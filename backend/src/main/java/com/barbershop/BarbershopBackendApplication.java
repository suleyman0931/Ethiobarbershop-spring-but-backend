package com.barbershop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableJpaAuditing // ← THIS ALLOWS TIMESTAMPS
public class BarbershopBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(BarbershopBackendApplication.class, args);
  }
}
