package com.calzone.financial.crm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface B2CServiceRequestRepository extends JpaRepository<B2CServiceRequest, Long> {
    List<B2CServiceRequest> findByCustomerProfileId(Long customerProfileId);
    List<B2CServiceRequest> findByStatus(String status);
}
