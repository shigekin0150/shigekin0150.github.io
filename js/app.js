let questions = [];
const dataPath = 'data/sharing_and_visibility_exams.json';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(dataPath);
    if (!response.ok) throw new Error('JSON読み込み失敗');

    const raw = await response.json();

    // raw が [ { generated_at, questions:[...] }, ... ] の形式を想定
    // それ以外でも落ちないように吸収
    questions = extractQuestions(raw);

    renderQuestions();
  } catch (error) {
    alert('エラー：JSONが見つからないか正しくありません。');
    console.error(error);
  }
});

function extractQuestions(raw) {
  // ケース1: 既に問題配列
  if (Array.isArray(raw) && raw.length > 0 && raw[0]?.question_ja) {
    return raw;
  }

  // ケース2: [ { questions: [...] }, ... ]
  if (Array.isArray(raw)) {
    const merged = [];
    raw.forEach(item => {
      if (item && Array.isArray(item.questions)) merged.push(...item.questions);
    });
    return merged;
  }

  // ケース3: { questions:[...] }
  if (raw && Array.isArray(raw.questions)) {
    return raw.questions;
  }

  return [];
}

function renderQuestions() {
  const container = document.getElementById('question-list');
  container.innerHTML = '';

  if (!questions.length) {
    container.textContent = '問題データが見つかりません（JSON構造を確認してください）';
    return;
  }

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';

    const title = document.createElement('div');
    title.className = 'question-title';
    title.textContent = `Q${q.question_no ?? (index + 1)}. ${q.question_ja || '問題文なし'}`;
    card.appendChild(title);

    const choicesWrap = document.createElement('div');
    choicesWrap.className = 'choices';

    const choices = q.choices_ja; // ←ここ重要
    if (choices && typeof choices === 'object') {
      Object.entries(choices).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'choice-item';
        item.textContent = `${key}: ${value}`;
        choicesWrap.appendChild(item);
      });
    } else {
      const item = document.createElement('div');
      item.className = 'choice-item';
      item.textContent = '（選択肢データなし）';
      choicesWrap.appendChild(item);
    }

    card.appendChild(choicesWrap);
    container.appendChild(card);
  });
}
