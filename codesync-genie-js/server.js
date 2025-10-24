import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Groq } from "groq-sdk"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const AUTH_SECRET = process.env.AUTH_SECRET;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. Please check your .env file.");
  process.exit(1);
}


const client = new Groq({ apiKey: GROQ_API_KEY });


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.post("/genie", async (req, res) => {
  try {
    
    const authSecretFetched =
      req.headers.authorization ||
      req.body.authorization ||
      req.body.Authorization;

    if (!authSecretFetched)
      return res
        .status(401)
        .json({ error: "Authorization header is required." });

    if (authSecretFetched !== AUTH_SECRET)
      return res.status(401).json({ error: "Invalid authorization secret." });

    
    const userQuery = req.body.query;
    if (!userQuery)
      return res.status(400).json({ error: "Query parameter is required." });

    console.log("Processing query:", userQuery);

    const temperature = 0.6;
    const maxTokens = 1500;
    const topP = 0.9;

    
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
            You are an advanced AI assistant specializing in generating and explaining high-quality code.
            You can write and analyze code in Python, C, JavaScript, Java, TypeScript, and C++.
            Rules:
            - Always include comments and explanations.
            - Format the code neatly.
            - Ignore irrelevant (non-coding) queries politely.
            - Respond only in English.
          `,
        },
        { role: "user", content: userQuery },
      ],
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      stream: true,
    });

    
    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta?.content || "";
      res.write(delta);
    }

    res.end();
    console.log("Response fully streamed.");
  } catch (error) {
    console.error("Error processing query:", error.message);
    res.status(500).json({
      error: "An error occurred while processing the request.",
      details: error.message,
    });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
