import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;

const app = express();
app.use(
  cors({
    origin: "https://wecare-ai.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WeCare AI Backend is running✅...");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log("📩 Received message:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // ✅ Try multiple models in order
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];

  for (const model of models) {
    try {
      console.log(`🔄 Trying model: ${model}`);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      console.log(`✅ Success with ${model}:`, aiResponse);

      return res.json({ reply: aiResponse });
    } catch (error) {
      console.error(
        `❌ ${model} failed:`,
        error.response?.data?.error?.message || error.message
      );

      // If this isn't the last model, continue to next one
      if (model !== models[models.length - 1]) {
        continue;
      }

      // All models failed
      res.status(503).json({
        error: "All AI models are currently unavailable",
        details: "Please try again in a few moments",
      });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}✅`);
});

