package com.barbershop.modules.customer.serviceImpl;

import com.barbershop.modules.auth.model.entity.User;
import com.barbershop.modules.auth.repository.UserRepository;
import com.barbershop.modules.customer.dto.request.CustomerRequest;
import com.barbershop.modules.customer.dto.response.CustomerResponse;
import com.barbershop.modules.customer.model.entity.Customer;
import com.barbershop.modules.customer.repository.CustomerRepository;
import com.barbershop.modules.customer.service.CustomerService;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CustomerResponse createCustomerProfile(Long userId, CustomerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (customerRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Customer profile already exists");
        }

        Customer customer = new Customer(
                user,
                request.getFirstName(),
                request.getLastName(),
                request.getPhoneNumber(),
                request.getDateOfBirth(),
                null,
                null,
                request.getAddress(),
                null,
                null);

        return toResponse(customerRepository.save(customer));
    }

    @Override
    public CustomerResponse getCustomerProfileByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return toResponse(customer);
    }

    @Override
    public CustomerResponse updateCustomerProfile(Long userId, CustomerRequest request) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhoneNumber(request.getPhoneNumber());
        if (request.getDateOfBirth() != null) customer.setDateOfBirth(request.getDateOfBirth());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());

        return toResponse(customerRepository.save(customer));
    }

    @Override
    public void deleteCustomerProfile(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        customerRepository.delete(customer);
    }

    private CustomerResponse toResponse(Customer c) {
        return new CustomerResponse(
                c.getId(),
                c.getFirstName(),
                c.getLastName(),
                c.getEmail(),
                c.getPhoneNumber(),
                c.getDateOfBirth(),
                c.getGender(),
                c.getAddress(),
                c.getMarketingNotifications(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                c.getUser().getId());
    }
}
