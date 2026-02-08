let totalBroken = 0;
let gaugePos = 0;
let direction = 1;
const gauge = document.getElementById('gauge');
const actionBtn = document.getElementById('action-btn');
const char = document.getElementById('character');
const countDisp = document.getElementById('count');

// メーターを動かす（クソゲーらしい速さに調整）
function moveGauge() {
    gaugePos += 4 * direction; // 速さ。ここを大きくすると難易度アップ
    if (gaugePos > 290 || gaugePos < 0) direction *= -1;
    gauge.style.left = gaugePos + 'px';
    requestAnimationFrame(moveGauge);
}
moveGauge();

actionBtn.addEventListener('click', () => {
    // パンチのアニメーション
    char.classList.add('punch');
    setTimeout(() => char.classList.remove('punch'), 100);

    // 判定（130px〜170pxが赤いゾーン）
    if (gaugePos >= 125 && gaugePos <= 175) {
        let broken = 10 + Math.floor(Math.random() * 90); // 10〜100枚
        totalBroken += broken;
        showEffect("🔥 クリティカル！ 🔥");
    } else {
        totalBroken += 1;
        showEffect("スカッ");
    }
    countDisp.textContent = totalBroken;
});

function showEffect(text) {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.top = '40%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '2rem';
    effect.style.color = '#ff0';
    effect.textContent = text;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}
