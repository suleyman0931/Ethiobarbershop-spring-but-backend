package com.barbershop.modules.auth.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.barbershop.modules.auth.dto.request.LoginRequest;
import com.barbershop.modules.auth.dto.request.RefreshTokenRequest;
import com.barbershop.modules.auth.dto.request.SignupRequest;
import com.barbershop.modules.auth.dto.response.JwtResponse;
import com.barbershop.modules.auth.dto.response.MessageResponse;
import com.barbershop.modules.auth.dto.response.TokenRefreshResponse;
import com.barbershop.modules.auth.model.entity.Role;
import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.model.enums.RoleType;
import com.barbershop.modules.auth.repository.RoleTypeRepository;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.auth.security.util.JwtUtils;
import com.barbershop.modules.auth.serviceImpl.RefreshTokenService;
import com.barbershop.modules.auth.serviceImpl.UserDetailsImpl;
import com.barbershop.modules.auth.model.entity.RefreshToken;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleTypeRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  RefreshTokenService refreshTokenService;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    String jwt = jwtUtils.generateJwtToken(authentication);

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

    return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
        userDetails.getUsername(), userDetails.getEmail(), roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<Role> roles = new HashSet<>();

    // Public signup only allows ROLE_CUSTOMER.
    // Owner is registered in the database manually.
    // Barber is assigned by the shop owner only.
    Role customerRole = roleRepository.findByRoleType(RoleType.ROLE_CUSTOMER)
        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(customerRole);

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  @PostMapping("/refresh-token")
  public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
    String requestRefreshToken = request.getRefreshToken();

    return refreshTokenService.findByToken(requestRefreshToken)
        .map(refreshTokenService::verifyExpiration)
        .map(RefreshToken::getUser)
        .map(user -> {
          String token = jwtUtils.generateJwtTokenFromUsername(user.getUsername());
          return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
        })
        .orElseThrow(() -> new RuntimeException("Refresh token not found"));
  }

  /**
   * Logout — delete the refresh token for the current user.
   */
  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    if (userDetails != null) {
      refreshTokenService.deleteByUserId(userDetails.getId());
    }
    return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
  }
}
