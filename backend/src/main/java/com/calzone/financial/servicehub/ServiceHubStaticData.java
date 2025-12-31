package com.calzone.financial.servicehub;

import java.util.*;

public class ServiceHubStaticData {

    public static Map<String, Object> tabData() {
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
                Map.of("title","Professional Tax Registration","desc","Starts from ₹2999₹2699","to","/compliances/professional-tax","categoryKey","licenses"),
                Map.of("title","Shops & Establishment License","desc","Starts from ₹1999","to","/licenses/shop","categoryKey","licenses")
        ));
        licenses.put("Export Business", Arrays.asList(
                Map.of("title","Import Export Code Registration (IEC)","desc","Starts from ₹249","to","/licenses/iec","categoryKey","licenses"),
                Map.of("title","AD Code Registration","desc","Contact Expert to Get Price","to","/licenses/adcode","categoryKey","licenses"),
                Map.of("title","APEDA Registration","desc","Starts from ₹1499₹999","to","/licenses/apeda","categoryKey","licenses")
        ));
        licenses.put("Quality & Standards", Arrays.asList(
                Map.of("title","ISO Certification","desc","Contact Expert to Get Price","to","/licenses/iso","categoryKey","licenses"),
                Map.of("title","Hallmark Registration","desc","Starts from ₹1499₹999","to","/licenses/hallmark","categoryKey","licenses")
        ));
        t.put("Licenses/Registrations", licenses);

        Map<String, List<Map<String,String>>> ip = new LinkedHashMap<>();
        ip.put("Trademark", Arrays.asList(
                Map.of("title","Trademark Registration","desc","Starts from ₹1499₹1349","to","/ip/trademark-registration","categoryKey","ip"),
                Map.of("title","Respond to Trademark Objection","desc","Starts from ₹2999","to","/ip/trademark-objection","categoryKey","ip"),
                Map.of("title","Trademark Hearing Service","desc","Starts from ₹1999₹1499","to","/ip/trademark-hearing","categoryKey","ip"),
                Map.of("title","Renewal of Trademark","desc","Starts from ₹1499₹999","to","/ip/trademark-renewal","categoryKey","ip"),
                Map.of("title","International Trademark","desc","Starts from ₹1499₹999","to","/ip/international-trademark","categoryKey","ip")
        ));
        ip.put("Copyright", Arrays.asList(
                Map.of("title","Copyright Music","desc","Starts from ₹499","to","/ip/copyright-music","categoryKey","ip")
        ));
        ip.put("Patent", Arrays.asList(
                Map.of("title","Patent Search","desc","Starts from ₹1999","to","/ip/patent-search","categoryKey","ip"),
                Map.of("title","Provisional Patent Application","desc","Contact Expert to Get Price","to","/ip/provisional-patent","categoryKey","ip"),
                Map.of("title","Patent Registration","desc","Starts from ₹5999","to","/ip/patent-registration","categoryKey","ip")
        ));
        ip.put("Infringement", Arrays.asList(
                Map.of("title","Patent Infringement","desc","Starts from ₹1499₹999","to","/ip/patent-infringement","categoryKey","ip")
        ));
        t.put("Trademark/IP", ip);

        t.put("Company Change", Map.of("Company Name/Management", Arrays.asList(
                Map.of("title","Change the Name of Your Company","desc","Contact Expert to Get Price","to","/company/change-name","categoryKey","company"),
                Map.of("title","Change the Objectives of Your Business","desc","Contact Expert to Get Price","to","/company/change-objectives","categoryKey","company"),
                Map.of("title","Appointment of a Director/Partner","desc","Contact Expert to Get Price","to","/company/appoint-director","categoryKey","company"),
                Map.of("title","Removal of a Director/Partner","desc","Contact Expert to Get Price","to","/company/remove-director","categoryKey","company"),
                Map.of("title","Change the Official Address of Your Company (Within the City)","desc","Contact Expert to Get Price","to","/company/change-address-city","categoryKey","company"),
                Map.of("title","Change the Official Address of Your Company (From One State to Another State)","desc","Contact Expert to Get Price","to","/company/change-address-state","categoryKey","company")
        )));

        t.put("Taxation & Compliance", Map.of("Direct & Indirect Tax", Arrays.asList(
                Map.of("title","Income Tax Return Filing (ITR)","desc","Contact Expert to Get Price","to","/tax/itr-filing","categoryKey","tax"),
                Map.of("title","TDS Return Filing","desc","Contact Expert to Get Price","to","/tax/tds-filing","categoryKey","tax"),
                Map.of("title","GSTR Filings","desc","Starts from ₹3999₹2999","to","/tax/gstr-filings","categoryKey","tax")
        )));

        t.put("New Business/Closure", Map.of("Business Registration", Arrays.asList(
                Map.of("title","Private Limited Company Registration","desc","Starts from ₹999","to","/formation/private-ltd","categoryKey","formation"),
                Map.of("title","Limited Liability Partnership Registration","desc","Starts from ₹1499","to","/formation/llp","categoryKey","formation"),
                Map.of("title","Sole Proprietorship","desc","Starts from ₹699","to","/formation/sole-proprietorship","categoryKey","formation"),
                Map.of("title","One Person Company Registration","desc","Starts from ₹999","to","/formation/opc","categoryKey","formation"),
                Map.of("title","Partnership Firm Registration","desc","Starts from ₹2499","to","/formation/partnership","categoryKey","formation")
        )));

        return t;
    }

    public static Map<String, List<Map<String, String>>> processData() {
        Map<String, List<Map<String, String>>> p = new LinkedHashMap<>();
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
}
