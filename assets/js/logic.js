// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
let questionsEl = document.getElementById('questions');
let startBtn = document.getElementById('start');
let choicesEl = document.getElementById('choices');
let feedbackEl = document.getElementById('feedback');
let initialsEl = document.getElementById('initials');
let submitBtn = document.getElementById('submit');
let timeEl = document.getElementById('time');

// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  document.getElementById('start-screen').classList.add('hide');

  // un-hide questions section
  questionsEl.classList.remove('hide');

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timeEl.textContent = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.getElementById('question-title').textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over the choices for each question
  currentQuestion.choices.forEach(function (choice, index) {

    // create a new button for each choice, setting the label and value for the button
    let choiceBtn = document.createElement('button');
    choiceBtn.textContent = index + 1 + '. ' + choice;
    choiceBtn.setAttribute('value', choice);

    // display the choice button on the page
    choicesEl.appendChild(choiceBtn);
  });
}

function questionClick(event) {

  // if the clicked element is not a choice button, do nothing .
  if (!event.target.matches('button')) return;

  // identify the targeted button that was clicked on
  let userChoice = event.target.value;
  let correctAnswer = questions[currentQuestionIndex].answer;

  // check if user guessed right
  if (userChoice === correctAnswer) {

    // play "right" sound effect
    sfxRight.play();

    // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    feedbackEl.textContent = 'Correct!';
  }

  // check if user guessed wrong
  else {

    // play "wrong" sound effect
    sfxWrong.play();

    // display "wrong" feedback on page
    feedbackEl.textContent = 'Wrong!';

    // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 15;

    // if they run out of time (i.e., time is less than zero) set time to zero so we can end quiz
    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timeEl.textContent = time;
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.classList.remove('hide');
  setTimeout(function () {
    feedbackEl.classList.add('hide');
  }, 500);

// move to next question
  currentQuestionIndex++;

// check if we've run out of questions
// if the time is less than zero and we have reached the end of the questions array,
if (currentQuestionIndex === questions.length || time === 0) {

    // call a function that ends the quiz (quizEnd function)
    quizEnd();
  } else {

// or else get the next question
    getQuestion();
  }
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  
  // stop the timer
  clearInterval(timerId);

  // show end screen
  document.getElementById('end-screen').classList.remove('hide');

  // show final score
  document.getElementById('final-score').textContent = time;

  // hide the "questions" section
  questionsEl.classList.add('hide');
}

// add the code in this function to update the time, it should be called every second
function clockTick() {

  // right here - update time
  time--;

  // update the element to display the new time value
  timeEl.textContent = time;

  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// complete the steps to save the high score
function saveHighScore() {

  // get the value of the initials input box
  let initials = initialsEl.value.trim();

  // make sure the value of the initials input box wasn't empty
  if (initials !== '') {

  // if it is not, check and see if there is a value of high scores in local storage
  // if there isn't any, then create a new array to store the high score
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

  // add the new initials and high score to the array
    let newScore = { initials: initials, score: time };

  // convert the array to a piece of text
    highscores.push(newScore);

  // store the high score in local storage
    localStorage.setItem('highscores', JSON.stringify(highscores));

  // finally, redirect the user to the high scores page.
    window.location.href = './pages/highscores.html';
  } else {

    // if the value of the initials input box is empty, trigger a warning alert
    swal({
      title: "Kindly enter your short name",
      icon: "warning"
  });
  }
}

// use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {

  // if the user presses the enter key, then call the saveHighscore function
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
