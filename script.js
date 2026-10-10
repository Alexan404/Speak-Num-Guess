const msgEl = document.getElementById('msg');
const listenButton = document.getElementById('listen');
const statusEl = document.getElementById('status');

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const randomNum = getRandomNumber();
console.log('Number:', randomNum);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  listenButton.disabled = true;
  statusEl.textContent =
    'Speech recognition is not supported in this browser. Try Chrome or Edge.';
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;

  listenButton.addEventListener('click', () => {
    statusEl.textContent = 'Listening…';
    listenButton.disabled = true;

    try {
      recognition.start();
    } catch (error) {
      listenButton.disabled = false;
      statusEl.textContent = `Could not start the microphone: ${error.message}`;
    }
  });

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript.trim().toLowerCase();
    writeMessage(transcript);
    checkNumber(transcript);
  });

  recognition.addEventListener('error', (event) => {
    const messages = {
      'not-allowed': 'Microphone access was blocked. Allow it in your browser settings and try again.',
      'service-not-allowed': 'Speech recognition is unavailable. Try Chrome or Edge.',
      'audio-capture': 'No microphone was found. Check that one is connected and enabled.',
      network: 'Speech recognition needs a network connection. Check your connection and try again.',
      'no-speech': 'No speech was detected. Click the microphone and try again.',
    };

    statusEl.textContent =
      messages[event.error] || `Speech recognition error: ${event.error}.`;
  });

  recognition.addEventListener('end', () => {
    listenButton.disabled = false;
    if (statusEl.textContent === 'Listening…') {
      statusEl.textContent = 'Click the microphone and try again.';
    }
  });
}

function writeMessage(message) {
  msgEl.replaceChildren();
  const said = document.createElement('div');
  said.textContent = 'You said:';
  const transcript = document.createElement('span');
  transcript.classList.add('box');
  transcript.textContent = message;
  msgEl.append(said, transcript);
}

function checkNumber(message) {
  const wordToNumber = {
    one: 1,
    won: 1,
    two: 2,
    to: 2,
    too: 2,
    three: 3,
    four: 4,
    for: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    ate: 8,
    nine: 9,
    ten: 10,
  };
  const number = wordToNumber[message] ?? Number(message);

  if (!Number.isFinite(number)) {
    appendMessage('That is not a valid number.');
  } else if (number < 1 || number > 100) {
    appendMessage('Number must be between 1 and 100.');
  } else if (number === randomNum) {
    const heading = document.createElement('h2');
    heading.textContent = `Congrats! You guessed the number: ${number}`;
    const button = document.createElement('button');
    button.classList.add('play-again');
    button.textContent = 'Play Again';
    button.addEventListener('click', () => window.location.reload());
    msgEl.append(heading, button);
  } else {
    appendMessage(number > randomNum ? 'GO LOWER' : 'GO HIGHER');
  }
}

function appendMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  msgEl.append(div);
}
