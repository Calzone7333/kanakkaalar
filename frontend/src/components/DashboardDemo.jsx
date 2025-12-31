import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Users, PieChart, CheckCircle, Search, FileText,
    Bell, Settings, ChevronDown, Menu, CreditCard, Building,
    ArrowRight, Check, Loader2, RefreshCw
} from "lucide-react";

// --- SCENARIO CONFIGURATION ---
// This component simulates a full 1-minute user journey
// Flow: Login -> Dashboard Load -> Select Service -> Fill Form -> Success

export default function DashboardDemo() {
    const [scene, setScene] = useState("login"); // login, loading, dashboard, service, form, processing, success
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // % coordinates
    const [clickEffect, setClickEffect] = useState(false);

    // Simulation States
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // --- ORCHESTRATOR ---
    useEffect(() => {
        let timeouts = [];
        const schedule = (fn, delay) => {
            const t = setTimeout(fn, delay);
            timeouts.push(t);
            return t;
        };

        const runScenario = () => {
            // RESET
            setScene("login");
            setEmailText("");
            setPasswordText("");
            setCompanyName("");
            setShowDropdown(false);
            setCursorPos({ x: 80, y: 80 });

            // 1. LOGIN SEQUENCE (0s - 10s)
            // Move to email
            schedule(() => setCursorPos({ x: 50, y: 42 }), 1000);
            schedule(() => setClickEffect(true), 2000);
            schedule(() => setClickEffect(false), 2200);

            // Type Email
            let email = "prakash@kanakkaalar.com";
            email.split("").forEach((char, i) => {
                schedule(() => setEmailText(p => p + char), 2500 + (i * 100));
            });

            // Move to Password
            schedule(() => setCursorPos({ x: 50, y: 55 }), 5000);
            schedule(() => setClickEffect(true), 5500);
            schedule(() => setClickEffect(false), 5700);

            // Type Password
            let pass = "********";
            pass.split("").forEach((char, i) => {
                schedule(() => setPasswordText(p => p + char), 6000 + (i * 100));
            });

            // Click Login
            schedule(() => setCursorPos({ x: 50, y: 70 }), 7500);
            schedule(() => setClickEffect(true), 8500);
            schedule(() => {
                setClickEffect(false);
                setScene("loading");
            }, 8700);

            // 2. DASHBOARD SEQUENCE (10s - 20s)
            schedule(() => setScene("dashboard"), 11000);

            // Explore Dashboard (Move cursor around)
            schedule(() => setCursorPos({ x: 20, y: 30 }), 12000); // Hover sidebar
            schedule(() => setCursorPos({ x: 70, y: 40 }), 14000); // Hover chart

            // 3. NEW SERVICE SEQUENCE (20s - 30s)
            // Click "Apply New"
            schedule(() => setCursorPos({ x: 85, y: 15 }), 16000);
            schedule(() => setClickEffect(true), 17000);
            schedule(() => {
                setClickEffect(false);
                setScene("service");
            }, 17200);

            // Select "Pvt Ltd"
            schedule(() => setCursorPos({ x: 30, y: 50 }), 19000); // Move to card
            schedule(() => setClickEffect(true), 20000);
            schedule(() => {
                setClickEffect(false);
                setScene("form");
            }, 20200);

            // 4. FORM FILLING (30s - 45s)
            // Type Company Name
            schedule(() => setCursorPos({ x: 50, y: 35 }), 22000);
            schedule(() => setClickEffect(true), 22500);
            schedule(() => setClickEffect(false), 22700);

            let company = "Growth Tech Pvt Ltd";
            company.split("").forEach((char, i) => {
                schedule(() => setCompanyName(p => p + char), 24000 + (i * 100));
            });

            // Select State (Dropdown)
            schedule(() => setCursorPos({ x: 50, y: 55 }), 27000);
            schedule(() => setClickEffect(true), 28000);
            schedule(() => {
                setClickEffect(false);
                setShowDropdown(true);
            }, 28200);

            // Choose "Delhi"
            schedule(() => setCursorPos({ x: 50, y: 65 }), 29000);
            schedule(() => setClickEffect(true), 29500);
            schedule(() => {
                setClickEffect(false);
                setShowDropdown(false);
            }, 29700);

            // Submit
            schedule(() => setCursorPos({ x: 80, y: 85 }), 31000);
            schedule(() => setClickEffect(true), 32000);
            schedule(() => {
                setClickEffect(false);
                setScene("processing");
            }, 32200);

            // 5. SUCCESS (45s - 55s)
            schedule(() => setScene("success"), 36000);

            // RESTART LOOP (60s)
            schedule(() => runScenario(), 55000);
        };

        runScenario();

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full h-full bg-slate-100 relative font-sans select-none overflow-hidden rounded-xl border border-slate-300 shadow-2xl flex flex-col hover:cursor-none">

            {/* Browser Chrome */}
            <div className="h-8 bg-white border-b border-slate-200 flex items-center px-4 justify-between z-30 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="bg-slate-100 px-4 py-1 rounded-md text-[10px] text-slate-500 font-medium flex items-center gap-2 w-1/2 justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    portal.kanakkaalar.com
                </div>
                <div className="w-10"></div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative bg-slate-50 overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* --- SCENE 1: LOGIN --- */}
                    {scene === "login" && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full h-full flex items-center justify-center bg-slate-50"
                        >
                            <div className="w-[300px] bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                                <div className="flex justify-center mb-6">
                                    <div className="w-12 h-12 bg-[#1A7F7D] rounded-xl flex items-center justify-center shadow-lg shadow-[#1A7F7D]/30">
                                        <Activity className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3 text-xs text-slate-800 font-medium relative overflow-hidden">
                                            {emailText}<span className="animate-pulse">|</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                        <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3 text-xs text-slate-800 font-bold tracking-widest">
                                            {passwordText}
                                        </div>
                                    </div>
                                    <button className="w-full h-10 bg-[#1A7F7D] text-white rounded-lg text-xs font-bold shadow-md shadow-[#1A7F7D]/20 mt-2">
                                        Secure Login
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SCENE 2: LOADING --- */}
                    {scene === "loading" && (
                        <motion.div key="loading" className="w-full h-full flex flex-col items-center justify-center bg-white">
                            <Loader2 className="w-10 h-10 text-[#1A7F7D] animate-spin mb-4" />
                            <div className="text-xs font-semibold text-slate-500">Authenticating...</div>
                        </motion.div>
                    )}

                    {/* --- SCENE 3: DASHBOARD --- */}
                    {scene === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-full h-full flex bg-slate-50"
                        >
                            {/* Sidebar */}
                            <div className="w-16 bg-[#1A7F7D] flex flex-col items-center py-6 gap-6 shrink-0">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><Menu size={18} /></div>
                                <div className="w-full h-[1px] bg-white/10" />
                                <div className="p-2 bg-white/20 rounded-lg text-white"><Activity size={20} /></div>
                                <div className="p-2 text-white/40"><Users size={20} /></div>
                                <div className="p-2 text-white/40"><Settings size={20} /></div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Overview</h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Welcome Back, User</p>
                                    </div>
                                    <div className="bg-[#1A7F7D] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-[#1A7F7D]/30 flex items-center gap-2">
                                        Apply New <ArrowRight size={12} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
                                    >
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Total Filings</div>
                                        <div className="text-2xl font-bold text-[#1A7F7D]">128</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
                                    >
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Compliance</div>
                                        <div className="text-2xl font-bold text-[#C59B4E]">98%</div>
                                    </motion.div>
                                </div>

                                {/* Animated Graph */}
                                <div className="h-32 bg-white rounded-xl border border-slate-100 p-4 flex items-end gap-2">
                                    {[30, 45, 35, 60, 50, 80, 70, 90, 65].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + (i * 0.05) }}
                                            className="flex-1 bg-gradient-to-t from-[#1A7F7D] to-[#2DD4BF] rounded-t-sm opacity-80"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SCENE 4: SERVICE SELECT --- */}
                    {scene === "service" && (
                        <motion.div key="service" className="w-full h-full bg-slate-50 flex flex-col p-6">
                            <h2 className="text-sm font-bold text-slate-800 mb-4">Select Service</h2>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white p-3 rounded-xl border border-[#1A7F7D] shadow-md relative overflow-hidden">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-10 h-10 bg-[#1A7F7D]/10 rounded-full flex items-center justify-center text-[#1A7F7D]">
                                            <Building size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-800">Private Limited Co.</div>
                                            <div className="text-[10px] text-slate-500">Registration & Compliance</div>
                                        </div>
                                        <div className="w-5 h-5 bg-[#1A7F7D] rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-800">Trademark Filing</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SCENE 5: FORM FILLING --- */}
                    {scene === "form" && (
                        <motion.div key="form" className="w-full h-full bg-white flex flex-col p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                                <div className="w-6 h-6 bg-[#1A7F7D] rounded flex items-center justify-center text-white"><Building size={12} /></div>
                                <span className="text-xs font-bold text-slate-800">New Incorporation</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Proposed Name</label>
                                    <div className="h-8 border-b border-slate-200 flex items-center text-xs font-medium text-slate-800">
                                        {companyName}<span className="animate-pulse">|</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Registered State</label>
                                    <div className="h-8 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800">
                                        <span>{!showDropdown ? "Select State..." : "Delhi"}</span>
                                        <ChevronDown size={14} className="text-slate-400" />
                                    </div>
                                    {showDropdown && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-10 left-0 right-0 bg-white shadow-xl border border-slate-100 rounded-lg p-1 z-10">
                                            <div className="px-3 py-1.5 text-xs hover:bg-slate-50 rounded">Maharashtra</div>
                                            <div className="px-3 py-1.5 text-xs bg-[#1A7F7D]/10 text-[#1A7F7D] font-bold rounded">Delhi</div>
                                            <div className="px-3 py-1.5 text-xs hover:bg-slate-50 rounded">Karnataka</div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto flex justify-end">
                                <div className="px-4 py-2 bg-[#1A7F7D] text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2">
                                    Proceed to Pay <ArrowRight size={12} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- SCENE 6: PROCESSING & SUCCESS --- */}
                    {scene === "processing" && (
                        <motion.div key="proc" className="w-full h-full flex flex-col items-center justify-center bg-white gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-slate-100" />
                                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-[#1A7F7D] border-t-transparent animate-spin" />
                            </div>
                            <div className="text-xs font-bold text-slate-500">Processing Application...</div>
                        </motion.div>
                    )}

                    {scene === "success" && (
                        <motion.div key="success" className="w-full h-full flex flex-col items-center justify-center bg-[#1A7F7D] text-white relative overflow-hidden">
                            {/* Confetti */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        x: (Math.random() - 0.5) * 300,
                                        y: (Math.random() - 0.5) * 300,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            ))}

                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }} type="spring"
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl"
                            >
                                <Check size={40} className="text-[#1A7F7D]" strokeWidth={4} />
                            </motion.div>
                            <h2 className="text-xl font-bold mb-1">Success!</h2>
                            <p className="text-xs text-white/80">Application #KAN-8829 Submitted</p>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* --- CURSOR OVERLAY --- */}
                <motion.div
                    className="absolute top-0 left-0 pointer-events-none z-50 drop-shadow-2xl"
                    animate={{
                        left: `${cursorPos.x}%`,
                        top: `${cursorPos.y}%`,
                        scale: clickEffect ? 0.9 : 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 25,
                        mass: 0.5
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#C59B4E" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    {clickEffect && (
                        <div className="absolute -inset-4 border-2 border-[#C59B4E] rounded-full animate-ping opacity-50" />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
