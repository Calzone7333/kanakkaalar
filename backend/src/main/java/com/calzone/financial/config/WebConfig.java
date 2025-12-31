package com.calzone.financial.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        // Allow the frontend development server origin
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://115.97.59.230:5173");
        config.addAllowedOrigin("http://192.168.1.18:5173");
        config.addAllowedOrigin("http://192.168.1.2:5173");
        config.addAllowedOrigin("http://192.168.1.3:5173");
        config.addAllowedOrigin("http://192.168.1.4:5173");
        // Allow all headers and HTTP methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        // Apply this configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
