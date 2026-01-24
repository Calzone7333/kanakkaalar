import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Briefcase, ShieldCheck } from "lucide-react";
import DashboardDemo from "../components/DashboardDemo";
import ComplianceSection from "../pages/ComplianceSection";
import WhyChooseSection from "../pages/WhyChooseSection";
import SEO from "../components/SEO";

// Import all header and hero images
import whyChooseBg from "../assets1/img/whychoose-bg-1.svg";
import dashboard2 from "../assets1/img/dashboard-2.jpg";
import customersGroup from "../assets1/img/customers-group.png";
import logo from "../assets1/img/logo.svg";
import star1 from "../assets1/img/icons/star-1.svg";
import heroShape1 from "../assets1/img/hero-shape-1.svg";
import heroShape2 from "../assets1/img/hero-shape-2.png";

// Import banner and phone images
import bannerImg1 from "../assets1/img/herooriginal.png";
import bannerGif from "../assets1/img/bannerGif.gif"
import bannerGif1 from "../assets1/img/bannerGif2.gif"
import bannerGif2 from "../assets1/img/bannerGif1.gif"
import bannerGif3 from "../assets1/img/bannerGif3.gif"

// Import brand logos
import aboutImg1 from "../assets1/img/about-img-1.png";
import checkbox from "../assets1/img/icons/checkbox.svg";
import starShape from "../assets1/img/star-shape.svg";
// Import feature icons
import codeIcon from "../assets1/img/icons/code-icon.svg";
import caretIcon from "../assets1/img/icons/caret-icon.svg";
import cloudComputingIcon from "../assets1/img/icons/cloud-computing.svg";
import qualityAssuranceIcon from "../assets1/img/icons/quality-assurance.svg";

// Import 3D and shape images
import springShape from "../assets1/img/spring-shape.png";

// Import process section images
import howitwork1 from "../assets1/img/howitwork1.png";
import howitwork2 from "../assets1/img/howitwork2.png";

import vector7 from "../assets1/img/vector-7.svg";
import homeIcon from "../assets1/img/icons/home.svg";
import productsIcon from "../assets1/img/icons/products.svg";
import analyticsIcon from "../assets1/img/icons/analytics.svg";
import starShape2 from "../assets1/img/star-shape.svg";

// Import dashboard and analytics images
import dashboardImg from "../assets1/img/dashboard.png";
import advancedTrackingIcon from "../assets1/img/icons/advanced-tracking.svg";
import inDepthIcon from "../assets1/img/icons/in-depth.svg";

// Import phone image and 3D shape
import phoneImg2 from "../assets1/img/phone-img-2.png";
// Import integration icons
import slackIcon from "../assets1/img/icons/slack.svg";
import dropboxIcon from "../assets1/img/icons/dropbox.svg";
import linkedinIcon from "../assets1/img/icons/linkedin.svg";
import hubspotIcon from "../assets1/img/icons/hubspot.svg";
import whatsappIcon from "../assets1/img/icons/whatsapp.svg";
import discordIcon from "../assets1/img/icons/discord.svg";
import zoomIcon from "../assets1/img/icons/zoom.svg";
import githubIcon from "../assets1/img/icons/github.svg";
import mailchimpIcon from "../assets1/img/icons/mailchip.svg";
import shopifyIcon from "../assets1/img/icons/shopify.svg";
import googledriveIcon from "../assets1/img/icons/googledrive.svg";
import notionIcon from "../assets1/img/icons/notion.svg";

// Import blog post images
import videoBg2 from "../assets1/img/hero-bg-2.jpg";

