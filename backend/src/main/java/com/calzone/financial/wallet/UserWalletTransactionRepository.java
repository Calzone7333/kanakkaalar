package com.calzone.financial.wallet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserWalletTransactionRepository extends JpaRepository<UserWalletTransaction, Long> {
    List<UserWalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
