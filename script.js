// Configurações Globais
const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;
const GROUND_Y = 220;
const GRAVITY = 0.8;
const INITIAL_SPEED = 6;
const SPEED_INCREMENT = 0.001; 
const JUMP_FORCE = -14;

// Elementos do DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const currentScoreElement = document.getElementById("current-score");
const highScoreElement = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over-screen");

// Estado do Jogo
let isGameRunning = false;
let isGameOver = false;
let gameSpeed = INITIAL_SPEED;
let score = 0;
let highScore = localStorage.getItem("dinoHighScore") || 0;
let gameFrame = 0;

// Som de pulo gerado 100% por código (Sem arquivos .wav)
function playJumpSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = "square"; // Som retrô estilo 8-bits
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1); 
        
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) { 
        // Previne erros se o navegador bloquear áudio no primeiro clique
    }
}

// Classe do Dinossauro - Desenhada via Código
class Dino {
    constructor() {
        this.width = 44;
        this.height = 48;
        this.x = 50;
        this.y = GROUND_Y - this.height;
        this.vy = 0; 
        this.isJumping = false;
        this.legUp = false; // Controle da animação das pernas
    }

    update() {
        this.vy += GRAVITY;
        this.y += this.vy;

        if (this.y > GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.vy = 0;
            this.isJumping = false;
        }

        // Troca as pernas a cada 10 frames para simular corrida
        if (!this.isJumping && isGameRunning && gameFrame % 10 === 0) {
            this.legUp = !this.legUp;
        }
    }

    draw() {
        ctx.fillStyle = "#535353"; // Cor do Dino
        let px = this.x;
        let py = this.y;

        // Construindo o Dino com blocos (Renderização Procedural)
        ctx.fillRect(px + 20, py, 24, 16);           // Cabeça e focinho
        ctx.clearRect(px + 24, py + 2, 4, 4);        // Olho (buraco vazado)
        ctx.fillRect(px + 12, py + 16, 20, 20);      // Corpo central
        ctx.fillRect(px, py + 16, 12, 12);           // Rabo base
        ctx.fillRect(px - 4, py + 12, 4, 8);         // Ponta do rabo
        ctx.fillRect(px + 32, py + 20, 8, 4);        // Bracinho

        // Animação das pernas
        if (this.isJumping) {
            ctx.fillRect(px + 12, py + 36, 6, 12); // Perna Esq parada
            ctx.fillRect(px + 24, py + 36, 6, 12); // Perna Dir parada
        } else if (this.legUp) {
            ctx.fillRect(px + 12, py + 36, 6, 6);  // Perna Esq levantada
            ctx.fillRect(px + 24, py + 36, 6, 12); // Perna Dir no chão
        } else {
            ctx.fillRect(px + 12, py + 36, 6, 12); // Perna Esq no chão
            ctx.fillRect(px + 24, py + 36, 6, 6);  // Perna Dir levantada
        }
    }

    jump() {
        if (!this.isJumping) {
            this.vy = JUMP_FORCE;
            this.isJumping = true;
            playJumpSound(); // Chama o som sintetizado
        }
    }
}

// Classe dos Cactos - Desenhados via Código
class Obstacle {
    constructor() {
        this.x = GAME_WIDTH;
        // Cria cactos de tamanhos aleatórios
        this.width = 20 + Math.random() * 20; 
        this.height = 35 + Math.random() * 25; 
        this.y = GROUND_Y - this.height;
    }

    update() {
        this.x -= gameSpeed; 
    }

    draw() {
        ctx.fillStyle = "#535353"; // Cor dos obstáculos
        let px = this.x;
        let py = this.y;
        let w = this.width;
        let h = this.height;

        // Construindo o Cacto em blocos proporcionais
        ctx.fillRect(px + w*0.3, py, w*0.4, h); // Tronco central
        ctx.fillRect(px, py + h*0.3, w*0.3, h*0.1); // Braço Esq horizontal
        ctx.fillRect(px, py + h*0.1, w*0.1, h*0.3); // Braço Esq vertical
        ctx.fillRect(px + w*0.7, py + h*0.5, w*0.3, h*0.1); // Braço Dir horizontal
        ctx.fillRect(px + w*0.9, py + h*0.25, w*0.1, h*0.35); // Braço Dir vertical
    }
}

// Instâncias Globais
let dino = new Dino();
let obstacles = [];

function startGame() {
    isGameRunning = true;
    isGameOver = false;
    score = 0;
    gameSpeed = INITIAL_SPEED;
    obstacles = [];
    dino = new Dino(); 
    gameOverScreen.classList.add("hidden");
    highScoreElement.innerText = "HI " + formatScore(highScore);
    requestAnimationFrame(gameLoop); 
}

function endGame() {
    isGameRunning = false;
    isGameOver = true;
    gameOverScreen.classList.remove("hidden");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("dinoHighScore", highScore); 
    }
}

// Loop Principal
function gameLoop() {
    if (!isGameRunning) return; 

    gameFrame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Desenhar Chão
    ctx.fillStyle = "#535353";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 2);

    dino.update();
    dino.draw();

    // Adicionar novos obstáculos
    if (gameFrame % 100 === 0) { 
        obstacles.push(new Obstacle());
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.update();
        obs.draw();

        // Checar Colisão (Regras de física entre o Dino e o Cacto)
        if (checkCollision(dino, obs)) {
            endGame();
            return;
        }

        // Remover cactos que já passaram da tela para liberar memória
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            i--; 
        }
    }

    // Pontuação
    if (gameFrame % 5 === 0) { 
        score++;
        currentScoreElement.innerText = formatScore(score);
    }

    // Aumentar dificuldade
    gameSpeed += SPEED_INCREMENT;

    requestAnimationFrame(gameLoop);
}

// Matemática de Colisão
function checkCollision(dino, obstacle) {
    // Reduzimos um pouco a "caixa de colisão" (Hitbox) para ficar justo
    let hitBoxPadding = 5; 
    return (
        dino.x + hitBoxPadding < obstacle.x + obstacle.width &&
        dino.x + dino.width - hitBoxPadding > obstacle.x &&
        dino.y + hitBoxPadding < obstacle.y + obstacle.height &&
        dino.y + dino.height - hitBoxPadding > obstacle.y
    );
}

function formatScore(score) {
    return String(score).padStart(5, '0'); 
}

// Controles do Teclado
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (!isGameRunning && !isGameOver) {
            startGame(); 
        } else if (isGameRunning) {
            dino.jump();
        } else if (isGameOver) {
            startGame(); 
        }
    }
});

// Inicializa a tela com o Recorde
highScoreElement.innerText = "HI " + formatScore(highScore);
  
