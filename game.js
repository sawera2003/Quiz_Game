// HTML Element references
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

// Variables for game logic
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Constants for game configuration
const CORRECT_BONUS = 5; // Points per correct answer
const MAX_QUESTIONS = 7; // Maximum number of questions per game

// Fetch the questions from a JSON file
fetch("questions.json")
  .then((response) => response.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startGame(); // Start the game once questions are loaded
  })
  .catch((err) => {
    console.error("Error loading questions:", err);
  });

// Function to start the game
function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // Create a copy of questions
  getNewQuestion(); // Fetch the first question
}

// Function to get a new question
function getNewQuestion() {
  // If no more questions or max question count is reached, end the game
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html");
  }

  questionCounter++; // Increment the question counter
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  // Randomly select a new question
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];

  // Update the question text
  question.innerText = currentQuestion.question;

  // Update the choice text for each available option
  choices.forEach((choice) => {
    const number = choice.dataset.number;
    choice.innerText = currentQuestion[`choice${number}`];
  });

  // Remove the used question from the available questions
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true; // Allow users to answer the question
}

// Handle choice selection by users
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return; // Ignore clicks if not accepting answers

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset.number;

    // Determine if the selected answer is correct or incorrect
    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS); // Increment the score for correct answers
    }

    // Apply the correct/incorrect class to the parent element
    selectedChoice.parentElement.classList.add(classToApply);

    // Remove the applied class after a delay and get the next question
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion(); // Load the next question
    }, 1000);
  });
});

// Function to increment the score
function incrementScore(bonus) {
  score += bonus; // Increment the score by the specified bonus
  scoreText.innerText = score; // Update the displayed score
}
