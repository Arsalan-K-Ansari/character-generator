// //need to create string from form inputs to then send to chatgpt. Make that database inputs.
// //front end JS needs to first do a GET request to the backend where a route to query info has been set up to SELECT fields that were input into the form
// //results of GET request get make into queries for backstory and char name
// //using the below endpoint to test for now

// ///api/characters

// //JSON for testing below for easy copy/paste via insomnia

// // {
// // 	"character_gender": "female",
// // 	"eye_color": "purple",
// // 	"hair_color": "blue",
// // 	"class_name": "cleric",
// // 	"race_name": "elf",
// // 	"class_id": 1,
// // 	"race_id": 2
// // }

// // trying to get fetch requests going 
// const parentElement = document.querySelector('#backstoryappend');
// const parentElementName = document.querySelector('#charnameappend');

// parentElement.append(pElement); // will crash if parentElement is null
// reGenButton.addEventListener('click', reGen); // will crash if reGenButton is null

// const getBackstoryPrompt = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   try {
//     const response = await fetch('/api/characters', options);
//     const data = await response.json();
//     // console.log(data);
//     // console.log(data);
//     // console.log(data.length);
//     const arrayLength = data.length;
//     const lastCharacter = data[arrayLength - 1];
//     // character_gender
//     // class
//     // race
//     const characterGender = lastCharacter.character_gender;
//     // console.log(characterGender);
//     const characterClass = lastCharacter.class.class_name;
//     // console.log(characterClass);
//     const characterRace = lastCharacter.race.race_name;
//     // console.log(characterRace);
//     // console.log(data[0].character_gender + ' ' + data[0].race_id);
//     // console.log(data[0].character_gender);
//     // let char_gen = data[0].character_gender;
//     //console.log(typeof data[0].character_gender); //string
//     // console.log(
//     //   'Without using the character name, generate a cool backstory for a ' +
//     //     characterGender +
//     //     ' ' +
//     //     characterClass +
//     //     ' ' +
//     //     characterRace +
//     //     ' fantasy character. Do not use the character name.',
//     // );
//     return (
//       'Without using the character name, generate a cool backstory for a ' +
//       characterGender +
//       ' ' +
//       characterClass +
//       ' ' +
//       characterRace +
//       ' fantasy character. Do not use the character name.'
//     );
//   } catch (error) {
//     console.error();
//   }
// };

