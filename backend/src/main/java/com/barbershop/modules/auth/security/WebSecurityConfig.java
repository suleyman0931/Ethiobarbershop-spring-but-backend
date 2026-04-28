package com.barbershop.modules.auth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.barbershop.modules.auth.security.util.CustomAccessDeniedHandler;
import com.barbershop.modules.auth.security.util.JwtAuthenticationEntryPoint;
import com.barbershop.modules.auth.security.util.JwtRequestFilter;
import com.barbershop.modules.auth.serviceImpl.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
  /**
   * @deny unauthorized request
   */
  @Autowired
  private JwtAuthenticationEntryPoint unauthorizedHandler;

  @Autowired
  private JwtRequestFilter jwtRequestFilter;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    var authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
      throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity httpSecurity, CustomAccessDeniedHandler accessDeniedHandler)
      throws Exception {
    httpSecurity
        .cors(Customizer.withDefaults()) // FRONTEND --> newest modification for cors <-> frontend access to backend
        .csrf(csrf -> csrf.disable()) // tied to top
        // .addFilterBefore(new JwtRequestFilter(),
        // UsernamePasswordAuthenticationFilter.class) -- THIS BREAKS DB

        // exceptionHandlingCustomizer
        .exceptionHandling(e -> {
          e.authenticationEntryPoint(unauthorizedHandler);
          e.accessDeniedHandler(accessDeniedHandler);
        })

        // sessionManagementCustomizer
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // authoriezed request
        .authorizeHttpRequests(auth -> auth

            // Allow all preflight OPTIONS requests
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // Authentication endpoints
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/users/**").permitAll()

            // Admin endpoints — super admin only
            .requestMatchers("/api/admin/**").hasRole("ADMIN")

            // Some test endpoints
            .requestMatchers("/api/test/auth/all").permitAll()
            .requestMatchers("/api/test/auth/user").hasAnyRole("CUSTOMER", "BARBER", "OWNER")
            .requestMatchers("/api/test/auth/owner").hasRole("OWNER")

            // Owner profiles
            .requestMatchers("/api/owners/register-barber").hasRole("OWNER")
            .requestMatchers("/api/owners/**").hasRole("OWNER")

            // Barber profiles — specific paths MUST come before wildcards
            .requestMatchers(HttpMethod.GET, "/api/barbers").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/barbers/shop/*").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/barbers/me").hasRole("BARBER")
            .requestMatchers(HttpMethod.POST, "/api/barbers/me").hasRole("BARBER")
            .requestMatchers(HttpMethod.PUT, "/api/barbers/me").hasRole("BARBER")
            .requestMatchers(HttpMethod.DELETE, "/api/barbers/me").hasRole("BARBER")
            .requestMatchers(HttpMethod.GET, "/api/barbers/*").hasRole("OWNER")
            .requestMatchers(HttpMethod.DELETE, "/api/barbers/*").hasRole("OWNER")
            .requestMatchers("/api/barbers/**").hasRole("BARBER")

            // Services
            .requestMatchers(HttpMethod.GET, "/api/services").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/services/active").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/services").hasRole("OWNER")
            .requestMatchers(HttpMethod.PUT, "/api/services/*").hasRole("OWNER")
            .requestMatchers(HttpMethod.DELETE, "/api/services/*").hasRole("OWNER")

            // Customer profiles (example: maybe you let them see themselves)
            .requestMatchers("/api/customers/**").hasRole("CUSTOMER")

            // Shop endpoints:
            // 1) Everyone can GET /api/shops, GET /api/shops/{id}
            .requestMatchers(HttpMethod.GET, "/api/shops").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/shops/*").permitAll()

            // 2) Only owners can create a shop (POST /api/shops/owner/create, or however
            // you named it)
            .requestMatchers(HttpMethod.POST, "/api/shops/owner/create").hasRole("OWNER")

            // 3) If you want owners to do other CRUD on shops:
            .requestMatchers(HttpMethod.PUT, "/api/shops/*").hasRole("OWNER")
            .requestMatchers(HttpMethod.DELETE, "/api/shops/*").hasRole("OWNER")

            // 4) Seats:
            .requestMatchers(HttpMethod.POST, "/api/shops/*/seats/**").hasRole("OWNER")

            // 5) Applications:
            .requestMatchers(HttpMethod.POST, "/api/shops/*/applications").hasRole("BARBER")
            .requestMatchers(HttpMethod.GET, "/api/shops/*/applications").hasRole("OWNER")
            .requestMatchers(HttpMethod.POST, "/api/shops/*/applications/*/approve").hasRole("OWNER")
            .requestMatchers(HttpMethod.POST, "/api/shops/*/applications/*/reject").hasRole("OWNER")

            // 5) Images:
            .requestMatchers( "/api/images/owners/**").hasRole("OWNER")
            .requestMatchers(HttpMethod.POST, "/api/images/barbers/**").hasRole("BARBER")
            .requestMatchers(HttpMethod.POST, "/api/images/customers/**").hasRole("CUSTOMER")
            // .requestMatchers(HttpMethod.POST, "/api/images/shops/**").hasRole("OWNER") // -- this is buggy?
            .requestMatchers(HttpMethod.GET, "/api/images/files/**").permitAll()

            // 6) External services:
            // Weather is public — shown on home page for everyone
            .requestMatchers("/api/external/weather").permitAll()
            // Hairstyle recommendations require customer login
            .requestMatchers("/api/external/**").hasRole("CUSTOMER")

            // Payments
            .requestMatchers(HttpMethod.POST, "/api/payments/submit").hasRole("CUSTOMER")
            .requestMatchers(HttpMethod.GET, "/api/payments/pending").hasRole("OWNER")
            .requestMatchers(HttpMethod.PUT, "/api/payments/*/verify").hasRole("OWNER")
            .requestMatchers(HttpMethod.PUT, "/api/payments/*/reject").hasRole("OWNER")

            // Actuator, etc.
            .requestMatchers("/actuator/**").permitAll()

            // fallback
            .anyRequest()
            .authenticated())

        .authenticationProvider(authenticationProvider());

    httpSecurity.authenticationProvider(authenticationProvider());
    httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    return httpSecurity.build();
  }
}
