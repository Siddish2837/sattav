/**
 * Resume text parser
 * Extracts structured data (skills, education, experience) from plain text
 */

const SKILL_KEYWORDS: string[] = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Bash", "Shell",
  // Web Frontend
  "React", "Vue", "Angular", "Next.js", "Nuxt", "Svelte", "HTML", "CSS",
  "Tailwind", "Bootstrap", "SASS", "SCSS", "jQuery", "Redux", "GraphQL",
  "WebSockets", "REST", "TypeScript",
  // Web Backend
  "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring", "Laravel",
  "Ruby on Rails", "ASP.NET", "NestJS",
  // Databases
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Elasticsearch",
  "Cassandra", "DynamoDB", "Firebase", "Supabase",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Ansible",
  "Jenkins", "GitHub Actions", "CI/CD", "Linux", "Nginx", "Apache",
  // Data & ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
  "scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau",
  "Power BI", "Data Analysis", "Data Visualization", "NLP", "Computer Vision",
  "Statistics", "MLOps",
  // Tools
  "Git", "GitHub", "GitLab", "Jira", "Figma", "Postman", "VS Code",
  "IntelliJ", "Webpack", "Vite", "Babel",
  // Soft/Domain
  "Agile", "Scrum", "REST APIs", "Microservices", "System Design",
  "Data Structures", "Algorithms", "OOP", "Functional Programming",
  "Test Driven Development", "TDD", "Unit Testing",
  // Security
  "Cybersecurity", "Networking", "Penetration Testing", "SIEM", "Cryptography",
  // Design
  "UI/UX", "Wireframing", "Prototyping", "User Research", "Figma",
  "Adobe XD", "Illustrator", "Photoshop", "Design Systems",
  // Mobile
  "React Native", "Flutter", "iOS", "Android", "Expo",
];

const EDUCATION_KEYWORDS = [
  "B.Tech", "B.E", "B.Sc", "B.Com", "BCA", "BE",
  "M.Tech", "M.Sc", "MBA", "MCA", "M.E",
  "PhD", "Ph.D", "Doctorate",
  "Bachelor", "Master", "Degree",
  "Computer Science", "Information Technology", "Electronics",
  "Electrical", "Mechanical", "Civil",
  "10th", "12th", "HSC", "SSC", "Intermediate",
];

const EXPERIENCE_PATTERNS = [
  /(\d+)\s*\+?\s*years?\s*of\s*experience/gi,
  /experience\s*[:\-]?\s*(\d+)\s*\+?\s*years?/gi,
  /(\d+)\s*\+?\s*years?\s*[\w\s]*experience/gi,
  /intern(?:ship)?/gi,
  /trainee/gi,
  /fresher/gi,
  /worked\s+at\s+([\w\s]+)/gi,
];

export interface ParsedResume {
  skills: string[];
  education: string[];
  experience: string[];
  summary: string;
  rawWordCount: number;
}

export function parseResumeText(text: string): ParsedResume {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  const upperText = normalizedText.toUpperCase();

  // Extract skills — case-insensitive whole-word match
  const foundSkills = new Set<string>();
  for (const skill of SKILL_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  }

  // Extract education mentions
  const foundEducation: string[] = [];
  for (const kw of EDUCATION_KEYWORDS) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalizedText)) {
      const lineWithKw = normalizedText
        .split("\n")
        .find((line) => regex.test(line));
      if (lineWithKw) {
        const cleaned = lineWithKw.replace(/\s+/g, " ").trim();
        if (cleaned.length > 2 && cleaned.length < 200) {
          foundEducation.push(cleaned);
        }
      }
    }
  }

  // Extract experience hints
  const experienceLines: string[] = [];
  for (const pattern of EXPERIENCE_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      for (const m of matches) {
        const cleaned = m.replace(/\s+/g, " ").trim();
        if (cleaned.length > 3 && !experienceLines.includes(cleaned)) {
          experienceLines.push(cleaned);
        }
      }
    }
  }

  // Pull lines that look like job titles or company names
  const lines = normalizedText.split("\n").map((l) => l.trim()).filter(Boolean);
  const jobTitlePatterns =
    /engineer|developer|analyst|designer|manager|lead|intern|consultant|architect|scientist|specialist/i;
  for (const line of lines) {
    if (
      jobTitlePatterns.test(line) &&
      line.length > 5 &&
      line.length < 120 &&
      !experienceLines.includes(line)
    ) {
      experienceLines.push(line);
      if (experienceLines.length >= 6) break;
    }
  }

  const uniqueEducation = [...new Set(foundEducation)].slice(0, 5);
  const uniqueExperience = [...new Set(experienceLines)].slice(0, 6);

  return {
    skills: [...foundSkills],
    education: uniqueEducation,
    experience: uniqueExperience,
    summary: normalizedText.slice(0, 300).replace(/\n/g, " ").trim(),
    rawWordCount: normalizedText.split(/\s+/).length,
  };
}
