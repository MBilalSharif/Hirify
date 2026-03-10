import type { FormData } from "./supabase";

export interface DemoTemplate {
  id: string;
  label: string;
  description: string;
  sections: string[];
  tips: string[];
  data: FormData;
}

export const demoTemplates: DemoTemplate[] = [
  {
    id: "software-engineer",
    label: "Software Engineer",
    description: "ATS-optimized template for full-stack developers with 3+ years of experience. Highlights technical skills, project impact, and professional growth.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Quantify your impact (e.g. 'improved load times by 40%')",
      "List technologies in your Skills section — ATS scanners match keywords",
      "Include links to GitHub / portfolio for technical roles",
    ],
    data: {
      personal: {
        fullName: "Alex Johnson",
        email: "alex.johnson@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/alexjohnson",
        portfolioUrl: "https://alexjohnson.dev",
      },
      experience: [
        {
          company: "TechCorp Inc.",
          role: "Full Stack Developer",
          duration: "Jan 2023 - Present",
          description:
            "Built and maintained RESTful APIs with Node.js and Express. Led migration of legacy jQuery frontend to React, improving load times by 40%. Implemented CI/CD pipelines with GitHub Actions.",
        },
        {
          company: "StartupXYZ",
          role: "Junior Developer",
          duration: "Jun 2021 - Dec 2022",
          description:
            "Developed responsive web applications using React and TypeScript. Collaborated with the design team to translate Figma mockups into pixel-perfect UI components. Wrote unit tests with Jest.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "B.Sc. Computer Science",
          institution: "University of California, Berkeley",
          startMonth: "August",
          startYear: "2017",
          endMonth: "May",
          endYear: "2021",
          grade: "3.7 GPA",
        },
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Git",
        "REST APIs",
      ],
      languages: ["English", "Spanish"],
      certifications: ["AWS Certified Cloud Practitioner"],
      projects: [
        {
          title: "E-Commerce Platform",
          description:
            "Full-stack online store with product catalog, cart, Stripe payments, and admin dashboard. Handles 500+ daily active users.",
          techUsed: "React, Node.js, PostgreSQL, Stripe, Docker",
        },
        {
          title: "Real-Time Chat App",
          description:
            "WebSocket-based messaging app with rooms, typing indicators, and message history. Deployed on AWS EC2.",
          techUsed: "React, Socket.io, Express, MongoDB",
        },
      ],
      bio: "Passionate full-stack developer with 3+ years of experience building scalable web applications. Strong background in React, Node.js, and cloud services.",
    },
  },
  {
    id: "fresh-graduate",
    label: "Fresh Graduate",
    description: "Designed for recent graduates with internships and academic projects. Emphasizes education, transferable skills, and eagerness to learn.",
    sections: ["Summary", "Internships", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Lead with education and GPA if 3.5+ — it's your strongest asset",
      "Internship descriptions are recommended for better results",
      "Add academic or personal projects to fill the experience gap",
    ],
    data: {
      personal: {
        fullName: "Sarah Chen",
        email: "sarah.chen@email.com",
        phone: "+1 (555) 987-6543",
        location: "Boston, MA",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        portfolioUrl: "",
      },
      experience: [],
      internships: [
        {
          company: "Google",
          role: "Software Engineering Intern",
          duration: "May 2025 - Aug 2025",
          description:
            "Developed internal tools using Python and Angular. Optimized database queries reducing response time by 30%. Participated in code reviews and agile sprints.",
        },
        {
          company: "Local Tech Startup",
          role: "Web Development Intern",
          duration: "Jun 2024 - Aug 2024",
          description:
            "Built landing pages and dashboards using React. Integrated third-party APIs for payment processing. Wrote documentation for the onboarding process.",
        },
      ],
      isFreshGraduate: true,
      education: [
        {
          degree: "B.Sc. Computer Science",
          institution: "Massachusetts Institute of Technology",
          startMonth: "September",
          startYear: "2022",
          endMonth: "May",
          endYear: "2026",
          grade: "3.9 GPA",
        },
      ],
      skills: [
        "Python",
        "JavaScript",
        "React",
        "Java",
        "SQL",
        "Git",
        "HTML",
        "CSS",
        "Data Structures",
        "Algorithms",
      ],
      languages: ["English", "Mandarin"],
      certifications: ["Google IT Support Professional Certificate"],
      projects: [
        {
          title: "Campus Event Finder",
          description:
            "Web app for discovering and RSVPing to campus events. Features search, filtering, and Google Calendar integration.",
          techUsed: "React, Firebase, Google Maps API",
        },
        {
          title: "Machine Learning Sentiment Analyzer",
          description:
            "NLP model that classifies product reviews as positive, negative, or neutral with 92% accuracy. Built as a senior capstone project.",
          techUsed: "Python, scikit-learn, Flask, NLTK",
        },
      ],
      bio: "Enthusiastic CS graduate with strong academic performance and hands-on internship experience at top tech companies. Eager to contribute to innovative software projects.",
    },
  },
  {
    id: "graphic-designer",
    label: "Graphic Designer",
    description: "Clean, ATS-friendly layout for creative professionals. Showcases brand work, design tools, and measurable creative impact.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "List all design tools in Skills — recruiters filter by tool names",
      "Portfolio URL is recommended for better results in design roles",
      "Describe project outcomes, not just what you designed",
    ],
    data: {
      personal: {
        fullName: "Maya Rodriguez",
        email: "maya.rodriguez@email.com",
        phone: "+1 (555) 456-7890",
        location: "Los Angeles, CA",
        linkedinUrl: "https://linkedin.com/in/mayarodriguez",
        portfolioUrl: "https://mayarod.design",
      },
      experience: [
        {
          company: "Creative Agency Co.",
          role: "Senior Graphic Designer",
          duration: "Mar 2022 - Present",
          description:
            "Lead visual design for 20+ client brands including logo, typography, and marketing collateral. Manage a team of 3 junior designers. Increased client satisfaction scores by 25%.",
        },
        {
          company: "Freelance",
          role: "Graphic Designer",
          duration: "Jan 2020 - Feb 2022",
          description:
            "Designed brand identities, social media graphics, and print materials for small businesses. Built a client base of 30+ recurring customers through referrals.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "B.F.A. Graphic Design",
          institution: "Rhode Island School of Design",
          startMonth: "September",
          startYear: "2016",
          endMonth: "May",
          endYear: "2020",
          grade: "3.8 GPA",
        },
      ],
      skills: [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Figma",
        "InDesign",
        "After Effects",
        "Typography",
        "Brand Identity",
        "UI Design",
        "Print Design",
        "Color Theory",
      ],
      languages: ["English", "Spanish"],
      certifications: ["Adobe Certified Expert — Photoshop", "Google UX Design Certificate"],
      projects: [
        {
          title: "EcoLife Brand Redesign",
          description:
            "Complete brand overhaul for a sustainable living startup including logo, packaging, website visuals, and social media kit. Resulted in 60% increase in brand recognition.",
          techUsed: "Illustrator, Photoshop, Figma",
        },
        {
          title: "City Arts Festival Campaign",
          description:
            "Designed posters, banners, digital ads, and merchandise for a city-wide arts festival attracting 10,000+ attendees.",
          techUsed: "Illustrator, InDesign, After Effects",
        },
      ],
      bio: "Creative graphic designer with 5+ years of experience in brand identity, digital design, and print media. Passionate about translating ideas into compelling visual stories.",
    },
  },
  {
    id: "data-scientist",
    label: "Data Scientist",
    description: "Structured for data & ML professionals. Highlights analytical tools, model performance metrics, and research credentials.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Include model accuracy or business impact numbers in project descriptions",
      "Certifications section is recommended for better results in data roles",
      "List frameworks (TensorFlow, PyTorch) individually for ATS keyword matching",
    ],
    data: {
      personal: {
        fullName: "James Park",
        email: "james.park@email.com",
        phone: "+1 (555) 321-0987",
        location: "Seattle, WA",
        linkedinUrl: "https://linkedin.com/in/jamespark",
        portfolioUrl: "https://github.com/jamespark",
      },
      experience: [
        {
          company: "DataDriven Analytics",
          role: "Data Scientist",
          duration: "Jul 2022 - Present",
          description:
            "Built predictive models for customer churn reducing attrition by 18%. Designed A/B testing frameworks and automated reporting dashboards with Python and Tableau. Mentored 2 junior analysts.",
        },
        {
          company: "HealthTech Solutions",
          role: "Junior Data Analyst",
          duration: "Aug 2020 - Jun 2022",
          description:
            "Analyzed patient outcome data using SQL and Python. Created interactive Tableau dashboards for hospital administrators. Published internal research on readmission prediction.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "M.Sc. Data Science",
          institution: "University of Washington",
          startMonth: "September",
          startYear: "2018",
          endMonth: "June",
          endYear: "2020",
          grade: "3.9 GPA",
        },
        {
          degree: "B.Sc. Statistics",
          institution: "UCLA",
          startMonth: "September",
          startYear: "2014",
          endMonth: "June",
          endYear: "2018",
          grade: "3.6 GPA",
        },
      ],
      skills: [
        "Python",
        "R",
        "SQL",
        "TensorFlow",
        "PyTorch",
        "Tableau",
        "Pandas",
        "Scikit-learn",
        "AWS SageMaker",
        "Statistics",
      ],
      languages: ["English", "Korean"],
      certifications: ["AWS Machine Learning Specialty", "Google Data Analytics Certificate"],
      projects: [
        {
          title: "Customer Segmentation Engine",
          description:
            "K-means clustering pipeline that segments 500K+ customers into actionable groups for targeted marketing campaigns, boosting conversion by 22%.",
          techUsed: "Python, scikit-learn, Pandas, Tableau",
        },
        {
          title: "Stock Price Forecasting Model",
          description:
            "LSTM-based deep learning model for predicting stock trends with 78% directional accuracy. Features a Streamlit dashboard for real-time monitoring.",
          techUsed: "Python, TensorFlow, Streamlit, yfinance",
        },
      ],
      bio: "Data scientist with expertise in machine learning, statistical analysis, and data visualization. Proven track record of delivering actionable insights that drive business growth.",
    },
  },
  {
    id: "marketing-manager",
    label: "Marketing Manager",
    description: "ATS-ready template for digital marketing leaders. Structured to showcase campaign ROI, growth metrics, and strategic expertise.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Use metrics like ROAS, conversion rates, and traffic growth in Experience",
      "Bio section is recommended for better results — summarize your strategic value",
      "Include marketing tools (HubSpot, Google Ads) as individual skills for ATS",
    ],
    data: {
      personal: {
        fullName: "Emily Thompson",
        email: "emily.thompson@email.com",
        phone: "+1 (555) 654-3210",
        location: "Chicago, IL",
        linkedinUrl: "https://linkedin.com/in/emilythompson",
        portfolioUrl: "",
      },
      experience: [
        {
          company: "GrowthBrand Inc.",
          role: "Marketing Manager",
          duration: "Apr 2022 - Present",
          description:
            "Manage a $2M annual marketing budget across digital channels. Grew organic traffic by 150% through SEO and content strategy. Led product launch campaigns generating $5M in first-quarter revenue.",
        },
        {
          company: "Digital First Agency",
          role: "Digital Marketing Specialist",
          duration: "Jun 2019 - Mar 2022",
          description:
            "Planned and executed PPC, email, and social media campaigns for 15+ clients. Achieved average ROAS of 4.2x across all accounts. Managed HubSpot CRM and marketing automation workflows.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "B.A. Marketing",
          institution: "Northwestern University",
          startMonth: "September",
          startYear: "2015",
          endMonth: "June",
          endYear: "2019",
          grade: "3.5 GPA",
        },
      ],
      skills: [
        "SEO",
        "Google Ads",
        "Facebook Ads",
        "HubSpot",
        "Content Strategy",
        "Email Marketing",
        "Google Analytics",
        "Copywriting",
        "A/B Testing",
        "Brand Strategy",
      ],
      languages: ["English", "French"],
      certifications: ["Google Ads Certified", "HubSpot Inbound Marketing"],
      projects: [
        {
          title: "Product Launch — FitTrack Pro",
          description:
            "End-to-end go-to-market campaign for a fitness wearable. Coordinated influencer partnerships, PR, paid media, and email sequences. Generated 50K pre-orders.",
          techUsed: "HubSpot, Google Ads, Meta Ads, Mailchimp",
        },
        {
          title: "SEO Content Overhaul",
          description:
            "Audited and restructured 200+ blog posts with keyword optimization. Organic search traffic increased 150% within 6 months.",
          techUsed: "Ahrefs, Google Analytics, WordPress, Surfer SEO",
        },
      ],
      bio: "Results-driven marketing manager with 6+ years of experience in digital strategy, campaign management, and brand growth. Expert at turning data into actionable marketing plans.",
    },
  },
  {
    id: "project-manager",
    label: "Project Manager",
    description: "Professional PM template optimized for ATS. Highlights agile methodology, budget management, and cross-functional leadership.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Certifications (PMP, CSM) are recommended for better results in PM roles",
      "Quantify team sizes, budgets, and on-time delivery rates",
      "List methodology keywords — Agile, Scrum, Kanban — for ATS matching",
    ],
    data: {
      personal: {
        fullName: "David Kim",
        email: "david.kim@email.com",
        phone: "+1 (555) 789-0123",
        location: "Austin, TX",
        linkedinUrl: "https://linkedin.com/in/davidkim",
        portfolioUrl: "",
      },
      experience: [
        {
          company: "Enterprise Solutions Ltd.",
          role: "Senior Project Manager",
          duration: "Jan 2022 - Present",
          description:
            "Manage a portfolio of 5 concurrent projects worth $10M+. Implemented agile methodology reducing delivery time by 30%. Coordinate cross-functional teams of 15-25 engineers, designers, and QA.",
        },
        {
          company: "TechBuild Corp.",
          role: "Project Manager",
          duration: "Mar 2019 - Dec 2021",
          description:
            "Led software delivery for SaaS products with 100K+ users. Maintained 95% on-time delivery rate. Facilitated sprint planning, retrospectives, and stakeholder demos.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "MBA",
          institution: "University of Texas at Austin",
          startMonth: "August",
          startYear: "2017",
          endMonth: "May",
          endYear: "2019",
          grade: "3.8 GPA",
        },
        {
          degree: "B.Sc. Information Systems",
          institution: "Georgia Tech",
          startMonth: "August",
          startYear: "2013",
          endMonth: "May",
          endYear: "2017",
          grade: "3.5 GPA",
        },
      ],
      skills: [
        "Agile / Scrum",
        "Jira",
        "Confluence",
        "Risk Management",
        "Stakeholder Management",
        "Budgeting",
        "MS Project",
        "Kanban",
        "Team Leadership",
        "Strategic Planning",
      ],
      languages: ["English", "Korean"],
      certifications: ["PMP (Project Management Professional)", "Certified Scrum Master (CSM)"],
      projects: [
        {
          title: "Enterprise CRM Migration",
          description:
            "Led migration of legacy CRM to Salesforce for a 500-person organization. Completed 2 weeks ahead of schedule with zero data loss.",
          techUsed: "Salesforce, Jira, Confluence, MS Project",
        },
        {
          title: "Mobile App Launch",
          description:
            "Managed end-to-end delivery of a customer-facing mobile app from concept to App Store launch within 6 months, coordinating 3 agile teams.",
          techUsed: "Jira, Figma, TestFlight, Slack",
        },
      ],
      bio: "Certified PMP and Scrum Master with 6+ years of experience managing complex software projects. Proven ability to deliver on time, on budget, and above expectations.",
    },
  },
  {
    id: "uiux-designer",
    label: "UI/UX Designer",
    description: "ATS-friendly template for UX/UI designers. Emphasizes user research, design systems, and measurable usability improvements.",
    sections: ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"],
    tips: [
      "Portfolio URL is recommended for better results — include your best case studies",
      "Mention design tools individually (Figma, Sketch, Adobe XD) for ATS scanners",
      "Describe outcomes of your design work (e.g. conversion uplift, task completion rate)",
    ],
    data: {
      personal: {
        fullName: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        linkedinUrl: "https://linkedin.com/in/priyasharma",
        portfolioUrl: "https://priyasharma.design",
      },
      experience: [
        {
          company: "DesignLab Studio",
          role: "Senior UI/UX Designer",
          duration: "May 2022 - Present",
          description:
            "Lead product design for a B2B SaaS platform with 50K+ users. Conduct user research, create wireframes, and deliver high-fidelity prototypes. Redesigned onboarding flow increasing activation rate by 35%.",
        },
        {
          company: "AppWorks Inc.",
          role: "UI/UX Designer",
          duration: "Jul 2020 - Apr 2022",
          description:
            "Designed mobile and web interfaces for 10+ client projects. Conducted usability testing sessions and created design systems. Collaborated closely with developers to ensure design fidelity.",
        },
      ],
      internships: [],
      isFreshGraduate: false,
      education: [
        {
          degree: "B.Des. Interaction Design",
          institution: "Parsons School of Design",
          startMonth: "September",
          startYear: "2016",
          endMonth: "May",
          endYear: "2020",
          grade: "3.7 GPA",
        },
      ],
      skills: [
        "Figma",
        "Sketch",
        "Adobe XD",
        "Prototyping",
        "User Research",
        "Wireframing",
        "Design Systems",
        "Usability Testing",
        "Interaction Design",
        "Responsive Design",
      ],
      languages: ["English", "Hindi"],
      certifications: ["Google UX Design Professional Certificate", "Nielsen Norman Group UX Certification"],
      projects: [
        {
          title: "FinTrack Dashboard Redesign",
          description:
            "Redesigned a financial analytics dashboard improving task completion rate by 40%. Led user interviews, card sorting, and iterative prototyping with 3 rounds of testing.",
          techUsed: "Figma, Maze, Hotjar, FigJam",
        },
        {
          title: "HealthPal Mobile App",
          description:
            "Designed a health tracking app from concept to handoff. Created user personas, journey maps, and a comprehensive design system with 80+ reusable components.",
          techUsed: "Figma, Principle, Zeplin, Miro",
        },
      ],
      bio: "User-centered UI/UX designer with 5+ years of experience crafting intuitive digital products. Specializes in design systems, user research, and data-driven design decisions.",
    },
  },
];
