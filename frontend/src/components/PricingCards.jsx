import React from 'react';
import { Check, Tag, Diamond, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '../lib/auth';

const PricingCards = ({ plans, serviceName }) => {
    const navigate = useNavigate();

    const handleGetStarted = (plan) => {
        const auth = getAuth();
        const user = auth?.user;
        const targetPath = '/dashboard/user/servicehub';
        const stateData = { serviceTitle: serviceName || plan.title.trim() }; // Fallback to plan title if serviceName missing, though serviceName is preferred for ServiceHub matching

        if (user) {
            navigate(targetPath, { state: stateData });
        } else {
            navigate('/login', { state: { redirectTo: targetPath, ...stateData } });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {plans.map((plan, index) => {
                const isRecommended = plan.isRecommended;
                const isPremium = plan.isPremium;

                // Base Card Styling
                let cardClass = "bg-white border border-slate-200 shadow-md hover:shadow-xl relative rounded-[2rem]";

                // Highlighted / Recommended Styling
                if (isRecommended) {
                    cardClass = "bg-[#F0FDFA] border-2 border-[#1A7F7D] shadow-[0_20px_40px_-5px_rgba(26,127,125,0.15)] relative z-10 scale-105 rounded-[2rem]";
                }
                // Premium Styling (if not recommended)
                else if (isPremium) {
                    cardClass = "bg-[#FFFBF2] border border-[#C59B4E] shadow-lg relative rounded-[2rem] hover:shadow-2xl";
                }

                // Button Styling
                const btnClass = isRecommended
                    ? "bg-[#0F2D30] text-white hover:bg-[#1A7F7D]"
                    : (isPremium
                        ? "bg-[#C59B4E] text-white hover:bg-[#B0893C]"
                        : "bg-white text-[#0F2D30] border-2 border-slate-100 hover:border-[#0F2D30] hover:bg-slate-50");

                // Icons based on index 
                const renderIcon = () => {
                    if (index === 0) return <Tag size={28} strokeWidth={1.5} className="text-[#C59B4E]" />;
                    if (index === 1) return <Diamond size={28} strokeWidth={1.5} className="text-[#C59B4E]" />;
                    return <Crown size={28} strokeWidth={1.5} className="text-[#C59B4E]" />;
                }

                return (
                    <div key={index} className={`flex flex-col p-8 transition-all duration-300 ${cardClass}`}>

                        {/* "Most Popular" Floating Badge */}
                        {isRecommended && (
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                                <div className="bg-[#0F2D30] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-full shadow-lg flex items-center gap-2">
                                    <Diamond size={12} fill="currentColor" /> Most Popular
                                </div>
                            </div>
                        )}

                        {/* "Premium" Badge for non-recommended premium cards */}
                        {isPremium && !isRecommended && (
                            <div className="absolute top-0 right-0 z-20">
                                <span className="bg-[#C59B4E] text-white text-[10px] font-bold uppercase py-1.5 px-4 rounded-bl-2xl rounded-tr-[2rem] shadow-sm">
                                    Premium
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className={`text-xl font-bold ${isPremium && !isRecommended ? 'text-[#8C6B28]' : 'text-slate-800'}`}>{plan.title}</h3>
                                {/* Price */}
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className={`text-4xl font-extrabold ${isPremium && !isRecommended ? 'text-[#8C6B28]' : 'text-[#0F2D30]'}`}>{plan.price}</span>
                                    {plan.originalPrice && (
                                        <span className="text-sm text-slate-400 line-through font-medium ml-1">{plan.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                            {/* Icon Box */}
                            <div className={`p-3 rounded-2xl ${isRecommended ? 'bg-white/60' : (isPremium ? 'bg-white/80' : 'bg-slate-50')}`}>
                                {renderIcon()}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-500 mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>

                        {/* Divider */}
                        <div className={`h-px w-full mb-6 ${isPremium && !isRecommended ? 'bg-[#C59B4E]/30' : 'bg-slate-200/60'}`}></div>

                        {/* Features List */}
                        <ul className="space-y-4 mb-8 flex-grow">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                    <div className={`p-0.5 rounded-full mt-0.5 ${isRecommended ? 'text-[#1A7F7D]' : (isPremium ? 'text-[#C59B4E]' : 'text-green-500')}`}>
                                        <Check size={16} strokeWidth={4} />
                                    </div>
                                    <span className="leading-snug">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Action Button */}
                        <button
                            onClick={() => handleGetStarted(plan)}
                            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${btnClass}`}
                        >
                            Get Started <ArrowRight size={16} />
                        </button>

                        {/* Govt Fee Note */}
                        {plan.govtFeeNote && (
                            <p className="text-[10px] text-slate-400 text-center mt-3 italic">{plan.govtFeeNote}</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default PricingCards;
