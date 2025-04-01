package com.barcode.honeykeep.account.service;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import com.barcode.honeykeep.pocket.entity.Pocket;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    //TODO: 포켓 정보 추가
    public List<AccountResponse> getAccountsByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByUser_Id(userId);

        return accounts.stream().map(account -> {
            return AccountResponse.builder()
                    .accountNumber(account.getAccountNumber())
                    .accountBalance(account.getAccountBalance().getAmount())
                    .accountName(account.getAccountName())
                    .bankName(account.getBank().getName())
                    .totalPocketAmount(calculateTotalPocketAmount(account))
                    .pocketCount(account.getPockets().size())
                    .build();
        }).collect(Collectors.toList());
    }


    public AccountDetailResponse getAccountDetailById(Long id, Long userId) {
        Account account = getAccountById(id);
        validateAccountOwner(account, userId);

        // Pocket 엔티티를 DTO로 변환
        List<PocketSummaryResponse> pocketDtos = account.getPockets().stream()
                .map(pocket -> PocketSummaryResponse.builder()
                        .id(pocket.getId())
                        .name(pocket.getName())
                        .accountName(account.getAccountName())
                        .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                        .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                        .type(pocket.getType().getType())
                        .isFavorite(pocket.getIsFavorite())
                        .imgUrl(pocket.getImgUrl())
                        .endDate(pocket.getEndDate())
                        .build())
                .collect(Collectors.toList());

        return AccountDetailResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountBalance(account.getAccountBalance().getAmount())
                .bankName(account.getBank().getName())
                .accountName(account.getAccountName())
                .totalPocketAmount(calculateTotalPocketAmount(account))
                .pocketCount(account.getPockets().size())
                .pocketList(pocketDtos) // DTO 리스트 사용
                .build();
    }

    /**
     * ID로 계좌 조회
     */
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));
    }

    /**
     * 계좌 소유자 검증
     */
    public void validateAccountOwner(Account account, Long userId) {
        if (!account.getUser().getId().equals(userId)) {
            throw new CustomException(AccountErrorCode.ACCOUNT_ACCESS_DENIED);
        }
    }

    //포켓들 금액 합 계산
    private BigDecimal calculateTotalPocketAmount(Account account) {
        BigDecimal total = BigDecimal.ZERO;

        for (Pocket pocket : account.getPockets()) {
            total = total.add(pocket.getSavedAmount().getAmount());
        }
        return total;
    }

}