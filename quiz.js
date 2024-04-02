document.getElementById('generate-quiz').addEventListener('click', function() {
    // Call fetch to load the JSON and generate the quiz
    fetchQuestions().then(questions => {
        if (questions) {
            generateQuiz(questions);
            this.style.display = 'none'; // Hide generate button
            document.getElementById('submit-quiz').style.display = 'block'; // Show submit button
        }
    });
});

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json'); // Fetch the questions from the JSON file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const questions = await response.json(); // Parse the JSON
        return questions; // Return the parsed JSON
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function generateQuiz(questionsJson) {
    const selectedQuestions = getRandomQuestions(questionsJson, 10);
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = ''; // Clear previous quiz
    selectedQuestions.forEach((q, index) => {
        const questionElem = document.createElement('div');
        questionElem.classList.add('question');
        questionElem.innerHTML = `<h3>${q.question}</h3>`;
        q.options.forEach((option, optionIndex) => {
            const optionContainer = document.createElement('div'); // Container for each option
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.id = `question-${index}-option-${optionIndex}`;
            optionInput.name = `question-${index}`;
            optionInput.value = optionIndex;
            const optionLabel = document.createElement('label');
            optionLabel.setAttribute('for', optionInput.id);
            optionLabel.textContent = option;
            optionContainer.appendChild(optionInput);
            optionContainer.appendChild(optionLabel);
            questionElem.appendChild(optionContainer);
        });
        quizContainer.appendChild(questionElem);
    });
}

function getRandomQuestions(allQuestions, numQuestions) {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

document.getElementById('submit-quiz').addEventListener('click', async function() {
    const questionsJson = await fetchQuestions(); // Fetch the questions again for scoring
    if (!questionsJson) return; // Stop if there was an error fetching the questions

    const quizContainer = document.getElementById('quiz');
    const answers = quizContainer.querySelectorAll('input[type="radio"]:checked');
    let score = 0;
    answers.forEach((answer) => {
        const questionIndex = parseInt(answer.name.split('-')[1]);
        const question = questionsJson[questionIndex];
        const correctAnswers = question.correct_answers.map(num => num - 1); // Adjust for zero-based index
        const optionIndex = parseInt(answer.value);
        const label = answer.nextElementSibling; // Assuming label is immediately after input

        if (correctAnswers.includes(optionIndex)) {
            score++;
            label.style.color = 'green';
        } else {
            label.style.color = 'red';
        }

        // Highlight all correct answers
        correctAnswers.forEach((correctIndex) => {
            const correctOptionId = `question-${questionIndex}-option-${correctIndex}`;
            const correctLabel = document.querySelector(`label[for="${correctOptionId}"]`);
            correctLabel.style.color = 'green';
        });
    });

    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML = `Ai răspuns corect la <strong>${score}</strong> din ${questionsJson.length} întrebări.`;
    document.getElementById('submit-quiz').style.display = 'none'; // Optionally hide submit button after grading
});
