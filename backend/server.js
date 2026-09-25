import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "./models/User.js";
import Job from "./models/Job.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
const upload = multer({ dest: 'uploads/' });

mongoose.connect("mongodb://127.0.0.1:27017/antigravity")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// --- HEURISTIC INTELLIGENCE UTILITIES ---

const DOMAINS = {
    "AI": ["PyTorch", "TensorFlow", "NLP", "LLMs", "Computer Vision", "Machine Learning", "ML", "HuggingFace", "Prompt Engineering"],
    "Data": ["SQL", "Pandas", "Tableau", "PowerBI", "Statistics", "Snowflake", "ETL", "Data Science", "Data Analytics"],
    "Development": ["React", "Node.js", "TypeScript", "JavaScript", "HTML", "CSS", "Next.js", "Frontend", "Backend", "Full Stack", "Java", "C++"],
    "Cloud": ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "DevOps", "CI/CD", "Jenkins", "Linux"],
    "Creative": ["Figma", "Design", "UX", "UI", "Adobe", "Creative", "Wireframing"],
    "Business": ["Product Management", "MBA", "Agile", "SEO", "Sales", "Marketing", "Strategic"]
};

function detectUserDomain(skills) {
    let domainCounts = {};
    Object.keys(DOMAINS).forEach(d => {
        domainCounts[d] = skills.filter(s => 
            DOMAINS[d].some(ds => s.toLowerCase().includes(ds.toLowerCase()))
        ).length;
    });
    const topDomain = Object.keys(domainCounts).reduce((a, b) => domainCounts[a] >= domainCounts[b] ? a : b);
    return domainCounts[topDomain] > 0 ? topDomain : "Generalist";
}

function getExperienceTier(years) {
    if (!years || years < 2) return "Fresher";
    if (years < 6) return "Mid-Level";
    return "Experienced";
}

// --- MIDDLEWARE ---

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const apiRouter = express.Router();

// --- ROUTES ---

apiRouter.post("/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

apiRouter.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username });
        if (!user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ access_token: token, token_type: "bearer" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

apiRouter.get("/users/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

apiRouter.get("/jobs/recommendations", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userSkills = user.skills || [];
        const userDomain = detectUserDomain(userSkills);
        const userTier = getExperienceTier(user.experience_years);
        
        const allJobs = await Job.find();
        
        let scoredJobs = [];
        try {
            // 1. Attempt to hit Python ML Microservice
            const userProfileText = user.resume_text || userSkills.join(" ");
            const mlResponse = await fetch("http://127.0.0.1:5001/rank", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_text: userProfileText,
                    jobs: allJobs.map(j => j.toObject())
                }),
                signal: AbortSignal.timeout(3000)
            });
            
            if (mlResponse.ok) {
                scoredJobs = await mlResponse.json();
                console.log("Successfully retrieved ML Engine recommendations.");
            } else {
                throw new Error("ML service returned " + mlResponse.status);
            }
        } catch (mlErr) {
            console.log("ML Engine unavailable, falling back to heuristic scoring.", mlErr.message);
            // 2. Fallback Heuristic Intelligence
            scoredJobs = allJobs.map(job => {
                const jobObj = job.toObject();
            const jobSkills = jobObj.skills || [];
            
            let totalWeight = 0;
            let matchedWeight = 0;
            const matchedNames = [];
            const missingCritical = [];
            
            jobSkills.forEach(skillDef => {
                totalWeight += skillDef.weight;
                const isMatched = userSkills.some(us => us.toLowerCase() === skillDef.name.toLowerCase());
                if (isMatched) {
                    matchedWeight += skillDef.weight;
                    matchedNames.push(skillDef.name);
                } else if (skillDef.weight > 0.8) {
                    missingCritical.push(skillDef.name);
                }
            });
            
            let score = 0;
            if (totalWeight > 0) {
                score = Math.floor((matchedWeight / totalWeight) * 80);
            }

            // --- PERSONALIZATION LOGIC ---
            
            // Domain Alignment Bonus (+15)
            if (jobObj.category && jobObj.category.includes(userDomain)) {
                score += 15;
            }
            
            // Level Mismatch Penalty (-30 for senior roles given to freshers)
            if (userTier === "Fresher" && jobObj.level === "Experienced") {
                score -= 30;
            } else if (userTier === "Experienced" && jobObj.level === "Fresher") {
                score -= 10; // Overqualified penalty
            }

            // Critical Skill Gap Penalty (-15 per missing critical skill)
            score -= (missingCritical.length * 15);

            score = Math.max(5, Math.min(100, score));

            // Dynamic Explanation
            let explanation = `This position aligns with your ${userDomain} expertise. `;
            if (matchedNames.length > 0) {
                explanation += `We detected core synergy in ${matchedNames.slice(0, 3).join(", ")}. `;
            }
            if (missingCritical.length > 0) {
                explanation += `Note: Bridging the gap in ${missingCritical[0]} is vital for this protocol.`;
            }

            return {
                ...jobObj,
                match_score: score,
                match_explanation: explanation,
                matched_skills_list: matchedNames,
                missing_skills_list: jobSkills.filter(s => !matchedNames.includes(s.name)).map(s => s.name)
            };
        });
        } // Close catch block here
        
        // Final sort and return only relevant ones
        scoredJobs.sort((a, b) => b.match_score - a.match_score);
        res.json(scoredJobs.slice(0, 20));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

