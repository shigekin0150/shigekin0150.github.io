let questions = [];
const dataPath = 'data/sharing_and_visibility_exams.json';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error('JSON読み込み失敗');

        questions = await response.json();
        renderQuestions();

    } catch (error) {
        alert('エラー：JSONが見つからないか正しくありません。');
        console.error(error);
    }
});

function renderQuestions() {
    const container = document.getElementById('question-list');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';

        const title = document.createElement('div');
        title.className = 'question-title';
        title.textContent = `Q${index + 1}. ${q.question_ja}`;
        card.appendChild(title);

        const choicesWrap = document.createElement('div');
        choicesWrap.className = 'choices';

        Object.entries(q.choices).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'choice-item';
            item.textContent = `${key}: ${value}`;
            choicesWrap.appendChild(item);
        });

        card.appendChild(choicesWrap);
        container.appendChild(card);
    });
}
