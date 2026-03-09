import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { 
  Wrench, Activity, Zap, Layers, Cpu, Settings, 
  FileText, Mail, Linkedin, Github, ChevronDown,
  GraduationCap, Briefcase, Code, MapPin, Calendar,
  ExternalLink, Menu, X
} from "lucide-react";

// Portfolio Data
const portfolioData = {
  name: "Sreekanth Netha Thatikonda",
  title: "Hydraulic Systems Engineer",
  tagline: "Designing the future of Mobile Hydraulic Machines",
  email: "sthatiko@asu.edu",
  location: "Kansas, United States",
  linkedin: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/",
  about: `I am a passionate Mechanical and Aerospace Engineering graduate from Arizona State University. My fascination with engineering started during my undergraduate studies, where I developed a keen interest in data science through a project involving fluid conveyance negotiating in different mediums and analyzing the effects using multiple software tools. This experience ignited my passion for design, architecture, and data analysis.

I have honed my skills in various programming languages such as Python, R, and MATLAB, along with proficiency in design, simulation, and system tools. My professional experience includes working as a Hydraulics Systems Engineer at CNH Industrial, where I have been involved in the design, development, and detailing of hydraulic and pneumatic components and systems for skid steers and compact track loaders.

I am eager to leverage my engineering expertise to further my professional growth. I am excited to take on new challenges, implement innovative solutions, and contribute meaningfully to a dynamic team.`,
  education: [
    {
      institution: "Arizona State University",
      degree: "Master of Science in Mechanical and Aerospace Engineering",
      gpa: "GPA: 3.8/4.0",
      period: "January 2022 - December 2023",
      location: "Arizona, United States",
      courses: ["Design", "System Modelling", "Control Systems", "Machine Learning", "Vehicle Dynamics", "Data Visualization"]
    },
    {
      institution: "Rajasthan Technical University",
      degree: "Bachelor of Technology in Aeronautical Engineering",
      period: "August 2017 - July 2021",
      location: "Rajasthan, India",
      courses: ["Design Modelling", "Fluid Mechanics", "Aircraft Systems", "Computer Programming", "Aerodynamics", "Aircraft Structures"]
    },
    {
      institution: "School of Aeronautics",
      degree: "Bachelor of Science in Aircraft Maintenance Engineering - Avionics",
      period: "August 2017 - Dec 2020",
      location: "Rajasthan, India",
      courses: ["Electronics Module 5", "Materials and Hardware", "Aircraft Systems", "Digital Techniques", "Propulsion", "Maintenance Practices"]
    }
  ],
  experience: [
    {
      company: "CNH Industrial",
      role: "Hydraulic Systems Engineer",
      period: "Aug 2024 - Present",
      type: "Full-time",
      location: "Kansas, United States",
      highlights: [
        "Working on design, development, and detailing of Hydraulic and pneumatic components and systems for Skid Steers and Compact Track Loaders.",
        "Generate innovative SSL/CTL hydraulic system design for CPM and Next Gen to enhance vehicle performance, customer value, and cost reduction.",
        "Creating engineering specifications, work closely with suppliers, and adhere to engineering standards and CNHi GPD processes.",
        "Experience working with Creo, TeamCenter, Automation Studios, AmeSim software's to develop hydraulic system designs, layouts, modelling, and simulations."
      ]
    },
    {
      company: "Arizona State University",
      role: "Teaching Assistant",
      period: "June 2022 - July 2023",
      type: "Part-time",
      location: "Arizona, United States",
      highlights: [
        "Working as an Assistant Professor for Physics Lecture, Laboratory and played a pivotal role in instructing engineering and medical students.",
        "TA for Engineering Mechanics I: Statics and Dynamics",
        "Teaching students and grading exams for the concepts of Force systems, resultants, equilibrium using MATLAB."
      ]
    },
    {
      company: "School of Aeronautics",
      role: "Control Systems Engineer",
      period: "Jan 2021 - Dec 2021",
      type: "Full-time",
      location: "Rajasthan, India",
      highlights: [
        "Compliance with GD&T specifications, Designing, V&V testing and verification of mechanical and electrical systems using CAD Software's.",
        "Work Closely with the mechanical design and manufacturing team to develop and modify parts for gear drives.",
        "Performed inspections, diagnostics, and repair activities for mechanical and electrical designs."
      ]
    },
    {
      company: "Hindustan Aeronautics Ltd.",
      role: "Mechanical Design Engineer - Intern",
      period: "Jan 2019 - Dec 2019",
      type: "Internship",
      location: "Bangalore, India",
      highlights: [
        "Designed and Manufactured ALH DHRUV, CHETAK vehicle components of Helicopters according to EASA DGCA CAR PART 121 and 145 regulations.",
        "Designing and testing to validate structural designs of aircraft structures and FEA analysis via CAD software's.",
        "Expertly disassembled, inspected, repaired, and reassembled Auxiliary Power Units and airframe components."
      ]
    }
  ],
  projects: [
    {
      title: "Adaptive Powertrain System Design",
      description: "Advanced adaptive powertrain system using Python, Simulink, and MATLAB, with custom hardware interfaces.",
      tags: ["Python", "Simulink", "MATLAB", "Powertrain"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    },
    {
      title: "Steer-by-Wire System Design",
      description: "SBW system model with advanced control techniques and co-simulation with CARSIM.",
      tags: ["Control Systems", "CARSIM", "Simulation"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    },
    {
      title: "Design Simulations",
      description: "Geospatial data analysis from wind turbines using Python and MATLAB.",
      tags: ["Python", "MATLAB", "Data Analysis"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    },
    {
      title: "Analyzing HVAC Designs",
      description: "HVAC analysis using AutoCAD, Ansys Fluent for heat transfer efficiency.",
      tags: ["ANSYS", "CFD", "HVAC"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    },
    {
      title: "Power Optimization via Feedforward",
      description: "HVAC analysis using AutoCAD, Ansys Fluent for heat transfer efficiency.",
      tags: ["PID", "Optimization", "Control"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    },
    {
      title: "Fluidic Thrust Vector Control",
      description: "Developed fluidic thrust vector control technology achieving 12.4-degree deflection using ANSYS, CFX, CATIA, and SolidWorks.",
      tags: ["ANSYS", "CFX", "CATIA", "SolidWorks"],
      link: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/details/projects/"
    }
  ],
  skills: {
    languages: ["Python", "MATLAB", "R", "HTML5", "CSS3", "JavaScript"],
    design: ["Creo", "Simulink", "AutoCAD", "DS", "Fusion 360", "ANSYS", "Automation Studio", "AmeSim"],
    databases: ["PTC Windchill", "Siemens Teamcenter"],
    libraries: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "SciPy", "TensorFlow", "PyTorch"],
    tools: ["Salesforce", "Git", "Jupyter", "Slack", "Tableau", "Power BI", "PyCharm", "VS Code", "Excel"]
  }
};

// Background Images - Hydraulic Equipment Theme
const HYDRAULIC_BG = "https://customer-assets.emergentagent.com/job_sreekanth-portfolio/artifacts/tsp1w9kd_unnamed.jpg";
const HERO_BG = HYDRAULIC_BG;
const EXPERIENCE_BG = HYDRAULIC_BG;
const WIREFRAME_BG = HYDRAULIC_BG;

// Hero Schematic without title (for background overlay)
const HeroSchematicOverlay = ({ scrollProgress = 0 }) => {
  const flowOffset = 200 - (scrollProgress * 200);
  
  return (
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#12d640" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="heroGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Labels only - no title */}
      <text x="60" y="360" fill="#666" fontSize="9" fontFamily="Space Mono">RESERVOIR</text>
      <text x="55" y="250" fill="#666" fontSize="9" fontFamily="Space Mono">PUMP</text>
      <text x="200" y="140" fill="#666" fontSize="9" fontFamily="Space Mono">CONTROL VALVE</text>
      <text x="380" y="95" fill="#666" fontSize="9" fontFamily="Space Mono">LIFT CYL</text>
      <text x="380" y="275" fill="#666" fontSize="9" fontFamily="Space Mono">TILT CYL</text>
      
      {/* Hydraulic Reservoir */}
      <rect x="40" y="300" width="80" height="50" fill="none" stroke="#12d640" strokeWidth="2" rx="4" />
      <line x1="50" y1="310" x2="110" y2="310" stroke="#12d640" strokeWidth="1" opacity="0.5" />
      <rect x="55" y="315" width="50" height="30" fill="#12d640" opacity="0.2" />
      
      {/* Hydraulic Pump - static */}
      <g>
        <circle cx="80" cy="230" r="25" fill="none" stroke="#12d640" strokeWidth="2" />
        <polygon points="80,210 95,240 65,240" fill="none" stroke="#12d640" strokeWidth="2" />
        <circle cx="80" cy="230" r="5" fill="#12d640" />
      </g>
      
      {/* Pump to Reservoir */}
      <path d="M80 255 L80 300" fill="none" stroke="#00d4ff" strokeWidth="3" strokeDasharray="8,4" opacity="0.6" />
      
      {/* Pressure Line - Pump to Control Valve */}
      <path 
        d="M105 230 L150 230 L150 180 L200 180" 
        fill="none" stroke="url(#heroGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset} filter="url(#heroGlow)"
      />
      
      {/* Control Valve */}
      <rect x="200" y="150" width="100" height="60" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="210" y="165" width="80" height="30" fill="#12d640" opacity="0.15" className="valve-animate" />
      <line x1="220" y1="180" x2="280" y2="180" stroke="#12d640" strokeWidth="2" />
      
      {/* Valve Ports */}
      <circle cx="220" cy="150" r="4" fill="#12d640" />
      <circle cx="250" cy="150" r="4" fill="#12d640" />
      <circle cx="280" cy="150" r="4" fill="#12d640" />
      <circle cx="220" cy="210" r="4" fill="#00d4ff" />
      <circle cx="280" cy="210" r="4" fill="#00d4ff" />
      
      {/* Valve to Lift Cylinder */}
      <path d="M280 150 L280 115 L360 115" fill="none" stroke="url(#heroGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset * 0.8} filter="url(#heroGlow)" />
      
      {/* Lift Cylinder */}
      <rect x="360" y="100" width="90" height="35" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="107" width="40" height="21" fill="#12d640" opacity="0.3" className="cylinder-animate" />
      <rect x="405" y="112" width="50" height="11" fill="none" stroke="#12d640" strokeWidth="2" />
      <circle cx="455" cy="117" r="6" fill="#12d640" opacity="0.5" />
      
      {/* Valve to Tilt Cylinder */}
      <path d="M250 210 L250 255 L360 255" fill="none" stroke="url(#heroGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset * 0.6} filter="url(#heroGlow)" />
      
      {/* Tilt Cylinder */}
      <rect x="360" y="240" width="90" height="35" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="247" width="35" height="21" fill="#12d640" opacity="0.3" className="cylinder-animate" style={{animationDelay: '0.5s'}} />
      <rect x="400" y="252" width="55" height="11" fill="none" stroke="#12d640" strokeWidth="2" />
      <circle cx="455" cy="257" r="6" fill="#12d640" opacity="0.5" />
      
      {/* Return Lines */}
      <path d="M220 210 L220 340 L120 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.6" />
      <path d="M365 135 L340 135 L340 340 L120 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
      <path d="M365 275 L340 275 L340 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
      
      {/* Flow Indicators */}
      <circle cx="130" cy="230" r="3" fill="#12d640" className="glow-animation" />
      <circle cx="175" cy="180" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.3s'}} />
      <circle cx="280" cy="130" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.5s'}} />
      <circle cx="320" cy="115" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.7s'}} />
      
      {/* Pressure Gauge - needle rotates inside circle */}
      <g>
        <circle cx="170" cy="200" r="15" fill="none" stroke="#12d640" strokeWidth="1.5" />
        <text x="164" y="204" fill="#12d640" fontSize="8" fontFamily="Space Mono">PSI</text>
        <g className="gauge-needle" style={{ transformOrigin: '170px 200px' }}>
          <line x1="170" y1="200" x2="170" y2="188" stroke="#12d640" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
};

// SSL/CTL Hydraulic Schematic
const SSLCTLSchematic = ({ scrollProgress = 0 }) => {
  const flowOffset = 200 - (scrollProgress * 200);
  
  return (
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <defs>
        <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#12d640" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Title */}
      <text x="250" y="25" fill="#12d640" fontSize="14" fontFamily="Space Mono" textAnchor="middle" fontWeight="bold">SSL/CTL HYDRAULIC SYSTEM</text>
      
      {/* Labels */}
      <text x="60" y="360" fill="#666" fontSize="9" fontFamily="Space Mono">RESERVOIR</text>
      <text x="55" y="250" fill="#666" fontSize="9" fontFamily="Space Mono">PUMP</text>
      <text x="200" y="140" fill="#666" fontSize="9" fontFamily="Space Mono">CONTROL VALVE</text>
      <text x="380" y="95" fill="#666" fontSize="9" fontFamily="Space Mono">LIFT CYL</text>
      <text x="380" y="275" fill="#666" fontSize="9" fontFamily="Space Mono">TILT CYL</text>
      
      {/* Hydraulic Reservoir */}
      <rect x="40" y="300" width="80" height="50" fill="none" stroke="#12d640" strokeWidth="2" rx="4" />
      <line x1="50" y1="310" x2="110" y2="310" stroke="#12d640" strokeWidth="1" opacity="0.5" />
      <rect x="55" y="315" width="50" height="30" fill="#12d640" opacity="0.2" />
      
      {/* Hydraulic Pump - static */}
      <g>
        <circle cx="80" cy="230" r="25" fill="none" stroke="#12d640" strokeWidth="2" />
        <polygon points="80,210 95,240 65,240" fill="none" stroke="#12d640" strokeWidth="2" />
        <circle cx="80" cy="230" r="5" fill="#12d640" />
      </g>
      
      {/* Pump to Reservoir */}
      <path d="M80 255 L80 300" fill="none" stroke="#00d4ff" strokeWidth="3" strokeDasharray="8,4" opacity="0.6" />
      
      {/* Pressure Line - Pump to Control Valve */}
      <path 
        d="M105 230 L150 230 L150 180 L200 180" 
        fill="none" stroke="url(#pressureGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset} filter="url(#glow)"
      />
      
      {/* Control Valve */}
      <rect x="200" y="150" width="100" height="60" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="210" y="165" width="80" height="30" fill="#12d640" opacity="0.15" className="valve-animate" />
      <line x1="220" y1="180" x2="280" y2="180" stroke="#12d640" strokeWidth="2" />
      
      {/* Valve Ports */}
      <circle cx="220" cy="150" r="4" fill="#12d640" />
      <circle cx="250" cy="150" r="4" fill="#12d640" />
      <circle cx="280" cy="150" r="4" fill="#12d640" />
      <circle cx="220" cy="210" r="4" fill="#00d4ff" />
      <circle cx="280" cy="210" r="4" fill="#00d4ff" />
      
      {/* Valve to Lift Cylinder */}
      <path d="M280 150 L280 115 L360 115" fill="none" stroke="url(#pressureGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset * 0.8} filter="url(#glow)" />
      
      {/* Lift Cylinder */}
      <rect x="360" y="100" width="90" height="35" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="107" width="40" height="21" fill="#12d640" opacity="0.3" className="cylinder-animate" />
      <rect x="405" y="112" width="50" height="11" fill="none" stroke="#12d640" strokeWidth="2" />
      <circle cx="455" cy="117" r="6" fill="#12d640" opacity="0.5" />
      
      {/* Valve to Tilt Cylinder */}
      <path d="M250 210 L250 255 L360 255" fill="none" stroke="url(#pressureGradient)" strokeWidth="3"
        strokeDasharray="20,10" strokeDashoffset={flowOffset * 0.6} filter="url(#glow)" />
      
      {/* Tilt Cylinder */}
      <rect x="360" y="240" width="90" height="35" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="247" width="35" height="21" fill="#12d640" opacity="0.3" className="cylinder-animate" style={{animationDelay: '0.5s'}} />
      <rect x="400" y="252" width="55" height="11" fill="none" stroke="#12d640" strokeWidth="2" />
      <circle cx="455" cy="257" r="6" fill="#12d640" opacity="0.5" />
      
      {/* Return Lines */}
      <path d="M220 210 L220 340 L120 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.6" />
      <path d="M365 135 L340 135 L340 340 L120 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
      <path d="M365 275 L340 275 L340 340" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
      
      {/* Flow Indicators */}
      <circle cx="130" cy="230" r="3" fill="#12d640" className="glow-animation" />
      <circle cx="175" cy="180" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.3s'}} />
      <circle cx="280" cy="130" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.5s'}} />
      <circle cx="320" cy="115" r="3" fill="#12d640" className="glow-animation" style={{animationDelay: '0.7s'}} />
      
      {/* Pressure Gauge - needle rotates inside circle */}
      <g>
        <circle cx="170" cy="200" r="15" fill="none" stroke="#12d640" strokeWidth="1.5" />
        <text x="164" y="204" fill="#12d640" fontSize="8" fontFamily="Space Mono">PSI</text>
        <g className="gauge-needle" style={{ transformOrigin: '170px 200px' }}>
          <line x1="170" y1="200" x2="170" y2="188" stroke="#12d640" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
};

// Wheel Loader Hydraulic Schematic - Clean Layout
const WheelLoaderSchematic = ({ scrollProgress = 0 }) => {
  const flowOffset = 200 - (scrollProgress * 200);
  
  return (
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <defs>
        <linearGradient id="wlPressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#12d640" />
        </linearGradient>
        <filter id="wlGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Title */}
      <text x="250" y="25" fill="#00d4ff" fontSize="14" fontFamily="Space Mono" textAnchor="middle" fontWeight="bold">WHEEL LOADER HYDRAULIC SYSTEM</text>
      
      {/* Labels */}
      <text x="35" y="335" fill="#666" fontSize="8" fontFamily="Space Mono">RESERVOIR</text>
      <text x="35" y="235" fill="#666" fontSize="8" fontFamily="Space Mono">TANDEM PUMP</text>
      <text x="170" y="95" fill="#666" fontSize="8" fontFamily="Space Mono">LOADER VALVE</text>
      <text x="170" y="195" fill="#666" fontSize="8" fontFamily="Space Mono">STEERING VALVE</text>
      <text x="380" y="85" fill="#666" fontSize="8" fontFamily="Space Mono">BOOM CYL</text>
      <text x="380" y="145" fill="#666" fontSize="8" fontFamily="Space Mono">BUCKET CYL</text>
      <text x="380" y="245" fill="#666" fontSize="8" fontFamily="Space Mono">STEER CYL</text>
      
      {/* Reservoir - Bottom Left */}
      <rect x="30" y="290" width="70" height="40" fill="none" stroke="#12d640" strokeWidth="2" rx="4" />
      <line x1="40" y1="300" x2="90" y2="300" stroke="#12d640" strokeWidth="1" opacity="0.5" />
      <rect x="45" y="305" width="40" height="20" fill="#12d640" opacity="0.2" />
      
      {/* Tandem Pump - Above Reservoir */}
      <rect x="30" y="200" width="70" height="45" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <circle cx="50" cy="222" r="12" fill="none" stroke="#12d640" strokeWidth="1.5" />
      <circle cx="80" cy="222" r="12" fill="none" stroke="#12d640" strokeWidth="1.5" />
      <polygon points="50,214 56,228 44,228" fill="none" stroke="#12d640" strokeWidth="1" />
      <polygon points="80,214 86,228 74,228" fill="none" stroke="#12d640" strokeWidth="1" />
      
      {/* Suction Line - Reservoir to Pump */}
      <path d="M65 290 L65 245" fill="none" stroke="#00d4ff" strokeWidth="2" strokeDasharray="6,3" opacity="0.5" />
      
      {/* Loader Control Valve - Top Center */}
      <rect x="160" y="100" width="80" height="45" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="170" y="115" width="60" height="20" fill="#12d640" opacity="0.15" className="valve-animate" />
      <circle cx="175" cy="100" r="3" fill="#12d640" />
      <circle cx="200" cy="100" r="3" fill="#12d640" />
      <circle cx="225" cy="100" r="3" fill="#12d640" />
      
      {/* Steering Valve - Middle Center */}
      <rect x="160" y="200" width="80" height="45" fill="none" stroke="#00d4ff" strokeWidth="2" rx="2" />
      <rect x="170" y="215" width="60" height="20" fill="#00d4ff" opacity="0.15" className="valve-animate" style={{animationDelay: '0.3s'}} />
      <circle cx="175" cy="200" r="3" fill="#00d4ff" />
      <circle cx="225" cy="200" r="3" fill="#00d4ff" />
      
      {/* Boom Cylinder - Top Right */}
      <rect x="360" y="65" width="100" height="30" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="71" width="45" height="18" fill="#12d640" opacity="0.3" className="cylinder-animate" />
      <rect x="410" y="75" width="55" height="10" fill="none" stroke="#12d640" strokeWidth="2" />
      
      {/* Bucket Cylinder - Middle Right */}
      <rect x="360" y="125" width="100" height="30" fill="none" stroke="#12d640" strokeWidth="2" rx="2" />
      <rect x="365" y="131" width="40" height="18" fill="#12d640" opacity="0.3" className="cylinder-animate" style={{animationDelay: '0.4s'}} />
      <rect x="405" y="135" width="60" height="10" fill="none" stroke="#12d640" strokeWidth="2" />
      
      {/* Steering Cylinder - Bottom Right */}
      <rect x="360" y="225" width="100" height="30" fill="none" stroke="#00d4ff" strokeWidth="2" rx="2" />
      <rect x="365" y="231" width="35" height="18" fill="#00d4ff" opacity="0.3" className="cylinder-animate" style={{animationDelay: '0.6s'}} />
      <rect x="400" y="235" width="65" height="10" fill="none" stroke="#00d4ff" strokeWidth="2" />
      
      {/* PRESSURE LINES - Non-overlapping */}
      
      {/* Pump Output 1 to Loader Valve */}
      <path d="M100 215 L130 215 L130 122 L160 122" fill="none" stroke="url(#wlPressureGradient)" strokeWidth="2.5"
        strokeDasharray="15,8" strokeDashoffset={flowOffset} filter="url(#wlGlow)" />
      
      {/* Pump Output 2 to Steering Valve */}
      <path d="M100 230 L140 230 L140 222 L160 222" fill="none" stroke="url(#wlPressureGradient)" strokeWidth="2.5"
        strokeDasharray="15,8" strokeDashoffset={flowOffset * 0.9} filter="url(#wlGlow)" />
      
      {/* Loader Valve to Boom Cylinder */}
      <path d="M240 115 L280 115 L280 80 L360 80" fill="none" stroke="#12d640" strokeWidth="2"
        strokeDasharray="12,6" strokeDashoffset={flowOffset * 0.7} filter="url(#wlGlow)" />
      
      {/* Loader Valve to Bucket Cylinder */}
      <path d="M240 130 L300 130 L300 140 L360 140" fill="none" stroke="#12d640" strokeWidth="2"
        strokeDasharray="12,6" strokeDashoffset={flowOffset * 0.6} filter="url(#wlGlow)" />
      
      {/* Steering Valve to Steering Cylinder */}
      <path d="M240 222 L320 222 L320 240 L360 240" fill="none" stroke="#00d4ff" strokeWidth="2"
        strokeDasharray="12,6" strokeDashoffset={flowOffset * 0.5} filter="url(#wlGlow)" />
      
      {/* RETURN LINES - Separate paths, no overlap */}
      
      {/* Loader Valve Return */}
      <path d="M160 145 L120 145 L120 310 L100 310" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4" />
      
      {/* Steering Valve Return */}
      <path d="M160 245 L110 245 L110 320 L100 320" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.4" />
      
      {/* Flow Indicators */}
      <circle cx="115" cy="215" r="2.5" fill="#12d640" className="glow-animation" />
      <circle cx="200" cy="122" r="2.5" fill="#12d640" className="glow-animation" style={{animationDelay: '0.2s'}} />
      <circle cx="260" cy="115" r="2.5" fill="#12d640" className="glow-animation" style={{animationDelay: '0.3s'}} />
      <circle cx="200" cy="222" r="2.5" fill="#00d4ff" className="glow-animation" style={{animationDelay: '0.4s'}} />
      <circle cx="280" cy="222" r="2.5" fill="#00d4ff" className="glow-animation" style={{animationDelay: '0.5s'}} />
    </svg>
  );
};

// Combined Schematics Component with tabs
const HydraulicSchematics = ({ scrollProgress = 0 }) => {
  const [activeTab, setActiveTab] = useState('ssl');
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('ssl')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded transition-all ${
            activeTab === 'ssl' 
              ? 'bg-[#12d640] text-black' 
              : 'border border-[#12d640]/50 text-[#12d640] hover:bg-[#12d640]/10'
          }`}
          data-testid="tab-ssl"
        >
          SSL/CTL
        </button>
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded transition-all ${
            activeTab === 'wheel' 
              ? 'bg-[#00d4ff] text-black' 
              : 'border border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10'
          }`}
          data-testid="tab-wheel-loader"
        >
          Wheel Loader
        </button>
      </div>
      
      {/* Schematic Content */}
      <div className="flex-1">
        {activeTab === 'ssl' ? (
          <SSLCTLSchematic scrollProgress={scrollProgress} />
        ) : (
          <WheelLoaderSchematic scrollProgress={scrollProgress} />
        )}
      </div>
    </div>
  );
};

// Scroll-Triggered Flow Animation Component
const ScrollFlowAnimation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const flowProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const unsubscribe = flowProgress.on("change", (v) => setProgress(v));
    return () => unsubscribe();
  }, [flowProgress]);

  return (
    <div ref={ref} className="absolute inset-0 z-10 pointer-events-none opacity-30">
      <HeroSchematicOverlay scrollProgress={progress} />
    </div>
  );
};

// Navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Education', 'Experience', 'Projects', 'Skills', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#12d640]/20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#hero"
            className="font-heading text-2xl font-semibold tracking-wider gradient-text"
            whileHover={{ scale: 1.05 }}
            data-testid="nav-logo"
          >
            SK
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-mono text-sm text-[#aaa] hover:text-[#12d640] transition-colors uppercase tracking-widest"
                whileHover={{ y: -2 }}
                data-testid={`nav-${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
            {/* Resume Link - Opens in new tab */}
            <motion.a
              href="/assets/resume/RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-[#12d640] hover:text-[#00ff55] transition-colors uppercase tracking-widest border border-[#12d640]/50 px-3 py-1 rounded hover:border-[#12d640] hover:bg-[#12d640]/10"
              whileHover={{ y: -2, scale: 1.05 }}
              data-testid="nav-resume"
            >
              Resume
            </motion.a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-md border-t border-[#12d640]/20"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block font-mono text-sm text-[#aaa] hover:text-[#12d640] uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-${item.toLowerCase()}`}
              >
                {item}
              </a>
            ))}
            {/* Resume Link for Mobile */}
            <a
              href="/assets/resume/RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-mono text-sm text-[#12d640] uppercase tracking-widest border border-[#12d640]/50 px-3 py-2 rounded text-center hover:bg-[#12d640]/10"
              onClick={() => setIsOpen(false)}
              data-testid="mobile-nav-resume"
            >
              Resume
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background - Cinematic CTL Image */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="CNH Compact Track Loader - Cinematic"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
      </motion.div>

      {/* Schematic Overlay */}
      <ScrollFlowAnimation />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-mono text-sm tracking-[0.3em] mb-4 uppercase gradient-text">
            Hydraulic Systems Engineer
          </p>
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-medium uppercase tracking-tight text-white mb-6">
            {portfolioData.name.split(' ').map((word, i) => (
              <span key={i} className="block">
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={i === 0 ? "gradient-text" : ""}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-[#aaa] text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-light"
          >
            {portfolioData.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 font-mono text-sm uppercase tracking-widest font-medium text-black rounded-lg"
              style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="hero-cta-contact"
            >
              <Mail size={16} />
              Get in Touch
            </motion.a>
            <motion.a
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#12d640] text-[#12d640] px-8 py-3 font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-[#12d640]/10 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="hero-cta-linkedin"
            >
              <Linkedin size={16} />
              LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[#12d640]"
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle, align = "left" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-mono text-xs tracking-[0.3em] uppercase mb-2 gradient-text"
    >
      {subtitle}
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase tracking-tight text-white"
    >
      {title}
    </motion.h2>
  </div>
);

// About Section
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const [flowProgress, setFlowProgress] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => setFlowProgress(v));
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 sm:py-32 relative"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader title="About Me" subtitle="The Engineer" />
            <div className="space-y-6 text-[#aaa] leading-relaxed">
              {portfolioData.about.split('\n\n').map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-4"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 mt-10"
            >
              {[
                { value: "3.8", label: "GPA" },
                { value: "4+", label: "Years Exp" },
                { value: "6+", label: "Projects" }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-4 text-center">
                  <p className="font-heading text-3xl font-semibold gradient-text">{stat.value}</p>
                  <p className="font-mono text-xs text-[#666] uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card p-6" style={{ minHeight: '450px' }}>
              <HydraulicSchematics scrollProgress={flowProgress} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Education Section
const EducationSection = () => {
  return (
    <section
      id="education"
      className="py-24 sm:py-32 relative overflow-hidden"
      data-testid="education-section"
    >
      <div className="bg-grid" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader title="Education" subtitle="Academic Journey" align="center" />
        <div className="space-y-8">
          {portfolioData.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass-card p-6 sm:p-8"
              data-testid={`education-card-${index}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(18, 214, 64, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)' }}>
                    <GraduationCap className="text-[#12d640]" size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl font-semibold uppercase tracking-tight gradient-text mb-1">
                    {edu.institution}
                  </h3>
                  <p className="text-white font-medium mb-2">
                    {edu.degree}
                    {edu.gpa && <span className="text-[#00d4ff] ml-2">{edu.gpa}</span>}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#aaa]">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {edu.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {edu.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.courses.map((course, i) => (
                      <span key={i} className="skill-pill">{course}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section with Animated Timeline Line
const ExperienceSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const lineHeight = useSpring(useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30
  });

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 sm:py-32 relative overflow-hidden"
      data-testid="experience-section"
    >
      {/* Background - Wireframe Excavator */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <img
          src={WIREFRAME_BG}
          alt="Wireframe Excavator"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader title="Experience" subtitle="Professional Journey" />

        <div className="relative">
          {/* Static Background Line - passes through center of dots */}
          <div className="absolute left-[9px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-[#333] transform lg:-translate-x-1/2" />
          
          {/* Animated Progress Line - passes through center of dots */}
          <motion.div 
            className="absolute left-[9px] lg:left-1/2 top-0 w-[2px] transform lg:-translate-x-1/2 origin-top"
            style={{ 
              height: lineHeight,
              background: 'linear-gradient(180deg, #12d640 0%, #00d4ff 100%)',
              boxShadow: '0 0 10px #12d640, 0 0 20px #12d640'
            }}
          />

          <div className="space-y-12">
            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative grid lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:text-right' : ''}`}
                data-testid={`experience-card-${index}`}
              >
                {/* Timeline Node - line passes through center */}
                <motion.div 
                  className="absolute left-0 lg:left-1/2 w-5 h-5 rounded-full transform lg:-translate-x-1/2 top-2 z-10"
                  style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: "spring" }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: ['0 0 5px #12d640', '0 0 20px #12d640', '0 0 5px #12d640']
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </motion.div>

                <div className={`pl-10 lg:pl-0 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`glass-card p-6 sm:p-8 ${index % 2 === 1 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(18, 214, 64, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)' }}>
                        <Briefcase className="text-[#12d640]" size={20} />
                      </div>
                      <div className={index % 2 === 1 ? 'lg:text-right flex-1' : 'flex-1'}>
                        <h3 className="font-heading text-xl font-semibold uppercase tracking-tight gradient-text">
                          {exp.company}
                        </h3>
                        <p className="text-white text-sm">{exp.role}</p>
                      </div>
                    </div>

                    <div className={`flex flex-wrap gap-4 mb-4 text-sm text-[#aaa] ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {exp.period}
                      </span>
                      <span className="skill-pill">{exp.type}</span>
                    </div>

                    <ul className={`space-y-2 ${index % 2 === 1 ? 'lg:text-left' : ''}`}>
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-[#aaa] text-sm flex gap-2">
                          <span className="text-[#12d640] flex-shrink-0">&#8226;</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Projects Section
const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 sm:py-32 relative overflow-hidden" data-testid="projects-section">
      <div className="absolute inset-0 z-0">
        <img src={HYDRAULIC_BG} alt="Hydraulic Equipment" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-[#0a0a0a]/90" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader title="Projects" subtitle="Engineering Work" align="center" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group glass-card p-6 transition-all duration-300 block"
              data-testid={`project-card-${index}`}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(18, 214, 64, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)' }}>
                <Layers className="text-[#12d640]" size={24} />
              </div>
              <h3 className="font-heading text-xl font-semibold uppercase tracking-tight text-white mb-2 group-hover:text-[#12d640] transition-colors">
                {project.title}
              </h3>
              <p className="text-[#aaa] text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span key={i} className="skill-pill text-xs">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider gradient-text group-hover:gap-4 transition-all">
                View Project <ExternalLink size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// Skills Section
const SkillsSection = () => {
  const skillCategories = [
    { title: "Languages", icon: Code, skills: portfolioData.skills.languages },
    { title: "Design & Simulation", icon: Settings, skills: portfolioData.skills.design },
    { title: "Databases & PLM", icon: Cpu, skills: portfolioData.skills.databases },
    { title: "Libraries", icon: Layers, skills: portfolioData.skills.libraries },
    { title: "Tools", icon: Wrench, skills: portfolioData.skills.tools }
  ];

  return (
    <section id="skills" className="py-24 sm:py-32 relative overflow-hidden" data-testid="skills-section">
      <div className="absolute inset-0 z-0">
        <img src={HYDRAULIC_BG} alt="Hydraulic Equipment" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#0a0a0a]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader title="Skills" subtitle="Technical Expertise" align="center" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
              data-testid={`skills-category-${index}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(18, 214, 64, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)' }}>
                  <category.icon className="text-[#12d640]" size={20} />
                </div>
                <h3 className="font-heading text-lg font-semibold uppercase tracking-tight gradient-text">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="skill-pill"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <SectionHeader title="Get in Touch" subtitle="Let's Connect" align="center" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#aaa] text-lg mb-12"
          >
            Interested in discussing hydraulic systems, engineering projects, or potential collaborations? 
            I'm always open to connecting with fellow engineers and industry professionals.
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <motion.a
              href={`mailto:${portfolioData.email}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 group transition-all"
              data-testid="contact-email"
            >
              <Mail className="text-[#12d640] mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-mono text-xs text-[#666] uppercase tracking-wider mb-1">Email</p>
              <p className="text-white text-sm truncate">{portfolioData.email}</p>
            </motion.a>

            <motion.a
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 group transition-all"
              data-testid="contact-linkedin"
            >
              <Linkedin className="text-[#12d640] mx-auto mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="font-mono text-xs text-[#666] uppercase tracking-wider mb-1">LinkedIn</p>
              <p className="text-white text-sm">Connect with me</p>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
              data-testid="contact-location"
            >
              <MapPin className="text-[#12d640] mx-auto mb-3" size={28} />
              <p className="font-mono text-xs text-[#666] uppercase tracking-wider mb-1">Location</p>
              <p className="text-white text-sm">{portfolioData.location}</p>
            </motion.div>
          </div>

          <motion.a
            href={`mailto:${portfolioData.email}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-4 font-mono text-sm uppercase tracking-widest font-medium text-black rounded-lg"
            style={{ background: 'linear-gradient(135deg, #12d640 0%, #00d4ff 100%)' }}
            data-testid="contact-cta"
          >
            <Mail size={18} />
            Send Me a Message
          </motion.a>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-8 border-t border-[#12d640]/20" data-testid="footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-mono text-xs text-[#666]">
          &copy; 2022 {portfolioData.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#12d640] transition-colors" data-testid="footer-linkedin">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${portfolioData.email}`} className="text-[#666] hover:text-[#12d640] transition-colors" data-testid="footer-email">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
function App() {
  return (
    <div className="App bg-[#0a0a0a] min-h-screen">
      <div className="noise-overlay" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      <Navigation />
      
      <main>
        <HeroSection />
        <AboutSection />
        <div className="section-divider" />
        <EducationSection />
        <div className="section-divider" />
        <ExperienceSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
