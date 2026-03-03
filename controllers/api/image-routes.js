// old rapid API

// const router = require('express').Router();
// const imagapiKey = process.env.IMAGE_API_KEY;
// // let reqHash = '';

// // /api/images/imagegen
// router.post('/imagegen', async (req, res) => {
//   const url = 'https://arimagesynthesizer.p.rapidapi.com/generate';
//   const options = {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//       'X-RapidAPI-Key': `${imagapiKey}`,
//       'X-RapidAPI-Host': 'arimagesynthesizer.p.rapidapi.com',
//     },
//     body: new URLSearchParams({
//       prompt: req.body.prompt,
//       id: '12345',
//       width: '768',
//       height: '768',
//       inferenceSteps: '50',
//       guidanceScale: '7.5',
//       img2img_strength: '0.75',
//     }),
//   };

//   try {
//     // console.log(req);
//     // console.log(req.body.prompt);
//     const response = await fetch(url, options);
//     const result = await response.text();
//     const imgHash = JSON.parse(result);
//     res.send(result);
//     // console.log(result);
//     // console.log(imgHash.hash);
//     reqHash = imgHash.hash;
//     // console.log(reqHash);
//   } catch (error) {
//     console.error(error);
//   }
// });

// // /api/images/genimg

// // /api/images/genimg?hash=XYZ
// router.get('/genimg', async (req, res) => {
//   const hash = req.query.hash;
//   if (!hash) return res.status(400).json({ error: "Missing hash" });

//   const url = `https://arimagesynthesizer.p.rapidapi.com/get?hash=${encodeURIComponent(
//     hash
//   )}&returnType=image`;

//   const options = {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": `${imagapiKey}`,
//       "X-RapidAPI-Host": "arimagesynthesizer.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await fetch(url, options);

//     // If RapidAPI responds with JSON, it's probably "not ready yet"
//     const contentType = response.headers.get("content-type") || "";
//     if (contentType.includes("application/json")) {
//       const json = await response.json();
//       return res.status(202).json(json); // still processing
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     res.set("Content-Type", contentType || "image/jpeg");
//     return res.send(Buffer.from(arrayBuffer));
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch image" });
//   }
// });

// // /api/images/hashes

// router.get('/hashes', async (req, res) => {
//   const url = 'https://arimagesynthesizer.p.rapidapi.com/my_images';
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': `${imagapiKey}`,
//       'X-RapidAPI-Host': 'arimagesynthesizer.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.text();
//     res.send(result);
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;

// New rapid api

const express = require("express");
const router = express.Router();

/**
 * POST /api/images/imagegen
 * body: { prompt: string }
 * returns: image bytes
 */
router.post("/imagegen", async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const rapidKey = process.env.IMAGE_API_KEY;
    if (!rapidKey) {
      return res.status(500).json({
        error:
          "Missing RAPIDAPI_KEY (or IMAGE_API_KEY) in environment. Add it to your .env file.",
      });
    }

    // 1) Ask RapidAPI to generate
    const genUrl =
      "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php";

    // RapidAPI examples use form-url-encoded fields: prompt, style_id, size :contentReference[oaicite:4]{index=4}
    const body = new URLSearchParams({
      prompt,
      style_id: "4",
      size: "1-1",
    });

    const genResp = await fetch(genUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": rapidKey,
        "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
      },
      body,
    });

    const genText = await genResp.text();

    if (!genResp.ok) {
      return res.status(genResp.status).send(genText);
    }

    let genJson;
    try {
      genJson = JSON.parse(genText);
    } catch {
      return res.status(502).json({
        error: "RapidAPI returned non-JSON response",
        raw: genText,
      });
    }

    // 2) Extract the image URL (thumb)
    // Based on common response path shown in examples: result.data.results[0].thumb :contentReference[oaicite:5]{index=5}
    const thumb =
      genJson?.result?.data?.results?.[0]?.thumb ||
      genJson?.data?.results?.[0]?.thumb ||
      genJson?.result?.results?.[0]?.thumb ||
      genJson?.results?.[0]?.thumb;

    if (!thumb || typeof thumb !== "string") {
      return res.status(502).json({
        error: "Could not find image URL (thumb) in RapidAPI response",
        response: genJson,
      });
    }

    // 3) Fetch the actual image bytes and return them to the browser as a blob
    const imgResp = await fetch(thumb);

    if (!imgResp.ok) {
      return res.status(502).json({
        error: `Failed to fetch generated image from thumb URL (${imgResp.status})`,
        thumb,
      });
    }

    const contentType = imgResp.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await imgResp.arrayBuffer();

    res.set("Content-Type", contentType);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("RapidAPI imagegen error:", err);
    return res.status(500).json({ error: err?.message || "Image generation failed" });
  }
});

module.exports = router;