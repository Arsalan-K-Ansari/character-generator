// // remove console logs for url, response, result
// let imgUrl;
// let comparisonHash;
// // let genhash;

// // getUserPrompt

// const getUserPrompt = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };
//   try {
//     const response = await fetch('/api/characters', options);
//     const data = await response.json();
//     const arrayLength = data.length;
//     const lastCharacter = data[arrayLength - 1];
//     // console.log(data[0]);
//     let charGender = lastCharacter.character_gender;
//     let charHair = lastCharacter.hair_color;
//     let charEyes = lastCharacter.eye_color;
//     let charRace = lastCharacter.race.race_name;
//     let charClass = lastCharacter.class.class_name;
//     //added char race and class here as it was missing before
//     return (
//       charGender +
//       ' ' +
//       charRace +
//       ' ' +
//       charClass +
//       ' fantasy character with ' +
//       charHair +
//       ' hair and ' +
//       charEyes +
//       ' eyes'
//     );
//   } catch (error) {
//     // console.log(error);
//   }
// };

// const hashProcessing = async (imgHash) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };
//   try {
//     const response = await fetch('/api/images/hashes', options);
//     const result = await response.json();
//     // console.log(result);
//     grabbedHash = await imgHash.hash;
//     // console.log('grabbing hash ... ' + grabbedHash);
//     imgUrl = `https://arimagesynthesizer.p.rapidapi.com/get?hash=${grabbedHash}&returnType=image`;
//     // console.log('generated url ' + imgUrl);
//     comparisonHash = imgUrl;
//     return imgUrl, comparisonHash;
//   } catch (err) {
//     // console.log(err);
//   }
// };

// // /api/images/genimg

// // /api/images/imagegen
// const imageLoad = async () => {
//   const options = {
//     method: 'POST',
//     body: new URLSearchParams({
//       prompt: await getUserPrompt(),
//     }),
//     headers: {
//       'content-type': 'application/x-www-form-urlencoded',
//     },
//   };

//   try {
//     setInterval(const response = await fetch('/api/images/imagegen', options);
//     const result = await response.text();
//     const imgHash = JSON.parse(result);

//     // console.log(imgHash.message);

//     if (imgHash.message === 'File is ready.') {
//       hashProcessing(imgHash);
//       // console.log('File ready ... results = ' + imgHash.hash);
//       imageLoad();
//     })
//   } catch (error) {
//     console.error(error);
//   }
// };

// const grabImage = setInterval(async () => {
//   const url = imgUrl;
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': '79b34024f1msh90fae889226021ep19a161jsn6277619c4984',
//       'X-RapidAPI-Host': 'arimagesynthesizer.p.rapidapi.com',
//     },
//   };

//   try {
//     if (imgUrl === comparisonHash) {
//       clearInterval(grabImage);
//       fetch(url, options)
//         .then((response) => response.blob())
//         .then((blob) => {
//           const reader = new FileReader();
//           console.log(blob);
//           reader.readAsDataURL(blob);
//           reader.onloadend = () => {
//             const base64data = reader.result;
//             console.log(base64data); //GETS US A USEABLE BASE64 OUTPUT

//             //img element creation
//             const parentElement = document.getElementById('testtext');
//             const imgElement = document.createElement('img');
//             imgElement.id = 'genimg';
//             imgElement.src = base64data;
//             parentElement.append(imgElement);
//           };
//         });
//     } else if (imgUrl !== comparisonHash) {
//       // console.log('image url ' + imgUrl);
//       // console.log('comparison url' + comparisonHash);
//       clearInterval(grabImage);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }, 10000);

// // render img on page

// // get message status

// // get img

// // console.log(getUserPrompt());
// // imageGen();
// // getImg(); //GET IMG should be last function to run
// // hashProcessing();

// // console.log('retrieval script connected...');


// new script for rapidAI Image generation

document.addEventListener("DOMContentLoaded", () => {
  const parent = document.getElementById("testtext");
  if (!parent) return;

  function ensureImg() {
    let img = document.getElementById("genimg");
    if (!img) {
      img = document.createElement("img");
      img.id = "genimg";
      img.alt = "Generated character";
      parent.appendChild(img);
    }
    return img;
  }

  async function getUserPrompt() {
    const res = await fetch("/api/characters", { cache: "no-store" });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return "fantasy character portrait, highly detailed, cinematic lighting";
    }

    const last = data[data.length - 1];
    const gender = last.character_gender ?? "unknown";
    const hair = last.hair_color ?? "dark";
    const eyes = last.eye_color ?? "brown";
    const race = last.race?.race_name ?? "human";
    const klass = last.class?.class_name ?? "adventurer";

    return `${gender} ${race} ${klass} fantasy character portrait, ${hair} hair, ${eyes} eyes, highly detailed, cinematic lighting`;
  }

  // Call this from your "Generate Character" click handler
  async function generateImage() {
    const img = ensureImg();
    img.removeAttribute("src");

    const prompt = await getUserPrompt();

    const res = await fetch("/api/images/imagegen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const contentType = res.headers.get("content-type") || "";

    // Case 1: backend returns JSON with imageUrl
    if (contentType.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Imagegen failed (${res.status})`);
      }

      if (!data.imageUrl) {
        throw new Error("No imageUrl returned from backend");
      }

      img.src = data.imageUrl;
      return;
    }

    // Case 2: backend returns image bytes
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Imagegen failed (${res.status}): ${t}`);
    }

    const blob = await res.blob();
    img.src = URL.createObjectURL(blob);
  }

  // If you already auto-run generation on output page:
  generateImage().catch(console.error);

  // Otherwise, expose generateImage() and call it from your existing generate flow.
});


