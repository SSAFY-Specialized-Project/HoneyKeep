package com.barcode.honeykeep.auth.config;

import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)    // token으로 검증하기 때문에 session 필요 없음
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(   // Spring Security 검증을 생략할 주소
                                "/error",
                                "/favicon.ico",
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/send-verification",
                                "/api/v1/auth/verify-email",
                                "/api/v1/sample/**",
                                "/actuator/health",
                                "/actuator/info")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable()) // 필요 시 비활성화
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("https://www.adte.site", "http://localhost:5173")
//                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
//                        .allowedHeaders("*")
//                        .exposedHeaders("Set-Cookie")  // ✅ 쿠키 헤더 노출
//                        .allowCredentials(true)
//                        .maxAge(3600);
//            }
//        };
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

