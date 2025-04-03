package com.barcode.honeykeep.notification.repository;

import com.barcode.honeykeep.notification.entity.FCMToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FCMTokenRepository extends CrudRepository<FCMToken, String> {

    Optional<FCMToken> findByToken(String token);

}
