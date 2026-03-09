import { createContext, useContext, useState, useEffect } from 'react';
import { getAllContent, trackVisitor } from '../services/api';

// Default/fallback portfolio data (shown while loading or if API fails)
const defaultPortfolioData = {
  name: "Sreekanth Netha Thatikonda",
  title: "Hydraulic Systems Engineer",
  tagline: "Designing the future of Mobile Hydraulic Machines",
  email: "sthatiko@asu.edu",
  location: "Kansas, United States",
  linkedin: "https://www.linkedin.com/in/sreekanth-netha-thatikonda/",
  about: "",
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: [],
    design: [],
    databases: [],
    libraries: [],
    tools: []
  }
};

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // Track visitor
        trackVisitor().catch(console.error);
        
        // Fetch all content
        const content = await getAllContent();
        
        // Transform API response to match component expectations
        const transformedData = {
          ...defaultPortfolioData,
          about: content.about?.text || defaultPortfolioData.about,
          education: content.education?.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            period: edu.period,
            location: edu.location,
            gpa: edu.gpa || "",
            courses: edu.courses ? edu.courses.split(',').map(c => c.trim()) : [],
            id: edu.id
          })) || [],
          experience: content.experience?.map(exp => ({
            company: exp.company,
            role: exp.title,
            period: exp.period,
            type: exp.type || "Full-time",
            location: exp.location,
            highlights: exp.description ? exp.description.split('\n').filter(h => h.trim()) : [],
            id: exp.id
          })) || [],
          projects: content.projects?.map(proj => ({
            title: proj.title,
            description: proj.description,
            link: proj.link,
            tags: proj.tags ? proj.tags.split(',').map(t => t.trim()) : [],
            image_url: proj.image_url,
            id: proj.id
          })) || [],
          skills: transformSkills(content.skills || [])
        };
        
        setPortfolioData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load portfolio content:', err);
        setError(err.message);
        setLoading(false);
        // Keep default data on error
      }
    }
    
    loadContent();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, loading, error, setPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Transform skills array from API to object format
function transformSkills(skillsArray) {
  const skillsObj = {
    languages: [],
    design: [],
    databases: [],
    libraries: [],
    tools: []
  };
  
  skillsArray.forEach(item => {
    const category = item.category?.toLowerCase() || '';
    const skills = item.skills ? item.skills.split(',').map(s => s.trim()) : [];
    
    if (category.includes('language')) {
      skillsObj.languages = skills;
    } else if (category.includes('design') || category.includes('simulation')) {
      skillsObj.design = skills;
    } else if (category.includes('database') || category.includes('plm')) {
      skillsObj.databases = skills;
    } else if (category.includes('librar')) {
      skillsObj.libraries = skills;
    } else if (category.includes('tool')) {
      skillsObj.tools = skills;
    }
  });
  
  return skillsObj;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
