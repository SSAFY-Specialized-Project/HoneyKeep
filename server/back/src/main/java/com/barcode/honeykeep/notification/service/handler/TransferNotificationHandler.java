package com.barcode.honeykeep.notification.service.handler;

import com.barcode.honeykeep.notification.dto.AccountTransferNotificationDTO;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.type.PushType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TransferNotificationHandler extends AbstractNotificationHandler {

    public TransferNotificationHandler(FCMTokenRepository fcmTokenRepository) {
        super(fcmTokenRepository);
    }

    @Override
    public PushType getPushType() {
        return PushType.TRANSFER;
    }

    @Override
    protected Map<String, String> buildData(Object messageData) {
        AccountTransferNotificationDTO dto = (AccountTransferNotificationDTO) messageData;
        Map<String, String> data = new HashMap<>();
        data.put("transactionType", dto.getTransactionType().name());
        data.put("amount", dto.getAmount().toString());
        data.put("withdrawAccountName", dto.getWithdrawAccountName());
        data.put("depositAccountName", dto.getDepositAccountName());
        data.put("transferDate", dto.getTransferDate().toString());
        return data;
    }
}
