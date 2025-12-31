package com.calzone.financial.expert;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/experts")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ExpertController {

    private final ExpertService expertService;
    private final ObjectMapper objectMapper;

    public ExpertController(ExpertService expertService, ObjectMapper objectMapper) {
        this.expertService = expertService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public List<Expert> getAllExperts() {
        return expertService.getAllExperts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expert> getExpertById(@PathVariable Long id) {
        return expertService.getExpertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/image")
    public ResponseEntity<?> getExpertImage(@PathVariable Long id) {
        return expertService.getExpertById(id)
                .map(expert -> {
                    if (expert.getImage() == null) {
                        return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_TYPE, expert.getImageContentType())
                            .body(expert.getImage());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Expert> createExpert(
            @RequestPart("data") String expertJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        Expert expert = objectMapper.readValue(expertJson, Expert.class);
        return ResponseEntity.ok(expertService.createExpert(expert, file));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Expert> updateExpert(
            @PathVariable Long id, 
            @RequestPart("data") String expertJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        try {
            Expert expert = objectMapper.readValue(expertJson, Expert.class);
            return ResponseEntity.ok(expertService.updateExpert(id, expert, file));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExpert(@PathVariable Long id) {
        expertService.deleteExpert(id);
        return ResponseEntity.noContent().build();
    }
}
