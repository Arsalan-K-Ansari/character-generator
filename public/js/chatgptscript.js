//need to create string from form inputs to then send to chatgpt. Make that database inputs.
//front end JS needs to first do a GET request to the backend where a route to query info has been set up to SELECT fields that were input into the form
//results of GET request get make into queries for backstory and char name
//using the below endpoint to test for now

///api/characters

//JSON for testing below for easy copy/paste via insomnia

// {
// 	"character_gender": "female",
// 	"eye_color": "purple",
// 	"hair_color": "blue",
// 	"class_name": "cleric",
// 	"race_name": "elf",
// 	"class_id": 1,
// 	"race_id": 2
// }

const getBackstoryPrompt = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch('/api/characters', options);
    const data = await response.json();
    // console.log(data);
    // console.log(data);
    // console.log(data.length);
    const arrayLength = data.length;
    const lastCharacter = data[arrayLength - 1];
    // character_gender
    // class
    // race
    const characterGender = lastCharacter.character_gender;
    // console.log(characterGender);
    const characterClass = lastCharacter.class.class_name;
    // console.log(characterClass);
    const characterRace = lastCharacter.race.race_name;
    // console.log(characterRace);
    // console.log(data[0].character_gender + ' ' + data[0].race_id);
    // console.log(data[0].character_gender);
    // let char_gen = data[0].character_gender;
    //console.log(typeof data[0].character_gender); //string
    // console.log(
    //   'Without using the character name, generate a cool backstory for a ' +
    //     characterGender +
    //     ' ' +
    //     characterClass +
    //     ' ' +
    //     characterRace +
    //     ' fantasy character. Do not use the character name.',
    // );
    return (
      'Without using the character name, generate a cool backstory for a ' +
      characterGender +
      ' ' +
      characterClass +
      ' ' +
      characterRace +
      ' fantasy character. Do not use the character name.'
    );
  } catch (error) {
    console.error();
  }
};

const getNamePrompt = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch('/api/characters', options);
    const data = await response.json();
    // console.log(data);
    // console.log(data.length);
    const arrayLength = data.length;
    const lastCharacter = data[arrayLength - 1];
    // character_gender
    // class
    // race
    const characterGender = lastCharacter.character_gender;
    // console.log(characterGender);
    const characterClass = lastCharacter.class.class_name;
    // console.log(characterClass);
    const characterRace = lastCharacter.race.race_name;
    // console.log(characterRace);
    // console.log(data);
    // console.log(data);
    // console.log(data[0].character_gender + ' ' + data[0].race_id);
    // console.log(data[0].character_gender);
    // let char_gen = data[0].character_gender;
    //console.log(typeof data[0].character_gender); //string
    return (
      'generate a cool name for a ' +
      characterGender +
      ' ' +
      characterClass +
      ' ' +
      characterRace +
      ' fantasy character from the 1800s.'
    );
  } catch (error) {
    console.error();
  }
};

const parentElement = document.querySelector('#backstoryappend');
const parentElementName = document.querySelector('#charnameappend');

const getBackstory = async () => {
  const pElement = document.createElement('p');
  pElement.id = 'backstoryoutput';
  pElement.textContent = 'Loading, please wait...';
  parentElement.append(pElement);
  const options = {
    method: 'POST',
    body: JSON.stringify({
      prompt: await getBackstoryPrompt(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch('/api/chatgpt/getbackstory', options);
    const data = await response.json();
    // console.log(data);
    // console.log(data.choices[0].text);
    //add in a bit of text for the user to continue the story since there is not a clean way for Chatgpt to conclude output (sentence ending)
    const pElement = document.querySelector('#backstoryoutput');
    pElement.textContent = (data.choices?.[0]?.text || "").trim();
  } catch (error) {
    console.error();
  }
};

const getName = async () => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      prompt: await getNamePrompt(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch('/api/chatgpt/namegen', options);
    const data = await response.json();
    // console.log(data);
    // console.log(data.choices[0].text);
    //add in a bit of text for the user to continue the story since there is not a clean way for Chatgpt to conclude output (sentence ending)
    const pElement = document.createElement('p');
    pElement.id = 'genname';
    pElement.textContent = data.choices[0].text.replace('.', '');
    parentElementName.append(pElement);
  } catch (error) {
    console.error();
  }
};

//these functions will run on an event listener? when a button is clicked, go and generate? or just this way on page load?
getBackstory();
getName();
// const getBackstory = async () => {
//   const result = await getPrompt();
// do something else here after firstFunction completes
// };

function reGen() {
  //wipe the current boxes
  document.querySelector('#genname').remove();
  document.querySelector('#backstoryoutput').remove();
  getBackstory();
  getName();
}

//maybe something here to show while the page is loading?

// console.log('the chatgpt backstory script is connected');

const reGenButton = document.querySelector('#regen');

reGenButton.addEventListener('click', reGen);

// console.log('bananas');
