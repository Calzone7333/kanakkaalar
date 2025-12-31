package com.calzone.financial.docs;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController("docsDocumentController")
@RequestMapping("/api/docs")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocsDocumentRepository docs;
    private final UserRepository userRepository;

    // Constructor injection
    public DocumentController(DocsDocumentRepository docs, UserRepository userRepository) {
        this.docs = docs;
        this.userRepository = userRepository;
    }

    // --- Simple ping for diagnostics ---
    @GetMapping("/ping")
    public ResponseEntity<?> ping() { return ResponseEntity.ok(Map.of("ok", true)); }

    // --- List user's documents ---
    @GetMapping({"/my-docs","/my-docs/"})
    public ResponseEntity<List<Document>> myDocs() {
        // System.out.println("[DocumentController] my-docs called");
        try {
            Long userId = null;
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                if (principal instanceof User) {
                    userId = ((User) principal).getId();
                } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                    Optional<User> uopt = userRepository.findByEmail(email);
                    if (uopt.isPresent()) userId = uopt.get().getId();
                } else if (principal instanceof String) {
                    String email = (String) principal;
                    Optional<User> uopt = userRepository.findByEmail(email);
                    if (uopt.isPresent()) userId = uopt.get().getId();
                }
            }
            if (userId == null) return ResponseEntity.status(401).build();

            List<Document> list = docs.findByOwnerUserId(userId);
            // Do not return the content bytes in the list for efficiency
            for (Document d : list) {
                d.setContent(null);
            }
            return ResponseEntity.ok(list);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // --- Upload single file and store in DB ---
    @RequestMapping(value = {"/upload", "/upload/"}, method = org.springframework.web.bind.annotation.RequestMethod.POST, consumes = {"multipart/form-data"})
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,
                                    @RequestParam(value = "ownerUserId", required = false) Long ownerUserId) {
        System.out.println("[DocumentController] upload endpoint called. file=" + (file != null ? file.getOriginalFilename() : "null") + " ownerUserId=" + ownerUserId);
        try {
            // Resolve ownerUserId from security context if not provided
            Long resolvedOwner = ownerUserId;
            if (resolvedOwner == null) {
                var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated()) {
                    Object principal = auth.getPrincipal();
                    if (principal instanceof User) {
                        resolvedOwner = ((User) principal).getId();
                    } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                        String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                        Optional<User> uopt = userRepository.findByEmail(email);
                        if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                    } else if (principal instanceof String) {
                        Optional<User> uopt = userRepository.findByEmail((String) principal);
                        if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                    }
                }
            }

            if (resolvedOwner == null) {
                System.out.println("[DocumentController] upload: resolvedOwner is null -> unauthorized");
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }

            if (file == null) {
                System.out.println("[DocumentController] upload: no file in request");
                return ResponseEntity.badRequest().body(Map.of("message", "No file provided"));
            }

            if (file.isEmpty()) {
                System.out.println("[DocumentController] upload: empty file");
                return ResponseEntity.badRequest().body(Map.of("message", "Empty file uploaded"));
            }

            System.out.println("[DocumentController] upload: owner=" + resolvedOwner + " filename=" + file.getOriginalFilename() + " size=" + file.getSize() + " contentType=" + file.getContentType());

            Document d = new Document();
            d.setOwnerUserId(resolvedOwner);
            d.setFilename(file.getOriginalFilename());
            d.setContentType(file.getContentType());
            d.setSizeBytes(file.getSize());
            d.setContent(file.getBytes());
            // Ensure s3Key column is not null in existing schema: set to empty string when not using S3
            d.setS3Key("");
            Document saved = docs.save(d);

            return ResponseEntity.ok(Map.of("documentId", saved.getId()));

        } catch (org.springframework.dao.DataAccessException dae) {
            dae.printStackTrace();
            String errMsg = dae.getClass().getName() + ": " + dae.getMostSpecificCause();
            return ResponseEntity.status(500).body(Map.of("message", "Database error during upload", "error", errMsg));
        } catch (Exception ex) {
            ex.printStackTrace();
            // Return detailed error info for debugging
            String errMsg = ex.getClass().getName() + ": " + ex.getMessage();
            return ResponseEntity.status(500).body(Map.of("message", "Upload failed", "error", errMsg));
        }
    }

    // Handle file size exceptions
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSize(org.springframework.web.multipart.MaxUploadSizeExceededException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(413).body(Map.of("message", "File too large", "error", ex.getMessage()));
    }

    // --- Replace document content (owner only) ---
    @RequestMapping(value = "/{id}", method = org.springframework.web.bind.annotation.RequestMethod.PUT, consumes = {"multipart/form-data"})
    public ResponseEntity<?> replace(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Document> existingOpt = docs.findById(id);
            if (existingOpt.isEmpty()) return ResponseEntity.notFound().build();
            Document existing = existingOpt.get();

            // resolve current user
            Long resolvedOwner = null;
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                if (principal instanceof User) resolvedOwner = ((User) principal).getId();
                else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                    Optional<User> uopt = userRepository.findByEmail(email);
                    if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                } else if (principal instanceof String) {
                    Optional<User> uopt = userRepository.findByEmail((String) principal);
                    if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                }
            }

            if (resolvedOwner == null) return ResponseEntity.status(401).build();
            if (!resolvedOwner.equals(existing.getOwnerUserId())) {
                return ResponseEntity.status(403).body(Map.of("message", "You are not allowed to replace this document"));
            }

            if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message", "No file provided"));

            existing.setFilename(file.getOriginalFilename());
            existing.setContentType(file.getContentType());
            existing.setSizeBytes(file.getSize());
            existing.setContent(file.getBytes());
            docs.save(existing);

            return ResponseEntity.ok(Map.of("message", "Document replaced", "documentId", existing.getId()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Replace failed", "error", ex.getClass().getName() + ": " + ex.getMessage()));
        }
    }

    // POST alternative for replace (some environments route PUT differently)
    @PostMapping("/{id}/replace")
    public ResponseEntity<?> replacePost(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return replace(id, file);
    }

    // --- Delete document (owner only) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Optional<Document> existingOpt = docs.findById(id);
            if (existingOpt.isEmpty()) return ResponseEntity.notFound().build();
            Document existing = existingOpt.get();

            // resolve current user
            Long resolvedOwner = null;
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                if (principal instanceof User) resolvedOwner = ((User) principal).getId();
                else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                    Optional<User> uopt = userRepository.findByEmail(email);
                    if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                } else if (principal instanceof String) {
                    Optional<User> uopt = userRepository.findByEmail((String) principal);
                    if (uopt.isPresent()) resolvedOwner = uopt.get().getId();
                }
            }

            if (resolvedOwner == null) return ResponseEntity.status(401).build();
            if (!resolvedOwner.equals(existing.getOwnerUserId())) {
                return ResponseEntity.status(403).body(Map.of("message", "You are not allowed to delete this document"));
            }

            docs.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Document deleted"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Delete failed", "error", ex.getClass().getName() + ": " + ex.getMessage()));
        }
    }

    // POST alternative for delete
    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        return delete(id);
    }

    // --- Download file bytes from DB by document id ---
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Optional<Document> dopt = docs.findById(id);
        if (dopt.isEmpty()) return ResponseEntity.notFound().build();
        Document d = dopt.get();
        byte[] content = d.getContent();
        if (content == null || content.length == 0) return ResponseEntity.noContent().build();
        String filename = d.getFilename() == null ? "file" : d.getFilename();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(d.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(d.getContentType()))
                .body(content);
    }
}