import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, Database, Cpu, Layers, 
  ChevronRight, Terminal, Activity, Globe, BookOpen, Award, Zap, Command, 
  Sparkles, MessageSquare, X, Loader2, RefreshCcw, Search, Microscope, 
  TrendingUp, History, GraduationCap, Briefcase, PlayCircle, FileText, 
  Monitor, CheckCircle2, Image as ImageIcon, ArrowUpRight, Instagram, 
  Users, Lightbulb, Clock, Target, Rocket, Brain, MessageCircle, ShieldCheck, 
  FileText as FileIcon, Sun, Moon, Waves, Palette, Camera, Mountain, HeartHandshake
} from 'lucide-react';

const App = () => {
  // THEME STATE
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [scrolled, setScrolled] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  const [isConsulting, setIsConsulting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState('brief');
  const [consultationQuery, setConsultationQuery] = useState('');
  const [consultationResponse, setConsultationResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // HOVER STATE FOR RESILIENCE SECTION
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // SCROLL STATE FOR HOBBIES
  const [activeHobbyIndex, setActiveHobbyIndex] = useState(0);
  const hobbyScrollRef = useRef(null);

  const dynamicKeywords = ["agentic", "RAG-driven", "multi-agent", "intelligent", "scalable", "automated"];

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
  const modelName = "gemini-2.5-flash";
  // SKILLS DATA FOR POPUP INTERACTION
  const skillsData = [
    { 
      id: 'team', 
      title: "Team Player", 
      icon: <Users size={24}/>, 
      color: "text-blue-500",
      story: "I don't just work in teams; I build them. I led 60+ volunteers as NSS Head, directed my SIH National Finals squad, and thrive in collaborative hackathon environments." 
    },
    { 
      id: 'fast', 
      title: "Fast Learner", 
      icon: <Rocket size={24}/>, 
      color: "text-purple-500",
      story: "My learning philosophy is 'Build to Learn'. I mastered n8n, Supabase, and RAG architectures in real-time while building my Market Intelligence Suite." 
    },
    { 
      id: 'adapt', 
      title: "Adaptable", 
      icon: <Target size={24}/>, 
      color: "text-orange-500",
      story: "Transitioned seamlessly from India to Ireland, topping 2 subjects in my first semester at MTU while adapting to a new academic culture." 
    },
    { 
      id: 'comm', 
      title: "Communicator", 
      icon: <MessageCircle size={24}/>, 
      color: "text-pink-500",
      story: "I act as a Technical Translator. From pitching at IDE Bootcamps to conducting research reviews for faculty, I bridge the gap between code and concept." 
    },
    { 
      id: 'think', 
      title: "Critical Thinking", 
      icon: <Brain size={24}/>, 
      color: "text-emerald-500",
      story: "I look for the 'Why' before the 'How'. My research under professor guidance focused on optimizing neural search spaces, not just using default models." 
    },
    { 
      id: 'active', 
      title: "Proactive", 
      icon: <Zap size={24}/>, 
      color: "text-yellow-500",
      story: "I identify bottlenecks early. Whether it's optimization in data pipelines or logistics in community volunteering, I solve problems before they escalate." 
    }
  ];

  // HOBBIES DATA - ADD YOUR IMAGES AND CAPTIONS HERE
  const hobbies = [
    { title: "Open Water Swimming", icon: <Waves size={32}/>, image: "openwater.jpg", caption: "Finding calm in the chaos of open water." },
    { title: "Painting", icon: <Palette size={32}/>, image: "painting.jpg", caption: "Expressing creativity and attention to detail through visual art." },
    { title: "Sky Photography", icon: <Camera size={32}/>, image: "skyphoto.jpeg", caption: "Capturing the ever-changing canvas above." },
    { title: "Community Volunteering", icon: <HeartHandshake size={32}/>, image: "community1.jpg", caption: "Giving back and building connections." },
    { title: "Exploring Tech", icon: <Cpu size={32}/>, image: "explore tech.png", caption: "Always tinkering with the latest in AI." },
    { title: "Hiking", icon: <Mountain size={32}/>, image: "hiking1.jpg", caption: "Recharging in nature." },
  ];

  const ATHARVA_KNOWLEDGE_BASE = `
    IDENTITY: I am Atharva Katurde, an AI Engineer specializing in agentic and RAG-driven ecosystems.
    BUSINESS IMPACT (Technical Translator): I act as a bridge between the technical and non-technical worlds. I possess the unique ability to translate complex engineering architectures into clear business value and ROI for stakeholders. I ensure that technical solutions are perfectly aligned with commercial strategy.
    ACADEMICS: Pursuing MSc in AI at Munster Technological University (MTU). Achieved First Class Honours (1:1) in my first semester.
    LOCATION & MOBILITY: Currently based in Cork. I am 100% ready to relocate anywhere in Ireland; location is not a constraint for the right opportunity.
    AVAILABILITY: Available for full-time work starting June 2026, upon completion of my academic year in May.
    MY TRANSFERABLE SKILLS (Ideal for Irish Market):
    - Team Player: I focus on collaborative technical synergy in cross-functional squads.
    - Fast Learner: I possess the agility to master new LLM frameworks and cloud tools in record time.
    - Critical Thinking: I analyze technical bottlenecks to ensure commercial success.
    - Proactive: I identify optimizations in data pipelines before they become issues.
    - Communicator: As a "Technical Translator," I make complex engineering accessible to stakeholders.
    - Resilience: My experience at McDonald's UK/Ireland has taught me operational excellence in high-pressure environments.
    HOBBIES: 
    - I love Open Water Swimming (great for building mental resilience).
    - I enjoy clicking pictures of the sky and Painting (highlights my attention to detail).
    - I am passionate about community volunteering.
    PROJECTS:
    - Risk Analysis Suite: Built an AI Agent using Llama 3 and n8n to automate financial threat detection.
    - BoloTech AI: Assisted communication tool for speech impairments using Whisper AI.
    - AI Blog Generator: Multi-agent system using Gemini and Mistral for SEO content.
    CONTACT: aatharva15k@gmail.com | @athrrrv.py | linkedin.com/in/katurdeatharva009/
  `;

  const callGemini = async (prompt) => {
    if (!prompt.trim()) return;
    setIsLoadingAI(true);
    setConsultationResponse('');
    
    const systemPrompt = `
      ${ATHARVA_KNOWLEDGE_BASE}
      INSTRUCTIONS:
      - You ARE Atharva Katurde. Speak in the FIRST PERSON ("I").
      - RULE: Be extremely concise. Maximum 2 sentences per response. 
      - TONE: Professional, warm, and mindful. Focus on facts, no filler.
      - MISSION: If asked about relocation or value, emphasize I'm ready to move and have a 1:1 MTU grade.
    `;

    try {
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Check your .env file.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemPrompt
      });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.5
        }
      });

      const text = result.response.text();
      setConsultationResponse(text || "That's a great question! Feel free to reach out via email for a deeper discussion.");
      
    } catch (err) {
      console.error('Gemini API Error:', err);
      setConsultationResponse("I'm currently updating my systems. Please email me directly!");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // TYPING EFFECT & SCROLL EFFECT  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => {
      if (textIndex < dynamicKeywords.length) {
        const newText = dynamicKeywords[textIndex];
        if (typingText.length < newText.length) {
          setTypingText(newText.substring(0, typingText.length + 1));
        } else {
          setTextIndex((prev) => (prev + 1) % dynamicKeywords.length);
          setTypingText('');
        }
      }
    }, 100);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [typingText, textIndex]);

  // Handle Hobby Scroll for "Pop Up" Effect
  const handleHobbyScroll = () => {
    if (hobbyScrollRef.current) {
        const container = hobbyScrollRef.current;
        const center = container.scrollLeft + container.clientWidth / 2;
        const cards = container.querySelectorAll('[data-hobby-card]');
        
        let closestIndex = 0;
        let closestDist = Infinity;

        cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(center - cardCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestIndex = index;
            }
        });
        setActiveHobbyIndex(closestIndex);
    }
  };

  // Function to determine hobby card styles based on active index
  const getHobbyCardStyle = (index) => {
    const dist = Math.abs(index - activeHobbyIndex);
    const base = "flex-shrink-0 w-72 md:w-80 aspect-[4/5] rounded-[40px] overflow-hidden border relative snap-center transition-all duration-500 ease-out";
    const themeStyles = theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl";

    if (dist === 0) {
      // Center Card (Active)
      return `${base} ${themeStyles} scale-100 opacity-100 z-10`;
    } else {
      // Side Cards (Blurred/Small)
      return `${base} ${themeStyles} scale-90 opacity-40 blur-[2px] z-0 grayscale`;
    }
  };

  const projects = [
    {
      id: "risk-suite",
      title: "Risk Analysis Suite",
      subtitle: "Global Market Intelligence",
      period: "Sep 2025 - Dec 2025",
      shortDesc: "End-to-end AI Agent automating financial risk analyst workflows with Llama 3.",
      fullDesc: "I built an end-to-end AI Agent that mimics the workflow of a Financial Risk Analyst. It autonomously ingests real-time market data, assesses threats using Llama 3, and pushes insights to an executive dashboard.",
      techStack: ["n8n", "Llama 3 (Ollama)", "PostgreSQL", "Power BI", "Docker", "Python", "Apache Spark"],
      deepDive: [
        {
          heading: "Agentic Architecture",
          points: [
            "Parallel Design: Backend uses n8n to run granular and macro analysis in parallel.",
            "Sentiment Analyst: Local Llama 3 scoring sentiment and generating risk ledgers.",
            "Automation: Stream B aggregates headlines for the dashboard's real-time market pulse."
          ]
        },
        {
          heading: "Market Logic",
          points: [
            "PostgreSQL Medallion architecture for clean, audit-ready data logs.",
            "Executive Dashboard designed for high decision velocity.",
            "Sentiment Index gauge acting as a market mood indicator."
          ]
        }
      ],
      gallery: [
        { 
          label: "Performance Recording", 
          fileName: "Recording.mp4", 
          type: "video", 
          desc: null 
        },
        { 
          label: "The \"Agentic\" Workflow (n8n Architecture)", 
          fileName: "n8n architecture .png", 
          type: "image",
          desc: "The backend uses an n8n workflow with two parallel streams for granular and macro analysis. It fetches live financial news via NewsAPI. Stream A loops through each article, where a local Llama 3 AI agent extracts the ticker, assigns a sentiment score (-1 to +1), and generates a brief risk summary, then upserts results into PostgreSQL to avoid duplicates. Stream B triggers after completion to aggregate all headlines into a single Market Pulse summary for the dashboard ticker."
        },
        { 
          label: "The Executive Dashboard (Power BI)", 
          fileName: "Dashboard.jpeg", 
          type: "image",
          desc: "The Executive Dashboard in Power BI is built for rapid decision-making. A Donut Chart shows portfolio risk distribution (e.g., 28% High Risk) for instant exposure awareness. A Real-Time Sentiment Gauge acts as a market thermometer, indicating fear or optimism. The Live Risk Ledger ranks companies by AI-generated sentiment with Red/Amber/Green status. Drill-through lets users select a company to view a detailed Strategic Risk Profile explaining the AI's risk assessment."
        }
      ],
      icon: <Activity className="text-blue-400" />
    },
    {
      id: "bolo-tech",
      title: "BoloTech AI",
      subtitle: "Assistive Communication",
      period: "Sep 2024 - May 2025",
      shortDesc: "Inclusive real-time communication for speech impairments using Whisper.",
      fullDesc: "I designed BoloTech to bridge communication gaps for the differently-abled. It provides seamless STT/TTS conversion optimized for regional Indian accents with >93% accuracy.",
      techStack: ["Flutter", "WebRTC", "OpenAI Whisper", "Firebase", "Python", "UX Research"],
      deepDive: [
        {
          heading: "Multilingual Engine",
          points: [
            "Engineered a low-latency pipeline using WebRTC and Flutter.",
            "Integrated lightweight deep learning models processing English, Hindi, and Marathi.",
            "Firebase implementation for secure authentication and cloud logging."
          ]
        }
      ],
      gallery: [
        { 
          label: "App Insights PDF", 
          fileName: "bolotech_insights.pdf", 
          type: "pdf", 
          desc: null 
        },
        { 
          label: "System Architecture", 
          fileName: "system_architecture.png", 
          type: "image", 
          desc: "Client Layer: Interaction between User A and User B mobile apps.\n\nApplication/Server Layer: Centralized Firebase Server and cloud STT/TTS services.\n\nData Layer: Persistent storage of call logs and messages."
        }
      ],
      icon: <Globe className="text-purple-400" />
    },
    {
      id: "blog-writer",
      title: "AI Blog Generation",
      subtitle: "Multi-Agent System",
      period: "Sep 2024 - Jan 2025",
      shortDesc: "Automated SEO-optimized blog platform with multi-modal AI integration.",
      fullDesc: "I developed a multi-agent system that combines Mistral AI, Gemini, and Stability AI to create structured blogs with visuals and automated SEO support.",
      externalLink: "https://pumatech.streamlit.app/",
      techStack: ["Streamlit", "Google Gemini", "Supabase", "SDXL", "Agentic AI", "ReportLab"],
      deepDive: [
        {
          heading: "Platform Features",
          points: [
            "User dashboard for content management and reuse.",
            "Multi-format export (Markdown, PDF, DOCX, TXT).",
            "Automated SEO titles, meta descriptions, and keyword suggestions."
          ]
        }
      ],
      gallery: [{ 
          label: "Demo Recording", 
          fileName: "Aiblogrecording.mp4", 
          type: "video", 
          desc: null 
        }],
      icon: <Cpu className="text-emerald-400" />
    }
  ];

  const timeline = [
    { 
      year: "2025-2026", title: "Munster Technological University (MTU)", role: "MSc: Artificial Intelligence", 
      desc: "I achieved a 1:1 First Class Honours grade in my first semester. My work focuses on AI Agents, NLP, and Big Data Research.", 
      icon: <Zap className="text-yellow-500"/> 
    },
    { 
      year: "2025", title: "Ai India Innovations", role: "Software Engineer Intern", 
      desc: "I architected production-ready GenAI applications and optimized LLM architectures for business scalability.", 
      icon: <Briefcase className="text-emerald-500"/> 
    },
    { 
      year: "2022-2025", title: "University of Pune", role: "B.Eng: Computer Engineering", 
      desc: "I graduated with an 8.86 CGPA. I led my team to the SIH National Finals and managed 60+ volunteers as NSS Student Lead.", 
      icon: <Award className="text-purple-500"/> 
    },
    { 
      year: "2019-2022", title: "AISSMS Pune", role: "Diploma: Comp Engineering", 
      desc: "I secured a 9.1 CGPA. I mastered foundational programming and served as a Student Coordinator. This is the place where i fell in love with technology.", 
      icon: <GraduationCap className="text-blue-500"/> 
    },
    { 
      year: "2009-2019", title: "St. Mary's Convent School", role: "Foundation", 
      desc: "Where I built my foundation in academic excellence and core organizational discipline.", 
      icon: <History className="text-gray-500"/> 
    }
  ];

  const research = [
    {
      title: "Enhancing Neural Architecture Search: A Comparative Optimization Framework",
      outlet: "Springer (ICCI 2024) // Aug 29, 2025",
      impact: "I introduced surrogate modeling and RL-based strategies to improve NAS computational efficiency.",
      link: "https://link.springer.com/chapter/10.1007/978-981-96-4539-8_2"
    },
    {
      title: "Enhanced Classification of Astronomical Images Using Optimized Neural Networks via NAS",
      outlet: "IEEE // Jun 24, 2025",
      impact: "I achieved a 7-10% accuracy improvement & 30% reduction in inference time for large-scale research.",
      link: "https://ieeexplore.ieee.org/document/11035681"
    },
    {
      title: "Enhancing Recommendations with Adaptive Multi-Modal Generative Models",
      outlet: "IEEE // Jun 10, 2025",
      impact: "I introduced the AMGR framework combining GANs, VAEs, and transformers for recommendation accuracy.",
      link: "https://ieeexplore.ieee.org/abstract/document/11019832"
    },
    {
      title: "SecureSense : AI/ML Based Anomaly Detection Tool",
      outlet: "IEEE // Jul 12, 2024",
      impact: "My research on Behavior-Based Anomaly Detection Systems (BBADS) for proactive cybersecurity defense.",
      link: "https://ieeexplore.ieee.org/document/10581060"
    },
    {
      title: "Data compression for backbone Network",
      outlet: "Journal of Multimedia Technology // May 15, 2024",
      impact: "I optimized network throughput and energy consumption via advanced compression algorithms.",
      link: "https://journals.stmjournals.com/jomtra/article=2024/view=138607/"
    }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-600/40 overflow-x-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-gray-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Gradient Mesh */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-30' : 'opacity-60'}`}>
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* CUSTOM SCROLLBAR GLOBAL STYLES */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: ${theme === 'dark' ? '#0a0a0a' : '#f1f5f9'};
          }
          ::-webkit-scrollbar-thumb {
            background: ${theme === 'dark' ? '#333' : '#cbd5e1'};
            border-radius: 5px;
            border: 2px solid ${theme === 'dark' ? '#0a0a0a' : '#f1f5f9'};
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #3b82f6;
          }
          /* Hide scrollbar for horizontal scroll but allow functionality */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      {/* ARCHITECTURE BRIEF MODAL */}
      {selectedProject && (
        <div className={`fixed inset-0 z-[200] overflow-y-auto animate-in fade-in duration-500 ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl`}>
           <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl">
              
              <div className={`flex justify-between items-center mb-12 border-b pb-8 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                 <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                        {selectedProject.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{selectedProject.title}</h1>
                        <p className="text-blue-500 font-mono tracking-widest uppercase text-xs font-bold mt-2">{selectedProject.subtitle}</p>
                    </div>
                 </div>
                 <button onClick={() => { setSelectedProject(null); setActiveProjectTab('brief'); }} className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    <X size={24} />
                 </button>
              </div>

              {/* TABS NAVIGATION */}
              <div className={`flex gap-8 border-b mb-12 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                 {['brief', 'architecture', 'media'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveProjectTab(tab)}
                        className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeProjectTab === tab ? 'text-blue-500' : 'text-gray-500 hover:text-gray-400'}`}
                    >
                        {tab}
                        {activeProjectTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>}
                    </button>
                 ))}
                 {selectedProject.externalLink && (
                    <a href={selectedProject.externalLink} target="_blank" rel="noreferrer" className="pb-4 text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        LIVE DEMO <ArrowUpRight size={14}/>
                    </a>
                 )}
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeProjectTab === 'brief' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Executive Summary</h3>
                                <p className="text-lg md:text-xl leading-relaxed italic font-medium">
                                    "{selectedProject.fullDesc}"
                                </p>
                            </section>
                            <div className={`p-8 rounded-3xl border italic text-sm leading-relaxed ${theme === 'dark' ? 'bg-blue-900/10 border-blue-500/20 text-gray-300' : 'bg-blue-50 border-blue-100 text-slate-700'}`}>
                                <div className="flex items-center gap-2 text-blue-500 mb-4"><Sparkles size={16}/> <span className="font-black uppercase tracking-widest text-xs">Digital Twin Context</span></div>
                                "I architected this specific system to solve high-velocity decision bottlenecks while maintaining full on-premise data privacy."
                            </div>
                        </div>
                        <div className="space-y-8">
                            {selectedProject.deepDive.map((d, i) => (
                                <div key={i} className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <h4 className="text-sm font-black uppercase tracking-widest border-l-4 border-blue-500 pl-4 mb-4">{d.heading}</h4>
                                    <ul className="space-y-3">
                                        {d.points.map((p, j) => <li key={j} className="text-sm opacity-80 flex gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0"/> {p}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeProjectTab === 'architecture' && (
                    <div className="space-y-16">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Integrated Stack & Ecosystem</h3>
                            <div className="flex flex-wrap gap-4">
                                {selectedProject.techStack.map(t => (
                                    <div key={t} className={`px-8 py-5 rounded-2xl flex items-center gap-4 border ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-500">{t}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className={`p-12 rounded-[56px] border ${theme === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">System Reliability Protocol</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3"><ShieldCheck className="text-blue-500"/><h5 className={`font-bold uppercase text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security</h5><p className="text-xs text-gray-500 italic">Implemented local LLM inference via Ollama to ensure data privacy within the Medallion architecture.</p></div>
                                <div className="space-y-3"><TrendingUp className="text-emerald-500"/><h5 className={`font-bold uppercase text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Scalability</h5><p className="text-xs text-gray-500 italic">Dockerized environment allowing for seamless vertical scaling of data logs.</p></div>
                                <div className="space-y-3"><Zap className="text-yellow-500"/><h5 className={`font-bold uppercase text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Velocity</h5><p className="text-xs text-gray-500 italic">Minimized inference latency by optimizing RAG retrieval chains with efficient pre-processing.</p></div>
                            </div>
                        </section>
                    </div>
                )}

                {activeProjectTab === 'media' && (
                    <div className="flex flex-col gap-24 py-12 max-w-5xl mx-auto">
                        {selectedProject.gallery.length > 0 ? selectedProject.gallery.map((item, i) => (
                            <div key={i} className={`group relative rounded-[48px] overflow-hidden border transition-all ${theme === 'dark' ? 'bg-black/50 border-white/10 hover:border-blue-500/30' : 'bg-white border-slate-200 shadow-xl'} flex flex-col items-center justify-center p-8 min-h-[400px]`}>
                                <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-[32px] ${theme === 'dark' ? 'bg-black' : 'bg-slate-100'}`}>
                                    {/* DETECT MEDIA TYPE */}
                                    {item.type === 'video' ? (
                                       <video 
                                            src={`/${item.fileName}`} 
                                            controls 
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-contain max-h-[70vh]"
                                       />
                                    ) : item.type === 'pdf' ? (
                                        <iframe 
                                            src={`/${item.fileName}#toolbar=0`} 
                                            className="w-full h-[70vh] border-0 rounded-2xl bg-white"
                                            title={item.label}
                                        />
                                    ) : (
                                       <img src={`/${item.fileName}`} alt={item.label} className="w-full h-full object-contain max-h-[70vh]" />
                                    )}

                                    {/* HOVER OVERLAY - Only for non-video items with descriptions */}
                                    {item.type !== 'video' && item.desc && (
                                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                                            <div className="p-4 bg-blue-600/20 rounded-3xl text-blue-400 mb-6 border border-blue-500/30">
                                                {item.type === 'pdf' ? <FileIcon size={32}/> : <ImageIcon size={32}/>}
                                            </div>
                                            <h5 className="text-white font-black uppercase tracking-widest text-xl mb-6 border-b border-white/10 pb-4 w-full max-w-md">
                                                {item.label}
                                            </h5>
                                            <p className="text-sm md:text-base text-gray-300 italic leading-relaxed font-medium max-w-2xl whitespace-pre-line text-left px-4">
                                                {item.desc}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className={`mt-8 flex items-center justify-between w-full px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg text-blue-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-blue-50'}`}>
                                            {item.type === 'video' ? <PlayCircle size={16}/> : item.type === 'pdf' ? <FileIcon size={16}/> : <ImageIcon size={16}/>}
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.label}</span>
                                    </div>
                                    {/* Filename removed */}
                                </div>
                            </div>
                        )) : (
                            <div className="p-40 text-center border border-dashed border-white/10 rounded-[64px] text-gray-600 text-xs uppercase tracking-widest italic">
                                Visual Documentation Asset Configuration Pending local placement
                            </div>
                        )}
                    </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* RAG AI MODAL */}
      {isConsulting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`p-5 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-2 text-blue-500 font-mono"><Terminal size={16} /><span className="text-xs font-bold tracking-widest uppercase">Atharva_Twin_v4.5</span></div>
              <button onClick={() => setIsConsulting(false)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}><X size={18} /></button>
            </div>
            <div className="p-8 overflow-y-auto">
              {!consultationResponse ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">Ask me anything.</h3>
                  <textarea value={consultationQuery} onChange={(e) => setConsultationQuery(e.target.value)} placeholder="Ask about my leadership style, fast learning, or projects..." className={`w-full h-32 rounded-xl p-6 text-sm outline-none font-mono ${theme === 'dark' ? 'bg-black/50 border border-white/10 focus:border-blue-500' : 'bg-slate-50 border border-slate-200 focus:border-blue-500'}`} />
                  <button onClick={() => callGemini(consultationQuery)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-blue-500 shadow-lg">QUERY TWIN</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border font-mono text-sm leading-relaxed ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    {consultationResponse.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                  </div>
                  <button onClick={() => setConsultationResponse('')} className="text-xs font-black opacity-60 flex items-center gap-2 hover:opacity-100"><RefreshCcw size={14}/> RESET</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? (theme === 'dark' ? 'bg-black/90 border-b border-white/5' : 'bg-white/90 border-b border-slate-200') : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><Command size={16} className="text-white"/></div>
            <span className="text-sm font-black tracking-widest uppercase">ATHARVA KATURDE</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-xs font-black opacity-60 tracking-widest uppercase">
                <a href="#projects" className="hover:opacity-100 hover:text-blue-500 transition-all">Work</a>
                <a href="#resilience" className="hover:opacity-100 hover:text-blue-500 transition-all">Resilience</a>
                <a href="#timeline" className="hover:opacity-100 hover:text-blue-500 transition-all">Evolution</a>
                <a href="#hobbies" className="hover:opacity-100 hover:text-blue-500 transition-all">Beyond Code</a>
            </div>
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
            <button onClick={() => setIsConsulting(true)} className={`px-5 py-2 rounded-full font-black text-[10px] tracking-widest uppercase border transition-all ${theme === 'dark' ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/10 hover:bg-black hover:text-white'}`}>
                Ask Me
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border text-[10px] font-mono tracking-widest mb-8 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-white border-slate-200 text-blue-600 shadow-sm'}`}>
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> MSc ARTIFICIAL INTELLIGENCE @ MTU
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              I architect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 italic pr-4">
                {typingText}<span className="animate-pulse">_</span>
              </span> 
              ecosystems.
            </h1>
            <p className="text-xl md:text-2xl opacity-60 leading-relaxed max-w-2xl mb-12 font-medium">
               Bridging the gap between engineering complexity and commercial strategy. Currently specializing in multi-agent systems and scalable data architectures.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsConsulting(true)} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3">
                <Search size={16}/> Talk to my AI
              </button>
              <div className={`flex items-center gap-2 px-6 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <a href="https://linkedin.com/in/katurdeatharva009/" target="_blank" className="p-2 opacity-50 hover:opacity-100 hover:text-blue-500 transition-all"><Linkedin size={20}/></a>
                <a href="https://medium.com/@katurdeathu71" target="_blank" className="p-2 opacity-50 hover:opacity-100 hover:text-blue-500 transition-all"><BookOpen size={20}/></a>
                <a href="https://www.instagram.com/athrrrv.py/" target="_blank" className="p-2 opacity-50 hover:opacity-100 hover:text-blue-500 transition-all"><Instagram size={20}/></a>
                <a href="mailto:aatharva15k@gmail.com" target="_blank" className="p-2 opacity-50 hover:opacity-100 hover:text-blue-500 transition-all"><Mail size={20}/></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET RESILIENCE (INTERACTIVE) */}
      <section id="resilience" className={`py-32 relative border-y ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
         <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-16 opacity-90">Market Resilience</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                {skillsData.map((skill) => (
                    <div 
                        key={skill.id}
                        onMouseEnter={() => setHoveredSkill(skill.id)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className={`
                            relative p-6 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all duration-500 cursor-default
                            ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-lg'}
                            ${hoveredSkill && hoveredSkill !== skill.id ? 'blur-sm opacity-30 scale-90' : 'opacity-100 scale-100'}
                            ${hoveredSkill === skill.id ? 'z-20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105' : ''}
                        `}
                    >
                        {/* THE POPUP (Tooltip Style) */}
                        <div className={`
                            absolute bottom-full mb-6 w-72 p-6 rounded-2xl shadow-2xl text-left pointer-events-none transition-all duration-300 z-50
                            ${hoveredSkill === skill.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                            ${theme === 'dark' ? 'bg-[#0a0a0a] border border-blue-500/50' : 'bg-white border border-slate-200'}
                        `}>
                            <h4 className={`text-xs font-black uppercase tracking-widest mb-3 ${skill.color}`}>{skill.title}</h4>
                            <p className="text-sm leading-relaxed opacity-90 font-medium">{skill.story}</p>
                            
                            {/* The "Dashed Line" Connector */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 h-6 w-[2px] border-l-2 border-dashed border-blue-500"></div>
                        </div>

                        <div className={`transition-transform duration-300 ${hoveredSkill === skill.id ? 'scale-110' : ''} ${skill.color}`}>{skill.icon}</div>
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">{skill.title}</span>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* PROJECTS GRID */}
      <section id="projects" className="py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase opacity-90">Portfolio</h2>
            <p className="text-xs font-bold tracking-widest font-mono hidden md:block opacity-50">SELECTED WORKS // 2024-25</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div key={p.id} onClick={() => setSelectedProject(p)} className={`group p-10 rounded-[40px] border transition-all cursor-pointer hover:-translate-y-2 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200'}`}>
                <div className={`mb-8 w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`}>{p.icon}</div>
                <h3 className="text-2xl font-black italic uppercase mb-2 leading-none">{p.title}</h3>
                <p className="text-[10px] font-mono text-blue-500 font-bold uppercase mb-6">{p.subtitle}</p>
                <p className={`text-sm leading-relaxed mb-8 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>"{p.shortDesc}"</p>
                <div className={`flex flex-col gap-4 mt-auto border-t pt-6 opacity-80 border-dashed ${theme === 'dark' ? 'border-gray-700/50' : 'border-slate-200'}`}>
                   <div className="flex flex-wrap gap-2">
                     {p.techStack.slice(0, 3).map(t => <span key={t} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${theme === 'dark' ? 'bg-black text-gray-400' : 'bg-slate-100 text-slate-600'}`}>{t}</span>)}
                   </div>
                   <div className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2">View Brief <ChevronRight size={12}/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className={`py-32 ${theme === 'dark' ? 'bg-black/20' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-24 text-center opacity-90">Evolution</h2>
          <div className="max-w-4xl mx-auto flex flex-col gap-16">
             {timeline.map((item, i) => (
                <div key={i} className="flex gap-8 group">
                   <div className={`w-24 text-right pt-2 font-mono text-xs font-bold opacity-50 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{item.year}</div>
                   <div className={`relative border-l-2 border-dashed pl-8 pb-8 ${theme === 'dark' ? 'border-gray-700/50' : 'border-slate-300'}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'bg-black border-blue-500' : 'bg-white border-blue-600'}`}></div>
                      <h4 className="text-2xl font-black italic uppercase leading-none mb-2">{item.title}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">{item.role}</p>
                      <p className={`text-sm opacity-70 leading-relaxed max-w-xl ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>"{item.desc}"</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
           <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-16 opacity-90">Research Logs</h2>
           <div className="grid gap-4">
              {research.map((pub, i) => (
                 <a key={i} href={pub.link} target="_blank" rel="noreferrer" className={`p-8 rounded-3xl border flex flex-col md:flex-row gap-6 items-start md:items-center transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Microscope size={24}/></div>
                    <div className="flex-grow">
                       <h4 className="text-lg font-bold leading-tight mb-2">{pub.title}</h4>
                       <div className="flex gap-4 text-[10px] font-mono opacity-50 uppercase">
                          <span>{pub.outlet}</span>
                       </div>
                    </div>
                    <div className="text-xs font-bold text-blue-500 flex items-center gap-2">READ PAPER <ArrowUpRight size={14}/></div>
                 </a>
              ))}
           </div>
        </div>
      </section>

      {/* HOBBIES / BEYOND THE CODE */}
      <section id="hobbies" className={`py-32 overflow-hidden ${theme === 'dark' ? 'bg-black/40' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase opacity-90">Beyond the Code</h2>
          <p className="text-xs font-bold tracking-widest font-mono opacity-50 mt-4">LIFESTYLE // INTERESTS // PASSIONS</p>
        </div>
        
        {/* Horizontal Scroll Container - Manual Control with Snap */}
        <div 
          ref={hobbyScrollRef}
          onScroll={handleHobbyScroll}
          className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x snap-mandatory no-scrollbar pl-[calc(50%-9rem)] pr-[calc(50%-9rem)] md:pl-[calc(50%-10rem)] md:pr-[calc(50%-10rem)]" 
          style={{ scrollBehavior: 'smooth' }}
        >
          {hobbies.map((hobby, i) => (
             <div 
               key={i} 
               data-hobby-card
               className={`
                  flex-shrink-0 w-72 md:w-80 aspect-[4/5] rounded-[40px] overflow-hidden border relative snap-center transition-all duration-500 ease-out
                  ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}
                  ${i === activeHobbyIndex ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-40 blur-[1px]'}
               `}
             >
                {/* Image Placeholder or Actual Image */}
                <div className="absolute inset-0">
                  {hobby.image ? (
                    <img src={hobby.image} alt={hobby.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30 gap-4">
                      <div className={theme === 'dark' ? 'text-white' : 'text-slate-400'}>{hobby.icon}</div>
                      <span className="text-[10px] font-mono uppercase tracking-widest">Image Pending</span>
                    </div>
                  )}
                </div>
                
                {/* Instagram-style Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t p-8 flex flex-col justify-end transition-opacity duration-500 ${i === activeHobbyIndex ? 'opacity-100' : 'opacity-0'} ${theme === 'dark' ? 'from-black/90 via-black/20' : 'from-white/90 via-white/20'}`}>
                   <h3 className={`font-black italic uppercase text-2xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{hobby.title}</h3>
                   <p className={`text-xs font-medium leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                     {hobby.caption}
                   </p>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-32 text-center border-t ${theme === 'dark' ? 'bg-black/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-12 opacity-90 leading-none">Initiate <br/> Connection.</h2>
          <a href="mailto:aatharva15k@gmail.com" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xs tracking-widest hover:scale-105 transition-transform shadow-xl">EMAIL ME</a>
          <div className="mt-20 font-mono text-[10px] uppercase opacity-40">Atharva Katurde // 2026</div>
        </div>
      </footer>
    </div>
  );
};

export default App;