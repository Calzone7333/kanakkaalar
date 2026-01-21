package com.calzone.financial.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ServiceItemService {

    private final ServiceItemRepository repository;

    public ServiceItemService(ServiceItemRepository repository) {
        this.repository = repository;
    }

    public List<ServiceItem> getAllItems() {
        return repository.findAll();
    }

    public List<ServiceItem> getActiveItems() {
        return repository.findByActiveTrue();
    }

    public ServiceItem getItem(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

    @Transactional
    public ServiceItem createItem(ServiceItem item) {
        return repository.save(item);
    }

    @Transactional
    public ServiceItem updateItem(Long id, ServiceItem updated) {
        ServiceItem existing = getItem(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPriceDescription(updated.getPriceDescription());
        existing.setDuration(updated.getDuration());
        existing.setCategory(updated.getCategory());
        existing.setSubCategory(updated.getSubCategory());
        existing.setCategoryKey(updated.getCategoryKey());
        existing.setRoute(updated.getRoute());
        existing.setPricingPlans(updated.getPricingPlans());
        existing.setActive(updated.isActive());
        return repository.save(existing);
    }

    @Transactional
    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    // Helper for User Dashboard: Grouped Data
    public Map<String, Map<String, List<ServiceItem>>> getGroupedActiveItems() {
        List<ServiceItem> all = getActiveItems();
        return all.stream()
                .collect(Collectors.groupingBy(
                        ServiceItem::getCategory,
                        Collectors.groupingBy(ServiceItem::getSubCategory)));
    }
}
