Project Overview — BisFilling AI Demo

Summary
- Full-stack demo combining a Spring Boot backend and an existing React frontend (Vite). The backend provides core platform modules (auth, CRM/lead intake, case management, document metadata, AI mock endpoints) and serves a simple static demo UI at / (backend demo index.html).
- Purpose: replicate core customer journey and internal processes, provide AI integration touchpoints (mocked), and offer a deployable demo that can be wired to real AI, OCR, and production MySQL or Supabase.

How to run (local)
- Build & run backend (production/dev):
  mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=demo
  - demo profile uses an in-memory H2 DB and mocked AI services (no external creds required).
- To use production MySQL, ensure application.properties contains proper JDBC URL or set these environment variables before running: MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD. The app reads spring.datasource.* from application.properties; env vars set in the dev environment are MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD.

Backend — major modules and files (implemented)
- Entry: backend/src/main/java/com/calzone/financial/BackendApplication.java
- Configuration:
  - backend/pom.xml (dependencies: Spring Boot starters, MySQL, H2 for demo, Lombok)
  - backend/src/main/resources/application.properties (MySQL defaults, JWT secret placeholder)
  - backend/src/main/resources/application-demo.properties (H2 demo profile + mocked AI placeholders)
- Security & Auth:
  - backend/src/main/java/com/calzone/financial/config/SecurityConfig.java (permits demo API access)
  - backend/src/main/java/com/calzone/financial/auth/User.java
  - backend/src/main/java/com/calzone/financial/auth/UserRepository.java
  - backend/src/main/java/com/calzone/financial/auth/JwtUtil.java
  - backend/src/main/java/com/calzone/financial/auth/AuthService.java
  - backend/src/main/java/com/calzone/financial/auth/AuthController.java
- CRM / Leads:
  - backend/src/main/java/com/calzone/financial/crm/Lead.java
  - backend/src/main/java/com/calzone/financial/crm/LeadRepository.java
  - backend/src/main/java/com/calzone/financial/crm/LeadController.java
- Case Management:
  - backend/src/main/java/com/calzone/financial/casemgmt/CaseRecord.java
  - backend/src/main/java/com/calzone/financial/casemgmt/CaseRepository.java
  - backend/src/main/java/com/calzone/financial/casemgmt/CaseController.java
- Document metadata & intake:
  - backend/src/main/java/com/calzone/financial/document/Document.java
  - backend/src/main/java/com/calzone/financial/document/DocumentRepository.java
  - backend/src/main/java/com/calzone/financial/document/DocumentController.java
- AI (mock) services and DTOs:
  - backend/src/main/java/com/calzone/financial/ai/AIController.java
  - backend/src/main/java/com/calzone/financial/ai/MockAIService.java
  - backend/src/main/java/com/calzone/financial/ai/dto.java
- Demo static UI served by backend (simple client for testing):
  - backend/src/main/resources/static/index.html

Exposed API endpoints (demo)
- Auth: POST /api/auth/register (body: {email,password})
- Auth: POST /api/auth/login (body: {email,password})
- Leads: POST /api/leads (Lead JSON), GET /api/leads
- Cases: POST /api/cases, GET /api/cases
- Documents: POST /api/documents (meta), GET /api/documents
- AI (mocked):
  - POST /api/ai/chat
  - POST /api/ai/ocr/validate
  - POST /api/ai/docs/draft
  - POST /api/ai/kb/search
  - POST /api/ai/predict/eta
  - POST /api/ai/triage/objection

What is working now (status)
- Backend compiles (project code added). Demo mode runs with H2 and serves static demo UI at / (index.html).
- Basic auth registration/login flow implemented (JWT util available) — demo SecurityConfig currently permits API traffic for ease of testing; production lockdown needed.
- Lead intake, case creation, and document metadata CRUD endpoints are implemented and backed by JPA entities.
- AI endpoints are implemented with a MockAIService that returns deterministic example responses; good for UI integration and flow testing.
- Demo frontend (backend static index.html) interacts with the AI endpoints for chat, OCR validation, KB search, and draft generation.

What is mocked / needs production wiring
- AI: MockAIService should be replaced with actual provider integrations (OpenAI SDK / Azure / Anthropic) and safe prompt engineering. Environment variable OPENAI_API_KEY is read by the environment; no secrets are hard-coded in files.
- OCR: Current OCR endpoint is mocked. Replace with Tesseract server, Google Cloud Vision, or AWS Textract integration and secure file storage (S3) for production.
- Embeddings / Semantic Search: Not yet implemented. Recommend Supabase (pgvector) or Neon/Postgres with vector support — create tables for embeddings and implement an ingest pipeline.
- Govt portal integrations (MCA/GST/IP India): Not implemented; must be added as connectors (APIs, RPA agents, or polling jobs).
- Dashboard UI: Backend supplies APIs and demo static UI. For a production-ready dashboard, integrate the React frontend pages with authenticated API calls, role-based views, and case timelines.

Files removed / emptied
- Several documentation markdown files were emptied per request (their contents removed but files exist as empty files):
  AGENTS.md, DEPLOYMENT.md, DEPLOYMENT_CHECKLIST.md, FINAL_DELIVERY_SUMMARY.md,
  GETTING_STARTED.md, IMPLEMENTATION_GUIDE.md, NEXT_STEPS_AND_CUSTOMIZATION.md,
  PROJECT_SUMMARY.md, README.md, README_COMPLETE.md, README_LOCAL_RUN.md,
  README_MCP_SUGGESTIONS.md, SETUP_INSTRUCTIONS.md, backend/README.md, docs/workflow.md, frontend/README.md

Environment variables used (set in dev environment)
- MYSQL_URL (jdbc string, example: jdbc:mysql://localhost:3306/user_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC)
- MYSQL_USER, MYSQL_PASSWORD
- OPENAI_API_KEY (for future wiring to real LLM)
- security.jwt.secret is read from application.properties; override with env variables in production

Security & production notes
- Current SecurityConfig is permissive to simplify demo testing. Before production deployment:
  - Enforce JWT auth for API routes, enable HTTPS, restrict actuator endpoints, and rotate secrets.
  - Implement RBAC checks in controllers and service layers.
  - Add PII redaction, encrypted storage (S3 + server-side encryption), and audit logs for AI outputs.
  - Integrate Sentry or similar for monitoring and add rate-limiting/fraud detection.

Recommended next steps (priority)
1. Replace MockAIService with a safe, audited integration to an LLM (OpenAI/Azure) and implement prompt templates + citation extraction.
2. Implement OCR provider and secure file uploads to S3 (or equivalent), with virus scanning.
3. Build the React dashboard views to consume the APIs (auth, leads, cases, documents, AI tools) and add role-based UI.
4. Add background workers/job queue for status polling of government portals and scheduled compliance monitoring.
5. Add unit/integration tests and CI pipeline.
6. Harden security: JWT enforcement, secrets management, and data encryption.

If you want, I can now:
- Wire OpenAI and a chosen OCR provider (I will use OPENAI_API_KEY from env) and replace mocks.
- Implement a production-ready React Dashboard connected to /api/* endpoints with JWT auth.
- Create a migration path from H2 demo to MySQL and seed sample data.

-- End of overview
