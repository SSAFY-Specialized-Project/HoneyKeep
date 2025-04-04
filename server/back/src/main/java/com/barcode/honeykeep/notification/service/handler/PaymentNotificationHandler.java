package com.barcode.honeykeep.notification.service.handler;

import com.barcode.honeykeep.notification.dto.PayNotificationDTO;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.type.PushType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentNotificationHandler extends AbstractNotificationHandler {

    public PaymentNotificationHandler(FCMTokenRepository fcmTokenRepository) {
        super(fcmTokenRepository);
    }

    @Override
    public PushType getPushType() {
        return PushType.PAYMENT;
    }

    @Override
    protected Map<String, String> buildData(Object messageData) {
        PayNotificationDTO dto = (PayNotificationDTO) messageData;
        Map<String, String> data = new HashMap<>();
        data.put("transactionType", dto.getTransactionType().name());
        data.put("amount", dto.getAmount().toString());
        data.put("withdrawAccountName", dto.getWithdrawAccountName());
        data.put("productName", dto.getProductName());
        data.put("transferDate", dto.getTransferDate().toString());
        return data;
    }
}
