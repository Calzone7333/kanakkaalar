package com.calzone.financial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableJpaRepositories(basePackages = {
                "com.calzone.financial.auth",
                "com.calzone.financial.user",
                "com.calzone.financial.lead",
                "com.calzone.financial.order",
                "com.calzone.financial.payment",
                "com.calzone.financial.docs",
                "com.calzone.financial.casemgmt",
                "com.calzone.financial.workflow",
                "com.calzone.financial.email",
                "com.calzone.financial.sms",
                "com.calzone.financial.process",
                "com.calzone.financial.compliance",
                "com.calzone.financial.servicehub",
                "com.calzone.financial.service", // Service Item repository
                "com.calzone.financial.notification",
                "com.calzone.financial.crm", // CRM repositories
                "com.calzone.financial.deal", // Deal repository
                "com.calzone.financial.wallet", // Wallet repository
                "com.calzone.financial.task", // Task repository
                "com.calzone.financial.system", // System repository
                "com.calzone.financial.company", // Company repository
                "com.calzone.financial.expert", // Expert repository
                "com.calzone.financial.attendance", // Attendance repository
                "com.calzone.financial.chat" // Chat repository
}, basePackageClasses = {
                com.calzone.financial.order.OrderRepository.class,
                com.calzone.financial.order.DocumentRepository.class,
                com.calzone.financial.docs.DocsDocumentRepository.class
})
@EntityScan(basePackages = {
                "com.calzone.financial.auth",
                "com.calzone.financial.user",
                "com.calzone.financial.lead",
                "com.calzone.financial.order",
                "com.calzone.financial.payment",
                "com.calzone.financial.docs",
                "com.calzone.financial.casemgmt",
                "com.calzone.financial.workflow",
                "com.calzone.financial.email",
                "com.calzone.financial.sms",
                "com.calzone.financial.process",
                "com.calzone.financial.servicehub",
                "com.calzone.financial.service", // Service Item entities
                "com.calzone.financial.compliance",
                "com.calzone.financial.notification",
                "com.calzone.financial.crm", // CRM entities
                "com.calzone.financial.deal", // Deal entities
                "com.calzone.financial.wallet", // Wallet entities
                "com.calzone.financial.task", // Task entities
                "com.calzone.financial.system", // System entities
                "com.calzone.financial.company", // Company entities
                "com.calzone.financial.expert", // Expert entities
                "com.calzone.financial.attendance", // Attendance entities
                "com.calzone.financial.chat" // Chat entities
})
public class BackendApplication {

        public static void main(String[] args) {
                SpringApplication.run(BackendApplication.class, args);
        }
}
