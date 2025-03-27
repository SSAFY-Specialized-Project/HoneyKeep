package com.barcode.honeykeep.mydataConnect.repository;

import com.barcode.honeykeep.mydataConnect.entity.LinkedInstitution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkedInstitutionRepository extends JpaRepository<LinkedInstitution, Long> {
    List<LinkedInstitution> findByUserId(Long userId);
}
