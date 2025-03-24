package com.barcode.honeykeep.auth.repository;

import com.barcode.honeykeep.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByNameAndIdentityNumberAndPhoneNumber(String name, String identityNumber, String phoneNumber);

    Optional<User> findByEmail(String email);
}
