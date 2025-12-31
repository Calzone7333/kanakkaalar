 package com.calzone.financial.order;

    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.List;

    public interface OrderRepository extends JpaRepository<Order, Long> {
        List<Order> findByAssigneeEmailIgnoreCase(String assigneeEmail);
        List<Order> findByAssigneeEmailNotNull();
        List<Order> findByCustomerEmail(String customerEmail);
        List<Order> findByServiceName(String serviceName);
        List<Order> findByServiceNameAndCustomerEmail(String serviceName, String customerEmail);
        List<Order> findByUserId(Long userId); //finds the users as ids,
    }
