package com.barcode.honeykeep.user.service;

import com.barcode.honeykeep.auth.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final AuthRepository authRepository;

    public List<Long> getAllUserIds() {
        return authRepository.findAllUserIds();
    }

}
