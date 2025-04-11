package com.barcode.honeykeep.user.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.user.dto.UserResponse;
import com.barcode.honeykeep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    /**
     * 모든 사용자 ID 목록 조회
     */
    public List<Long> getAllUserIds() {
        return userRepository.findAll()
                .stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    /**
     * ID로 사용자 조회
     */
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다: " + userId));

        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName()
        );
    }
}