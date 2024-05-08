// HTML Element references
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

// Game state variables
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Data storage for the questions
let questions = [];

// Fetching questions from the Open Trivia Database
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      // Create a formatted object for each question
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      const correctAnswerPosition = Math.floor(Math.random() * 4); // Position for the correct answer
      formattedQuestion.answer = correctAnswerPosition + 1;

      // Insert the correct answer at the designated position
      answerChoices.splice(correctAnswerPosition, 0, loadedQuestion.correct_answer);

      // Assign the answer choices to the formatted question
      answerChoices.forEach((choice, index) => {
        formattedQuestion[`choice${index + 1}`] = choice;
      });

      return formattedQuestion;
    });

    startGame(); // Start the game once questions are loaded and formatted
  })
  .catch((err) => {
    console.error("Error fetching or processing questions:", err);
  });

// Constants for the game logic
const CORRECT_BONUS = 5; // Points per correct answer
const MAX_QUESTIONS = 7; // Maximum number of questions per game

// Function to start the game
function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // Copy the loaded questions
  getNewQuestion(); // Fetch the first question
}

// Function to get a new question
function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score); // Save the most recent score
    return window.location.assign("end.html"); // Redirect to the end page
  }

  questionCounter++; // Increment the question counter
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`; // Display the question counter

  const questionIndex = Math.floor(Math.random() * availableQuestions.length); // Randomly select a question
  currentQuestion = availableQuestions[questionIndex]; // Get the selected question
  question.innerText = currentQuestion.question; // Display the question text

  // Update the text for the answer choices
  choices.forEach((choice) => {
    const number = choice.dataset.number; // Get the choice number from the dataset
    choice.innerText = currentQuestion[`choice${number}`]; // Set the text for the choice
  });

  availableQuestions.splice(questionIndex, 1); // Remove the used question from the list
  acceptingAnswers = true; // Allow users to select an answer
}

// Event listener for choice selection
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return; // Don't process clicks if answers aren't accepted

    acceptingAnswers = false; // Block further clicks
    const selectedChoice = e.target; // The clicked choice
    const selectedAnswer = selectedChoice.dataset.number; // The chosen answer number
    
    const isCorrect = selectedAnswer == currentQuestion.answer; // Check if the answer is correct
    const classToApply = isCorrect ? "correct" : "incorrect"; // Apply the correct class
    
    if (isCorrect) {
      incrementScore(CORRECT_BONUS); // Increase the score if the answer is correct
    }

    // Apply the class and remove it after a delay to get the next question
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply); // Remove the applied class
      getNewQuestion(); // Load the next question
    }, 1000); // Wait 1 second before switching to the next question
  });
});

// Function to increment the score
function incrementScore(points) {
  score += points; // Increment the score
  scoreText.innerText = score; // Update the score display
}
