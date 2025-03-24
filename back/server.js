import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY; // Make sure this is set in your .env file

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WeCare AI Backend is running✅...");
});

// AI Chat Route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: apiKey,
        },
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error(
      "Error in AI response:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}✅`);
});
