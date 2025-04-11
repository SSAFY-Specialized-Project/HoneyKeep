package com.barcode.honeykeep.pay.repository;

import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.dto.PayDto;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.dto.PocketBalanceResult;

public interface PayRepository {

    PocketBalanceResult payment(UserId userId, PayDto payDto);
}
