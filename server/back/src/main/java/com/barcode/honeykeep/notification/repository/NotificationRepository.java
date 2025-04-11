package com.barcode.honeykeep.notification.repository;

import com.barcode.honeykeep.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 특정 사용자에게 전달된 알림 목록을 생성일시 내림차순으로 조회하는 메서드
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
