import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import axios from "axios"; // Keeping axios even if not used
import {
  ChevronDown,
  MapPin,
  Smartphone,
  Zap,
  Briefcase,
  ArrowRight,
  UserCheck,
  CheckCircle,
  FileText,
  Scale,
  Calculator,
  Download,
  Users,
  Star,
  Globe, // Added from Fundraise
  DollarSign, // Added from Fundraise
  Handshake, // Added from Fundraise
  TrendingUp, // Added from Fundraise
  Lightbulb, // Added from Fundraise
  CreditCard, // Added from Fundraise
  Shield,
} from "lucide-react";

import { motion } from "framer-motion";
// Using the SVG background from the "Lawyer" (Dashboard) design
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- STATIC DATA (From Fundraising) ---

const fundRegTabs = [
  { id: 'fund-overview-content', label: 'Overview' },
  { id: 'fund-definition-content', label: 'Definition' },
  { id: 'fund-types-content', label: 'Types' },
  { id: 'fund-stages-content', label: 'Stages' },
  { id: 'fund-documents-content', label: 'Documents' },
  { id: 'fund-why-kanakkaalar', label: 'Why Kanakkaalar?' },
  { id: 'fund-faqs-content', label: 'FAQs' },
];

const fundTypesData = [
  { type: "Equity Financing", pros: "Best for high-growth, no repayment pressure", cons: "Dilution of ownership, less control" },
  { type: "Debt Financing", pros: "Maintain full ownership, interest is tax-deductible", cons: "Mandatory repayment puts pressure on cash flow" },
  { type: "SAFE Notes", pros: "Founder-friendly, simple and quick early-stage funding", cons: "Potential unforeseen dilution in future rounds" },
  { type: "Grants", pros: "Non-repayable capital, no equity dilution, ideal for R&D", cons: "Highly competitive, time-consuming application process" },
  { type: "Bootstrapping", pros: "Complete control and autonomy, no external reporting", cons: "Slower expansion, constrained capital limits scaling" },
  { type: "Crowdfunding", pros: "Validates product, establishes community, public buzz", cons: "High resource drain for campaign management, public expectation pressure" },
];

const fundStageData = [
  { stage: "Idea Stage", round: "Pre-seed", fundSize: "₹5L–₹25L", source: "Founders, Friends, Angel" },
  { stage: "Early Stage", round: "Seed", fundSize: "₹25L–₹2 Cr", source: "Angel Investors, Incubators" },
  { stage: "Growth Stage", round: "Series A", fundSize: "₹2 Cr–₹10 Cr", source: "VC Firms" },
  { stage: "Expansion Stage", round: "Series B/C", fundSize: "₹10 Cr+", source: "Institutional VCs" },
];

const mandatoryDocuments = [
  "Pitch Deck – Overview of the business, traction, team, and financials.",
  "Business Plan – In-depth strategy, projections, and market analysis.",
  "Term Sheet (Draft) – Investment terms and conditions summary.",
  "Shareholders' Agreement (SHA) – Post-deal governance, rights, and responsibilities.",
  "Cap Table – Existing shareholding structure and equity distribution.",
  "Company Incorporation Documents – CIN, PAN, MOA, AOA.",
  "FinancialStatements – Audited accounts, P&L, and balance sheets.",
  "Founders' KYC Documents – PAN, Aadhaar, and address proof.",
];

const complianceEssentials = [
  "Appropriate Company Incorporation (Pvt Ltd is recommended for equity funding).",
  "DPIIT Startup India Registration (for tax relief and credibility).",
  "FEMA Compliance (for foreign investment and FDI norms).",
  "Valuation Report (prepared by a registered valuer or CA).",
  "Clean Cap Table & Shareholding Structure.",
  "Founders' Agreements and Roles Defined.",
  "GST Registration (particularly for service/product-based startups).",
  "IP, Trademark, and Licensing Documents (if relevant).",
];

const KanakkaalarServices = [
  "Pitch Deck Creation – Investor-ready presentations that clearly present your business story and value.",
  "Financial Modeling – Develop accurate forecasts and ascertain realistic valuations.",
  "Valuation Reports – Professionally certified reports to aid in equity negotiations and compliance.",
  "Business Plan Analysis – Expert insights to fortify your plan prior to investor review.",
  "Application to Grants – Find and apply for eligible startup programs and government funding.",
  "Business Mentoring – Expert one-on-one guidance for key startup choices.",
  "Investor Connect – Direct access to a vetted universe of angels, VCs, and seed investors.",
  "Due Diligence – Legal, financial, and regulatory screenings to verify deal-readiness.",
  "DPR (Detailed Project Report) – Formal reports that are bankable and institutional investor-friendly.",
];

