// const chatgptkey = process.env.CHATAPI_KEY;
// const router = require('express').Router();

// //http://localhost:3001/api/chatgpt/namegen
// router.post('/namegen', async (req, res) => {
//   const options = {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${chatgptkey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'text-davinci-003',
//       prompt: req.body.prompt,
//       // n: 1,
//       // stop: '\n',
//       // prompt: 'Generate a cool fantasy character name from the 1800s',
//       max_tokens: 100,
//     }),
//   };
//   try {
//     const response = await fetch(
//       'https://api.openai.com/v1/completions',
//       options,
//     );
//     const data = await response.json();
//     res.send(data);
//   } catch (error) {
//     console.error(error);
//   }
// });

// //http://localhost:3001/api/chatgpt/getbackstory
// router.post('/getbackstory', async (req, res) => {
//   const options = {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${chatgptkey}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'text-davinci-003',
//       prompt: req.body.prompt,
//       // 'Generate an interesting backstory for a fantasty character from the 1800s.',
//       max_tokens: 300,
//     }),
//   };
//   try {
//     const response = await fetch(
//       'https://api.openai.com/v1/completions',
//       options,
//     );
//     const data = await response.json();
//     res.send(data);
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;

// New v1 chat completions used

// controllers/api/chatgpt-routes.js
const router = require("express").Router();

const OPENAI_API_KEY = process.env.CHATAPI_KEY;

// Small helper to call OpenAI Chat Completions and return "completion-style" JSON
async function chatToCompletionShape({ prompt, maxTokens }) {
  if (!OPENAI_API_KEY) {
    return {
      error: { message: "Missing CHATAPI_KEY on server (Heroku config var)." },
      choices: [{ text: "" }],
    };
  }

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.9,
    }),
  });

  const data = await resp.json();

  // If OpenAI returns an error, keep it visible but still return the "choices[].text" shape
  if (!resp.ok) {
    return {
      error: data?.error ?? { message: "OpenAI request failed" },
      choices: [{ text: "" }],
    };
  }

  const content = data?.choices?.[0]?.message?.content ?? "";
  return { choices: [{ text: content }] };
}

// http://localhost:3001/api/chatgpt/namegen
router.post("/namegen", async (req, res) => {
  try {
    const prompt = req.body?.prompt ?? "";
    const result = await chatToCompletionShape({ prompt, maxTokens: 100 });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Server error in /api/chatgpt/namegen" },
      choices: [{ text: "" }],
    });
  }
});

// http://localhost:3001/api/chatgpt/getbackstory
router.post("/getbackstory", async (req, res) => {
  try {
    const prompt = req.body?.prompt ?? "";
    const result = await chatToCompletionShape({ prompt, maxTokens: 300 });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Server error in /api/chatgpt/getbackstory" },
      choices: [{ text: "" }],
    });
  }
});

module.exports = router;