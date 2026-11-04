const wordBank = [
  "morning", "window", "garden", "gentle", "bright", "wonder", "little", "steady",
  "simple", "create", "follow", "travel", "moment", "pocket", "breeze", "before",
  "listen", "yellow", "inside", "future", "coffee", "stream", "circle", "bundle",
  "forest", "summer", "people", "enough", "notice", "silver", "across", "kindly",
  "canvas", "quiet", "gather", "almost", "smooth", "happen", "curious", "pencil",
  "energy", "always", "useful", "gentle", "change", "wonder", "fresh", "balance",
  "rhythm", "minute", "build", "clear", "shape", "small", "learn", "focus",
  "pause", "begin", "light", "move", "think", "make", "find", "grow"
];

const wordArea = document.querySelector("#word-area");
const input = document.querySelector("#typing-input");
const timeDisplay = document.querySelector("#time");
const speedDisplay = document.querySelector("#speed");
const accuracyDisplay = document.querySelector("#accuracy");
const result = document.querySelector("#result");
const resultCopy = document.querySelector("#result-copy");
const durationButtons = [...document.querySelectorAll(".mode-button")];
const durationOptions = durationButtons.map((button) => Number(button.dataset.duration));

let duration = 30;
let words = [];
let timerId = null;
let startedAt = null;
let remaining = duration;
let finished = false;

function makeWords() {
  const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
  words = Array.from({ length: 60 }, (_, index) => shuffled[index % shuffled.length]);
  wordArea.replaceChildren(...words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    if (index < words.length - 1) span.append(" ");
    return span;
  }));
}

function getTargetText() {
  return words.join(" ");
}

function getStats(typedText) {
  const target = getTargetText();
  const checkedLength = Math.min(typedText.length, target.length);
  let correct = 0;

  for (let index = 0; index < checkedLength; index += 1) {
    if (typedText[index] === target[index]) correct += 1;
  }

  const elapsedMinutes = startedAt === null
    ? 0
    : Math.max((Date.now() - startedAt) / 60_000, 1 / 60);
  const wpm = elapsedMinutes === 0 ? 0 : Math.round((correct / 5) / elapsedMinutes);
  const accuracy = checkedLength === 0 ? 100 : Math.round((correct / checkedLength) * 100);

  return { correct, checkedLength, wpm, accuracy };
}

function renderWords() {
  const typedText = input.value;
  const spans = wordArea.querySelectorAll(".word");

  spans.forEach((span, wordIndex) => {
    const wordStart = words.slice(0, wordIndex).reduce((total, word) => total + word.length + 1, 0);
    const typedWord = typedText.slice(wordStart, wordStart + words[wordIndex].length);
    span.classList.toggle("correct", typedWord.length === words[wordIndex].length
      && typedWord === words[wordIndex]);
    span.classList.toggle("incorrect", [...typedWord].some((character, index) =>
      character !== words[wordIndex][index]));
    span.classList.toggle("current", typedText.length >= wordStart
      && typedText.length < wordStart + words[wordIndex].length + 1);
  });

  wordArea.classList.toggle("finished", finished);
  const stats = getStats(typedText);
  speedDisplay.innerHTML = `${stats.wpm} <small>wpm</small>`;
  accuracyDisplay.innerHTML = `${stats.accuracy}<small>%</small>`;
}

function finishRound() {
  if (finished) return;
  finished = true;
  window.clearInterval(timerId);
  timerId = null;
  input.disabled = true;
  renderWords();
  const stats = getStats(input.value);
  resultCopy.textContent = `You typed ${stats.wpm} words per minute with ${stats.accuracy}% accuracy.`;
  result.hidden = false;
}

function updateTimer() {
  remaining = Math.max(0, duration - Math.floor((Date.now() - startedAt) / 1000));
  timeDisplay.textContent = remaining;
  renderWords();
  if (remaining === 0) finishRound();
}

function startTimer() {
  if (startedAt !== null || finished) return;
  startedAt = Date.now();
  timerId = window.setInterval(updateTimer, 100);
}

function resetRound() {
  window.clearInterval(timerId);
  timerId = null;
  startedAt = null;
  finished = false;
  remaining = duration;
  input.disabled = false;
  input.value = "";
  timeDisplay.textContent = duration;
  result.hidden = true;
  makeWords();
  renderWords();
}

input.addEventListener("input", () => {
  if (finished) return;
  if (input.value.length > 0) startTimer();
  renderWords();
  if (input.value.length >= getTargetText().length) finishRound();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});

durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedDuration = Number(button.dataset.duration);
    if (!durationOptions.includes(selectedDuration)) return;
    duration = selectedDuration;
    durationButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    resetRound();
    input.focus();
  });
});

document.querySelector("#restart").addEventListener("click", () => {
  resetRound();
  input.focus();
});

document.querySelector("#try-again").addEventListener("click", () => {
  resetRound();
  input.focus();
});

resetRound();