const fundFAQs = [
  { q: "What is fundraising for startups?", a: "Start-up fundraising is the activity of raising financial investment to fund business expansion, product development, or market penetration from sources like angel investors, VCs, or grants." },
  { q: "How to raise funding for a startup?", a: "Raising funds involves strategic planning, preparing investor-ready documents (Pitch Deck, Cap Table), determining the right valuation, and approaching investors or applying for grants relevant to your growth stage." },
  { q: "What is series ABC funding?", a: "Series A, B, and C refer to progressive stages of venture capital funding. Series A is typically the first institutional round to scale a proven business model. Series B funds further market expansion, and Series C and beyond are for major expansion, M&A, or IPO preparation." },
  { q: "Is this a guaranteed or assured fundraise process?", a: "No, fundraising is inherently risk-based. Kanakkaalar assures complete support in making you investor-ready, providing expert documentation, and connecting you with potential investors, but cannot guarantee a successful fundraise." },
  { q: "What is a SAFE note and is it legal in India?", a: "A SAFE (Simple Agreement for Future Equity) Note is a founder-friendly agreement where an investor provides funds in exchange for the right to receive equity in a future priced round. While popular in the US, its legal status and use in India are subject to specific regulatory compliance, and expert consultation is crucial." },
  { q: "Do I need DPIIT registration for funding?", a: "DPIIT Startup India registration is not strictly mandatory for all funding but provides significant benefits, including tax exemptions and access to government schemes, which can increase your startup's attractiveness to investors." },
  { q: "How much equity should I give in seed funding?", a: "Typically, founders dilute around 10% to 25% equity in a Seed funding round, but this varies based on valuation, amount raised, and negotiation. It is essential to balance raising capital with maintaining sufficient ownership for future rounds." },
  { q: "How can founders maintain control while raising funds?", a: "Founders can maintain control by negotiating terms that grant them superior voting rights, raising smaller rounds at higher valuations, or opting for debt/grants instead of equity when possible." },
];


// --- STATIC DATA (From Lawyer/Dashboard Design Footer) ---
const resourceLinks = [
  { title: "Trademark", icon: Briefcase, items: ["Trademark Search", "Trademark Registration", "Trademark Objection", "Trademark Infringement", "Well Known Trademark", "International Trademark Registration", "Trademark Class List"] },
  { title: "GST", icon: Scale, items: ["HSN Code Finder", "Online GST Registration", "GST Return Filing", "GST Cancellation", "GST Revocation"] },
  { title: "Company Registration", icon: Briefcase, items: ["Company Name Search", "Company Registration", "PVT LTD Company Registration", "LLP Registration", "Sole Proprietorship Registration", "OPC Registration", "Partnership Firm Registration", "Startup India Registration"] },
  { title: "ITR, Patent & BNS", icon: FileText, items: ["IT Return Filing", "Patent Search", "Patent Registration", "Provisional Patent Application", "Patent Infringement", "BNS Sections"] },
  { title: "Copyright & Experts", icon: UserCheck, items: ["Copyright Registration", "Copyright Music Protection", "Copyright Infringement", "Online Lawyer Consultation", "Online CA Consultation", "Company Secretary Services", "Consumer Complaints", "Lawyer Services", "Intellectual Property Lawyers"] },
  { title: "Calculators", icon: Calculator, items: ["GST Calculator", "TDS Calculator", "HRA Calculator", "Gratuity Calculator", "SIP Calculator", "NPS Calculator", "EPF Calculator", "Business Setup Calculator", "PPF Calculator", "Income Tax Calculator", "Simple Compound Interest Calculator", "Salary Calculator", "Retirement Planning Calculator", "RD Calculator", "Mutual Fund Calculator", "FD Calculator", "Home Loan EMI Calculator", "EMI Calculator", "Lumpsum Calculator"] },
  { title: "Downloads", icon: Download, items: ["Rental Agreement Format", "GST Invoice Format", "Income Certificate Format", "Power of Attorney Format", "Affidavit Format", "Salary Slip Sample", "Appointment Letter Format", "Relieving Letter Format", "Legal Heir Certificate Format", "Generate Free Rent Receipt", "Commercial Rental Agreement", "Consent Letter for GST Registration Format", "No Objection Certificate (NOC) Format", "Partnership Deed Format", "Experience Letter Format", "Resignation Letter Format", "Offer Letter Format", "Bonafide Certificate Format", "Delivery Challan Format", "Authorised Signatory in GST"] },
  { title: "Find Lawyers By City", icon: MapPin, items: ["Top Lawyers in Chennai", "Top Lawyers in Bangalore", "Top Lawyers in Mumbai", "Top Lawyers in Delhi", "Top Lawyers in Kolkata", "Top Lawyers in Gurgaon", "Search Lawyers in Other Cities"] },
];

// --- REUSABLE COMPONENTS (From Lawyer/Dashboard Design) ---

const LawyerCard = ({ lawyer }) => ( // Kept for potential future use
  <motion.div
    className="p-6 transition-shadow bg-white border-t-4 border-indigo-100 shadow-lg rounded-xl hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 bg-[#2E96FF] rounded-full mb-3 flex items-center justify-center text-white text-xl font-bold">
      {lawyer.name.charAt(0)}
    </div>
    <h3 className="mb-1 text-xl font-bold">{lawyer.name}</h3>
    <p className="mb-2 font-medium text-indigo-600">{lawyer.exp}</p>
    <p className="text-sm text-gray-600">{lawyer.desc}</p>
  </motion.div>
);

const StatPill = ({ count, label }) => ( // Kept for design consistency
  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md">
    <span className="text-[#222428] text-sm font-semibold tracking-wider">
      <span className="mr-1 font-bold">{count}</span>{label}
    </span>
  </div>
);

const ReviewBox = ({ score, reviews, source }) => ( // Kept for design consistency
  <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-[220px] flex flex-col items-center justify-center border border-white/20">
    <div className="flex items-center mb-2 text-yellow-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400" />)}
    </div>
    <h4 className="text-sm font-semibold text-white/80">{source}</h4>
    <p className="mt-1 text-3xl font-bold text-white">{score}</p>
    <p className="text-sm text-white/90">{reviews}</p>
  </div>
);

