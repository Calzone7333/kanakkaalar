import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

// ✅ CSS Imports
import "./assets1/css/bootstrap.min.css";
import "./assets1/css/fontawesome.min.css";
import "./assets1/css/slick.min.css";
import "./assets1/css/animate.css";
import "./assets1/css/odometer.css";
import "./assets1/css/style.css";
import "./styles/globals.css";

// ✅ JS Library Imports (auto-bundled by Vite)
import "jquery";
import "slick-carousel";
import Isotope from "isotope-layout";
import "odometer";

import "./assets1/js/wow.min.js";

// ⚙️ Safe WOW initialization moved to GlobalInit component

// ✅ Initialize global libraries after mount
function GlobalInit() {
  useEffect(() => {
    // Wait for DOM to be ready
    // Initialize WOW.js safely
    if (window.WOW) {
      new window.WOW({ live: false }).init();
    }

    // ✅ Initialize Slick Carousel if found
    if (window.$ && typeof window.$(".slick-slider").slick === "function") {
      window.$(".slick-slider").slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
      });
    }

    // ✅ Initialize Isotope (Grid Layout)
    const grid = document.querySelector(".grid");
    if (grid) {
      new Isotope(grid, {
        itemSelector: ".grid-item",
        layoutMode: "fitRows",
      });
    }
  }, []);

  return null;
}

// ✅ Mock API setup
if (import.meta.env.VITE_USE_MOCK === "true") {
  import("./lib/mock-api");
}

// ✅ Suppress noisy fetch errors in development
if (import.meta.env.DEV) {
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason || {};
    const msg = reason?.message || "";
    const stack = reason?.stack || "";
    if (
      msg.includes("Failed to fetch") ||
      stack.includes("edge.fullstory.com") ||
      stack.includes("fs.js")
    ) {
      e.preventDefault();
      console.warn("Suppressed third-party fetch error in dev:", reason);
    }
  });

  // Disable FullStory requests in dev
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const url = String(args[0] || "");
    if (url.includes("edge.fullstory.com") || url.includes("/s/fs.js")) {
      return new Response("", { status: 204 });
    }
    try {
      return await nativeFetch(...args);
    } catch (err) {
      const msg = err?.message || "";
      const stack = err?.stack || "";
      if (
        msg.includes("Failed to fetch") &&
        (stack.includes("edge.fullstory.com") || stack.includes("fs.js"))
      ) {
        return new Response("", { status: 204 });
      }
      throw err;
    }
  };
}

// ✅ Global guard for form + anchors
(function setupGlobalGuards() {
  if (typeof window !== "undefined") {
    window.addEventListener(
      "submit",
      (e) => {
        const form = e.target;
        if (form?.tagName === "FORM" && !form.hasAttribute("data-allow-submit")) {
          e.preventDefault();
          console.debug("Prevented native form submit for", form);
        }
      },
      true
    );

    window.addEventListener(
      "click",
      (e) => {
        const a = e.target.closest?.("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href === "#" || href.trim().toLowerCase().startsWith("javascript:")) {
          e.preventDefault();
          console.debug("Prevented default anchor navigation for", a);
        }
      },
      true
    );
  }
})();

import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

// ⚠️ USING A PUBLIC DEMO ID - MIGHT HIT RATE LIMITS OR ORIGIN ERRORS
const GOOGLE_CLIENT_ID = "411875773518-g3froafd9i5osq2p2gr01gllrcujhsjg.apps.googleusercontent.com";

// ✅ Render Application
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <HelmetProvider>
      <HashRouter>
        <GlobalInit />
        <App />
      </HashRouter>
    </HelmetProvider>
  </GoogleOAuthProvider>
);
