package com.barcode.honeykeep.user.repository;

import com.barcode.honeykeep.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 모든 사용자 ID 목록 조회
     */
    List<User> findAll();
    
    /**
     * ID로 사용자 조회
     */
    Optional<User> findById(Long id);
}