// const getNamePrompt = async () => {
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   try {
//     const response = await fetch('/api/characters', options);
//     const data = await response.json();
//     // console.log(data);
//     // console.log(data.length);
//     const arrayLength = data.length;
//     const lastCharacter = data[arrayLength - 1];
//     // character_gender
//     // class
//     // race
//     const characterGender = lastCharacter.character_gender;
//     // console.log(characterGender);
//     const characterClass = lastCharacter.class.class_name;
//     // console.log(characterClass);
//     const characterRace = lastCharacter.race.race_name;
//     // console.log(characterRace);
//     // console.log(data);
//     // console.log(data);
//     // console.log(data[0].character_gender + ' ' + data[0].race_id);
//     // console.log(data[0].character_gender);
//     // let char_gen = data[0].character_gender;
//     //console.log(typeof data[0].character_gender); //string
//     return (
//       'generate a cool name for a ' +
//       characterGender +
//       ' ' +
//       characterClass +
//       ' ' +
//       characterRace +
//       ' fantasy character from the 1800s.'
//     );
//   } catch (error) {
//     console.error();
//   }
// };

// const parentElement = document.querySelector('#backstoryappend');
// const parentElementName = document.querySelector('#charnameappend');

// const getBackstory = async () => {
//   const pElement = document.createElement('p');
//   pElement.id = 'backstoryoutput';
//   pElement.textContent = 'Loading, please wait...';
//   parentElement.append(pElement);
//   const options = {
//     method: 'POST',
//     body: JSON.stringify({
//       prompt: await getBackstoryPrompt(),
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   try {
//     const response = await fetch('/api/chatgpt/getbackstory', options);
//     const data = await response.json();
//     // console.log(data);
//     // console.log(data.choices[0].text);
//     //add in a bit of text for the user to continue the story since there is not a clean way for Chatgpt to conclude output (sentence ending)
//     const pElement = document.querySelector('#backstoryoutput');
//     pElement.textContent = (data.choices?.[0]?.text || "").trim();
//   } catch (error) {
//     console.error();
//   }
// };

// const getName = async () => {
//   const options = {
//     method: 'POST',
//     body: JSON.stringify({
//       prompt: await getNamePrompt(),
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   try {
//     const response = await fetch('/api/chatgpt/namegen', options);
//     const data = await response.json();
//     // console.log(data);
//     // console.log(data.choices[0].text);
//     //add in a bit of text for the user to continue the story since there is not a clean way for Chatgpt to conclude output (sentence ending)
//     const pElement = document.createElement('p');
//     pElement.id = 'genname';
//     pElement.textContent = data.choices[0].text.replace('.', '');
//     parentElementName.append(pElement);
//   } catch (error) {
//     console.error();
//   }
// };

// //these functions will run on an event listener? when a button is clicked, go and generate? or just this way on page load?
// getBackstory();
// getName();
// // const getBackstory = async () => {
// //   const result = await getPrompt();
// // do something else here after firstFunction completes
// // };

// function reGen() {
//   //wipe the current boxes
//   document.querySelector('#genname').remove();
//   document.querySelector('#backstoryoutput').remove();
//   getBackstory();
//   getName();
// }

// //maybe something here to show while the page is loading?

// // console.log('the chatgpt backstory script is connected');

// const reGenButton = document.querySelector('#regen');

// reGenButton.addEventListener('click', reGen);

// // console.log('bananas');


// New script

// public/js/chatgptscript.js

document.addEventListener("DOMContentLoaded", () => {
  const parentElement = document.querySelector("#backstoryappend");
  const parentElementName = document.querySelector("#charnameappend");
  const reGenButton = document.querySelector("#regen");

  if (!parentElement || !parentElementName) return;

  console.log("chatgptscript loaded ✅");

  // Ensure output nodes exist (so we can just update textContent)
  const ensureP = (parent, id, initialText = "") => {
    let el = document.querySelector(`#${id}`);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      parent.append(el);
    }
    el.textContent = initialText;
    return el;
  };

  const backstoryEl = ensureP(parentElement, "backstoryoutput", "Loading, please wait...");
  const nameEl = ensureP(parentElementName, "genname", "Loading, please wait...");

  // Fetch latest character ONCE and reuse it for both prompts
  const fetchLastCharacter = async () => {
    try {
      const response = await fetch("/api/characters", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store", // helps avoid 304/cached surprises
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      return data[data.length - 1];
    } catch (err) {
      console.error("Error fetching /api/characters:", err);
      return null;
    }
  };

  const buildPrompts = (lastCharacter) => {
    if (!lastCharacter) {
      return {
        backstoryPrompt: "Generate a cool fantasy character backstory (4-6 sentences).",
        namePrompt: "Generate a cool fantasy character name. Only return the name.",
      };
    }

    const characterGender = lastCharacter.character_gender || "unknown";
    const characterClass = lastCharacter.class?.class_name || "adventurer";
    const characterRace = lastCharacter.race?.race_name || "human";

    return {
      backstoryPrompt: `Without using the character name, generate a cool backstory for a ${characterGender} ${characterClass} ${characterRace} fantasy character. Keep it 4-6 sentences. Do not use the character name.`,
      namePrompt: `Generate a cool name for a ${characterGender} ${characterClass} ${characterRace} fantasy character from the 1800s. Only return the name.`,
    };
  };

  const postJson = async (url, bodyObj) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(bodyObj),
    });

    // Try to parse JSON even on errors (so we can display message)
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const msg = data?.error?.message || data?.error || `Request failed (${response.status})`;
      throw new Error(msg);
    }

    return data;
  };

  const extractChoiceText = (data) => {
    // Matches your current backend shape: data.choices[0].text
    const text = (data?.choices?.[0]?.text || "").trim();
    return text;
  };

  const setLoading = (isLoading) => {
    if (reGenButton) reGenButton.disabled = isLoading;
    if (isLoading) {
      nameEl.textContent = "Generating name...";
      backstoryEl.textContent = "Generating backstory...";
    }
  };

  const generateBoth = async () => {
    setLoading(true);

    try {
      const lastCharacter = await fetchLastCharacter();
      const { namePrompt, backstoryPrompt } = buildPrompts(lastCharacter);

      // Run OpenAI calls in parallel
      const [nameData, backstoryData] = await Promise.all([
        postJson("/api/chatgpt/namegen", { prompt: namePrompt }),
        postJson("/api/chatgpt/getbackstory", { prompt: backstoryPrompt }),
      ]);

      const nameText = extractChoiceText(nameData).replace(/\.$/, "");
      const backstoryText = extractChoiceText(backstoryData);

      nameEl.textContent = nameText || "No name returned.";
      backstoryEl.textContent = backstoryText || "No backstory returned.";
    } catch (err) {
      console.error(err);
      // Show the actual error so you know what's wrong in prod
      nameEl.textContent = `Error: ${err.message}`;
      backstoryEl.textContent = `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  };

  // Initial run
  generateBoth();

  // Regen button
  reGenButton?.addEventListener("click", generateBoth);
});