package com.barcode.honeykeep.notification.service.scheduler;


import com.barcode.honeykeep.notification.dto.PocketReminderNotificationDTO;
import com.barcode.honeykeep.notification.service.NotificationDispatcher;
import com.barcode.honeykeep.notification.type.PushType;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PocketReminderScheduler {

    private final PocketRepository pocketRepository;
    // NotificationDispatcher: 알림 전송을 담당하는 중앙 컴포넌트
    private final NotificationDispatcher notificationDispatcher;


    @Scheduled(cron = "10 11 11 * * *")
    public void sendPocketReminderNotifications() {

        log.info("내일 포켓 마감 알림 스케줄러 시작");

        // 내일 날짜 계산
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        // 내일의 시작 시각
        LocalDateTime startOfTomorrow = tomorrow.atStartOfDay();
        // 내일의 종료 시각
        LocalDateTime endOfTomorrow = tomorrow.atTime(LocalTime.MAX);

        // 내일 종료되는 포켓들만 조회
        List<Pocket> pockets = pocketRepository.findByEndDateBetweenFetch(startOfTomorrow, endOfTomorrow);
        log.info("내일 종료되는 포켓 건수: {}", pockets.size());

        // 조회된 각 포켓에 대해, 해당 포켓의 주인에게 알림 전송
        pockets.forEach(pocket -> {
            Long userId = pocket.getAccount().getUser().getId();
            String userName = pocket.getAccount().getUser().getName();
            String pocketName = pocket.getName();

            PocketReminderNotificationDTO dto = PocketReminderNotificationDTO.builder()
                    .notificationType(PushType.REMINDER.getType())
                    .userName(userName)
                    .pocketName(pocketName)
                    .build();
            try {
                notificationDispatcher.send(PushType.REMINDER, userId, dto);
                log.info("알림 전송 성공 - 사용자 ID: {}, 포켓 이름: {}", userId, pocketName);
            } catch (Exception e) {
                log.error("알림 전송 실패 - 사용자 ID: {}, 포켓 이름: {}, 에러: {}",
                        userId, pocketName, e.getMessage(), e);
            }
        });

    }
}