const ServiceItem = ({ title, description }) => ( // Kept for design consistency
  <div className="relative p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
    <div className="mb-4">
      <span className="text-indigo-600">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.0001 20.0022C24.4867 20.0022 20.0001 24.4894 20.0001 30.0033C20.0001 35.5173 24.4867 40.0044 30.0001 40.0044C35.5134 40.0044 40.0001 35.5173 40.0001 30.0033C40.0001 24.4894 35.5134 20.0022 30.0001 20.0022ZM30.0001 38.671C25.2201 38.671 21.3334 34.7839 21.3334 30.0033C21.3334 25.2228 25.2201 21.3357 30.0001 21.3357C34.7801 21.3357 38.6667 25.2228 38.6667 30.0033C38.6667 34.7839 34.7801 38.671 30.0001 38.671Z" fill="currentColor" />
          <path d="M51.9667 50.4256C57.1467 44.8583 60 37.6309 60 30.0033C60 23.4493 57.9267 17.2219 54 12.0013V6.53406C54 6.2807 53.8533 6.04734 53.6267 5.93399C53.4 5.82065 53.1267 5.84732 52.9267 6.00067L50.3467 7.96755C44.7867 2.82698 37.5933 0 30 0C23.4467 0 17.22 2.07356 12 6.00067H6.66667C6.41333 6.00067 6.18 6.14068 6.06667 6.36737C5.95333 6.59407 5.98 6.86743 6.13333 7.06745L8.03333 9.5744C2.85333 15.1417 0 22.3692 0 29.9967C0 36.5507 2.07333 42.7781 6 47.9987V53.3326C6 53.586 6.14 53.8193 6.36667 53.9327C6.46 53.9793 6.56 53.9993 6.66667 53.9993C6.80667 53.9993 6.95333 53.9527 7.06667 53.866L9.57333 51.9658C15.14 57.1464 22.3667 60 29.9933 60C36.5467 60 42.7733 57.9264 47.9933 53.9993H53.3267C53.58 53.9993 53.8133 53.8593 53.9267 53.6326C54.04 53.4059 54.0133 53.1326 53.86 52.9326L51.96 50.4256H51.9667ZM30 1.33348C37.3333 1.33348 44.2867 4.09379 49.62 9.10768C49.78 9.66107 50.68 9.70775 50.92 9.20769L52.6667 7.88088V20.0022H40.5333L42.1733 17.3686C42.1733 17.3686 42.2133 17.3486 42.2267 17.3286C42.4733 17.0552 42.4467 16.6352 42.1733 16.3885C38.82 13.3882 34.4933 11.7346 29.9933 11.7346C26.9533 11.7346 23.98 12.4881 21.3267 13.9215V6.66741C21.3267 6.3007 21.0267 6.00067 20.66 6.00067H14.32C18.98 2.94699 24.36 1.33348 29.9933 1.33348H30ZM42.96 40.8779L39.6867 38.8243C39.48 38.6976 39.22 38.691 39.0067 38.8043C38.7933 38.9243 38.66 39.1444 38.66 39.391V44.5449C36.0467 46.1051 33.06 46.9386 29.9933 46.9386C26 46.9386 22.1667 45.5251 19.12 42.9648L21.1733 39.6911C21.3 39.4844 21.3067 39.2244 21.1933 39.011C21.0733 38.7976 20.8533 38.6643 20.6133 38.6643H15.46C13.9 36.0507 13.0667 33.0637 13.0667 29.9967C13.0667 26.0029 14.48 22.1691 17.04 19.1221L20.3133 21.1757C20.42 21.2424 20.5467 21.2757 20.6667 21.2757C20.78 21.2757 20.8867 21.249 20.9867 21.1957C21.2 21.0757 21.3333 20.8556 21.3333 20.609V15.4551C23.9467 13.8949 26.9333 13.0615 30 13.0615C33.9733 13.0615 37.7933 14.4616 40.8333 17.0019L38.7733 20.3089C38.6467 20.5156 38.64 20.7756 38.7533 20.9823C38.8733 21.1957 39.0933 21.3224 39.3333 21.3224H44.54C46.1 23.936 46.9333 26.923 46.9333 29.99C46.9333 33.9838 45.52 37.8175 42.96 40.8645V40.8779ZM1.33333 30.0033C1.33333 22.6759 4.08667 15.7351 9.09333 10.4012C9.2 10.3878 9.30667 10.3545 9.40667 10.2811C9.7 10.0611 9.76 9.64107 9.53333 9.34771L8.00667 7.33415H20V19.4088L17.3133 17.722C17.0133 17.5686 16.6333 17.542 16.3867 17.822C13.3867 21.1757 11.7333 25.4962 11.7333 30.0033C11.7333 33.0437 12.4867 36.0173 13.92 38.671H6.66667C6.3 38.671 6 38.971 6 39.3377V45.6784C2.94667 41.0179 1.33333 35.6373 1.33333 30.0033ZM30 58.6732C22.6733 58.6732 15.7333 55.9196 10.4 50.9123C10.3867 50.8056 10.3533 50.699 10.28 50.599C10.06 50.3056 9.64 50.2456 9.34667 50.4723L7.33333 51.9991V40.0044C7.33333 40.0044 15.0267 40.0578 15.1133 40.0578C15.2 40.0578 19.4133 40.0044 19.4133 40.0044L17.7267 42.6914C17.5733 42.9914 17.5467 43.3715 17.8267 43.6182C21.18 46.6185 25.5 48.272 30.0067 48.272C33.0467 48.272 36.02 47.5186 38.6733 46.0851V53.3393C38.6733 53.706 38.9733 54.006 39.34 54.006H45.68C41.02 57.0597 35.64 58.6732 30.0067 58.6732H30ZM40 52.6725V40.5978L42.6867 42.2847C42.9867 42.438 43.3667 42.4714 43.6133 42.1847C46.6133 38.831 48.2667 34.5105 48.2667 30.0033C48.2667 26.963 47.5133 23.9893 46.08 21.3357H53.3333C53.7 21.3357 54 21.0357 54 20.669V14.3283C57.0533 18.9888 58.6667 24.3694 58.6667 30.0033C58.6667 37.3308 55.9133 44.2716 50.9067 49.6055C50.8 49.6189 50.6867 49.6522 50.5933 49.7255C50.3 49.9456 50.24 50.3656 50.4667 50.659L51.9933 52.6725H40Z" fill="currentColor" />
          <path d="M29.8198 29.5566C28.3198 29.5566 27.9998 28.8565 27.9998 28.2631C27.9998 28.1965 28.0198 26.5963 29.8198 26.5963C31.4798 26.5963 31.6998 27.7031 31.7265 27.9298C31.7665 28.2898 32.0932 28.5565 32.4532 28.5232C32.8198 28.4898 33.0865 28.1631 33.0532 27.7964C32.9798 27.0363 32.3798 25.6895 30.6665 25.3428V24.6694C30.6665 24.3027 30.3665 24.0027 29.9998 24.0027C29.6332 24.0027 29.3332 24.3027 29.3332 24.6694V25.2895C27.3865 25.5228 26.6665 27.143 26.6665 28.2565C26.6665 29.5233 27.4932 30.8834 29.8198 30.8834C30.4732 30.8834 31.9998 30.9901 31.9998 32.0102C31.9998 32.5969 31.3065 33.4037 29.9998 33.4037C29.0332 33.4037 27.9998 33.1237 27.9998 32.3436C27.9998 31.9769 27.6998 31.6768 27.3332 31.6768C26.9665 31.6768 26.6665 31.9769 26.6665 32.3436C26.6665 33.337 27.3865 34.4772 29.3332 34.6905V35.3239C29.3332 35.6906 29.6332 35.9907 29.9998 35.9907C30.3665 35.9907 30.6665 35.6906 30.6665 35.3239V34.6772C32.3265 34.4105 33.3332 33.1703 33.3332 32.0035C33.3332 31.4235 33.0798 29.5433 29.8198 29.5433V29.5566Z" fill="currentColor" />
        </svg>
      </span>
    </div>
    <h3 className="mb-4 text-2xl font-semibold text-gray-900">
      <a href="#" aria-label="Service details page link">{title}</a>
    </h3>
    <p className="mb-6 text-gray-600">{description}</p>
    <a href="#" aria-label="Service details page link" className="flex items-center font-bold text-gray-800 uppercase text-sm hover:text-indigo-600">
      <span>READ MORE</span>
      <ArrowRight className="w-4 h-4 ml-2" />
    </a>
  </div>
);

