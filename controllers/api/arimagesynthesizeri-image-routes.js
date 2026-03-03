const router = require('express').Router();
const imagapiKey = process.env.IMAGE_API_KEY;
// let reqHash = '';

// /api/images/imagegen
router.post('/imagegen', async (req, res) => {
  const url = 'https://arimagesynthesizer.p.rapidapi.com/generate';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': `${imagapiKey}`,
      'X-RapidAPI-Host': 'arimagesynthesizer.p.rapidapi.com',
    },
    body: new URLSearchParams({
      prompt: req.body.prompt,
      id: '12345',
      width: '768',
      height: '768',
      inferenceSteps: '50',
      guidanceScale: '7.5',
      img2img_strength: '0.75',
    }),
  };

  try {
    // console.log(req);
    // console.log(req.body.prompt);
    const response = await fetch(url, options);
    const result = await response.text();
    const imgHash = JSON.parse(result);
    res.send(result);
    // console.log(result);
    // console.log(imgHash.hash);
    reqHash = imgHash.hash;
    // console.log(reqHash);
  } catch (error) {
    console.error(error);
  }
});

// /api/images/genimg

// /api/images/genimg?hash=XYZ
router.get('/genimg', async (req, res) => {
  const hash = req.query.hash;
  if (!hash) return res.status(400).json({ error: "Missing hash" });

  const url = `https://arimagesynthesizer.p.rapidapi.com/get?hash=${encodeURIComponent(
    hash
  )}&returnType=image`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": `${imagapiKey}`,
      "X-RapidAPI-Host": "arimagesynthesizer.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    // If RapidAPI responds with JSON, it's probably "not ready yet"
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(202).json(json); // still processing
    }

    const arrayBuffer = await response.arrayBuffer();
    res.set("Content-Type", contentType || "image/jpeg");
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
});

// /api/images/hashes

router.get('/hashes', async (req, res) => {
  const url = 'https://arimagesynthesizer.p.rapidapi.com/my_images';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${imagapiKey}`,
      'X-RapidAPI-Host': 'arimagesynthesizer.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    res.send(result);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
