package com.barcode.honeykeep.common.config;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 로그 디렉토리를 초기화하는 컴포넌트.
 * 필요한 로그 디렉토리와 아카이브 디렉토리를 자동으로 생성함.
 * 다양한 환경(dev, prod 등)에 대응하여 로그 경로를 동적으로 설정함.
 */
@Component
public class LogDirectoryInitializer implements InitializingBean {
    private static final Logger logger = LoggerFactory.getLogger(LogDirectoryInitializer.class);

    @Value("${LOG_PATH:/var/log/honeykeep}")
    private String logPath;
    
    private final Environment environment;
    
    // 로그 카테고리 목록
    private final String[] categories = {"user", "transaction", "auth", "api", "error"};

    public LogDirectoryInitializer(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        // 현재 활성화된 프로필 출력
        String[] activeProfiles = environment.getActiveProfiles();
        String profile = activeProfiles.length > 0 ? activeProfiles[0] : "default";
        
        logger.info("현재 활성화된 프로필: {}", profile);
        logger.info("로그 디렉토리 초기화 시작. 기본 경로: {}", logPath);
        
        // 각 카테고리별로 디렉토리 생성
        for (String category : categories) {
            // 메인 로그 디렉토리
            File logDir = new File(logPath + "/" + category);
            if (!logDir.exists()) {
                boolean created = logDir.mkdirs();
                if (created) {
                    logger.info("로그 디렉토리 생성 완료: {}", logDir.getAbsolutePath());
                } else {
                    logger.warn("로그 디렉토리 생성 실패: {}", logDir.getAbsolutePath());
                }
            }

            // 아카이브 디렉토리
            File archiveDir = new File(logPath + "/" + category + "/archived");
            if (!archiveDir.exists()) {
                boolean created = archiveDir.mkdirs();
                if (created) {
                    logger.info("아카이브 디렉토리 생성 완료: {}", archiveDir.getAbsolutePath());
                } else {
                    logger.warn("아카이브 디렉토리 생성 실패: {}", archiveDir.getAbsolutePath());
                }
            }
        }
        
        logger.info("로그 디렉토리 초기화 완료. 총 {} 개의 카테고리 디렉토리 준비됨", categories.length);
    }
}