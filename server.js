import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // disabled for Hackathon demo since Vite inline scripts might break
}));
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Prevent massive payload attacks

// Rate limiting for the LLM API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);

// Initialize AI
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "dummy" });
const MODEL_NAME = "gemini-2.5-flash"; // Or gemma-2-9b-it if available in your project

function buildSystemContext(context) {
  const kbText = context.kbItems.map(item => `[${item.title}]: ${item.content}`).join("\n\n");
  
  return `
You are "Ona", an expert academic AI support assistant for a thesis management platform called "studyond".
You are assisting ${context.studentName}, a ${context.degree} student at ${context.university}.
Their thesis topic is: "${context.topic}".
They are currently in the "${context.currentPhase}" phase, at ${context.progress}% completion.

Here is the entire Knowledge Base of formal requirements, guidelines, and context available for this thesis. Use this to explicitly answer questions:
--- START KNOWLEDGE BASE ---
${kbText || "No specific guidelines provided."}
--- END KNOWLEDGE BASE ---

Be extremely helpful, concise, and academically rigorous. Never give harmful or generic advice. Keep answers under 150 words when possible.
  `;
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { context, history, prompt } = req.body;
    
    if (!API_KEY) {
      return res.json({ response: "AI is current disabled (API Key missing)." });
    }

    const systemInstruction = buildSystemContext(context);
    const contents = history.map(msg => ({
      role: msg.role === 'student' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    res.json({ response: result.text || "I'm sorry, I couldn't generate a response." });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.post('/api/intercept', async (req, res) => {
  try {
    const { context, prompt } = req.body;
    
    if (!API_KEY) return res.json({ knows_answer: false, response: null });

    const systemInstruction = `
You are evaluating a message that a student intends to send to their human supervisor.
Your goal is to save the supervisor time. 
Evaluate if the student's question can be COMPLETELY and ACCURATELY answered using ONLY the provided Knowledge Base below. 
If it is a specific question about formal requirements, formatting, deadlines, or rules covered in the KB, you should intercept it.
However, if the student is asking for academic feedback, methodological review, asking for a meeting, or if the answer is NOT strictly in the KB, you MUST NOT intercept it.

Thesis Topic: ${context.topic}
Current Phase: ${context.currentPhase}

--- START KNOWLEDGE BASE ---
${context.kbItems.map(item => `[${item.title}]: ${item.content}`).join("\n\n") || "No specific guidelines provided."}
--- END KNOWLEDGE BASE ---

Respond ONLY with a valid JSON object matching this schema:
{
  "knows_answer": boolean,
  "response": "If true, provide the helpful, concise answer to the student here as Ona. If false, put null."
}
`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    if (!result.text) return res.json({ knows_answer: false, response: null });
    
    const parsed = JSON.parse(result.text);
    res.json({
      knows_answer: parsed.knows_answer === true,
      response: parsed.response || null
    });

  } catch (error) {
    console.error("Intercept API Error:", error);
    res.json({ knows_answer: false, response: null });
  }
});

// Serve static React files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Express Server running proxy on port ${port}`);
});
