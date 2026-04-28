package com.barbershop.modules.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbershop.modules.auth.model.entity.Role;
import com.barbershop.modules.auth.model.enums.RoleType;

@Repository
public interface RoleTypeRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByRoleType(RoleType roleType);
}
