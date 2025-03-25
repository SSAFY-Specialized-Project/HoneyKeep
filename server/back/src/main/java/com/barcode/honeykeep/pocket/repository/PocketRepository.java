package com.barcode.honeykeep.pocket.repository;

import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.type.PocketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PocketRepository extends JpaRepository<Pocket, Long> {
    
    /**
     * 사용자 ID로 모든 포켓 조회
     */
    List<Pocket> findByAccountUserId(Long userId);
    
    /**
     * 사용자 ID와 포켓 이름으로 포켓 검색
     */
    List<Pocket> findByAccountUserIdAndNameContaining(Long userId, String name);
    
    /**
     * 사용자 ID와 포켓 타입으로 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndType(Long userId, PocketType type);
    
    /**
     * 즐겨찾기된 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndIsFavoriteIsTrue(Long userId);
    
    /**
     * 특정 계좌의 모든 포켓 조회
     */
    List<Pocket> findByAccountId(Long accountId);
    
    /**
     * 특정 카테고리의 모든 포켓 조회
     */
    List<Pocket> findByCategory_Id(Long categoryId);
    
    /**
     * 특정 기간 내에 시작하는 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndStartDateBetween(Long userId, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
    
    /**
     * 특정 기간 내에 종료하는 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndEndDateBetween(Long userId, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}