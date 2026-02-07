let questions = [];
let currentIndex = 0;
let score = 0;
let selectedChoices = [];

const dataPath = 'data/sharing_and_visibility_exams.json';

const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const setupContainer = document.getElementById('setup-container');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const nextBtn = document.getElementById('next-btn');
const summaryContainer = document.getElementById('summary-container');

// JSONデータの読み込みと開始
startBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error('Network response was not ok');
        questions = await response.json();
        setupContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        document.getElementById('total-questions').textContent = questions.length;
        showQuestion();
    } catch (error) {
        alert('エラー：JSONが見つからないか、正しくありません。');
        console.error(error);
    }
});

function showQuestion() {
    const q = questions[currentIndex];
    selectedChoices = [];
    resultContainer.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    
    document.getElementById('current-pos').textContent = currentIndex + 1;
    questionText.textContent = q.question_ja;
    choicesContainer.innerHTML = '';

    // 選択肢の生成
    Object.entries(q.choices).forEach(([key, value]) => {
        const div = document.createElement('div');
        div.className = 'choice-item';
        div.textContent = `${key}: ${value}`;
        div.onclick = () => selectChoice(div, key);
        choicesContainer.appendChild(div);
    });
}

function selectChoice(element, key) {
    const q = questions[currentIndex];
    const isMultiple = q.correct_answer.length > 1;
    
    if (!isMultiple) {
        document.querySelectorAll('.choice-item').forEach(el => el.classList.remove('selected'));
        selectedChoices = [key];
        element.classList.add('selected');
    } else {
        if (selectedChoices.includes(key)) {
            selectedChoices = selectedChoices.filter(k => k !== key);
            element.classList.remove('selected');
        } else {
            selectedChoices.push(key);
            element.classList.add('selected');
        }
    }
}

// 回答チェック
submitBtn.addEventListener('click', () => {
    if (selectedChoices.length === 0) return alert('回答を選択してください');
    
    const q = questions[currentIndex];
    const correctAnswers = q.correct_answer.sort().join(',');
    const userAnswers = selectedChoices.sort().join(',');
    
    submitBtn.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    const judgement = document.getElementById('judgement');
    const explanation = document.getElementById('explanation');

    if (correctAnswers === userAnswers) {
        judgement.textContent = "✅ 正解！";
        judgement.className = "correct";
        score++;
    } else {
        judgement.textContent = `❌ 不正解（正解: ${correctAnswers}）`;
        judgement.className = "incorrect";
    }
    explanation.textContent = q.explanation_ja;
});

nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showSummary();
    }
});

function showSummary() {
    quizContainer.classList.add('hidden');
    summaryContainer.classList.remove('hidden');
    document.getElementById('final-score').textContent = `${questions.length}問中 ${score}問正解でした！`;
}