export default function Home() {
  const navigate = useNavigate();
  // Preloader logic removed - handled globally in App.jsx

  // Custom Slider Logic
  const slideImages = [howitwork1, howitwork2];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slideImages.length]);

  return (
    <>
      <SEO
        title="Home"
        description="India's Smart Online Platform for Modern Businesses. We simplify legal, tax, and compliance for startups, SMEs, and individuals."
        keywords="business registration, company registration, trademark registration, GST filing, compliance, startup india, legal services, tax consultant"
      />
      <section
        className="cs_hero cs_style_2 cs_bg_filed position-relative bg-cover bg-center w-full overflow-hidden !pt-28 md:!pt-36"
        style={{
          backgroundImage: `url(${videoBg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container px-4 mx-auto">
          <div className="text-center cs_hero_text position-relative">
            <p className="text-center cs_hero_subtitle cs_heading_color cs_heading_font cs_mb_18">
              <span className="text-[#C59B4E]">
                <img src={star1} alt="Star icon" />
              </span>
              <span>Welcome To Kanakkaalar</span>
              <span className="text-[#C59B4E]">
                <img src={star1} alt="Star icon" />
              </span>
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900 mb-4 wow fadeInDown"
            >
              India&apos;s Smart Online Platform for Modern Businesses.
              <br />
            </h1>


            <p className="cs_hero_desc cs_mb_26 text-base sm:text-lg md:text-xl">
              Legal, tax, and compliance simplification. Lots of people trust it.
              supported by actual industry experts. making <br />
            </p>

            <div className="cs_btns_group">
              <button
                onClick={() => navigate("/login")}
                aria-label="Get started button"
                className="cs_btn cs_style_1 cs_fs_14 cs_bold cs_white_color text-uppercase"
                style={{
                  background: "#1A7F7D",
                  border: "none",
                  color: "#fff",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#156664"; // Darker shade on hover
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1A7F7D";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span>Get Started</span>
                <span className="cs_btn_icon">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </button>
              <a
                href="about-us.html"
                aria-label="About page link"
                className="cs_btn cs_style_1 cs_outline cs_fs_14 cs_bold cs_heading_color text-uppercase"
              >
                <span>Learn More</span>
                <span className="cs_btn_icon">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </a>
            </div>
            {/* 
            <div className="cs_hero_shape_1 position-absolute">
              <img src={heroShape1} alt="Shape" />
            </div> */}
          </div>

          <div className="cs_hero_shape_2 position-absolute">
            <img src={heroShape2} alt="Shape" />
          </div>
        </div>
      </section>
      <div className="cs_banner cs_style_1 relative w-full overflow-hidden">
        <div className="container">
          <div className="cs_banner_thumbnail_wrapper">
            <div className="cs_banner_thumbnail relative">
              {/* Main Banner Image */}
              <img
                src={bannerImg1}
                alt="Banner image"
                className="w-full h-auto object-cover"
                width="1200"
                height="600"
              />
            </div>
          </div>
        </div>

        {/* Left GIF Icon (Up) */}
        <img
          src={bannerGif}
          alt="Animated icon left"
          className="absolute z-[4] pointer-events-none opacity-90 mix-blend-screen
      w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px]
      top-[0] left-[10%] sm:left-[10%] md:left-[15%]"
        />

        {/* Small Mid-Left GIF (Tiny Sparkle) */}
        <img
          src={bannerGif3}
          alt="Animated icon small"
          className="absolute z-[4] pointer-events-none opacity-90 mix-blend-screen
      w-[15px] h-[15px] sm:w-[20px] sm:h-[20px] md:w-[25px] md:h-[25px]
      top-[2%] left-[32%] sm:left-[34%] md:left-[36%]"
        />

        {/* Center GIF Icon (Down) */}
        <img
          src={bannerGif1}
          alt="Animated icon center"
          className="absolute z-[50] pointer-events-none
          w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] md:w-[70px] md:h-[70px]
          top-[60px] sm:top-[25%] md:top-[25%] left-[52%]"
        />
        {/* Right GIF Icon (Lower Zig-Zag Position) */}
        <img
          src={bannerGif2}
          alt="Animated icon right"
          className="absolute z-[1] pointer-events-none opacity-90 mix-blend-screen
      w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px]
      top-[26%] sm:top-[10%] md:top-[-1%] left-[80%]"
        />
      </div>

      {/* About section */}
      <section className="relative mt-10 md:mt-16 lg:mt-20 xl:mt-24">
        <div className="cs_height_120 cs_height_lg_80"></div>

        <div className="container">
          <div className="cs_card cs_style_1">
            <div className="row cs_gap_y_50 relative z-1">
              {/* Left Image Section */}
              <div className="col-lg-5">
                <div className="cs_card_thumbnail relative">
                  <img src={aboutImg1} alt="About" className="w-full h-auto rounded-lg object-cover" width="600" height="400" />
                </div>
              </div>

              {/* Right Content Section */}
              <div className="col-lg-7">
                <div className="cs_card_content">
                  <div className="cs_section_heading cs_style_1 cs_mb_28">
                    <div className="cs_section_subtitle cs_fs_18 cs_heading_color cs_mb_22 flex items-center gap-2 justify-center md:justify-start">
                      <img src={star1} alt="Star icon" className="w-4 h-4" />
                      <span>About</span>
                      <img src={star1} alt="Star icon" className="w-4 h-4" />
                    </div>

                    <h2 className="cs_section_title text-3xl md:text-3xl font-semibold mb-0 wow fadeInUp">
                      Simplifying legal & Compliance
                    </h2>
                  </div>

                  <p className="cs_card_desc text-gray-700 mb-4">
                    If you're an ambitious startup navigating your first filings, a Small or Medium Enterprise (SME)
                    needing robust ongoing compliance, or an individual requiring simple tax help—{" "}
                    <span className="font-bold">Kanakkaalar</span> is here for you. As a cutting-edge legal technology
                    platform in India, we deliver all your essential legal, tax, and regulatory services fully online.
                    We combine expert knowledge with user-friendly technology to ensure you meet all your obligations
                    accurately and on time, all without ever leaving your desk. We handle the compliance, so you can
                    handle the business.
                  </p>

                  <ul className="cs_list cs_style_1 cs_mp_0 space-y-2">
                    <li className="flex items-center gap-2">
                      <img src={checkbox} alt="Check icon" className="w-5 h-5" />
                      <h3 className="text-base font-semibold mb-0">
                        with our marketing and technological solutions.
                      </h3>
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkbox} alt="Check icon" className="w-5 h-5" />
                      <h3 className="text-base font-semibold mb-0">
                        All throughout the world, people trust us.
                      </h3>
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkbox} alt="Check icon" className="w-5 h-5" />
                      <h3 className="text-base font-semibold mb-0">
                        Start Your 14 Days Free Trials Today!
                      </h3>
                    </li>
                  </ul>

                  <a
                    href="#"
                    aria-label="App download button"
                    className="cs_btn cs_style_1 bg-[#1A7F7D] hover:bg-[#156664] text-sm md:text-base cs_white_color font-bold uppercase mt-4 inline-flex items-center gap-2 transition-all"
                  >
                    <span>Download App</span>
                    <span className="cs_btn_icon">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative shapes */}
            <div className="cs_star_shape_1 absolute">
              <img src={starShape} alt="Star shape" />
            </div>

            <div className="cs_vector_shape_1 absolute">
              {/* <img src={dnaShape} alt="Shape" /> */}
            </div>
          </div>
        </div>

        <div className="cs_height_46 cs_height_lg_40"></div>
      </section>
      {/* About section End */}
      <section className="relative py-10 lg:pt-24 lg:pb-40">
        <div className="container mx-auto relative z-10">

          {/* Section Heading: Retained */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3">
              <img src={star1} alt="Star" className="w-5 h-5" />
              <span className="text-[#1A7F7D] text-lg font-semibold">Our Services</span>
              <img src={star1} alt="Star" className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800 leading-tight">
              Complete Business Solutions <br /> for Every Stage
            </h2>
          </div>

          {/* Features Wrapper: Changed to a Flex container with custom styling and a 3-column layout */}
          <div className="flex flex-wrap justify-center gap-8 position-relative z-1">



            {/* Card 1: Start a Business (Now the first card) */}
            <div className="cs_feature_item cs_white_bg cs_radius_20 w-full md:w-[30%]">
              <span className="cs_feature_icon cs_center !bg-[#1A7F7D] cs_radius_12 cs_mb_15">
                <Rocket className="w-8 h-8 text-white" />
              </span>
              <h3 className="cs_fs_24 cs_semibold cs_mb_6">
                <a href="#">Start a Business</a>
              </h3>
              <ul className="cs_features_list cs_mp_0">
                {["Private Limited Company Registration",
                  "Limited Liability Partnership Registration", // Updated text
                  "One Person Company Registration",          // Updated text
                  "Sole Proprietorship Registration",
                  "Producer Company Registration",            // Added
                  "Partnership Firm Registration",            // Added
                  "Startup India Registration",               // Added
                  "NGO Registration"                          // Added
                ].map((item, idx) => (
                  <li key={idx}>
                    <img src={caretIcon} alt="Caret icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#" aria-label="Explore more link" className="cs_text_btn cs_fs_14 cs_bold text-uppercase">
                <span>Explore More</span>
                <span className="cs_btn_icon"><i className="fa-solid fa-arrow-right"></i></span>
              </a>
            </div>

            {/* Card 2: Operate with Clarity */}
            <div className="cs_feature_item cs_white_bg cs_radius_20 w-full md:w-[30%]">
              <span className="cs_feature_icon cs_center !bg-[#1A7F7D] cs_radius_12 cs_mb_15">
                <Briefcase className="w-8 h-8 text-white" />
              </span>
              <h3 className="cs_fs_24 cs_semibold cs_mb_6">
                <a href="#">Operate with Clarity</a>
              </h3>
              <ul className="cs_features_list cs_mp_0">
                {["GST Registration & Compliance",
                  "Change Company Address",
                  "Director Replacement",
                  "Mandatory Annual Filings",
                  "Labor Compliance",
                  "Shop and Establishment License",
                  "Accounting & Tax"
                ].map((item, idx) => (
                  <li key={idx}>
                    <img src={caretIcon} alt="Caret icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#" aria-label="Explore more link" className="cs_text_btn cs_fs_14 cs_bold text-uppercase">
                <span>Explore More</span>
                <span className="cs_btn_icon"><i className="fa-solid fa-arrow-right"></i></span>
              </a>
            </div>

            {/* Card 3: Secure a Legacy */}
            <div className="cs_feature_item cs_white_bg cs_radius_20 w-full md:w-[30%]">
              <span className="cs_feature_icon cs_center !bg-[#1A7F7D] cs_radius_12 cs_mb_15">
                <ShieldCheck className="w-8 h-8 text-white" />
              </span>
              <h3 className="cs_fs_24 cs_semibold cs_mb_6">
                <a href="#">Secure a Legacy</a>
              </h3>
              <ul className="cs_features_list cs_mp_0">
                {["Trademark Registration",
                  "Copyright Registration",
                  "Patent Registration",
                  "IP Infringement Protection",
                  "Design Registration",
                  "Free Legal Document",
                  "Business Contracts"
                ].map((item, idx) => (
                  <li key={idx}>
                    <img src={caretIcon} alt="Caret icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#" aria-label="Explore more link" className="cs_text_btn cs_fs_14 cs_bold text-uppercase">
                <span>Explore More</span>
                <span className="cs_btn_icon"><i className="fa-solid fa-arrow-right"></i></span>
              </a>
            </div>
          </div>

          <img src={springShape} alt="Spring shape" className="cs_feature_shape_2 position-absolute bottom-10 right-0 w-20 sm:w-24 opacity-80 pointer-events-none" />

        </div>
        {/* <div className="cs_height_120 cs_height_lg_80"></div> */}
      </section>
      <section className="cs_gray_bg_2 position-relative">
        <div className="cs_height_120 cs_height_lg_80"></div>
        <div className="container">
          <div className="row cs_gap_y_40 position-relative z-1">

            {/* Right Column (Image/Illustration - Order 2 on large screens) */}
            <div className="col-lg-6 order-lg-2">
              <div className="cs_workink_process_heading cs_center_column position-relative">
                <div className="cs_section_heading cs_style_1 cs_mb_11 z-1">
                  <div className="cs_section_subtitle cs_fs_18 cs_heading_color cs_mb_22">
                    <img src={star1} alt="Star icon" />
                    <span>How It work</span>
                    <img src={star1} alt="Star icon" />
                  </div>
                  <h2 className="cs_section_title cs_fs_48 cs_semibold wow fadeInUp">Let's Utilize Optimum In Three Easy Actions.</h2>
                  <p className="cs_card_desc cs_mb_22">All the generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                </div>
                <div className="cs_process_thumbnail z-1 relative w-3/4 mx-auto">
                  {slideImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Slide ${index}`}
                      // Logic: The active image sets the height (relative).
                      // Inactive images sit on top (absolute) and are transparent.
                      className={`transition-opacity duration-700 ease-in-out max-h-[400px] object-contain mx-auto ${index === currentIndex
                        ? "opacity-100 relative z-10"
                        : "opacity-0 absolute top-0 left-0 z-0"
                        }`}
                    />
                  ))}
                </div>

                <div className="cs_vector_shape position-absolute bottom-0 start-0">
                  <img src={vector7} alt="Vector shape" />
                </div>
              </div>
            </div>
            {/* Left Column (Steps/Iconboxes - Order 1 on large screens) */}
            <div className="col-lg-6 order-lg-1">
              <div className="cs_iconbox_wrapper_2">

                {/* Step 1: Create Account */}
                <div className="cs_iconbox cs_style_2">
                  <span className="cs_iconbox_icon cs_center bg-[#C44746] cs_mb_18">
                    <img src={homeIcon} alt="Browser icon" />
                  </span>
                  <h3 className="cs_fs_24 cs_semibold cs_mb_4">Create your account</h3>
                  <p className="mb-0">All the generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                </div>

                {/* Step 2: Connect product */}
                <div className="cs_iconbox cs_style_2">
                  <span className="cs_iconbox_icon bg-[#1A7F7D] cs_center cs_mb_18">
                    <img src={productsIcon} alt="Product stack icon" />
                  </span>
                  <h3 className="cs_fs_24 cs_semibold cs_mb_4">Connect your product</h3>
                  <p className="mb-0">All the generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                </div>

                {/* Step 3: Track Analytics */}
                <div className="cs_iconbox cs_style_2">
                  <span className="cs_iconbox_icon bg-[#C59B4E] cs_center cs_mb_18">
                    <img src={analyticsIcon} alt="Analytics icon" />
                  </span>
                  <h3 className="cs_fs_24 cs_semibold cs_mb_4">Track Analytics your account</h3>
                  <p className="mb-0">All the generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Decorative shape at the bottom right */}
        <div className="cs_star_shape_4 position-absolute">
          <img src={starShape2} alt="Star shape" />
        </div>
        <div className="cs_height_0 cs_height_lg_80"></div>
      </section>

      <section className="position-relative">
        <div className="cs_height_120 cs_height_lg_80"></div>
        <div className="container">
          <div className="cs_card cs_style_1 cs_type_3">
            <div className="row cs_gap_y_50 position-relative z-1">
              <div className="col-lg-6">
                <div className="cs_card_thumbnail position-relative">
                  <img src={dashboardImg} alt="Dashboard image" className="w-3/4 mx-auto" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="cs_card_content">
                  <div className="cs_section_heading cs_style_1 cs_mb_27">
                    <div className="cs_section_subtitle cs_fs_18 cs_heading_color cs_mb_22">
                      <img src={star1} alt="Star icon" />
                      <span>Customizations & Analysis</span>
                      <img src={star1} alt="Star icon" />
                    </div>
                    <h2 className="cs_section_title cs_fs_48 cs_semibold wow fadeInLeft">We Make It Easy To Track All User Analytics</h2>
                    <p className="mb-0 cs_card_desc">All the generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                  </div>
                  <div className="cs_iconbox_wrapper_1">
                    <div className="cs_iconbox cs_style_1 cs_type_1">
                      <span className="cs_iconbox_icon cs_center bg-[#C59B4E]">
                        <img src={advancedTrackingIcon} alt="Advanced tracking icon" />
                      </span>
                      <div className="cs_iconbox_info">
                        <h3 className="cs_fs_20 cs_semibold cs_mb_1">Advanced tracking</h3>
                        <p className="mb-0">All the generators on the Internet tend to repeat predefined chunks as</p>
                      </div>
                    </div>
                    <div className="cs_iconbox cs_style_1 cs_type_1">
                      <span className="cs_iconbox_icon cs_center bg-[#1A7F7D]">
                        <img src={inDepthIcon} alt="In-depth monitoring icon" />
                      </span>
                      <div className="cs_iconbox_info">
                        <h3 className="cs_fs_20 cs_semibold cs_mb_1">In-depth  monitoring</h3>
                        <p className="mb-0">All the generators on the Internet tend to repeat predefined chunks as</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cs_height_120 cs_height_lg_80"></div>
        </div>
      </section>
      <section
        className="cs_bg_filed position-relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${whyChooseBg})` }}
      >
        <div className="cs_height_120 cs_height_lg_80"></div>
        <div className="container">
          <div className="cs_card cs_style_1 cs_type_4">
            <div className="row cs_gap_y_50 position-relative z-1">
              <div className="col-lg-6 order-lg-2">
                <div className="cs_card_thumbnail relative group cursor-pointer overflow-hidden rounded-xl shadow-2xl h-[300px] md:h-[400px] border border-slate-200 bg-white">
                  {/* Code-Generated "Video" Simulation */}
                  <DashboardDemo />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="cs_card_content">
                  <div className="cs_section_heading cs_style_1 cs_mb_27">
                    <div className="cs_section_subtitle cs_fs_18 cs_white_color cs_mb_22">
                      <img src={star1} alt="Star icon" />
                      <span>Why Choose us</span>
                      <img src={star1} alt="Star icon" />
                    </div>
                    <h2 className="cs_section_title cs_fs_48 cs_semibold cs_white_color wow fadeInDown">Trusted Partner In Digital Growth & Innovation</h2>
                    <p className="mb-0 cs_card_desc cs_white_color">With over 10 years of experience, a diverse team of experts, and a proven track record, Relatix is your trusted partner in achieving digital excellence.</p>
                  </div>
                  <ul className="cs_list cs_style_2 cs_white_color cs_semibold cs_mp_0">
                    <li>
                      <span className="cs_list_icon text-[#C59B4E]"><i className="fa-solid fa-circle-check"></i></span>
                      <span>Proven track record of success</span>
                    </li>
                    <li>
                      <span className="cs_list_icon text-[#C59B4E]"><i className="fa-solid fa-circle-check"></i></span>
                      <span>Creative and user-centric designs</span>
                    </li>
                    <li>
                      <span className="cs_list_icon text-[#C59B4E]"><i className="fa-solid fa-circle-check"></i></span>
                      <span>Tailored digital solutions</span>
                    </li>
                    <li>
                      <span className="cs_list_icon text-[#C59B4E]"><i className="fa-solid fa-circle-check"></i></span>
                      <span>24/7 dedicated support team</span>
                    </li>
                  </ul>

                  <a href="about-us.html" aria-label="About us page link" className="cs_btn cs_style_1 bg-[#C59B4E] hover:bg-[#b08d44] cs_fs_14 cs_heading_color cs_bold text-uppercase transition-all">
                    <span>Explore Now</span>
                    <span className="cs_btn_icon"><i className="fa-solid fa-arrow-right"></i></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="cs_height_0 cs_height_lg_80"></div>
        </div>
      </section >
      <section className="position-relative">
        <div className="cs_height_120 cs_height_lg_80"></div>
        <div className="container">
          <div className="cs_card cs_style_2 position-relative z-1">
            <div className="row cs_gap_y_40">
              <div className="col-lg-6 order-lg-2">
                <div className="cs_card_thumbnail">
                  <img src={dashboard2} alt="Dashboard image" />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="cs_card_content">
                  <div className="cs_section_heading cs_style_1 cs_mb_34">
                    <div className="cs_section_subtitle cs_fs_18 cs_heading_color cs_mb_22">
                      <img src={star1} alt="Star icon" />
                      <span>Appreciation feature</span>
                      <img src={star1} alt="Star icon" />
                    </div>
                    <h2 className="cs_section_title cs_fs_48 cs_semibold wow fadeInUp">Our Priority CRM Options</h2>
                    <p className="mb-0">CRM management is comprehensive contact management, allowing businesses to centralize and organize customer information for easy access.</p>
                  </div>
                  <div className="cs_service_item cs_radius_15 cs_gray_bg_2 cs_mb_24 cs_active">
                    <h3 className="cs_service_title cs_fs_24 cs_semibold cs_mb_8">Sales Force Automation</h3>
                    <p className="mb-0">CRM management is comprehensive contact management, allowing businesses to centralize and organize customer information for allowing businesses to centralize and organize easy access.</p>
                  </div>
                  <div className="cs_service_item cs_radius_15 cs_mb_48">
                    <h3 className="cs_service_title cs_fs_24 cs_semibold cs_mb_8">Lead Management</h3>
                    <p className="mb-0">CRM management is comprehensive contact management, allowing businesses to centralize and organize customer information for allowing businesses to centralize and organize easy access.</p>
                  </div>
                  <div className="cs_btns_group">
                    <a href="contact.html" aria-label="Get started button" className="cs_btn cs_style_1 bg-[#1A7F7D] hover:bg-[#156664] cs_fs_14 cs_bold cs_white_color text-uppercase transition-all">
                      <span>Get Started Free</span>
                      <span className="cs_btn_icon"><i className="fa-solid fa-arrow-right"></i></span>
                    </a>
                    {/* <div className="cs_client_info_wrapper">
                      <img src={customersGroup} alt="Customers image" />
                      <div>
                        <h3 className="cs_fs_30 cs_semibold mb-0">3.5k <span>+</span></h3>
                        <p className="cs_heading_color mb-0">Active Customer</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cs_vector_shape_6 position-absolute"></div>
          <div className="cs_vector_shape_7 position-absolute"></div>
        </div>
        <div className="cs_height_120 cs_height_lg_80"></div>
      </section>
      {/* Statistics Section Hidden */}
      <button type="button" aria-label="Scroll to top button" className="cs_scrollup bg-[#1A7F7D] hover:bg-[#156664] cs_white_color cs_radius_100 transition-all">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10L1.7625 11.7625L8.75 4.7875V20H11.25V4.7875L18.225 11.775L20 10L10 0L0 10Z" fill="currentColor" />
        </svg>
      </button>
    </>
  );
}