// Quiz Data
const quiz = [
  {
    question: "Q. Which of the following is not a CSS box model property?",
    choices: ["margin", "padding", "border-radius", "border-collapse"],
    answer: "border-collapse"
  },
  {
    question: "Q. Which is not a valid way to declare a function in JavaScript?",
    choices: ["function myFunction() {}", "let myFunction = function() {};", "myFunction: function() {}", "const myFunction = () => {};"],
    answer: "myFunction: function() {}"
  },
  {
    question: "Q. Which is not a JavaScript data type?",
    choices: ["string", "boolean", "object", "float"],
    answer: "float"
  },
  {
    question: "Q. What is the purpose of the 'this' keyword in JavaScript?",
    choices: ["It refers to the current function.", "It refers to the current object.", "It refers to the parent object.", "It is used for comments."],
    answer: "It refers to the current object."
  }
];

const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alert = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');
const modeSwitch = document.getElementById('modeSwitch');

// Sounds
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const tickSound = new Audio('sounds/tick.mp3');
const finishSound = new Audio('sounds/finish.mp3');

let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 15;
let timerID = null;

function showQuestions() {
  const questionDetails = quiz[currentQuestionIndex];
  questionBox.textContent = questionDetails.question;
  choicesBox.innerHTML = "";

  questionDetails.choices.forEach(choice => {
    const div = document.createElement('div');
    div.classList.add('choice');
    div.textContent = choice;
    choicesBox.appendChild(div);

    div.addEventListener('click', () => {
      document.querySelectorAll('.choice').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    });
  });

  startTimer();
}

function checkAnswer() {
  const selected = document.querySelector('.choice.selected');
  if (!selected) {
    displayAlert("Select your answer");
    return;
  }

  const correct = quiz[currentQuestionIndex].answer;
  if (selected.textContent === correct) {
    selected.style.backgroundColor = "#00c853";
    selected.style.color = "#fff";
    score++;
    correctSound.play();
    displayAlert("✅ Correct Answer!");
  } else {
    selected.style.backgroundColor = "#d32f2f";
    selected.style.color = "#fff";
    wrongSound.play();
    displayAlert(`❌ Wrong! Correct: ${correct}`);
  }

  timeLeft = 15;
  currentQuestionIndex++;

  if (currentQuestionIndex < quiz.length) {
    setTimeout(showQuestions, 1500);
  } else {
    stopTimer();
    setTimeout(showScore, 1500);
  }
}

function showScore() {
  questionBox.textContent = "";
  choicesBox.innerHTML = "";
  scoreCard.textContent = `You Scored ${score} out of ${quiz.length}!`;
  displayAlert("🎉 Quiz Completed!");
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  finishSound.play();
  nextBtn.textContent = "Play Again";
  quizOver = true;
  timer.style.display = "none";
}

function displayAlert(msg) {
  alert.textContent = msg;
  alert.style.display = "block";
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
}

function startTimer() {
  clearInterval(timerID);
  timeLeft = 15;
  timer.querySelector("span").textContent = timeLeft;
  tickSound.currentTime = 0;
  tickSound.loop = true;
  tickSound.play();

  timerID = setInterval(() => {
    timeLeft--;
    timer.querySelector("span").textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerID);
      tickSound.pause();
      tickSound.currentTime = 0;
      const again = confirm("⏰ Time's Up! Try again?");
      if (again) {
        startQuiz();
      } else {
        container.style.display = "none";
        startBtn.style.display = "block";
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerID);
  tickSound.pause();
  tickSound.currentTime = 0;
}

function shuffleQuestions() {
  for (let i = quiz.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
  }
}

function startQuiz() {
  quizOver = false;
  currentQuestionIndex = 0;
  score = 0;
  scoreCard.textContent = "";
  timeLeft = 15;
  nextBtn.textContent = "Next";
  timer.style.display = "flex";
  container.style.display = "flex";
  shuffleQuestions();
  showQuestions();
}

startBtn.addEventListener('click', () => {
  startBtn.style.display = "none";
  container.style.display = "flex";
  startQuiz();
});

nextBtn.addEventListener('click', () => {
  if (quizOver) {
    startQuiz();
  } else {
    checkAnswer();
  }
});

// Toggle Mode
modeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});
