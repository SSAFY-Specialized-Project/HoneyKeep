package com.barcode.honeykeep.cert.repository;

import com.barcode.honeykeep.cert.entity.Cert;
import com.barcode.honeykeep.cert.entity.Cert.CertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertRepository extends JpaRepository<Cert, Long> {
    
    Optional<Cert> findByUserIdAndStatus(Long userId, CertStatus status);
    
    boolean existsByUserIdAndStatusNot(Long userId, CertStatus status);
    
    Optional<Cert> findBySerialNumber(String serialNumber);
}
