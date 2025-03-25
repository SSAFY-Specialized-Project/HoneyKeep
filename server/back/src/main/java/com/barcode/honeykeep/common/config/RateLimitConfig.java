package com.barcode.honeykeep.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;

import java.util.List;

@Configuration
public class RateLimitConfig {

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