const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounterText");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [

    {
        question: "Who is the founder of Pakistan?",
        choice1: "Allama Iqbal",
        choice2: "Liaquat Ali Khan",
        choice3: "Quaid e Azam",
        choice4: "fatima Jinnah",
        answer: 3
    },
    {
        question: "What is the capital of France?",
        choice1: "Madrid",
        choice2: "Berlin",
        choice3: "Paris",
        choice4: "Lisbon",
        answer: 3
    },
    {
        question: "Which planet is known as the Red Planet?",
        choice1: "Earth",
        choice2: "Mars",
        choice3: "Jupiter",
        choice4: "Venus",
        answer: 2
    },
    {
        question: "Who wrote 'Hamlet'?",
        choice1: "Charles Dickens",
        choice2: "William Shakespeare",
        choice3: "Jane Austen",
        choice4: "Mark Twain",
        answer: 2
    },
    {
        question: "What is the largest mammal on Earth?",
        choice1: "Elephant",
        choice2: "Blue Whale",
        choice3: "Giraffe",
        choice4: "Rhino",
        answer: 2
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        choice1: "China",
        choice2: "Japan",
        choice3: "South Korea",
        choice4: "Thailand",
        answer: 2
    }
    

]
 const CORRECT_BONUS = 5;
 const MAX_QUESTIONS = 7;

 startGame = () => {
     questionCounter = 0;
     score = 0;
     availableQuestions = [...questions];
     console.log(availableQuestions);
     getNewQuestion();
 };

 getNewQuestion = () => {
    if (availableQuestions.length ===  0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);

        return window.location.assign("end.html");
    };
    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
 };

 choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
setTimeout( () => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
    }, 1000);
        
    });
 });

 incrementScore = num => {
    score += num;
    scoreText.innerText = score;
 };
 startGame();
