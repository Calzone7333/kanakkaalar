package com.calzone.financial.servicehub;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ServiceEntrySeeder implements CommandLineRunner {

    private final ServiceEntryRepository repo;

    public ServiceEntrySeeder(ServiceEntryRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() > 0) return; // already seeded

        Map<String, Object> tabData = ServiceHubStaticData.tabData();

        int order = 0;
        for (Map.Entry<String, Object> tabEntry : tabData.entrySet()) {
            String tabName = tabEntry.getKey();
            Object subObj = tabEntry.getValue();
            if (!(subObj instanceof Map)) continue;
            Map<String, List<Map<String, String>>> subMap = (Map<String, List<Map<String, String>>>) subObj;
            for (Map.Entry<String, List<Map<String, String>>> subEntry : subMap.entrySet()) {
                String subName = subEntry.getKey();
                List<Map<String, String>> items = subEntry.getValue();
                for (Map<String, String> item : items) {
                    ServiceEntry se = new ServiceEntry();
                    se.setTabName(tabName);
                    se.setSubTab(subName);
                    se.setTitle(item.getOrDefault("title", ""));
                    se.setDescription(item.getOrDefault("desc", ""));
                    se.setPath(item.getOrDefault("to", ""));
                    se.setCategoryKey(item.getOrDefault("categoryKey", ""));
                    se.setDisplayOrder(order++);
                    repo.save(se);
                }
            }
        }

        // System.out.println("[ServiceEntrySeeder] seeded " + repo.count() + " entries");
    }
}
