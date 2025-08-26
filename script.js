function goToPage(pageId) {
  // Hide all pages
  document.querySelectorAll("div").forEach(div => {
    div.style.display = "none";
  });

  // Show the selected page
  document.getElementById(pageId).style.display = "block";
}
// Morse code dictionary
const morseCodeMap = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..",
  "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  "?": "..--..", "!": "-.-.--", ".": ".-.-.-", ",": "--..--", " ": "/"
};

// Reverse dictionary for Morse → English
const englishMap = {};
for (let key in morseCodeMap) {
  englishMap[morseCodeMap[key]] = key;
}

// Convert English to Morse
function autoConvert() {
  const input = document.getElementById("converter-input").value.trim();
  if (!input) {
    document.getElementById("converter-output").value = "";
    return;
  }

  // Check if the input looks like Morse code
  const morsePattern = /^[.\-\/\s]+$/;
  if (morsePattern.test(input)) {
    // Convert from Morse to English
    const english = input.split(' ').map(code => inverseMorseMap[code] || '').join('');
    document.getElementById("converter-output").value = english;
  } else {
    // Convert from English to Morse
    const text = input.toUpperCase();
    const morse = text.split('').map(c => morseCodeMap[c] || '').join(' ');
    document.getElementById("converter-output").value = morse;
  }
}

// Speak English text using browser TTS
function speakEnglish() {
  const text = document.getElementById("outputText").value;
  if (text.trim() === "") {
    alert("Please convert some text first!");
    return;
  }
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  window.speechSynthesis.speak(msg);
}

// Play Morse code as beeps
function playMorse() {
  const morse = document.getElementById("outputText").value.trim();
  if (morse === "") {
    alert("Please convert some text to Morse code first!");
    return;
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let time = audioCtx.currentTime;

  morse.split("").forEach(symbol => {
    if (symbol === ".") {
      playBeep(audioCtx, time, 0.1); // dot = short beep
      time += 0.2;
    } else if (symbol === "-") {
      playBeep(audioCtx, time, 0.3); // dash = long beep
      time += 0.4;
    } else if (symbol === " ") {
      time += 0.3; // space between letters
    } else if (symbol === "/") {
      time += 0.7; // space between words
    }
  });
}

// Helper function to create a beep sound
function playBeep(audioCtx, startTime, duration) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // 600Hz beep
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}
