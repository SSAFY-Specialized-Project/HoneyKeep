package com.barcode.honeykeep.pocket.repository;

import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.type.PocketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
     * 특정 카테고리에 해당하는 모든 포켓 조회
     */
    List<Pocket> findByAccountUserIdAndCategory_Id(Long userId, Long categoryId);

    /**
     * 포켓 다중 필터링 조회 (카테고리, 타입, 즐겨찾기)
     * @param userId 사용자 ID
     * @param categoryId 카테고리 ID (null 가능)
     * @param type 포켓 타입 (null 가능)
     * @param isFavorite 즐겨찾기 여부 (null 가능)
     * @return 카테고리, 타입, 즐겨찾기 기준으로 필터링된 포켓 목록
     */
    @Query("SELECT p FROM Pocket p WHERE p.account.user.id = :userId " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:type IS NULL OR p.type = :type) " +
            "AND (:isFavorite IS NULL OR p.isFavorite = :isFavorite)")
    List<Pocket> findPocketsByBasicFilters(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("type") PocketType type,
            @Param("isFavorite") Boolean isFavorite);

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

    /**
     * Crawling UUID가 존재하는 포켓 조회
     */
    Optional<Pocket> findByCrawlingUuid(String crawlingUuid);

    @Query("select p from Pocket p " +
            "join fetch p.account a " +
            "join fetch a.user " +
            "where p.endDate between :start and :end")
    List<Pocket> findByEndDateBetweenFetch(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}