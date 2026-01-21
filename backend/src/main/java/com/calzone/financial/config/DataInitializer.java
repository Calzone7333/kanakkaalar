package com.calzone.financial.config;

import com.calzone.financial.service.ServiceItem;
import com.calzone.financial.service.ServiceItemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer {

        private final ObjectMapper objectMapper = new ObjectMapper();

        @Bean
        public CommandLineRunner loadServiceData(ServiceItemRepository repository) {
                return args -> {
                        System.out.println(">>> STARTING SERVICE DATA INITIALIZATION <<<");
                        repository.deleteAll();

                        List<ServiceItem> items = new ArrayList<>();

                        // 1. GST Registration
                        addItem(items, "Licenses/Registrations", "Business Essentials", "licenses", "GST Registration",
                                        "Price: ₹1,499", "/compliances/gst", "30 mins",
                                        createPlans(
                                                        1499,
                                                        List.of("GST Form Filing in under 24 hours", "GST Certificate"),
                                                        7499,
                                                        List.of("GST Registration within 7 Business Days",
                                                                        "GST Return Filing – Valid for 12 Months* (Rs. 6000)",
                                                                        "ITR Filing for 1 Year for turnover upto 40 lakhs (2500)",
                                                                        "MSME Certificate (Rs. 500)",
                                                                        "Trademark Application* & Basic Logo Design* (Rs. 7000)",
                                                                        "Basic Business Card & Letterhead Design (Rs. 1,200)",
                                                                        "30-Minute Consultation with each Expert (Rs. 1500/-)"),
                                                        19999,
                                                        List.of("Dedicated Account Manager", "MSME Udyam Registration",
                                                                        "GST Registration",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions)",
                                                                        "ITR Filing for one financial year (upto 40 lakhs) - Rs. 2500")));

                        // 2. MSME Registration
                        addItem(items, "Licenses/Registrations", "Business Essentials", "licenses", "MSME Registration",
                                        "Price: ₹1,999", "/licenses/msme", "45 mins",
                                        createPlans(
                                                        1999, List.of("MSME Udyam", "GST Registration"),
                                                        16399,
                                                        List.of("MSME Udyam", "GST Registration",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions)"),
                                                        18899,
                                                        List.of("Dedicated Account Manager", "MSME Udyam Registration",
                                                                        "GST Registration",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions)",
                                                                        "ITR Filing for one financial year (upto 40 lakhs) - Rs. 2500")));

                        // 3. Food License
                        addItem(items, "Licenses/Registrations", "Business Essentials", "licenses", "Food License",
                                        "Price: ₹1,000", "/licenses/fssai", "2-3 days",
                                        createPlans(
                                                        1000,
                                                        List.of("15-minutes call with food license experts",
                                                                        "Assistance with selecting the right license type",
                                                                        "Your food license application filing done in 24 hours",
                                                                        "99% faster application approval",
                                                                        "FSSAI Certificate"),
                                                        16899,
                                                        List.of("15-minutes call with food license experts",
                                                                        "Assistance with selecting the right license type",
                                                                        "Your food license application filing done in 24 hours",
                                                                        "99% faster application approval",
                                                                        "FSSAI Certificate", "GST Registration",
                                                                        "GST filing for one financial year (upto 300 transactions)"),
                                                        19399,
                                                        List.of("15-minutes call with food license experts",
                                                                        "Assistance with selecting the right license type",
                                                                        "Your food license application filing done in 24 hours",
                                                                        "99% faster application approval",
                                                                        "FSSAI Certificate", "GST Registration",
                                                                        "GST filing for one financial year (upto 300 transactions)",
                                                                        "ITR Filings for one financial year (upto 40 lakhs) - Rs. 2500")));

                        // 4. Digital Signature Certificate
                        addItem(items, "Licenses/Registrations", "Business Essentials", "licenses",
                                        "Digital Signature (DSC)", "Price: ₹2,500", "/licenses/dsc", "45 mins",
                                        createPlans(
                                                        2500, List.of("Individual DSC"),
                                                        2500, List.of("Director/Partner DSC"),
                                                        2500, List.of("Organisation DSC")));

                        // 5. Trade License
                        addItem(items, "Licenses/Registrations", "Business Essentials", "licenses", "Trade License",
                                        "Price: ₹3,000", "/licenses/trade", "1 hr",
                                        createPlans(
                                                        3000,
                                                        List.of("Application Filing", "Doc Verification",
                                                                        "License Issuance"),
                                                        3000,
                                                        List.of("Application Filing", "Doc Verification",
                                                                        "License Issuance", "Priority Processing"),
                                                        3000,
                                                        List.of("Application Filing", "Doc Verification",
                                                                        "License Issuance", "Priority Processing",
                                                                        "Consultation")));

                        // 6. PF/ESI Registration
                        addItem(items, "Licenses/Registrations", "Labour Compliance", "licenses", "PF/ESI Registration",
                                        "Price: ₹1,500", "/compliances/pf-esi", null,
                                        createPlans(
                                                        1500,
                                                        List.of("PF Registration", "ESI Registration", "Basic Support"),
                                                        1500,
                                                        List.of("PF Registration", "ESI Registration",
                                                                        "Priority Support"),
                                                        1500, List.of("PF Registration", "ESI Registration",
                                                                        "Dedicated Manager")));

                        // 7. Professional Tax Registration
                        addItem(items, "Licenses/Registrations", "Labour Compliance", "licenses",
                                        "Professional Tax Registration", "Price: ₹1,500",
                                        "/compliances/professional-tax", "30 mins",
                                        createPlans(
                                                        1500,
                                                        List.of("Fully expert assisted process",
                                                                        "Assistance on document preparation",
                                                                        "Your application submission in 48 hours",
                                                                        "100% Compliance assurance",
                                                                        "PTRC Certificate"),
                                                        2249,
                                                        List.of("Fully expert assisted process",
                                                                        "Assistance on document preparation",
                                                                        "Your application submission in 24 hours",
                                                                        "100% Compliance assurance", "PTRC Certificate",
                                                                        "PT Filing for half year"),
                                                        4999,
                                                        List.of("Fully expert assisted process",
                                                                        "Assistance on document preparation",
                                                                        "Your application submission in 24 hours",
                                                                        "100% Compliance assurance", "PTRC Certificate",
                                                                        "PT Filing for one year",
                                                                        "company tax registration",
                                                                        "company tax filing for One Year")));

                        // 8. Shops & Establishment License
                        addItem(items, "Licenses/Registrations", "Labour Compliance", "licenses",
                                        "Shops & Establishment License", "Price: ₹2,500", "/licenses/shop", "45 mins",
                                        createPlans(
                                                        2500,
                                                        List.of("Expert assisted process",
                                                                        "Application filing in just 4 days",
                                                                        "Guidance during Shop verification by officers",
                                                                        "Shop License Certificate in 14 days",
                                                                        "Zero balance current account with 7% interest"),
                                                        18899,
                                                        List.of("Expert assisted process", "GST Registration",
                                                                        "MSME Registration",
                                                                        "Application filing in just 4 days",
                                                                        "Guidance during Shop verification by officers",
                                                                        "Shop License Certificate in 14 days",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions)",
                                                                        "Zero balance current account with 7% interest"),
                                                        21399,
                                                        List.of("Dedicated Account Manager", "Expert assisted process",
                                                                        "GST Registration", "MSME Registration",
                                                                        "Application filing in just 4 days",
                                                                        "Guidance during Shop verification by officers",
                                                                        "Shop License Certificate in 14 days",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions)",
                                                                        "Zero balance current account with 7% interest",
                                                                        "ITR Filing for one financial year (upto 40 lakhs) - Rs. 2500")));

                        // 9. IEC
                        addItem(items, "Licenses/Registrations", "Export Business", "licenses",
                                        "Import Export Code (IEC)", "Price: ₹1,200", "/licenses/iec", "1.5 hrs",
                                        createPlans(
                                                        1200, List.of("IEC Application Filing", "DDFT Certificate"),
                                                        1200,
                                                        List.of("IEC Application Filing", "DDFT Certificate",
                                                                        "Modification Support"),
                                                        1200, List.of("IEC Application Filing", "DDFT Certificate",
                                                                        "Lifetime Support")));

                        // 10. AD Code
                        addItem(items, "Licenses/Registrations", "Export Business", "licenses", "AD Code Registration",
                                        "Price: ₹1,500", "/licenses/adcode", null,
                                        createPlans(
                                                        1500,
                                                        List.of("AD Code Registration", "Bank Authorization Draft"),
                                                        1500,
                                                        List.of("AD Code Registration", "Bank Authorization Draft",
                                                                        "ICEGATE Registration"),
                                                        1500,
                                                        List.of("AD Code Registration", "Bank Authorization Draft",
                                                                        "ICEGATE Registration",
                                                                        "Port Registration Assistance")));

                        // 11-13. Red Items (Contact)
                        addItem(items, "Licenses/Registrations", "Export Business", "licenses", "APEDA Registration",
                                        "Contact Expert", "/licenses/apeda", null, null);
                        addItem(items, "Licenses/Registrations", "Quality & Standards", "licenses", "ISO Certification",
                                        "Contact Expert", "/licenses/iso", null, null);
                        addItem(items, "Licenses/Registrations", "Quality & Standards", "licenses",
                                        "Hallmark Registration", "Contact Expert", "/licenses/hallmark", null, null);

                        // 14. Trademark Registration
                        addItem(items, "Trademark/IP", "Trademark", "ip", "Trademark Registration", "Price: ₹7,500",
                                        "/ip/trademark-registration", null,
                                        createPlans(
                                                        7500,
                                                        List.of("Trademark Search", "Application Filing (TM-A)",
                                                                        "Basic Support"),
                                                        7500,
                                                        List.of("Trademark Search", "Application Filing",
                                                                        "Objection Handling (Basic)", "Status Updates"),
                                                        7500,
                                                        List.of("Comprehensive TM Search", "Application Filing",
                                                                        "Objection Handling (Priority)",
                                                                        "Hearing Assistance")));

                        // 15. Respond to Trademark Objection
                        addItem(items, "Trademark/IP", "Trademark", "ip", "Respond to Trademark Objection",
                                        "Price: ₹10,000", "/ip/trademark-objection", null,
                                        createPlans(
                                                        10000,
                                                        List.of("30 minute consultation with an IP lawyer",
                                                                        "Thorough case study on your brand objection",
                                                                        "Reply draft for TM Objection (Only Once)",
                                                                        "TM reply filing on IP portal (Only Once)",
                                                                        "Regular updates on deadlines",
                                                                        "TM Certificate*"),
                                                        10000,
                                                        List.of("30 minute consultation with an IP lawyer",
                                                                        "Thorough case study on your brand objection",
                                                                        "Reply draft for TM Objection (As many times)",
                                                                        "TM reply filing on IP portal (As many times)",
                                                                        "Regular updates on deadlines",
                                                                        "TM Certificate*"),
                                                        10000,
                                                        List.of("30-minute expert consultation with a Senior IP lawyer",
                                                                        "Dedicated account manager",
                                                                        "Thorough case study on your brand objection",
                                                                        "Reply draft for TM Objection (As many times)",
                                                                        "TM reply filing on IP portal (As many times)",
                                                                        "Regular updates on deadlines",
                                                                        "Top priority for senior IP lawyer to handle the hearing (Upto 6 hearings)",
                                                                        "Assistance in gathering evidence and preparing arguments for TM Hearing",
                                                                        "Representing for your brand's hearing at the TM registry jurisdiction")));

                        // 16-18. Red Items (Trademark)
                        addItem(items, "Trademark/IP", "Trademark", "ip", "Trademark Hearing Service",
                                        "Contact Expert", "/ip/trademark-hearing", null, null);
                        addItem(items, "Trademark/IP", "Trademark", "ip", "Renewal of Trademark",
                                        "Contact Expert", "/ip/trademark-renewal", null, null);
                        addItem(items, "Trademark/IP", "Trademark", "ip", "International Trademark",
                                        "Contact Expert", "/ip/trademark-international", null, null);

                        // 19. Red Item (Copyright)
                        addItem(items, "Trademark/IP", "Copyright", "ip", "Copyright Music",
                                        "Contact Expert", "/ip/copyright-music", null, null);

                        // 20-22. Red Items (Patent)
                        addItem(items, "Trademark/IP", "Patent", "ip", "Patent Search",
                                        "Contact Expert", "/ip/patent-search", null, null);
                        addItem(items, "Trademark/IP", "Patent", "ip", "Provisional Patent Application",
                                        "Contact Expert", "/ip/patent-provisional", null, null);
                        addItem(items, "Trademark/IP", "Patent", "ip", "Patent Registration",
                                        "Contact Expert", "/ip/patent-registration", null, null);

                        // 23. Change Company Name
                        addItem(items, "Company Change", "Company Name/Management", "company", "Change Company Name",
                                        "Price: ₹4,999", "/company/change-name", "30 mins",
                                        createPlans(
                                                        4999, List.of("ROC filing"),
                                                        5199, List.of("ROC filing + Board resolution + PAN update"),
                                                        5449, List.of("ROC filing + GST update + pan update")));

                        // 24. Change Objectives
                        addItem(items, "Company Change", "Company Name/Management", "company",
                                        "Change Objectives of Your Business", "Price: ₹3,499",
                                        "/company/change-objectives", null,
                                        createPlans(
                                                        3499,
                                                        List.of("Drafting Board Resolution", "MOA Amendment Draft"),
                                                        3499,
                                                        List.of("Drafting Board Resolution", "MOA Amendment",
                                                                        "ROC Filing (MGT-14)"),
                                                        3499, List.of("Drafting Board Resolution", "MOA Amendment",
                                                                        "ROC Filing", "Updated MOA/AOA")));

                        // 25. Appoint Director
                        addItem(items, "Company Change", "Company Name/Management", "company",
                                        "Appointment of a Director/Partner", "Price: ₹1,999",
                                        "/company/appoint-director", "30 mins",
                                        createPlans(
                                                        1999, List.of("Director Consent (DIR-2)", "Board Resolution"),
                                                        1999,
                                                        List.of("Director Consent", "Board Resolution",
                                                                        "ROC Filing (DIR-12)"),
                                                        1999, List.of("Director Consent", "Board Resolution",
                                                                        "ROC Filing", "Digital Welcome Kit")));

                        // 26. Remove Director
                        addItem(items, "Company Change", "Company Name/Management", "company",
                                        "Removal of a Director/Partner", "Price: ₹1,999", "/company/remove-director",
                                        "30 mins",
                                        createPlans(
                                                        1999, List.of("Resignation Letter Review", "Board Resolution"),
                                                        1999,
                                                        List.of("Resignation Review", "Board Resolution",
                                                                        "ROC Filing (DIR-12)"),
                                                        1999, List.of("Resignation Review", "Board Resolution",
                                                                        "ROC Filing", "Settlement Support")));

                        // 27. Change Address (City)
                        addItem(items, "Company Change", "Company Name/Management", "company",
                                        "Change Address (Same City)", "Price: ₹1,500", "/company/change-address-city",
                                        null,
                                        createPlans(
                                                        1500, List.of("Board Resolution", "Address Proof Verification"),
                                                        1500,
                                                        List.of("Board Resolution", "Address Proof",
                                                                        "ROC Filing (INC-22)"),
                                                        1500, List.of("Board Resolution", "Address Proof", "ROC Filing",
                                                                        "Update in Statutory Registers")));

                        // 28. Change Address (State)
                        addItem(items, "Company Change", "Company Name/Management", "company",
                                        "Change Address (Different State)", "Price: ₹7,500",
                                        "/company/change-address-state", null,
                                        createPlans(7500, List.of("ROC Filing", "Board Resolution"), 7500,
                                                        List.of("ROC Filing", "Board Resolution", "Document Prep"),
                                                        7500,
                                                        List.of("ROC Filing", "Board Resolution", "Document Prep",
                                                                        "Consultation")));

                        // 29. Transfer Shares
                        addItem(items, "Company Change", "Capital & Share Services", "company", "Transfer Shares",
                                        "Price: ₹4,999", "/company/transfer-shares", null,
                                        createPlans(4999, List.of("Share Transfer Deed", "Stamp Duty Calculation"),
                                                        4999,
                                                        List.of("Share Transfer Deed", "Stamp Duty Calculation",
                                                                        "Board Resolution"),
                                                        4999,
                                                        List.of("Share Transfer Deed", "Stamp Duty Calculation",
                                                                        "Board Resolution", "ROC Filing")));

                        // 30. Increase Authorized Capital
                        addItem(items, "Company Change", "Capital & Share Services", "company",
                                        "Changing the Authorized Capital of your Company", "Price: ₹4,999",
                                        "/company/change-capital", null,
                                        createPlans(4999, List.of("ROC Form Filing"), 4999,
                                                        List.of("ROC Form Filing", "Board Resolution"), 4999,
                                                        List.of("ROC Form Filing", "Board Resolution",
                                                                        "MOA/AOA Update")));

                        // 31. Partnership to Pvt Ltd
                        addItem(items, "Company Change", "Business Upgrades", "company",
                                        "Convert Partnership into a Private Limited company", "Price: ₹9,999",
                                        "/company/partnership-to-private", "2-3 hrs",
                                        createPlans(9999, List.of("Name Approval", "Incorporation Filing"), 9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN"),
                                                        9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN",
                                                                        "PAN & TAN")));

                        // 32. LLP to Pvt Ltd
                        addItem(items, "Company Change", "Business Upgrades", "company",
                                        "Convert LLP into a Private Limited Company", "Price: ₹9,999",
                                        "/company/llp-to-private", "2-3 hrs",
                                        createPlans(9999, List.of("Name Approval", "Incorporation Filing"), 9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN"),
                                                        9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN",
                                                                        "PAN & TAN")));

                        // 33. Sole to Pvt Ltd
                        addItem(items, "Company Change", "Business Upgrades", "company",
                                        "Convert Sole Proprietorship into a Private Limited Company", "Price: ₹9,999",
                                        "/company/sole-to-private", "3-4 hrs",
                                        createPlans(9999, List.of("Name Approval", "Incorporation Filing"), 9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN"),
                                                        9999,
                                                        List.of("Name Approval", "Incorporation Filing", "DSC & DIN",
                                                                        "PAN & TAN")));

                        // 34. ITR Filing
                        addItem(items, "Taxation & Compliance", "Direct & Indirect Tax", "tax",
                                        "Income Tax Return Filing (ITR)", "Price: ₹1,000", "/tax/itr-filing", null,
                                        createPlans(
                                                        1000,
                                                        List.of("Income From salaries, One house property , Interest income , Dividend Income"),
                                                        2200,
                                                        List.of("Income From salaries, One house Property income , Interest income , Dividend Income , Capital Gain on shares"),
                                                        4000,
                                                        List.of("Income From salaries, One house Property income , Dividend Income , Capital Gain on shares Business Income")));

                        // 35. TDS Return Filing
                        addItem(items, "Taxation & Compliance", "Direct & Indirect Tax", "tax", "TDS Return Filing",
                                        "Price: ₹1,000", "/tax/tds-filing", "1-2 hrs",
                                        createPlans(
                                                        1000,
                                                        List.of("Three Month Payment and One Quarter Return filing"),
                                                        2000, List.of("6 months payment + Two quarter return filing"),
                                                        4000, List.of("12 months payment + 4 quarter return filing")));

                        // 36. GSTR Filings
                        addItem(items, "Taxation & Compliance", "Direct & Indirect Tax", "tax", "GSTR Filings",
                                        "Price: ₹699", "/tax/gstr-filings", "30 mins",
                                        createPlans(
                                                        699,
                                                        List.of("Expert-assisted process",
                                                                        "GSTR-1 & 3B(upto 100 transactions per month)"),
                                                        7500,
                                                        List.of("Expert assisted process",
                                                                        "GSTR-1 & 3B for 12 months (Upto 300 transactions & turnover of 20 lakhs)"),
                                                        10500,
                                                        List.of("Dedicated account manager", "Expert assisted process",
                                                                        "GSTR-1 & 3B for 12 months (Upto 500 transactions & turnover of 40 lakhs)",
                                                                        "ITR Filing for one Financial year (Upto 40 lakhs)")));

                        // 37. Annual Compliance PVT
                        addItem(items, "Taxation & Compliance", "RoC/Secretarial Compliance", "tax",
                                        "Annual Compliance for PVT", "Price: ₹24,500", "/roc/annual-pvt", "30 mins",
                                        createPlans(
                                                        24500,
                                                        List.of("Appointment of Auditor",
                                                                        "Issuance of share certificate",
                                                                        "INC 20 A form filing",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation",
                                                                        "AOC 4, MGT 7 & ADT 1 filing",
                                                                        "Annual filing(Upto turnover of 20 lakhs)",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)"),
                                                        34999,
                                                        List.of("Appointment of Auditor",
                                                                        "Issuance of share certificate",
                                                                        "INC 20 A form filing",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation",
                                                                        "AOC 4, MGT 7 & ADT 1 filing",
                                                                        "Annual filing(Upto turnover of 20 lakhs)",
                                                                        "Facilitation of Annual General Meeting",
                                                                        "Statutory regulations PF, ESI",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Preparation of Minutes & Filing of AGM Report",
                                                                        "GST Returns Filings (12 Months)",
                                                                        "Consultation with CA, CS & Lawyer"),
                                                        49999,
                                                        List.of("Appointment of Auditor",
                                                                        "Issuance of share certificate",
                                                                        "INC 20 A form filing",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation",
                                                                        "AOC 4, MGT 7 & ADT 1 filing",
                                                                        "Annual filing(Upto turnover of 20 lakhs)",
                                                                        "Facilitation of Annual General Meeting",
                                                                        "Statutory regulations PF, ESI",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Preparation of Minutes & Filing of AGM Report",
                                                                        "GST Returns Filings (12 Months)",
                                                                        "Dedicated account manager",
                                                                        "Consultation with CA, CS & Lawyer",
                                                                        "TDS filing for 1 year",
                                                                        "Payroll service (Up to 5 employees)")));

                        // 38. Annual Compliance LLP
                        addItem(items, "Taxation & Compliance", "RoC/Secretarial Compliance", "tax",
                                        "Annual Compliance for LLP", "Price: ₹10,999", "/roc/annual-llp", "1 hr",
                                        createPlans(
                                                        10999,
                                                        List.of("Form 8 & 11 filing(One year)",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation"),
                                                        19999,
                                                        List.of("Form 8 & 11 filing(One year)",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation",
                                                                        "Dedicated account manager",
                                                                        "GST Returns Filings (12 Months)"),
                                                        29999,
                                                        List.of("Form 8 & 11 filing(One year)",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation",
                                                                        "Dedicated account manager",
                                                                        "GST Returns Filings (12 Months)",
                                                                        "Statutory regulations PF, ESI",
                                                                        "TDS filing for 1 year",
                                                                        "Payroll service (up to 5 employees)")));

                        // 39. Director KYC
                        addItem(items, "Taxation & Compliance", "RoC/Secretarial Compliance", "tax",
                                        "Director KYC(DIR-3) Filing", "Price: ₹499", "/roc/dir-3-filing", "20 mins",
                                        createPlans(499, List.of("DIR-3 Filing"), 499,
                                                        List.of("DIR-3 Filing", "OTP Verification"), 499,
                                                        List.of("DIR-3 Filing", "OTP Verification", "Confirmation")));

                        // 40. PF & ESI Filings
                        addItem(items, "Taxation & Compliance", "Labour Compliance", "tax", "PF & ESI Filings",
                                        "Price: ₹1,000", "/labour/pf-esi", null,
                                        createPlans(
                                                        1000, List.of("Monthly PF Filing", "Monthly ESI Filing"),
                                                        5100,
                                                        List.of("6 Months PF & ESI Filing", "Basic Labor Compliance"),
                                                        9600, List.of("12 Months PF & ESI Filing",
                                                                        "Comprehensive Labor Compliance")));

                        // 41. Professional Tax Filings
                        addItem(items, "Taxation & Compliance", "Labour Compliance", "tax", "Professional Tax Filings",
                                        "Price: ₹1,500", "/labour/professional-tax", "30 mins",
                                        createPlans(
                                                        1500,
                                                        List.of("Fully expert assisted process",
                                                                        "Assistance on document preparation",
                                                                        "Timely filings on the respective state department",
                                                                        "100% Compliance assurance"),
                                                        2500,
                                                        List.of("Semi-Annual Filing Support",
                                                                        "Assistance on document preparation",
                                                                        "Timely filings on the respective state department",
                                                                        "100% Compliance assurance"),
                                                        3500,
                                                        List.of("Dedicated account manager",
                                                                        "Annual Filing Support",
                                                                        "Timely filings on the respective state department",
                                                                        "100% Compliance assurance")));

                        // 42. Payroll
                        addItem(items, "Taxation & Compliance", "Labour Compliance", "tax", "Payroll", "Price: ₹500",
                                        "/labour/payroll", null,
                                        createPlans(
                                                        500, List.of("1 year filing support (upto 10 employees)"),
                                                        4500, List.of("1 year filing support (upto 100 employees)"),
                                                        7500, List.of("1 year filing support (Above 100 employees)")));

                        // 43. Audit
                        addItem(items, "Taxation & Compliance", "Accounting & Financial Management", "tax",
                                        "Audit of a Company", "Price: ₹7,500", "/accounting/audit", null,
                                        createPlans(7500, List.of("Statutory Audit"), 12500,
                                                        List.of("Statutory Audit", "Tax Audit"),
                                                        15000,
                                                        List.of("Statutory Audit", "Tax Audit", "Internal Audit")));

                        // 44. Due Diligence
                        addItem(items, "Taxation & Compliance", "Business Expansion", "tax", "Due Diligence",
                                        "Price: ₹2,500", "/business/due-diligence", null,
                                        createPlans(2500, List.of("Basic Due Diligence"), 2500,
                                                        List.of("Financial Due Diligence"), 2500,
                                                        List.of("Comprehensive Due Diligence")));

                        // 45. Pitch Deck
                        addItem(items, "Taxation & Compliance", "Business Expansion", "tax", "Pitch Deck Service",
                                        "Price: ₹7,500", "/business/pitch-deck", null,
                                        createPlans(7500, List.of("Content Review"), 7500, List.of("Design & Content"),
                                                        7500,
                                                        List.of("Full Pitch Deck Creation")));

                        // 46. Private Limited Company
                        addItem(items, "New Business/Closure", "Business Registration", "formation",
                                        "Private Limited Company Registration", "Price: ₹4,999",
                                        "/formation/private-ltd", "2 hrs",
                                        createPlans(
                                                        4999,
                                                        List.of("Name Approval", "SPICE+ form filing",
                                                                        "Incorporation Certificate",
                                                                        "DIN for Directors", "DSC for 2 Directors",
                                                                        "Company PAN+TAN"),
                                                        5499,
                                                        List.of("Name Approval", "SPICE+ form filing",
                                                                        "Incorporation Certificate",
                                                                        "DIN for Directors", "DSC for 2 Directors",
                                                                        "Company PAN+TAN", "MSME registration Free"),
                                                        6799,
                                                        List.of("Name Approval", "SPICE+ form filing",
                                                                        "Incorporation Certificate",
                                                                        "DIN for Directors", "DSC for 2 Directors",
                                                                        "Company PAN+TAN", "INC 20A filing",
                                                                        "MSME registration Free", "ADT 1 filing")));

                        // 47. LLP Registration
                        addItem(items, "New Business/Closure", "Business Registration", "formation",
                                        "Limited Liability Partnership Registration", "Price: ₹4,999", "/formation/llp",
                                        "2 hrs",
                                        createPlans(
                                                        4999,
                                                        List.of("Expert assisted process",
                                                                        "Your company name is reserved in just 2-4 days",
                                                                        "DSC in 4 - 7 days",
                                                                        "LLP Incorporation form filing done in 21 days*",
                                                                        "LLP Incorporation Certificate",
                                                                        "LLP Agreement form filing done in 14 days(Post Incorporation)",
                                                                        "Company PAN+TAN", "DIN for directors"),
                                                        8099,
                                                        List.of("Expert assisted process",
                                                                        "Your company name is reserved in just 24 hours*",
                                                                        "DSC in just 24 hours*",
                                                                        "LLP Incorporation form filing done in 14 days*",
                                                                        "LLP Incorporation Certificate",
                                                                        "LLP Agreement form filing done in 14 days(Post Incorporation)",
                                                                        "Company PAN+TAN",
                                                                        "Digital welcome kit that includes a checklist of all post-incorporation",
                                                                        "DIN for directors"),
                                                        15000,
                                                        List.of("Expert assisted process",
                                                                        "Your company name is reserved in just 24 hours*",
                                                                        "DSC in just 24 hours*",
                                                                        "LLP Incorporation form filing done in 14 days*",
                                                                        "LLP Incorporation Certificate",
                                                                        "LLP Agreement form filing done in 14 days(Post Incorporation)",
                                                                        "Company PAN+TAN", "DIN for directors",
                                                                        "30-minute call with a senior CA/CS for your business planning",
                                                                        "Form 8 & 11 filing(One year)",
                                                                        "DIR 3 KYC (For 2 directors)",
                                                                        "One Year Income Tax filing(Upto turnover of 20 lakhs)",
                                                                        "Accounting & Bookkeeping(Upto 100 transactions)",
                                                                        "Financial statement preparation")));

                        // 48. Sole Proprietorship
                        addItem(items, "New Business/Closure", "Business Registration", "formation",
                                        "Sole Proprietorship", "Price: ₹1,499", "/formation/sole-proprietorship",
                                        "1 hr",
                                        createPlans(
                                                        1499, List.of("Expert assisted process", "GST registration"),
                                                        10799,
                                                        List.of("Expert assisted process", "GST registration",
                                                                        "MSME registration (Udyam)",
                                                                        "GST filing for one financial year (upto 300 transactions)"),
                                                        16499,
                                                        List.of("Expert assisted process", "GST registration",
                                                                        "MSME registration (Udyam)",
                                                                        "GST filing for one financial year (upto 500 transactions)",
                                                                        "ITR filing turnover upto 40 Lakh")));

                        // 49. OPC
                        addItem(items, "New Business/Closure", "Business Registration", "formation",
                                        "One Person Company Registration", "Price: ₹4,999", "/formation/opc", "2 hr",
                                        createPlans(
                                                        4999,
                                                        List.of("Your company name is filed in just 4 - 7 days",
                                                                        "SPICE+ form filing",
                                                                        "Incorporation Certificate in 40 days",
                                                                        "Company PAN+TAN", "DIN for directors"),
                                                        5499,
                                                        List.of("Expert assisted process",
                                                                        "Your company name is filed in just 2 - 3 days*",
                                                                        "DSC in just 3 - 4 days",
                                                                        "SPICE+ form filing in 10 days*",
                                                                        "Incorporation Certificate in 14 - 21 days",
                                                                        "Company PAN+TAN", "DIN for directors"),
                                                        7999,
                                                        List.of("Expert assisted process",
                                                                        "Your company name is filed in just 1 - 2 days*",
                                                                        "DSC in just 1 - 2 days",
                                                                        "SPICE+ form filing in 5 days*",
                                                                        "Incorporation Certificate in 10 - 17 days",
                                                                        "Company PAN+TAN", "DIN for directors",
                                                                        "MSME registration", "Form 20A filing",
                                                                        "ADT 1 filing")));

                        // 50. Partnership Firm
                        addItem(items, "New Business/Closure", "Business Registration", "formation",
                                        "Partnership Firm Registration", "Price: ₹4,999", "/formation/partnership",
                                        null,
                                        createPlans(
                                                        4999,
                                                        List.of("Expert assisted process",
                                                                        "Partnership deed drafting in 3 days",
                                                                        "Deed submission to the local registrar on your behalf",
                                                                        "PAN Card",
                                                                        "Zero balance current account with 7% interest"),
                                                        20898,
                                                        List.of("Expert assisted process",
                                                                        "Partnership deed drafting in 3 days",
                                                                        "Deed submission to the local registrar on your behalf",
                                                                        "PAN Card", "GST registration",
                                                                        "GSTR-1 & 3B for 12 months (Up to 300 transactions)",
                                                                        "Zero balance current account with 7% interest"),
                                                        30398,
                                                        List.of("Dedicated account manager",
                                                                        "Partnership deed drafting in 3 days",
                                                                        "Deed submission to the local registrar on your behalf",
                                                                        "PAN Card", "GST registration",
                                                                        "GSTR-1 & 3B for 12 months (Up to 300 transactions)",
                                                                        "Zero balance current account with 7% interest",
                                                                        "Trademark Registration for your Brand",
                                                                        "ITR Filing for one financial year (Up to 40 lakhs)")));

                        // 51-54 International (Red)
                        addItem(items, "New Business/Closure", "International Business Setup", "formation",
                                        "US Incorporation", "Contact Expert", "/formation/us-inc", null, null);
                        addItem(items, "New Business/Closure", "International Business Setup", "formation",
                                        "Dubai Incorporation", "Contact Expert", "/formation/dubai-inc", null, null);
                        addItem(items, "New Business/Closure", "International Business Setup", "formation",
                                        "UK Incorporation", "Contact Expert", "/formation/uk-inc", null, null);
                        addItem(items, "New Business/Closure", "International Business Setup", "formation",
                                        "Singapore Incorporation", "Contact Expert", "/formation/singapore-inc", null,
                                        null);

                        // 55. Section 8
                        addItem(items, "New Business/Closure", "NGO Registration", "formation",
                                        "Section 8 Registration", "Price: ₹4,999", "/formation/section8", "2 hrs",
                                        createPlans(
                                                        4999,
                                                        List.of("Expert assisted process",
                                                                        "Guidance on choosing right NGO structure",
                                                                        "Name suggestion",
                                                                        "Name approval within 7 working days"),
                                                        5999,
                                                        List.of("Expert assisted process", "DSC in just 24 hours",
                                                                        "DIN for directors",
                                                                        "Your company name is reserved in just 5 days",
                                                                        "SPICE+ form filing in 7 days",
                                                                        "Incorporation Certificate", "Company PAN+TAN",
                                                                        "Zero balance current account with 7% interest",
                                                                        "DARPAN Registration Free 🎊"),
                                                        19999,
                                                        List.of("Dedicated account manager", "DSC in just 24 hours",
                                                                        "DIN for directors",
                                                                        "Your company name is reserved in just 3 days",
                                                                        "SPICE+ form filing in 7 days*",
                                                                        "Incorporation Certificate", "Company PAN+TAN",
                                                                        "Zero balance current account with 7% interest",
                                                                        "Section 80g & 12A in 14 days post business formation",
                                                                        "DARPAN Registration Free 🎊", "CSR Filings",
                                                                        "Accounting for one Financial year (0-300 Transactions)",
                                                                        "Auditing for one Financial year (0-300 Transactions)",
                                                                        "IT filing for one Financial year",
                                                                        "Transaction and Tax Advisory by a Professional Auditor")));

                        // 56. Trust Registration
                        addItem(items, "New Business/Closure", "NGO Registration", "formation", "Trust Registration",
                                        "Price: ₹3,499", "/formation/trust", null,
                                        createPlans(
                                                        3499,
                                                        List.of("Expert assisted process",
                                                                        "Draft of Trust deed in just 72 hours*",
                                                                        "Submission of trust deed in 5 days",
                                                                        "Trust certificate in 7 days",
                                                                        "Company PAN+TAN",
                                                                        "Instant zero balance current A/c"),
                                                        10499,
                                                        List.of("Everything in Starter package", "+",
                                                                        "Section 80g & 12A in 14 days post business formation",
                                                                        "DARPAN Registration", "CSR Filings"),
                                                        10499,
                                                        List.of("Everything in Standard package",
                                                                        "Dedicated account manager",
                                                                        "Accounting for one Financial year (0-300 Transactions)",
                                                                        "Auditing for one Financial year (0-300 Transactions)",
                                                                        "IT filing for one Financial year",
                                                                        "Transaction and Tax Advisory by a Professional Auditor")));

                        // 57. Company Closure
                        addItem(items, "New Business/Closure", "Closure/Cancellation", "closure",
                                        "Company Closure Service", "Price: ₹3,999", "/closure/company-closure", null,
                                        createPlans(3999, List.of("Application Preparation"), 3999,
                                                        List.of("Application Filing"), 3999,
                                                        List.of("Complete Closure Support")));

                        // 58. GST Cancellation
                        addItem(items, "New Business/Closure", "Closure/Cancellation", "closure",
                                        "GST Cancellation Service", "Price: ₹2,499", "/closure/gst-cancellation", null,
                                        createPlans(2499, List.of("Application Preparation"), 2499,
                                                        List.of("Application Filing"), 2499,
                                                        List.of("Complete Cancellation Support")));

                        // 59-71 Legal
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "NDA", "Contact Expert",
                                        "/legal/nda", null, null);
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal",
                                        "Master Service Agreement", "Price: ₹2,000", "/legal/msa", null,
                                        createPlans(2000, List.of("Drafting"), 2000, List.of("Drafting", "Review"),
                                                        2000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Franchise Agreement",
                                        "Price: ₹2,000", "/legal/franchise", null,
                                        createPlans(2000, List.of("Drafting"), 2000, List.of("Drafting", "Review"),
                                                        2000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Joint Venture Agreement",
                                        "Price: ₹2,000", "/legal/joint-venture", null,
                                        createPlans(2000, List.of("Drafting"), 2000, List.of("Drafting", "Review"),
                                                        2000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Founders Agreements",
                                        "Price: ₹2,000", "/legal/founders", null,
                                        createPlans(2000, List.of("Drafting"), 2000, List.of("Drafting", "Review"),
                                                        2000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal",
                                        "Consultancy Services Agreement", "Price: ₹1,000", "/legal/consultancy", null,
                                        createPlans(1000, List.of("Drafting"), 1000, List.of("Drafting", "Review"),
                                                        1000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Employment Agreement",
                                        "Price: ₹1,000", "/legal/employment", null,
                                        createPlans(1000, List.of("Drafting"), 1000, List.of("Drafting", "Review"),
                                                        1000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Employment Contract",
                                        "Price: ₹1,000", "/legal/employment-contract", null,
                                        createPlans(1000, List.of("Drafting"), 1000, List.of("Drafting", "Review"),
                                                        1000,
                                                        List.of("Drafting", "Review", "Finalization")));
                        addItem(items, "Legal Agreements", "Contracts & Agreements", "legal", "Service Contract",
                                        "Price: ₹1,000", "/legal/service-contract", null,
                                        createPlans(1000, List.of("Drafting"), 1000, List.of("Drafting", "Review"),
                                                        1000,
                                                        List.of("Drafting", "Review", "Finalization")));

                        // 68. Legal Notice
                        addItem(items, "Legal Agreements", "Notices", "legal", "Legal Notice", "Price: ₹1,499",
                                        "/legal/legal-notice", null,
                                        createPlans(
                                                        1499,
                                                        List.of("Drafting of Legal Notice", "Chat & Email Support",
                                                                        "Free Legal Advice"),
                                                        1499,
                                                        List.of("Scrutinization of Legal Notice",
                                                                        "Drafting a Legal notice/ Reply to opposite party",
                                                                        "Chat & Email Support", "Free Legal Advice"),
                                                        null, null));

                        // 69. Cheque Bounce
                        addItem(items, "Legal Agreements", "Notices", "legal", "Cheque Bounce Notice", "Price: ₹2,500",
                                        "/legal/cheque-bounce", null,
                                        createPlans(
                                                        2500,
                                                        List.of("Drafting of Legal Notice", "Chat & Email Support",
                                                                        "Free Legal Advice"),
                                                        3500,
                                                        List.of("Scrutinization of Legal Notice",
                                                                        "Drafting a Legal notice/ Reply to opposite party",
                                                                        "Chat & Email Support", "Free Legal Advice"),
                                                        null, null));

                        // 70. Recovery of Dues
                        addItem(items, "Legal Agreements", "Notices", "legal", "Recovery of Dues", "Price: ₹1,000",
                                        "/legal/recovery", null,
                                        createPlans(1000, List.of("Drafting of Notice"), 1000,
                                                        List.of("Drafting", "Sending Notice"), 1000,
                                                        List.of("Drafting", "Sending Notice", "Follow-up")));

                        // 71. Terms of Service
                        addItem(items, "Legal Agreements", "Policy", "legal", "Terms of Service and Privacy Policy",
                                        "Price: ₹1,500", "/legal/policies", null,
                                        createPlans(1500, List.of("Drafting Policy"), 1500,
                                                        List.of("Drafting", "GDPR Compliance Check"), 1500,
                                                        List.of("Drafting", "GDPR Check", "Free Revision")));

                        repository.saveAll(items);
                        System.out.println(">>> SERVICE DATA INITIALIZATION COMPLETED: " + items.size()
                                        + " items saved. <<<");
                };
        }

        private void addItem(List<ServiceItem> list, String category, String subCategory, String catKey, String name,
                        String desc, String route, String duration, String pricingPlans) {
                ServiceItem item = new ServiceItem();
                item.setCategory(category);
                item.setSubCategory(subCategory);
                item.setCategoryKey(catKey);
                item.setName(name);
                item.setDescription(desc);
                item.setPriceDescription(desc != null ? desc.replace("Price: ", "") : null);
                item.setRoute(route);
                item.setDuration(duration);
                item.setPricingPlans(pricingPlans);
                item.setActive(true);
                list.add(item);
        }

        private String createPlans(Integer stdPrice, List<String> stdFeat, Integer premPrice, List<String> premFeat,
                        Integer elitePrice, List<String> eliteFeat) {
                try {
                        Map<String, Object> plans = new LinkedHashMap<>();

                        if (stdPrice != null) {
                                Map<String, Object> std = new LinkedHashMap<>();
                                std.put("price", stdPrice);
                                std.put("features", stdFeat != null ? stdFeat : Collections.emptyList());
                                plans.put("standard", std);
                        }

                        if (premPrice != null) {
                                Map<String, Object> prem = new LinkedHashMap<>();
                                prem.put("price", premPrice);
                                prem.put("features", premFeat != null ? premFeat : Collections.emptyList());
                                plans.put("premium", prem);
                        }

                        if (elitePrice != null) {
                                Map<String, Object> elite = new LinkedHashMap<>();
                                elite.put("price", elitePrice);
                                elite.put("features", eliteFeat != null ? eliteFeat : Collections.emptyList());
                                plans.put("elite", elite);
                        }

                        return objectMapper.writeValueAsString(plans);
                } catch (Exception e) {
                        e.printStackTrace();
                        return null;
                }
        }
}
