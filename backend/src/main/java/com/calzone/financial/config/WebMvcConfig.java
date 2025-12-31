package com.calzone.financial.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Paths;

/**
 * Web configuration to serve uploaded files from the local file system.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the absolute path for the upload directory
        File uploadDirFile = new File(uploadDir);
        String uploadPath = uploadDirFile.getAbsolutePath();

        // Ensure the path ends with a separator for proper file serving
        if (!uploadPath.endsWith(File.separator)) {
            uploadPath += File.separator;
        }

        // Map /uploads/** to the uploads directory on the file system
        // The file: prefix tells Spring to serve files from the file system
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600); // Cache for 1 hour
    }
}
