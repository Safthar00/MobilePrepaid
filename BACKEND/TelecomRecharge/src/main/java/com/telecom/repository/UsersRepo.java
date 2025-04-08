package com.telecom.repository;

import com.telecom.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<Users, Long> {
	Optional<Users> findById(Long userId);
    Optional<Users> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<Users> findByPhone(String phone);
    boolean existsByPhone(String phone);
    @Query("SELECT u FROM Users u WHERE u.role.roleName = 'REGISTEREDUSER'")
    List<Users> findAllRegisteredUsers();
}