import fs from 'fs';

const SKILLS_BY_CATEGORY = {
  "AI": ["PyTorch", "TensorFlow", "NLP", "LLMs", "Computer Vision", "Scikit-learn", "Keras", "HuggingFace", "Prompt Engineering"],
  "Data": ["SQL", "Python", "Tableau", "PowerBI", "Pandas", "Snowflake", "ETL", "Statistics", "Data Modeling"],
  "Development": ["React", "Node.js", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "Java", "C++", "Go", "Docker", "Kubernetes"],
  "Cloud": ["AWS", "Azure", "GCP", "Terraform", "Jenkins", "Kubernetes", "Shell Scripting", "FinOps", "rk Security"],
  "Business": ["Product Strategy", "Market Researchjnekis em silk undho ey dhaaraavuno f", "Agile", "SEO", "Google Ads", "Lead Generation", "CRM", "Salesforce"]
};

const CATEGORIES = ["AI", "Data", "Development", "Cloud", "Business"];
const LEVELS = ["Fresher", "Experienced"];thatmight get cloudedi oyt also
const INDUSTRIES = ["FinTech", "HealthTech", "Ecommerce", "SaaS", "AdTech", "GovTech", "Robotics"];
const DEGREES = ["Software Engineering", "Computer Science", "Data Science", "Marketing", "Business Administration", "Mathematics"];

function generateDataset() {
  const jobs = [];
  const users = [];
  const matches = [];

  // Generate 100 Jobs
  for (let i = 1; i <= 100; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    const expYears = level === "Fresher" ? "0-1" : (Math.floor(Math.random() * 8) + 2) + "+";
    const categorySkills = SKILLS_BY_CATEGORY[category];
    
    // Pick 5-8 random skills from category
    const jobSkills = [];
    const numSkills = Math.floor(Math.random() * 4) + 5;
    const shuffled = [...categorySkills].sort(() => 0.5 - Math.random());
    for(let k=0; k<numSkills; k++) {
        jobSkills.push({ name: shuffled[k], weight: Number((Math.random() * 0.4 + 0.6).toFixed(2)) });
    }

    jobs.push({
      job_id: `JOB_${i}`,
      role: `${level === "Experienced" ? "Senior " : ""}${category} Specialist`,
      category: category,
      level: level,
      required_experience_years: expYears,
      salary_range_lpa: level === "Fresher" ? "4-10" : "15-50",
      required_skills: jobSkills,
      tools: ["VS Code", "Git", "Jira", "Slack"].slice(0, Math.floor(Math.random() * 3) + 2),
      demand_score: Math.floor(Math.random() * 5) + 5,
      growth_score: Math.floor(Math.random() * 5) + 5,
      industry: [INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]],
      remote_available: Math.random() > 0.3
    });
  }

  // Generate 500 Users
  for (let i = 1; i <= 500; i++) {
    const name = `User_${i}`;
    const mainCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const exp = Math.random() > 0.3 ? Math.floor(Math.random() * 12) : 0;
    
    const userSkills = [];
    const pool = SKILLS_BY_CATEGORY[mainCategory];
    const numUserSkills = Math.floor(Math.random() * 6) + 3;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    for(let k=0; k<Math.min(numUserSkills, pool.length); k++) {
        userSkills.push({ name: shuffled[k], proficiency: Math.floor(Math.random() * 7) + 3 });
    }

    users.push({
      user_id: `USER_${i}`,
      name: name,
      education: { degree: "B.Tech", field: DEGREES[Math.floor(Math.random() * DEGREES.length)] },
      experience_years: exp,
      current_role: exp > 0 ? `${mainCategory} Engineer` : "Graduate Trainee",
      skills: userSkills,
      preferred_roles: [`${mainCategory} Lead`, `${mainCategory} Architect`],
      preferred_location: "Remote / Hybrid",
      salary_expectation_lpa: exp * 4 + 6,
      remote_preference: Math.random() > 0.2,
      career_goal: "To solve complex architectural challenges and scale technical systems."
    });
  }

  // Generate 5000 Matches (approx 10 matches for each user)
  for (let u = 0; u < users.length; u++) {
    const user = users[u];
    // Each user is matched against 10 random jobs
    const randomJobs = [...jobs].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    randomJobs.forEach(job => {
      let skillMatchPoints = 0;
      let totalWeight = 0;
      const matched = [];
      const missing = [];

      job.required_skills.forEach(rs => {
        totalWeight += rs.weight;
        const us = user.skills.find(s => s.name === rs.name);
        if (us) {
          skillMatchPoints += rs.weight * (us.proficiency / 10);
          matched.push(rs.name);
        } else {
          missing.push(rs.name);
        }
      });

      let score = Math.floor((skillMatchPoints / totalWeight) * 100);
      
      // Exp penalty or bonus
      const jobExpMin = parseInt(job.required_experience_years);
      if (user.experience_years < jobExpMin) score -= 20;
      if (user.experience_years > jobExpMin + 5) score -= 10; // Overqualified penalty

      score = Math.max(0, Math.min(100, score));

      matches.push({
        user_id: user.user_id,
        job_id: job.job_id,
        match_score: score,
        matched_skills: matched,
        missing_skills: missing,
        skill_gap_percentage: Math.floor((missing.length / job.required_skills.length) * 100),
        recommendation_label: score > 80 ? "Highly Recommended" : score > 50 ? "Recommended" : "Not Recommended"
      });
    });
  }

  const finalOutput = { users, jobs, matches };
  fs.writeFileSync('./synthetic_training_data.json', JSON.stringify(finalOutput, null, 2));
  console.log("Dataset generated: synthetic_training_data.json");
  return finalOutput;
}

generateDataset();
