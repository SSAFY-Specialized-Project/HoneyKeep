package com.barcode.honeykeep.common.config;

import com.barcode.honeykeep.common.interceptor.ApiLoggingInterceptor;
import com.barcode.honeykeep.common.interceptor.RateLimitInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ApiLoggingInterceptor apiLoggingInterceptor;
    private final RateLimitInterceptor rateLimitInterceptor;

    public WebConfig(ApiLoggingInterceptor apiLoggingInterceptor,
                     RateLimitInterceptor rateLimitInterceptor) {
        this.apiLoggingInterceptor = apiLoggingInterceptor;
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 로깅은 모든 API 요청에 적용
        registry.addInterceptor(apiLoggingInterceptor)
                .addPathPatterns("/api/**");

        // 일단 모든 API 요청에 Rate Limit 적용
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns("/api/**");
    }

    @Bean
    public RedisScript<Long> rateLimiterScript() {
        String script =
                "local key = KEYS[1] " +
                        "local limit = tonumber(ARGV[1]) " +
                        "local window = tonumber(ARGV[2]) " +
                        "local current = redis.call('get', key) " +
                        "if current and tonumber(current) > limit then " +
                        "   return tonumber(current) " +
                        "end " +
                        "current = redis.call('incr', key) " +
                        "if tonumber(current) == 1 then " +
                        "   redis.call('expire', key, window) " +
                        "end " +
                        "return tonumber(current)";
        return new DefaultRedisScript<>(script, Long.class);
    }
}