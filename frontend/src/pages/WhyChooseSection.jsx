import React from "react";

export default function WhyChooseSection() {
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center bg-[#FAF4E7] w-full px-6 sm:px-10 lg:px-20 py-16">
        
        {/* --- Section Title --- */}
        <div className="mb-20 text-center">
          <h2 className="text-black text-2xl sm:text-3xl md:text-3xl lg:text-[48px] font-bold max-w-4xl mx-auto leading-tight">
            Why choose — streamlining legal processes for your business
          </h2>
        </div>

        {/* --- Key Features Section --- */}
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row mb-28">
          
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-md lg:max-w-lg">
            <div className="w-48 h-3 mb-10 bg-black sm:w-64 sm:h-5 rounded-r-md" />
            
            <h3 className="text-[#111111] text-2xl sm:text-3xl font-bold mb-4">
              Key  Features
            </h3>

            <p className="text-[#111112] text-sm sm:text-base mb-6">
               is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since 
              the 1500s, when an unknown printer...
            </p>

            <div className="flex flex-col gap-3">
              {[
                { text: "Expert Guidance", img: "ztqkwely" },
                { text: "User-friendly platform", img: "4luulcqn" },
                { text: "Transparent pricing", img: "bj64nd25" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <img
                    src={`https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/${item.img}_expires_30_days.png`}
                    className="object-contain w-6 h-6"
                    alt={item.text}
                  />
                  <span className="text-[#111112] text-sm sm:text-base">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Images */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col gap-6">
              <div className="bg-[#FFAF00] p-3 rounded-md self-end">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/hqai9aq5_expires_30_days.png"
                  className="w-8 h-8"
                  alt="icon"
                />
              </div>

              <div className="bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/ef3u7fsu_expires_30_days.png')] bg-cover bg-center rounded-xl overflow-hidden h-64 sm:h-80 w-52 sm:w-64">
                <div className="w-full h-full opacity-70" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/qjw0agna_expires_30_days.png"
                className="left-0 w-40 h-auto rounded-md sm:w-52"
                alt="side1"
              />
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/dqpzg8tr_expires_30_days.png"
                className="w-40 h-auto rounded-md sm:w-52"
                alt="side2"
              />
            </div>
          </div>
        </div>

        {/* --- Feature Cards --- */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-28">
          {[
            { title: "Expert Team", desc: "Access experienced legal professionals for personalized guidance." },
            { title: "24/7 Support", desc: "Get assistance anytime with our dedicated support team." },
            { title: "Easy Navigation", desc: "Intuitive interface for hassle-free service access." },
            { title: "Clear Costs", desc: "No hidden fees, transparent pricing for all services." },
          ].map((card, i) => (
            <div
              key={i}
              className="flex flex-col bg-gradient-to-b from-[#F8D280] to-[#F8D28057] rounded-xl p-6 sm:p-8 text-start shadow-md"
            >
              <h4 className="text-[#111111] text-lg sm:text-xl font-semibold mb-3">{card.title}</h4>
              <p className="text-[#3F3829] text-sm sm:text-base">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* --- Work Process --- */}
        <div className="mb-20 text-center">
          <h2 className="text-black text-2xl sm:text-3xl md:text-3xl lg:text-[48px] font-bold">
            Work Process
          </h2>
        </div>

        <div className="relative w-full max-w-6xl mb-28">
          <div className="bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/gz9ps5z1_expires_30_days.png')] bg-cover bg-center rounded-2xl overflow-hidden">
            <div className="bg-[#CFD5D4] bg-opacity-90 p-6 sm:p-10 mt-64 max-w-xl">
              <h3 className="text-[#111111] text-xl sm:text-2xl font-semibold mb-4">
                Easy Steps
              </h3>
              <p className="text-[#272A25] text-sm sm:text-lg leading-relaxed mb-4">
                Our streamlined process ensures efficiency and accuracy. We handle everything from documentation to filings, keeping you informed every step.
              </p>
              <div className="bg-[#B38512] h-1 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* --- Our Work --- */}
        <div className="mb-20 text-center">
          <h2 className="text-black text-2xl sm:text-3xl md:text-3xl lg:text-[48px] font-bold">
            Our Work
          </h2>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 mb-28">
          {[
            {
              title: "Company Registration",
              desc: "Seamless company registration for startups.",
            },
            {
              title: "Trademark Filing",
              desc: "Protecting brands with efficient trademark services.",
            },
          ].map((work, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-[#F8D28057] to-[#F8D280] rounded-xl p-6 sm:p-10 shadow-md"
            >
              <h3 className="text-[#111111] text-xl sm:text-2xl font-semibold mb-2">
                {work.title}
              </h3>
              <p className="text-[#272A25] text-sm sm:text-lg">{work.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
