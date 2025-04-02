package com.barcode.honeykeep.webauthn.repository;

import com.barcode.honeykeep.webauthn.entity.WebAuthnSession;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebAuthnSessionRepository extends CrudRepository<WebAuthnSession, String> {
    
    Optional<WebAuthnSession> findByUserId(Long userId);
    
    Optional<WebAuthnSession> findByChallenge(String challenge);
    
    List<WebAuthnSession> findAllByUserId(Long userId);
    
    void deleteByUserId(Long userId);
} 