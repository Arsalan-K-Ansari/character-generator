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


// new script

document.addEventListener("DOMContentLoaded", () => {
  const parent = document.getElementById("testtext"); // where you want the image
  if (!parent) return;

  const showStatus = (msg) => {
    let p = document.getElementById("imgstatus");
    if (!p) {
      p = document.createElement("p");
      p.id = "imgstatus";
      parent.appendChild(p);
    }
    p.textContent = msg;
  };

  const getUserPrompt = async () => {
    const res = await fetch("/api/characters");
    const data = await res.json();
    const last = data[data.length - 1];

    const gender = last.character_gender;
    const hair = last.hair_color;
    const eyes = last.eye_color;
    const race = last.race?.race_name;
    const cls = last.class?.class_name;

    return `${gender} ${race} ${cls} fantasy character with ${hair} hair and ${eyes} eyes`;
  };

  const startImageGen = async () => {
    showStatus("Generating image...");

    const prompt = await getUserPrompt();

    const res = await fetch("/api/images/imagegen", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ prompt }),
    });

    const json = await res.json(); // your backend returns JSON string currently; better return JSON
    // If your backend still does res.send(result) (string), use: const json = JSON.parse(await res.text());

    if (!json.hash) {
      showStatus("No hash returned from image generator.");
      return;
    }

    await pollForImage(json.hash);
  };

  const pollForImage = async (hash) => {
    const maxTries = 40; // ~40 * 1500ms = ~60s
    const delayMs = 1500;

    for (let i = 0; i < maxTries; i++) {
      showStatus(`Waiting for image... (${i + 1}/${maxTries})`);

      const res = await fetch(`/api/images/genimg?hash=${encodeURIComponent(hash)}`);

      // If still processing, backend returns 202 JSON
      const ct = res.headers.get("content-type") || "";
      if (res.status === 202 || ct.includes("application/json")) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      if (!res.ok) {
        showStatus("Error fetching generated image.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      document.getElementById("genimg")?.remove();
      const img = document.createElement("img");
      img.id = "genimg";
      img.src = url;
      parent.appendChild(img);

      showStatus(""); // clear
      return;
    }

    showStatus("Timed out waiting for image. Try again.");
  };

  startImageGen().catch((e) => {
    console.error(e);
    showStatus("Image generation failed.");
  });
});