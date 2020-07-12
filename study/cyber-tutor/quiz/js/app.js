const myQuestions = [

  {
    question: "What does cybersecurity protect?",
    answers: {
      a: " Information systems, programs, and data ",
      b: " Houses and neighborhoods ",
      c: " Jobs "
    },
    correctAnswer: " Information systems, programs, and data "
  },
  {
    question: "What does a hacker use to gain access to a system?",
    answers: {
      a: " Paper and pencil ",
      b: " Computer ",
      c: " Hammer "
    },
    correctAnswer: " Computer "
  },
  {
    question: "What is the relationship between a vulnerability and an exploit?",
    answers: {
      a: " An exploit is needed for a vulnerability to succeed ",
      b: " A vulnerability enables hackers to utilize an exploit ",
      c: " Hackers can use an exploit even without a vulnerability in a system "
    },
    correctAnswer: " A vulnerability enables hackers to utilize an exploit "
  },
];

function createQuiz() {
	
  // variable to store the HTML output
  const output = [];

  // for each question...
  myQuestions.forEach (
  
    (currentQuestion, questionNumber) => {

      // variable to store the list of possible answers
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {

        // ...add an HTML radio button
		 answers.push (
		 
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${currentQuestion.answers[letter]}
          </label>`
		  
        );
      }

      // add this question and its answers to the output
      output.push (
	  
        `<div class="question"> <b> ${currentQuestion.question} </b> </div>
        <div class="answers"> ${answers.join('<br> ')}  </div>`
		
      );
    }
  );

  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join('');
}

function showAnswers() {

  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll('.answers');

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach ( (currentQuestion, questionNumber) => {

    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
	
    // if answer is correct
    if (currentQuestion.answers[userAnswer] === currentQuestion.correctAnswer) {
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = 'lightgreen';
    }
    // if answer is wrong or blank
    else {
      // color the answers red
      answerContainers[questionNumber].style.color = 'red';
    }
  });

  // show number of correct answers out of total
  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

// display quiz right away
createQuiz();

// on submit, show answers
submitButton.addEventListener('click', showAnswers);