const ProcessStep = ({ stepNumber, step, isLast }) => ( // Kept for design consistency
  <div className="relative flex items-start">
    <div className="flex flex-col items-center flex-shrink-0 mr-6">
      <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-indigo-600 rounded-full z-10">
        {stepNumber}
      </div>
      {!isLast && <div className="w-0.5 h-24 bg-indigo-200"></div>}
    </div>
    <div className="pt-2.5">
      <p className="text-lg text-gray-700">{step}</p>
    </div>
  </div>
);

const BenefitItem = ({ title, description }) => ( // Kept for design consistency
  <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg hover:border-indigo-500 hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
        <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
      <h4 className="text-xl font-bold text-gray-800">{title}</h4>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ExpertiseCard = ({ title }) => ( // Kept for design consistency
  <div className="relative p-6 overflow-hidden transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
    <div className="relative z-10">
      <div className="flex items-start mb-4">
        <span className="text-indigo-600">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.0001 20.0022C24.4867 20.0022 20.0001 24.4894 20.0001 30.0033C20.0001 35.5173 24.4867 40.0044 30.0001 40.0044C35.5134 40.0044 40.0001 35.5173 40.0001 30.0033C40.0001 24.4894 35.5134 20.0022 30.0001 20.0022ZM30.0001 38.671C25.2201 38.671 21.3334 34.7839 21.3334 30.0033C21.3334 25.2228 25.2201 21.3357 30.0001 21.3357C34.7801 21.3357 38.6667 25.2228 38.6667 30.0033C38.6667 34.7839 34.7801 38.671 30.0001 38.671Z" fill="currentColor" />
            <path d="M51.9667 50.4256C57.1467 44.8583 60 37.6309 60 30.0033C60 23.4493 57.9267 17.2219 54 12.0013V6.53406C54 6.2807 53.8533 6.04734 53.6267 5.93399C53.4 5.82065 53.1267 5.84732 52.9267 6.00067L50.3467 7.96755C44.7867 2.82698 37.5933 0 30 0C23.4467 0 17.22 2.07356 12 6.00067H6.66667C6.41333 6.00067 6.18 6.14068 6.06667 6.36737C5.95333 6.59407 5.98 6.86743 6.13333 7.06745L8.03333 9.5744C2.85333 15.1417 0 22.3692 0 29.9967C0 36.5507 2.07333 42.7781 6 47.9987V53.3326C6 53.586 6.14 53.8193 6.36667 53.9327C6.46 53.9793 6.56 53.9993 6.66667 53.9993C6.80667 53.9993 6.95333 53.9527 7.06667 53.866L9.57333 51.9658C15.14 57.1464 22.3667 60 29.9933 60C36.5467 60 42.7733 57.9264 47.9933 53.9993H53.3267C53.58 53.9993 53.8133 53.8593 53.9267 53.6326C54.04 53.4059 54.0133 53.1326 53.86 52.9326L51.96 50.4256H51.9667ZM30 1.33348C37.3333 1.33348 44.2867 4.09379 49.62 9.10768C49.78 9.66107 50.68 9.70775 50.92 9.20769L52.6667 7.88088V20.0022H40.5333L42.1733 17.3686C42.1733 17.3686 42.2133 17.3486 42.2267 17.3286C42.4733 17.0552 42.4467 16.6352 42.1733 16.3885C38.82 13.3882 34.4933 11.7346 29.9933 11.7346C26.9533 11.7346 23.98 12.4881 21.3267 13.9215V6.66741C21.3267 6.3007 21.0267 6.00067 20.66 6.00067H14.32C18.98 2.94699 24.36 1.33348 29.9933 1.33348H30ZM42.96 40.8779L39.6867 38.8243C39.48 38.6976 39.22 38.691 39.0067 38.8043C38.7933 38.9243 38.66 39.1444 38.66 39.391V44.5449C36.0467 46.1051 33.06 46.9386 29.9933 46.9386C26 46.9386 22.1667 45.5251 19.12 42.9648L21.1733 39.6911C21.3 39.4844 21.3067 39.2244 21.1933 39.011C21.0733 38.7976 20.8533 38.6643 20.6133 38.6643H15.46C13.9 36.0507 13.0667 33.0637 13.0667 29.9967C13.0667 26.0029 14.48 22.1691 17.04 19.1221L20.3133 21.1757C20.42 21.2424 20.5467 21.2757 20.6667 21.2757C20.78 21.2757 20.8867 21.249 20.9867 21.1957C21.2 21.0757 21.3333 20.8556 21.3333 20.609V15.4551C23.9467 13.8949 26.9333 13.0615 30 13.0615C33.9733 13.0615 37.7933 14.4616 40.8333 17.0019L38.7733 20.3089C38.6467 20.5156 38.64 20.7756 38.7533 20.9823C38.8733 21.1957 39.0933 21.3224 39.3333 21.3224H44.54C46.1 23.936 46.9333 26.923 46.9333 29.99C46.9333 33.9838 45.52 37.8175 42.96 40.8645V40.8779ZM1.33333 30.0033C1.33333 22.6759 4.08667 15.7351 9.09333 10.4012C9.2 10.3878 9.30667 10.3545 9.40667 10.2811C9.7 10.0611 9.76 9.64107 9.53333 9.34771L8.00667 7.33415H20V19.4088L17.3133 17.722C17.0133 17.5686 16.6333 17.542 16.3867 17.822C13.3867 21.1757 11.7333 25.4962 11.7333 30.0033C11.7333 33.0437 12.4867 36.0173 13.92 38.671H6.66667C6.3 38.671 6 38.971 6 39.3377V45.6784C2.94667 41.0179 1.33333 35.6373 1.33333 30.0033ZM30 58.6732C22.6733 58.6732 15.7333 55.9196 10.4 50.9123C10.3867 50.8056 10.3533 50.699 10.28 50.599C10.06 50.3056 9.64 50.2456 9.34667 50.4723L7.33333 51.9991V40.0044C7.33333 40.0044 15.0267 40.0578 15.1133 40.0578C15.2 40.0578 19.4133 40.0044 19.4133 40.0044L17.7267 42.6914C17.5733 42.9914 17.5467 43.3715 17.8267 43.6182C21.18 46.6185 25.5 48.272 30.0067 48.272C33.0467 48.272 36.02 47.5186 38.6733 46.0851V53.3393C38.6733 53.706 38.9733 54.006 39.34 54.006H45.68C41.02 57.0597 35.64 58.6732 30.0067 58.6732H30ZM40 52.6725V40.5978L42.6867 42.2847C42.9867 42.438 43.3667 42.4714 43.6133 42.1847C46.6133 38.831 48.2667 34.5105 48.2667 30.0033C48.2667 26.963 47.5133 23.9893 46.08 21.3357H53.3333C53.7 21.3357 54 21.0357 54 20.669V14.3283C57.0533 18.9888 58.6667 24.3694 58.6667 30.0033C58.6667 37.3308 55.9133 44.2716 50.9067 49.6055C50.8 49.6189 50.6867 49.6522 50.5933 49.7255C50.3 49.9456 50.24 50.3656 50.4667 50.659L51.9933 52.6725H40Z" fill="currentColor" />
            <path d="M29.8198 29.5566C28.3198 29.5566 27.9998 28.8565 27.9998 28.2631C27.9998 28.1965 28.0198 26.5963 29.8198 26.5963C31.4798 26.5963 31.6998 27.7031 31.7265 27.9298C31.7665 28.2898 32.0932 28.5565 32.4532 28.5232C32.8198 28.4898 33.0865 28.1631 33.0532 27.7964C32.9798 27.0363 32.3798 25.6895 30.6665 25.3428V24.6694C30.6665 24.3027 30.3665 24.0027 29.9998 24.0027C29.6332 24.0027 29.3332 24.3027 29.3332 24.6694V25.2895C27.3865 25.5228 26.6665 27.143 26.6665 28.2565C26.6665 29.5233 27.4932 30.8834 29.8198 30.8834C30.4732 30.8834 31.9998 30.9901 31.9998 32.0102C31.9998 32.5969 31.3065 33.4037 29.9998 33.4037C29.0332 33.4037 27.9998 33.1237 27.9998 32.3436C27.9998 31.9769 27.6998 31.6768 27.3332 31.6768C26.9665 31.6768 26.6665 31.9769 26.6665 32.3436C26.6665 33.337 27.3865 34.4772 29.3332 34.6905V35.3239C29.3332 35.6906 29.6332 35.9907 29.9998 35.9907C30.3665 35.9907 30.6665 35.6906 30.6665 35.3239V34.6772C32.3265 34.4105 33.3332 33.1703 33.3332 32.0035C33.3332 31.4235 33.0798 29.5433 29.8198 29.5433V29.5566Z" fill="currentColor" />
          </svg>
        </span>
        <h3 className="text-xl font-semibold text-gray-900">
          <a href="#" aria-label="Expertise details page link">{title}</a>
        </h3>
      </div>
      <div className="mt-auto">
        <p className="mb-4 text-sm text-gray-600">Expert legal support for {title.toLowerCase()}.</p>
        <a href="#" aria-label="Expertise details page link" className="flex items-center text-sm font-bold text-gray-800 uppercase hover:text-indigo-600">
          <span>READ MORE</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  </div>
);

const ResourceLinkGroup = ({ title, items, icon: Icon }) => ( // Kept for footer design
  <div className="p-4 bg-white shadow-lg rounded-xl">
    <h4 className="flex items-center gap-2 mb-3 text-xl font-bold text-gray-900">
      {Icon && <Icon className="w-5 h-5 text-[#2E96FF]" />} {title}
    </h4>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {items.slice(0, 7).map((item, i) => (
        <a key={i} href="#" className="text-sm text-gray-600 hover:text-[#2E96FF] transition truncate" title={item}>
          {item}
        </a>
      ))}
    </div>
    {items.length > 7 && (
      <a href="#" className="text-sm text-[#2E96FF] font-semibold mt-2 block hover:underline">
        View all ({items.length - 7} more)
      </a>
    )}
  </div>
);

// --- REUSABLE COMPONENTS (Imported from Fundraising) ---

const DetailItem = ({ title, description, icon: Icon }) => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
    <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const FundTypeTable = ({ data }) => (
  <div className="mt-6 overflow-x-auto bg-white border border-gray-200 shadow-lg rounded-xl">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-[#E6F0F6]">
        <tr>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Funding Type</th>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Pros</th>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Cons</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-6 py-4 whitespace-normal text-sm font-semibold text-[#022B50] min-w-[150px]">{row.type}</td>
            <td className="px-6 py-4 text-sm text-gray-700 whitespace-normal">{row.pros}</td>
            <td className="px-6 py-4 text-sm text-red-600 whitespace-normal">{row.cons}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FundStagesTable = ({ data }) => (
  <div className="mt-6 overflow-x-auto bg-white border border-gray-200 shadow-lg rounded-xl">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-[#E6F0F6]">
        <tr>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Stage</th>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Round</th>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Fund Size (₹)</th>
          <th className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Typical Source</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-normal">{row.stage}</td>
            <td className="px-6 py-4 whitespace-normal text-sm font-bold text-[#022B50]">{row.round}</td>
            <td className="px-6 py-4 text-sm text-gray-700 whitespace-normal">{row.fundSize}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal">{row.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// --- TAB CONTENT COMPONENTS (From Fundraising) ---

const FundOverviewContent = () => (
  <section id="fund-overview-content" className="py-12 scroll-mt-24">
    <h2 className="mb-6 text-3xl font-bold text-gray-800">Overview</h2>
    <p className="max-w-4xl mb-4 text-lg text-gray-700">
      Start-up fundraising is the activity of raising financial investment to fund business expansion, product development, or market penetration. This money can be sourced from **angel investors, venture capitalists, crowdfunding, or government grants**. Mismanagement of fundraising can result in compliance problems, forced equity dilution, or legal delays that can foul future investment prospects.
    </p>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      At Kanakkaalar we assist fundraising with expert advice to guarantee **strategic planning, compliance with regulations, and improved long-term results** for startups.
    </p>

    <div className="p-6 bg-[#E6F0F6] rounded-xl border-l-4 border-[#022B50] shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-[#022B50]">What Is Fundraising for Startups?</h3>
      <p className="font-medium text-gray-800">
        Fundraising is an important aspect of developing a business startup, particularly in the case of startups as most startups do not have enough money. Startup entrepreneurs usually start with using personal funds or borrowing money from friends and relatives. This initial source of money, **pre-seed funding**, is used to test whether a business idea works and create a simple business model.
      </p>
      <p className="mt-3 font-medium text-gray-800">
        It lays the foundation for the seed stage, where more formal **seed funding** can be raised from angel investors or investment companies. Such early-stage investments facilitate business growth, product testing, and determination of a target market.
      </p>
    </div>
  </section>
);

const FundDefinitionContent = () => (
  <section id="fund-definition-content" className="py-12 scroll-mt-24">
    <h3 className="mb-8 text-3xl font-bold text-gray-800">Key Fundraising Aims</h3>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DetailItem
        title="Business Expansion"
        description="Secure capital to enter new markets, acquire competitors, or increase production capacity."
        icon={TrendingUp}
      />
      <DetailItem
        title="Investor Readiness"
        description="Prepare all legal, financial, and business documents to be appealing and compliant for VCs."
        icon={Handshake}
      />
      <DetailItem
        title="Strategic Dilution"
        description="Determine the optimal equity to trade for capital and strategic guidance without losing control."
        icon={Scale}
      />
      <DetailItem
        title="Compliance Certainty"
        description="Ensure all funding is legally compliant with SEBI, FEMA, and Companies Act regulations."
        icon={CheckCircle}
      />
      <DetailItem
        title="Product/Tech Development"
        description="Fund essential research, development, and scaling of core product technology."
        icon={Zap}
      />
      <DetailItem
        title="Market Penetration"
        description="Finance aggressive marketing, sales efforts, and team growth to capture market share."
        icon={Globe}
      />
    </div>
  </section>
);

const FundTypesContent = () => (
  <section id="fund-types-content" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Types of Startup Fundraising</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      Startups can raise money in different ways, each appropriate for different requirements and stages of development. The following is a complete description of the types:
    </p>
    <FundTypeTable data={fundTypesData} />
  </section>
);

const FundStagesContent = () => (
  <section id="fund-stages-content" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Startup Funding Rounds & Stages</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      Startup funding goes through different stages, each corresponding to business development and risk levels. These investment companies assess equity financing opportunities in exchange for equity share, facilitating fast growth and driving the selected growth trajectory. Here is a simplified categorisation:
    </p>
    <FundStagesTable data={fundStageData} />
    <div className="max-w-4xl p-6 mt-8 border-l-4 border-green-500 shadow-md bg-green-50 rounded-xl">
      <h4 className="text-lg font-semibold text-gray-800">VC Value Addition</h4>
      <p className="text-sm text-gray-600">VCs provide not just capital but also strategic advice, legal support, and access to other potential investors. These collaborations refine the financial model, enhance marketing strategies, and make the company's competitive edge even better. With each round comes additional capital—and expectations. Select the appropriate funding round to fit your startup's current stage and objectives.</p>
    </div>
  </section>
);

const FundDocumentsContent = () => (
  <section id="fund-documents-content" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Documents Required for Fundraising</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      Pre-deal, VCs and angel investors need critical documents to consider and close the investment. These startup funding documents provide **legal certainty and investor confidence**.
    </p>
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h4 className="text-2xl font-bold text-[#022B50] mb-4">Core Investment Documents:</h4>
        <ul className="space-y-3 text-gray-700">
          {mandatoryDocuments.map((doc, i) => (
            <li key={i} className="flex items-start gap-2">
              <FileText className="flex-shrink-0 w-5 h-5 mt-1 text-green-500" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-[#022B50] mb-4">Legal & Compliance Essentials:</h4>
        <p className="mb-3 text-sm italic text-gray-600">
          Having these ready beforehand prevents delays, fosters trust, and facilitates easy closure of funding.
        </p>
        <ul className="space-y-3 text-gray-700">
          {complianceEssentials.map((doc, i) => (
            <li key={i} className="flex items-start gap-2">
              <Scale className="flex-shrink-0 w-5 h-5 mt-1 text-indigo-500" />
              <span>**{doc.split('(')[0].trim()}** ({doc.split('(').length > 1 ? doc.split('(')[1].slice(0, -1) : 'mandatory check'})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <p className="max-w-4xl mt-8 text-lg text-gray-700">
      Kanakkaalar streamlines your fundraising process by having all necessary documents prepared for you, ranging from pitch decks to legal documents to make you **investor-ready** and **compliant with the law**.
    </p>
  </section>
);

const FundHowKanakkaalar = () => (
  <section id="fund-why-kanakkaalar" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Kanakkaalar Fundraising Support Services</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      Kanakkaalar provides a **360° fundraising solution** to Indian startups. This is how we assist you in preparing and raising capital legally and with confidence:
    </p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {KanakkaalarServices.map((service, i) => {
        const [title, description] = service.split('–').map(s => s.trim());
        const Icon = i % 3 === 0 ? Lightbulb : i % 3 === 1 ? Handshake : FileText; // Simple icon variation
        return (
          <div key={i} className="flex items-start gap-3 p-5 border border-indigo-200 shadow-sm bg-indigo-50 rounded-xl">
            <Icon className="w-6 h-6 text-[#022B50] mt-1 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

// --- MERGED FAQ CONTENT ---
// (Using "Lawyer/Dashboard" 2-column layout + "Fundraising" data)
const FAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
  <section id="fund-faqs-content" className="py-20 bg-white scroll-mt-24">
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      {/* Left Column (Text updated for Fundraising) */}
      <div className="lg:col-span-5">
        <div className="flex items-center gap-2 mb-4 font-semibold text-indigo-600">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span>FAQ’s</span>
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        </div>
        <h2 className="mb-4 text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mb-8 text-gray-600">
          Find answers to common questions about our startup fundraising services, fees, and processes.
        </p>
        <a href="#" aria-label="FAQ page link" className="inline-flex items-center justify-center px-6 py-3 font-bold text-white uppercase transition-colors bg-indigo-700 rounded-lg text-sm hover:bg-indigo-800">
          <span>Check More Faq</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      </div>

      {/* Right Column (Accordion from Dashboard design) */}
      <div className="space-y-4 lg:col-span-7">
        {faqs.map((f, i) => (
          <div key={i} className="overflow-hidden bg-gray-100 rounded-lg">
            <button
              className="flex items-center justify-between w-full p-5 text-left"
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <h3 className="text-lg font-semibold text-gray-800">{f.q}</h3>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform ${faqOpen === i ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>
                <ChevronDown className={`w-5 h-5 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: faqOpen === i ? "auto" : 0, opacity: faqOpen === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-gray-600">{f.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// --- Main Component (Fundraising Page using Lawyer/Dashboard Design) ---
export default function FundraisingPage() {
  const [activeTab, setActiveTab] = useState(fundRegTabs[0].id);
  const [faqOpen, setFaqOpen] = useState(null);

  // Offset from Lawyer/Dashboard design
  const SCROLL_OFFSET = 120;

  // --- SCROLLSPY IMPLEMENTATION (From Fundraising component - more robust) ---
  useEffect(() => {
    const sectionIds = fundRegTabs.map(tab => tab.id);

    const handleScroll = () => {
      let currentActiveTab = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i];
        const section = document.getElementById(sectionId);

        if (section) {
          const rect = section.getBoundingClientRect();
          // Logic to check if the section's top edge is above or at the SCROLL_OFFSET line
          if (rect.top <= SCROLL_OFFSET) {
            currentActiveTab = sectionId;
          }
        }
      }

      // Check if the currentActiveTab is the last section and if we're scrolled to the bottom
      const isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5; // -5 for tolerance
      if (isScrolledToBottom) {
        currentActiveTab = sectionIds[sectionIds.length - 1];
      }

      setActiveTab(prevActiveTab => {
        if (prevActiveTab !== currentActiveTab) {
          return currentActiveTab;
        }
        return prevActiveTab;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array, as fundRegTabs is a top-level constant

  // Function to handle smooth scrolling when a tab is clicked
  const handleTabClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - SCROLL_OFFSET,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  return (
    <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 selection:bg-[#1A7F7D] selection:text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* === HERO SECTION (UPDATED PREMIUM DESIGN) === */}
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={BackgroundImageSrc}
            alt="Fundraising Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Teal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-left space-y-8 flex flex-col items-start">
              {/* Gold Seal Badge - Neatly Aligned */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>

                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#C59B4E] shadow-xl">
                  {/* Inner Ring */}
                  <div className="absolute inset-1 rounded-full border border-[#C59B4E]/30"></div>

                  <div className="text-center px-1">
                    <div className="flex justify-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-[#C59B4E] text-[#C59B4E]" />)}
                    </div>
                    <span className="block text-[#C59B4E] font-serif font-bold text-[10px] leading-tight uppercase tracking-wider mb-1">
                      Startup<br />Services<br />In India
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  Fundraising for <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Startups</span>
                </h1>

                <p className="text-sm md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Tailored fundraising strategies aligned with your growth. From equity to grants, we provide complete support to make you investor-ready.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                  <span>Verified Experts</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-[#C59B4E]" />
                  <span>Data Privacy</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Raise Funds Now</h2>
                    <p className="text-slate-500 text-[10px] md:text-xs px-2 leading-relaxed">
                      Share your details to connect with investment experts!
                    </p>
                  </div>
                  <LeadForm serviceName="Fundraising for Startups" btnText="Get Started" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === Sticky Navigation === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
            {fundRegTabs.map((tab) => (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  className={`
                    relative py-4 text-sm font-bold tracking-wide transition-all duration-200 border-b-[3px]
                    ${activeTab === tab.id
                      ? 'text-[#0F4C49] border-[#0F4C49]'
                      : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}
                  `}
                  onClick={(e) => { e.preventDefault(); handleTabClick(tab.id); }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === All Tab Content Sections === */}
      <div className="w-full px-4 py-12 md:py-20">
        <div className="mx-auto max-w-7xl space-y-16">
          <FundOverviewContent />
          <FundDefinitionContent />
          <FundTypesContent />
          <FundStagesContent />
          <FundDocumentsContent />
          <FundHowKanakkaalar />
          <FAQsContent faqs={fundFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
        </div>
      </div>

      {/* --- Resources & Links Footer Section --- */}
      <section className="px-4 py-16 bg-[#F8FAFC] border-t border-slate-200 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-slate-800 font-heading">
            Explore Our Resources
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resourceLinks.map((group, i) => (
              <ResourceLinkGroup key={i} title={group.title} items={group.items} icon={group.icon} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}