import React, { useState } from "react";
import { Link } from "react-router-dom";
// Assuming these imports are available from your main component file
// import logo2 from "../assets1/img/logo-2.svg"; 
import footerBg2 from "../assets1/img/footer-bg-2.svg";
import logo from "../assets1/img/kanakkaalar_logo.png";


/* FooterSection with Read More toggle functionality and original design classes */
function FooterSection({ title, links, className = "" }) {
  const [showAll, setShowAll] = useState(false);
  // Show only the first 5 links initially
  const displayedLinks = showAll ? links : links.slice(0, 5);
  const hasMore = links.length > 5;

  return (
    <div className={`cs_footer_widget ${className}`}>
      {/* Title */}
      <h3 className="cs_footer_widget_title cs_fs_24 cs_semibold cs_white_color cs_mb_29">{title}</h3>

      {/* Links List */}
      <ul className="cs_footer_menu cs_mp_0">
        {displayedLinks.map(([label, href]) => (
          <li key={label}>
            {/* Note: Using <a> tag structure to preserve original CSS/styling, assuming Link works similarly */}
            <Link to={href} aria-label={`${label} page link`}>{label}</Link>
          </li>
        ))}
      </ul>

      {/* Toggle Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          // Using cs_theme_color_4 or similar class if defined, otherwise using inline style for visibility
          className="cs_read_more_btn mt-2 text-sm cs_bold"
          style={{ color: '#DB3269', textDecoration: 'underline' }}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}


export default function Footer() {
  const currentYear = new Date().getFullYear();

  // 1. Define all content based on your request
  const allLinks = {
    ConsultAnExpert: [
      ["Talk to a Lawyer", "/ConsultanExpert/talkToLawyer"],
      ["Talk to a Chartered Accountant", "/ConsultanExpert/talkToCA"],
      ["Talk to a Company Secretary", "/ConsultanExpert/talkToCS"],
      ["Talk to an IP/Trademark Lawyer", "/ConsultanExpert/talkToIP"],
    ],
    InternationalSetup: [
      ["US Incorporation", "/International/us"],
      ["Singapore Incorporation", "/International/singapore"],
      ["UK Incorporation", "/International/uk"],
      ["Netherlands Incorporation", "/International/netherlands"],
      ["Hong Kong Company", "/International/hong-kong"],
      ["Dubai Company", "/International/dubai"],
      ["International TM Registration", "/International/international-trademark"],
    ],
    CompanyRegistration: [
      ["Private Limited Company", "/BusinessSetup/plc"],
      ["Limited Liability Partnership", "/BusinessSetup/llp"],
      ["One Person Company", "/BusinessSetup/opc"],
      ["Sole Proprietorship", "/BusinessSetup/sp"],
      ["Nidhi Company", "/BusinessSetup/nidhi"],
      ["Producer Company", "/BusinessSetup/producer"],
      ["Partnership Firm", "/BusinessSetup/partnership"],
      ["Startup India Registration", "/BusinessSetup/startup"],
    ],
    LicensesAndRegistrations: [
      ["Digital Signature Certificate", "/Licenses/dsc"],
      ["Udyam Registration", "/Licenses/udyam"],
      ["MSME Registration", "/Licenses/msme"],
      ["ISO Certification", "/Licenses/iso"],
      ["FSSAI (Food License)", "/Licenses/fssai"],
      ["Import/Export Code (IEC)", "/Licenses/iec"],
      ["Apeda RCMC", "/Licenses/apeda-rcmc"],
      ["Spice Board Registration", "/Licenses/spice-board"],
      ["FIEO Registration", "/Licenses/fieo"],
      ["Legal Metrology", "/Licenses/legal-metrology"],
      ["Hallmark Registration", "/Licenses/hallmark"],
      ["BIS Registration", "/Licenses/bis"],
      ["Liquor License", "/Licenses/liquor-license"],
      ["CLRA Registration & Licensing", "/Licenses/clra"],
      ["AD Code Registration", "/Licenses/ad-code"],
      ["IRDAI Registration", "/Licenses/irdai"],
      ["Drug & Cosmetic License", "/Licenses/drug-cosmetic"],
      ["Customs Clearance", "/Licenses/customs-clearance"],
    ],
    FundraisingAndNGO: [
      ["Fundraising", "/Fundraising"],
      ["Pitch Deck", "/Fundraising/pitch-deck"],
      ["Business Loan", "/Fundraising/business-loan"],
      ["DPR Service", "/Fundraising/dpr"],
      ["NGO", "/NGO"],
      ["Section 8 Company", "/NGO/section-8"],
      ["Trust Registration", "/NGO/trust"],
      ["Society Registration", "/NGO/society"],
      ["NGO Compliance", "/NGO/compliance"],
      ["Section 8 Compliance", "/NGO/compliance-section-8"],
      ["CSR-1 Filing", "/NGO/csr1"],
      ["Sec.80G & Sec.12A", "/NGO/80g-12a"],
      ["Darpan Registration", "/NGO/darpan"],
      ["FCRA Registration", "/NGO/fcra"],
    ],
  };

  // 2. Define the exact order of the widgets as requested
  const widgetOrder = [
    { title: "Consult an Expert", key: "ConsultAnExpert", className: "cs_links_widget" },
    { title: "International Business Setup", key: "InternationalSetup", className: "cs_help_widget" },
    { title: "Company Registration", key: "CompanyRegistration", className: "cs_contact_widget" },
    { title: "Fundraising & NGO", key: "FundraisingAndNGO", className: "cs_contact_widget" },
    { title: "Licenses & Registrations", key: "LicensesAndRegistrations", className: "cs_contact_widget" },
  ];

  return (
    <footer
      className="cs_footer cs_style_1 cs_type_1 cs_accent_bg cs_bg_filed cs_white_color"
      data-src={footerBg2}
    >
      <div className="cs_height_130 cs_height_lg_80"></div>
      <div className="container">

        {/* ======================= Footer Top: Contact Info ======================= */}
        <div className="cs_footer_top position-relative">
          <ul className="cs_location_list cs_mp_0">
            <li className="!items-start">
              <span className="cs_location_icon cs_center cs_theme_color_4 cs_radius_100 flex-shrink-0">
                <i className="fa-solid fa-phone-volume"></i>
              </span>
              <a href="tel:9655771091" aria-label="Make a call link" className="pt-2">9655771091</a>
            </li>
            <li className="!items-start">
              <span className="cs_location_icon cs_center cs_theme_color_4 cs_radius_100 flex-shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <a href="mailto:info@kanakkaalar.com" aria-label="Send mail link" className="pt-2 break-all">info@kanakkaalar.com</a>
            </li>
            <li className="!items-start">
              <span className="cs_location_icon cs_center cs_theme_color_4 cs_radius_100 flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </span>
              <p className="mb-0 pt-2 leading-relaxed max-w-md">
                32, AJ Block 1st St, Sri Ayyappa Nagar, Chinmaya Nagar Stage II Extension, Kumaran Nagar, Virugambakkam, Chennai, Tamil Nadu 600092
              </p>
            </li>
          </ul>
        </div>

        {/* ======================= Footer Main: Widgets/Links ======================= */}
        <div className="cs_footer_main">
          <div className="cs_footer_widget_wrapper">

            {/* Widget 1: Brand, Text, and Socials */}
            <div className="cs_footer_widget cs_text_widget">
              <div className="cs_brand cs_mb_32">
                <Link to="/" className="cs_brand_link">
                  <img src={logo} alt="Kanakkaalar" className="h-20 w-auto object-contain bg-white rounded-md p-1" />
                </Link>
              </div>
              <p className="cs_mb_32">
                Legal service provider in India. Reliable and expert services
                for businesses and individuals.
              </p>
              <div className="cs_social_links cs_style_1 cs_heading_color">
                <a href="#" aria-label="Social link"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="Social link"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#" aria-label="Social link"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="Social link"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="#" aria-label="Social link"><i className="fa-brands fa-youtube"></i></a>
              </div>
            </div>

            {/* Dynamically render the ordered link widgets with Show More/Less functionality */}
            {widgetOrder.map(widget => (
              <FooterSection
                key={widget.key}
                title={widget.title}
                links={allLinks[widget.key]}
                className={widget.className}
              />
            ))}

            {/* Note: If the original CSS cs_footer_widget_wrapper is designed for 4 columns, 
               the 6 widgets (Brand + 5 new categories) will wrap or overflow based on that CSS. */}
          </div>
        </div>

        {/* ======================= Footer Bottom: Copyright ======================= */}
      </div>
      <div className="cs_footer_bottom position-relative">
        <div className="container">
          <div className="cs_footer_text cs_white_color text-center">
            Copyright &copy; <span className="cs_getting_year">{currentYear}</span> Hado Global Services pvt Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}