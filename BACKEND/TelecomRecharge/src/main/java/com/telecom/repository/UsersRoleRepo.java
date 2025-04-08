package com.telecom.repository;

import com.telecom.model.UsersRole;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRoleRepo extends JpaRepository<UsersRole, Long> {
	Optional<UsersRole> findByRoleName(UsersRole.RoleName roleName);
	}