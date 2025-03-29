package com.barcode.honeykeep.user.repository;

import com.barcode.honeykeep.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByNameAndIdentityNumberAndPhoneNumber(String name, String identityNumber, String phoneNumber);

    Optional<User> findByEmail(String email);

    @Query("select u.id from User u")
    List<Long> findAllUserIds();

    /**
     * 모든 사용자 ID 목록 조회
     */
    List<User> findAll();

    /**
     * ID로 사용자 조회
     */
    Optional<User> findById(Long id);

    Boolean existsUserByUserKey(String userKey);
}
