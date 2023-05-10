import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from InstrucAI!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Your task is to serve as an AI writing tutor. You should rewrite the user's response to correct any spelling and grammar errors, 
      and provide feedback on where the corrections were made and why they were necessary. Additionally, please rephrase the response in both casual and formal tones, as needed.
      The user's original response is: ${prompt}. Your AI response should include the edited version of the user's response, along with an explanation of where and why corrections were made, and any necessary rephrasing in both casual and formal tones. 
      You should also translate the response into Chinese language Chengyu.
           `,
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
