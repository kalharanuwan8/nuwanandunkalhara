export const profile = {
  name: 'Nuwanandun Kalhara',
  email: 'kalharanuwan8@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nuwanandun-kalhara-71858a2a6',
  github: 'https://github.com/kalharanuwan8',
  cv: '/Nuwanandun-Kalhara-CV.pdf',
};

export type Category = 'All' | 'Full-stack' | 'AI & research' | 'Client work';

export type Project = {
  id: string;
  name: string;
  category: Category;
  type: string;
  summary: string;
  description: string;
  features: string[];
  stack: string[];
  accent: string;
  mark: string;
  github?: string;
};

export const projects: Project[] = [
  {
    id: 'brieflyai',
    name: 'BrieflyAi',
    category: 'AI & research',
    type: 'Agentic AI · Open Source',
    summary: 'Turn messy meeting conversations into structured business execution.',
    description: 'An enterprise-grade meeting intelligence system and compound workflow agent. Powered by local LLMs (Ollama Qwen 2.5) with deterministic guardrails, reflection loops, and human-in-the-loop triage to extract verified decisions, tasks, and personalized email digests with zero cloud data leakage.',
    features: [
      'Extracts decisions with rationales, action items, owners, and deadlines',
      'Dynamic speaker & roster validation with human-in-the-loop triage for ambiguous data',
      'Automated team recap generation & personalized attendee follow-up email drafts',
      'Multi-platform task dispatch ready for Linear, Jira, Asana, and Slack',
      'Executive action tracking dashboard backed by local SQLite with WAL mode'
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Ollama', 'Zod', 'SQLite', 'Tailwind CSS'],
    accent: 'violet',
    mark: 'BA',
    github: 'https://github.com/kalharanuwan8/BrieflyAi'
  },
  {
    id: 'citizensafe',
    name: 'CitizenSafe',
    category: 'Full-stack',
    type: 'Public project · Open Source',
    summary: 'A connected community. A faster response.',
    description: 'A full-stack disaster monitoring and community reporting platform that helps users report incidents and understand nearby hazards.',
    features: ['Geolocated incident reports with image uploads', 'Interactive map for nearby disaster visibility', 'Real-time alerts and community-based verification'],
    stack: ['React', 'Node.js', 'MongoDB', 'Google Maps API', 'AWS', 'Firebase', 'GitHub Actions'],
    accent: 'lime',
    mark: 'CS',
    github: 'https://github.com/kalharanuwan8/Citizensafe'
  },
  {
    id: 'tradexai',
    name: 'TradexAI',
    category: 'AI & research',
    type: 'Public project · AI System',
    summary: 'Market signals, with another layer of intelligence.',
    description: 'A trading intelligence platform combining Binance data, sentiment analysis, and Gemini AI in a tri-layer signal engine.',
    features: ['Market data and sentiment analysis integration', 'TradingView chart integration', 'Socket.IO chatbot and CI/CD deployment on Azure'],
    stack: ['MERN', 'Gemini AI', 'Binance API', 'Socket.IO', 'Docker', 'Azure'],
    accent: 'violet',
    mark: 'TX',
    github: 'https://github.com/kalharanuwan8/TradexAI'
  },
  {
    id: 'citizengate',
    name: 'CitizenGate',
    category: 'Full-stack',
    type: 'Web application',
    summary: 'Government services, brought together.',
    description: 'A centralized government services booking platform that brings authentication, documents, and appointments into one workflow.',
    features: ['Secure authentication using Clerk', 'Document management', 'Government service appointment scheduling'],
    stack: ['NestJS', 'PostgreSQL', 'Supabase', 'React', 'TypeScript', 'Clerk', 'Docker'],
    accent: 'blue',
    mark: 'CG'
  },
  {
    id: 'adaptive-learning',
    name: 'Adaptive Learning',
    category: 'AI & research',
    type: 'Final-year research · Public Repo',
    summary: 'Learning that responds to the learner.',
    description: 'An AI-powered adaptive learning system for children with ADHD. Multimodal machine learning detects distraction in real time and triggers gamified interventions to re-engage learners.',
    features: ['Multimodal attention monitoring research', 'Real-time distraction detection', 'Adaptive, gamified learning interventions'],
    stack: ['Python', 'React', 'Node.js', 'FastAPI', 'WebSockets', 'SQL', 'AWS'],
    accent: 'violet',
    mark: 'AL',
    github: 'https://github.com/kalharanuwan8/DistractionDetection'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Operations',
    category: 'Client work',
    type: 'Client project · Confidential',
    summary: 'From the first order to the daily report.',
    description: 'A full-stack restaurant billing and monitoring system with remotely accessible business analytics.',
    features: ['Restaurant billing and real-time sales tracking', 'Inventory management', 'Remote mobile access to analytics and reports'],
    stack: ['React', 'Node.js', 'Firebase', 'MongoDB Atlas'],
    accent: 'orange',
    mark: 'RO'
  },
  {
    id: 'bakery',
    name: 'Bakery Inventory',
    category: 'Client work',
    type: 'Client project · Confidential',
    summary: 'Keeping everyday operations in sync.',
    description: 'An inventory management system for bakery operations, covering stock visibility and reporting.',
    features: ['Stock level and product inventory tracking', 'Daily analytics reports', 'Role-based access control for staff'],
    stack: ['React', 'Node.js', 'MongoDB Atlas'],
    accent: 'lime',
    mark: 'BI'
  },
  {
    id: 'eshuttle',
    name: 'Eshuttle',
    category: 'Full-stack',
    type: 'Mobile & web',
    summary: 'A smarter way around campus.',
    description: 'A smart transportation management system to digitalize university shuttle operations.',
    features: ['Live shuttle tracking', 'Safety notifications', 'Real-time transportation analytics'],
    stack: ['Flutter', 'React', 'Firebase', 'Google Maps API', 'Stripe API'],
    accent: 'blue',
    mark: 'ES'
  },
  {
    id: 'cv-analyzer',
    name: 'CV Analyzer',
    category: 'AI & research',
    type: 'AI application · Open Source',
    summary: 'Making the next career step clearer.',
    description: 'An AI-powered system that analyzes resumes against job descriptions and provides personalized feedback.',
    features: ['Resume-to-job-description analysis', 'Skill gap feedback', 'Job match scoring'],
    stack: ['Python', 'FastAPI', 'TypeScript', 'NLP', 'Gemini'],
    accent: 'violet',
    mark: 'CV',
    github: 'https://github.com/kalharanuwan8/CVanalyzerbackend'
  },
  {
    id: 'budget-buddy',
    name: 'Budget Buddy',
    category: 'Full-stack',
    type: 'Desktop application · Contributor',
    summary: 'Know where your money goes.',
    description: 'Contributed to a personal finance desktop application with budget tracking and an interactive dashboard.',
    features: ['Income and expense tracking', 'Monthly budget management', 'Spending-pattern visualization'],
    stack: ['Java', 'Java Swing', 'JDBC', 'MySQL'],
    accent: 'orange',
    mark: 'BB'
  },
];

export const skillGroups = [
  { label: 'Interface', title: 'What people see.', skills: ['React', 'Next.js', 'TypeScript', 'Flutter', 'Tailwind CSS'], detail: 'Web interfaces and mobile applications that connect people to the systems behind them.' },
  { label: 'Systems', title: 'What makes it work.', skills: ['Node.js', 'Python', 'FastAPI', 'NestJS', 'Spring Boot'], detail: 'APIs, application logic, authentication, and the workflows that hold a product together.' },
  { label: 'Data', title: 'What connects it all.', skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'], detail: 'Relational and document databases for real-world application requirements.' },
  { label: 'Delivery', title: 'From code to cloud.', skills: ['AWS', 'Azure', 'Docker', 'GitHub Actions', 'CI/CD'], detail: 'Cloud deployment, containers, and automated delivery for web applications.' },
];
