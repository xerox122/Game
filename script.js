const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const sections = 5;
const sectionAngle = (2 * Math.PI) / sections;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FF8633'];
const prizes = ["Better Luck Next Time", "Smart Watch", "Leather File", "Button File", "5-Pic Pen"];
let currentAngle = 0;
let isSpinning = false;
let smartWatchWon = localStorage.getItem('smartWatchWon') === 'true';

function drawWheel() {
    for (let i = 0; i < sections; i++) {
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, i * sectionAngle, (i + 1) * sectionAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate((i + 0.5) * sectionAngle);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText(prizes[i], 100, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    let spinTime = 0;
    const spinTimeTotal = 3000; // Total spin duration in ms
    const easeOut = t => 1 - (--t) * t * t * t;

    function rotate() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            isSpinning = false;
            let winningIndex;
            if (!smartWatchWon) {
                // Ensure Smart Watch is won only once
                winningIndex = Math.floor(Math.random() * sections);
                if (prizes[winningIndex] === "Smart Watch") {
                    smartWatchWon = true;
                    localStorage.setItem('smartWatchWon', 'true');
                }
            } else {
                // Avoid Smart Watch if it's already won
                const validIndices = prizes
                    .map((prize, index) => prize !== "Smart Watch" ? index : null)
                    .filter(index => index !== null);
                winningIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
            }
            const winningOutcome = prizes[winningIndex];
            resultDiv.textContent = `You won: ${winningOutcome}`;
            return;
        }
        const angleChange = (spinTimeTotal - spinTime) / spinTimeTotal * easeOut(spinTime / spinTimeTotal) * (2 * Math.PI / sections) + 6 * Math.PI;
        currentAngle += angleChange;
        ctx.clearRect(0, 0, 400, 400);
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(currentAngle);
        ctx.translate(-200, -200);
        drawWheel();
        ctx.restore();
        requestAnimationFrame(rotate);
    }
    rotate();
}

drawWheel();
spinButton.addEventListener('click', spinWheel);