apiRouter.post("/resume/upload", authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        
        let textContent = "";
        try {
            const originalName = req.file.originalname || "";
            const isPdf = req.file.mimetype === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
            
            if (isPdf) {
                const dataBuffer = fs.readFileSync(req.file.path);
                
                // Flexible PDF Parsing logic for different library versions
                try {
                    let parsePdf = pdfParse;
                    if (typeof pdfParse !== 'function' && pdfParse.PDFParse) parsePdf = pdfParse.PDFParse;
                    else if (pdfParse.default) parsePdf = pdfParse.default;

                    if (typeof parsePdf === 'function') {
                        // Check if it's the newer class-based API (v2.x) or classic function API (v1.x)
                        const isClass = parsePdf.toString().includes('class ');
                        
                        if (isClass) {
                            const instance = new parsePdf(new Uint8Array(dataBuffer), { verbosity: 0 });
                            const result = await instance.getText();
                            textContent = result.text;
                        } else {
                            const pdfData = await parsePdf(dataBuffer);
                            textContent = pdfData.text;
                        }
                    } else {
                        textContent = "Error: PDF Parser signature mismatch.";
                        console.error("PDF Parser is not a function/class:", pdfParse);
                    }
                } catch (innerErr) {
                    console.error("Internal PDF parse error:", innerErr);
                    textContent = `Parse Failure: ${innerErr.message}`;
                }
            } else if (originalName.toLowerCase().endsWith('.docx')) {
                // Future-proofing: Handle docx if needed, for now just note it
                textContent = "DOCX support pending. Please use PDF.";
            } else {
                textContent = fs.readFileSync(req.file.path, 'utf8');
            }
        } catch (parseErr) {
            console.error("Critical Parse error:", parseErr);
            return res.status(500).json({ error: "Failed to process document: " + parseErr.message });
        }
        
        // Dynamic Extraction from full SKILLS pool
        const allPossibleSkills = Object.values(DOMAINS).flat();
        const extractedSkills = Array.from(new Set(allPossibleSkills.filter(skill => 
            textContent.toLowerCase().includes(skill.toLowerCase())
        )));

        // Fallback or detected years of experience (crude detection)
        const yearMatches = textContent.match(/(\d+)\+?\s*years?/i);
        const detectedYears = yearMatches ? parseInt(yearMatches[1]) : 0;
        
        const domain = detectUserDomain(extractedSkills);
        const tier = getExperienceTier(detectedYears);

        await User.findByIdAndUpdate(req.user.id, {
            resume: req.file.path,
            resume_text: textContent,
            skills: extractedSkills,
            experience_years: detectedYears
        });
        
        // --- PERSONALIZED INTELLIGENCE REPORT ---
        
        const tierLabels = {
            "Fresher": "Early-Career",
            "Mid-Level": "Strategic Growth",
            "Experienced": "Executive-Technical"
        };

        const domainSpecificAdvice = {
            "AI": [
                "Optimize for vector database exposure (Pinecone/Milvus).",
                "Highlight specific LLM fine-tuning techniques used.",
                "Ensure your GitHub links directly to Jupyter Notebooks or model weights."
            ],
            "Web": [
                "Focus on Core Web Vitals and performance optimization metrics.",
                "Incorporate modern state management (Zustand/Signals) into your projects.",
                "Demonstrate proficiency in micro-frontend architectures."
            ],
            "Cloud": [
                "Prioritize Terraform or Pulumi infrastructure-as-code samples.",
                "Highlight cost-optimization (FinOps) success stories in your Cloud tenure.",
                "Focus on multi-region high availability architectures."
            ],
            "Data": [
                "Quantify data pipeline efficiency gains (e.g., reduced latency by 30%).",
                "Focus on distributed data processing patterns (Spark/Kafka).",
                "Emphasize data governance and compliance (GDPR/HIPAA) awareness."
            ],
            "Generalist": [
              "Standardize your tech stack to avoid being perceived as a Jack-of-all-trades.",
              "Deep dive into one specific vertical (e.g., FinTech or Health) to boost market value.",
              "Develop a high-impact technical blog to establish industry authority."
            ]
        };

        // Dynamic Strengths Generation
        const coreSkills = extractedSkills.slice(0, 3).join(", ");
        const secondarySkills = extractedSkills.slice(3, 6).join(", ");
        
        let strengthText = `Exceptional signal in the ${domain} stack. `;
        if (coreSkills) {
            strengthText += `Your validated competency in ${coreSkills} forms a strong foundation. `;
            if (secondarySkills) {
                strengthText += `Coupled with ${secondarySkills}, your technical DNA shows strong alignment with modern ${domain} architectural standards. `;
            }
        } else {
             strengthText += `Your profile indicates potential, but explicit skills mapping is needed to establish a strong technical DNA.`;
        }
        const strengths = strengthText;

        // Calculate weaknesses by comparing to Domain benchmark
        const benchmark = DOMAINS[domain] || DOMAINS["Development"];
        const missingFromBenchmark = benchmark.filter(s => !extractedSkills.some(es => es.toLowerCase().includes(s.toLowerCase()))).slice(0, 4);
        
        const flaws = [];
        if (missingFromBenchmark.length > 0) {
            flaws.push(`Identified a synergy gap in critical ${domain} pivots: ${missingFromBenchmark.join(", ")}. Missing these severely limits your ATS match rate for top-tier roles.`);
        }
        if (extractedSkills.length < 5) {
            flaws.push(`Technical keyword density is critically low (${extractedSkills.length} detected). High-frequency ATS sync requires at least 8-10 core competencies explicitly listed.`);
        } else if (extractedSkills.length > 15) {
            flaws.push("Skill density is extremely high. Consider pruning legacy or irrelevant skills to avoid appearing as an unfocused generalist.");
        }
        if (detectedYears === 0 && domain !== "Business") {
            flaws.push(`Resume lacks explicit commercial timeline for ${domain}. If you are a fresher, focus on building verifiable laboratory repo samples or contributing to open source.`);
        } else if (detectedYears > 0) {
             flaws.push(`Ensure your ${detectedYears}+ years of experience clearly quantify business impact (e.g. "reduced latency by 20%") rather than just listing duties.`);
        }
        if (textContent.length < 800) {
            flaws.push(`Structural detail is sparse (${textContent.length} chars). Project descriptions require deeper technical granularity and outcomes.`);
        }
        
        // Dynamic Improvements
        let specificAdvice = domainSpecificAdvice[domain] || domainSpecificAdvice["Generalist"];
        let improvements = [];
        
        if (missingFromBenchmark.length > 0) {
             improvements.push(`Action Item: Prioritize upskilling or adding projects related to ${missingFromBenchmark[0]} and ${missingFromBenchmark[1] || 'core concepts'}.`);
        }
        improvements.push(specificAdvice[0]);
        
        if (detectedYears < 3) {
            improvements.push(`Pivot your project descriptions to the 'Action-Impact-Result' (AIR) framework to simulate senior-level value communication.`);
        } else {
             improvements.push(`As an experienced professional, ensure your header is optimized for ${domain} architecture and leadership search terms.`);
        }
        improvements.push(specificAdvice[1] || `Focus heavily on System Design and modern scaling principles for ${domain}.`);
        improvements = improvements.slice(0, 4);

        const resume_score = Math.min(100, 35 + (extractedSkills.length * 5) + (detectedYears * 4));

        res.json({ 
            message: "Neural Analysis complete.", 
            extracted_skills: extractedSkills,
            resume_score: resume_score,
            analysis: {
                domain,
                tier,
                flaws: flaws.length > 0 ? flaws : ["Resume is highly optimized; focusing on small visual polish is the only remaining pivot."],
                strengths: [strengths],
                improvements: improvements,
                better_summary: `Distinguished ${domain} professional specializing in ${extractedSkills.slice(0, 4).join(", ")}. Proven ability to architect high-performance ${domain} solutions and drive technical strategy at the ${tierLabels[tier] || tier} level.`
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use("/api/v1", apiRouter);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));