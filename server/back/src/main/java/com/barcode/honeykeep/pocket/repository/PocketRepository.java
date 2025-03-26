package com.barcode.honeykeep.pocket.repository;

import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.type.PocketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PocketRepository extends JpaRepository<Pocket, Long> {
    
    /**
     * 삭제되지 않은 포켓 ID로 조회
     */
    Optional<Pocket> findByIdAndIsDeletedFalse(Long pocketId);
    
    /**
     * 사용자 ID로 모든 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndIsDeletedFalse(Long userId);
    
    /**
     * 사용자 ID와 포켓 이름으로 삭제되지 않은 포켓 검색
     */
    List<Pocket> findByAccountUserIdAndNameContainingAndIsDeletedFalse(Long userId, String name);
    
    /**
     * 사용자 ID와 포켓 타입으로 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndTypeAndIsDeletedFalse(Long userId, PocketType type);
    
    /**
     * 즐겨찾기된 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndIsFavoriteIsTrueAndIsDeletedFalse(Long userId);
    
    /**
     * 특정 계좌의 모든 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountIdAndIsDeletedFalse(Long accountId);
    
    /**
     * 특정 카테고리의 모든 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByCategory_IdAndIsDeletedFalse(Long categoryId);
    
    /**
     * 특정 기간 내에 시작하는 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndStartDateBetweenAndIsDeletedFalse(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * 특정 기간 내에 종료하는 삭제되지 않은 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndEndDateBetweenAndIsDeletedFalse(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    // 이전 메서드도 유지 (호환성을 위해)
    
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
    List<Pocket> findByAccountUserIdAndStartDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * 특정 기간 내에 종료하는 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndEndDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}