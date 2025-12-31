package com.calzone.financial.servicehub;

import com.calzone.financial.order.DocumentRepository;
import com.calzone.financial.order.Order;
import com.calzone.financial.order.OrderRepository;
import com.calzone.financial.process.ProcessStage;
import com.calzone.financial.process.ProcessStageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/servicehub")
public class ServiceHubController {

    private final OrderRepository orderRepository;
    private final DocumentRepository documentRepository;
    private final ProcessStageRepository stageRepository;
    private final ServiceEntryRepository serviceEntryRepository;

    public ServiceHubController(OrderRepository orderRepository, DocumentRepository documentRepository, ProcessStageRepository stageRepository, ServiceEntryRepository serviceEntryRepository) {
        this.orderRepository = orderRepository;
        this.documentRepository = documentRepository;
        this.stageRepository = stageRepository;
        this.serviceEntryRepository = serviceEntryRepository;
    }

    // --- Static UI data for the ServiceHub page (moved from frontend) ---
    private static final Map<String, Object> STATIC_TAB_DATA = createTabData();
    private static final Map<String, List<Map<String, String>>> STATIC_PROCESS_DATA = createProcessData();
    private static Map<String, Object> createTabData() {
        Map<String, Object> t = new LinkedHashMap<>();
        Map<String, List<Map<String,String>>> licenses = new LinkedHashMap<>();
        licenses.put("Business Essentials", Arrays.asList(
                Map.of("title","GST Registration","desc","Starts from ₹749₹499","to","/compliances/gst","categoryKey","licenses"),
                Map.of("title","MSME Registration","desc","Starts from ₹699","to","/Licenses/msme","categoryKey","licenses"),
                Map.of("title","Food License","desc","Contact Expert to Get Price","to","/licenses/fssai","categoryKey","licenses"),
                Map.of("title","Digital Signature Certificate","desc","Starts from ₹847","to","/licenses/dsc","categoryKey","licenses"),
                Map.of("title","Trade License","desc","Starts from ₹1499₹999","to","/licenses/trade","categoryKey","licenses")
        ));
        licenses.put("Labour Compliance", Arrays.asList(
                Map.of("title","PF/ESI Registration","desc","Starts from ₹249","to","/compliances/pf-esi","categoryKey","licenses"),
                Map.of("title","Professional Tax Registration","desc","Starts from ₹2999₹2699","to","/compliances/professional-tax","categoryKey","licenses")
        ));
        t.put("Licenses/Registrations", licenses);

        Map<String, List<Map<String,String>>> ip = new LinkedHashMap<>();
        ip.put("Trademark", Arrays.asList(
                Map.of("title","Trademark Registration","desc","Starts from ₹1499₹1349","to","/ip/trademark-registration","categoryKey","ip")
        ));
        t.put("Trademark/IP", ip);

        // Add a couple more sections simplified
        t.put("Company Change", Map.of("Company Name/Management", Arrays.asList(Map.of("title","Change the Name of Your Company","desc","Contact Expert to Get Price","to","/company/change-name","categoryKey","company"))));
        t.put("Taxation & Compliance", Map.of("Direct & Indirect Tax", Arrays.asList(Map.of("title","Income Tax Return Filing (ITR)","desc","Contact Expert to Get Price","to","/tax/itr-filing","categoryKey","tax"))));
        t.put("New Business/Closure", Map.of("Business Registration", Arrays.asList(Map.of("title","Private Limited Company Registration","desc","Starts from ₹999","to","/formation/private-ltd","categoryKey","formation"))));

        return t;
    }
    private static Map<String, List<Map<String,String>>> createProcessData() {
        Map<String, List<Map<String,String>>> p = new LinkedHashMap<>();
        p.put("licenses", Arrays.asList(
                Map.of("title","Document Vetting","desc","Specialists review your documents"),
                Map.of("title","Application Filing","desc","The application is prepared and submitted"),
                Map.of("title","Fee Payment & Receipt","desc","Government fees are paid"),
                Map.of("title","Certificate Delivery","desc","Final certificate is uploaded")
        ));
        p.put("ip", Arrays.asList(
                Map.of("title","Preliminary Search","desc","Comprehensive uniqueness search"),
                Map.of("title","Drafting & Filing","desc","Application drafted and filed")
        ));
        p.put("company", Arrays.asList(
                Map.of("title","Data Collection & Vetting","desc","Gathering required director data"),
                Map.of("title","Drafting Resolutions & Forms","desc","Preparation of Board Resolutions")
        ));
        return p;
    }

