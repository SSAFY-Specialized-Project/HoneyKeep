package com.barcode.honeykeep.pocket.repository;

import com.barcode.honeykeep.pocket.dto.ReasonCountProjection;
import com.barcode.honeykeep.pocket.entity.OverspendingReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OverspendingReasonRepository extends JpaRepository<OverspendingReason, Long> {

    // 특정 포켓의 초과 원인 목록 조회
    // 확장성을 위해 리스트로 조회
    List<OverspendingReason> findByPocketId(Long pocketId);

    @Query("""
    SELECT r.reasonText AS label, COUNT(r) AS count
    FROM OverspendingReason r
    WHERE r.pocket.account.user.id = :userId
    GROUP BY r.reasonText
""")
    List<ReasonCountProjection> countReasonsGroupedByUser(@Param("userId") Long userId);

}
