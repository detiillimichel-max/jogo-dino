# 🦖 Jogo do Dinossauro (Chrome T-Rex Clone)

Um clone robusto do clássico jogo escondido no Google Chrome quando não há conexão com a internet. Desenvolvido inteiramente com tecnologias web nativas, este projeto foca em **renderização procedural** e arquitetura modular, dispensando o uso de arquivos de mídia externos.

## 🚀 Destaques e Funcionalidades

* **Gráficos 100% Procedurais:** O dinossauro e os cactos são desenhados frame a frame usando blocos e cálculos matemáticos no `<canvas>`, sem nenhuma imagem `.png` ou `.jpg`.
* **Áudio Sintetizado Nativo:** O som de pulo clássico estilo 8-bits é gerado via código utilizando a **Web Audio API** (osciladores e controle de ganho), eliminando a necessidade de arquivos `.wav` ou `.mp3`.
* **Física e Colisão:** Sistema de gravidade customizado e detecção de colisão precisa baseada em *hitboxes*.
* **Progressão Dinâmica:** A velocidade do jogo aumenta gradativamente, elevando a dificuldade de forma natural.
* **Sistema de Recorde:** O *High Score* é salvo localmente no navegador do usuário utilizando o `localStorage`.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica e elemento `<canvas>`.
* **CSS3:** Estilização limpa, responsividade básica e interface minimalista.
* **JavaScript (ES6+):** Lógica orientada a objetos (classes `Dino` e `Obstacle`), *Game Loop* com `requestAnimationFrame` e síntese de áudio.

## 📁 Estrutura de Arquivos

```text
jogo-dino/
├── index.html   # Estrutura principal e Canvas
├── style.css    # Aparência e layout da interface
├── script.js    # Lógica do jogo, renderização e áudio
└── README.md    # Documentação do projeto