    /**
     * Returns aggregated dashboard data for ADMIN or EMPLOYEE role.
     * Example: GET /api/servicehub/status?role=ADMIN
     * Example: GET /api/servicehub/status?role=EMPLOYEE&email=emp@company.com
     */
    @GetMapping("/status")
    public Map<String, Object> status(@RequestParam String role, @RequestParam(required = false) String email) {
        // Ensure the request is authenticated and authorized for the requested role
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isEmployee = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));

        if ("ADMIN".equalsIgnoreCase(role) && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Requires ADMIN role");
        }
        if ("EMPLOYEE".equalsIgnoreCase(role) && !(isEmployee || isAdmin)) {
            throw new org.springframework.security.access.AccessDeniedException("Requires EMPLOYEE role");
        }

        Map<String, Object> res = new HashMap<>();

        long totalOrders = orderRepository.count();
        long totalDocuments = documentRepository.count();

        long unverifiedDocuments = documentRepository.countByVerifiedFalse();

        res.put("totalOrders", totalOrders);
        res.put("totalDocuments", totalDocuments);
        res.put("unverifiedDocuments", unverifiedDocuments);

        if ("EMPLOYEE".equalsIgnoreCase(role) && email != null && !email.isBlank()) {
            // Orders assigned to this employee
            List<Order> assigned = orderRepository.findByAssigneeEmailIgnoreCase(email);
            res.put("assignedOrdersCount", assigned.size());
            // Documents for assigned orders
            long docsForAssigned = 0;
            for (Order o : assigned) {
                docsForAssigned += documentRepository.findByOrderId(o.getId()).size();
            }
            res.put("documentsForAssignedOrders", docsForAssigned);
        } else {
            // ADMIN overview
            long assignedCount = orderRepository.findByAssigneeEmailNotNull().size();
            res.put("assignedOrdersCount", assignedCount);
            // Simple per-status counts (CREATED, PAYMENT_COMPLETED, DOCUMENTS_PENDING, DOCUMENTS_VERIFIED, ASSIGNED)
            Map<String, Long> statusCounts = new HashMap<>();
            orderRepository.findAll().forEach(o -> statusCounts.merge(o.getStatus(), 1L, Long::sum));
            res.put("statusCounts", statusCounts);
        }

        res.put("role", role);
        res.put("timestamp", System.currentTimeMillis());
        return res;
    }

    // --- Page data endpoint: returns UI tab data and process steps so frontend can render same design ---
    @GetMapping("/page-data")
    public Map<String, Object> pageData(@RequestParam(required = false) String service) {
        Map<String, Object> out = new HashMap<>();

        // Attempt to load tabData from DB entries
        List<ServiceEntry> dbEntries = serviceEntryRepository.findAllByOrderByTabNameAscSubTabAscDisplayOrderAsc();
        if (dbEntries != null && !dbEntries.isEmpty()) {
            Map<String, Map<String, List<Map<String, String>>>> tabDataFromDb = new LinkedHashMap<>();
            for (ServiceEntry e : dbEntries) {
                String tab = e.getTabName() == null ? "Misc" : e.getTabName();
                String sub = e.getSubTab() == null ? "General" : e.getSubTab();
                tabDataFromDb.computeIfAbsent(tab, k -> new LinkedHashMap<>());
                Map<String, List<Map<String, String>>> subMap = tabDataFromDb.get(tab);
                subMap.computeIfAbsent(sub, k -> new ArrayList<>());
                List<Map<String, String>> list = subMap.get(sub);
                list.add(Map.of(
                    "title", e.getTitle(),
                    "desc", e.getDescription() == null ? "" : e.getDescription(),
                    "to", e.getPath() == null ? "" : e.getPath(),
                    "categoryKey", e.getCategoryKey() == null ? "" : e.getCategoryKey()
                ));
            }
            out.put("tabData", tabDataFromDb);
            out.put("tabKeys", new ArrayList<>(tabDataFromDb.keySet()));
            out.put("source", "db");
        } else {
            out.put("tabData", STATIC_TAB_DATA);
            out.put("tabKeys", new ArrayList<>(STATIC_TAB_DATA.keySet()));
            out.put("source", "static");
        }

        out.put("processStepData", STATIC_PROCESS_DATA);
        out.put("defaultTab", "Licenses/Registrations");

        // If service specified, include orders/stages for that service for the authenticated user/admin
        if (service != null && !service.isBlank()) {
            List<Map<String, Object>> entries = new ArrayList<>();
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String email = auth == null ? null : auth.getName();
            boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isEmployee = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));

            List<Order> orders = new ArrayList<>();
            if (isAdmin) {
                orders = orderRepository.findByServiceName(service);
            } else if (isEmployee) {
                orders = orderRepository.findByAssigneeEmailIgnoreCase(email);
            } else if (email != null) {
                orders = orderRepository.findByServiceNameAndCustomerEmail(service, email);
            }

            for (Order o : orders) {
                Map<String, Object> m = new HashMap<>();
                m.put("order", o);
                m.put("stages", stageRepository.findByOrderIdOrderByCreated(o.getId()));
                entries.add(m);
            }
            out.put("serviceEntries", entries);
        }

        return out;
    }

    // Return orders for the authenticated user filtered by service (e.g., GST Registration)
    @GetMapping("/my-orders")
    public List<Map<String, Object>> myOrders(@RequestParam(required = false) String service) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = auth == null ? null : auth.getName();
        if (email == null) throw new org.springframework.security.access.AccessDeniedException("Not authenticated");

        List<Order> orders;
        if (service == null || service.isBlank()) orders = orderRepository.findByCustomerEmail(email);
        else orders = orderRepository.findByServiceNameAndCustomerEmail(service, email);

        List<Map<String, Object>> out = new ArrayList<>();
        for (Order o : orders) {
            Map<String, Object> m = new HashMap<>();
            m.put("order", o);
            List<ProcessStage> stages = stageRepository.findByOrderIdOrderByCreated(o.getId());
            m.put("stages", stages);
            out.add(m);
        }
        return out;
    }

    // Return orders for service - ADMIN sees all, EMPLOYEE sees assigned to them
    @GetMapping("/orders")
    public List<Map<String, Object>> orders(@RequestParam(required = false) String service) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isEmployee = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"));
        String email = auth == null ? null : auth.getName();

        List<Order> orders = new ArrayList<>();
        if (isAdmin) {
            if (service == null || service.isBlank()) orders = orderRepository.findAll();
            else orders = orderRepository.findByServiceName(service);
        } else if (isEmployee) {
            // employee sees assigned orders
            orders = orderRepository.findByAssigneeEmailIgnoreCase(email);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Requires ADMIN or EMPLOYEE role");
        }

        List<Map<String, Object>> out = new ArrayList<>();
        for (Order o : orders) {
            Map<String, Object> m = new HashMap<>();
            m.put("order", o);
            List<ProcessStage> stages = stageRepository.findByOrderIdOrderByCreated(o.getId());
            m.put("stages", stages);
            out.add(m);
        }
        return out;
    }
}
