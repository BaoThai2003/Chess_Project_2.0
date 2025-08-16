import { getInitialBoard, whitePieces, blackPieces, isValidMove } from '../logic/chessLogic.js';

     export default class ChessScene extends Phaser.Scene {
         constructor() {
             super('ChessScene');
             this.boardState = getInitialBoard();
             this.whiteKingPos = [7, 4];
             this.blackKingPos = [0, 4];
             this.selectedPiece = null;
             this.timers = { white: 600, black: 600, currentPlayer: 'white', interval: null, isPaused: false };
             this.whiteSquareColor = 0xf0d9b5;
             this.blackSquareColor = 0xb58863;
             this.whitePieceColor = '#ffffff';
             this.blackPieceColor = '#000000';
         }

         create() {
            //tao ban co
             const boardX = 200;
             const boardY = 100;
             this.squares = [];
             for (let row = 0; row < 8; row++) {
                 this.squares[row] = [];
                 for (let col = 0; col < 8; col++) {
                     const x = boardX + col * 64;
                     const y = boardY + row * 64;
                     const color = (row + col) % 2 === 0 ? this.whiteSquareColor : this.blackSquareColor;
                     const square = this.add.rectangle(x, y, 64, 64, color).setOrigin(0);
                     square.setInteractive();
                     square.row = row;
                     square.col = col;
                     square.on('pointerdown', () => this.handleSquareClick(square));
                     this.squares[row][col] = square;

                     //dat quan co
                     const piece = this.boardState[row][col];
                     if (piece) {
                         const sprite = this.add.text(x + 32, y + 32, piece, {
                             fontSize: '40px',
                             color: whitePieces.includes(piece) ? this.whitePieceColor : this.blackPieceColor
                         }).setOrigin(0.5);
                         sprite.setInteractive();
                         sprite.row = row;
                         sprite.col = col;
                         sprite.on('pointerdown', () => this.handleSquareClick(sprite));
                     }
                 }
             }

             //tao hang cot
             for (let i = 0; i < 8; i++) {
                 this.add.text(boardX - 30, boardY + i * 64 + 32, (8 - i).toString(), { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
                 this.add.text(boardX + i * 64 + 32, boardY + 512, String.fromCharCode(97 + i), { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
             }

             //doi mau co
             document.getElementById('white-square').addEventListener('input', (e) => {
                 this.whiteSquareColor = Phaser.Display.Color.HexStringToColor(e.target.value).color;
                 this.updateBoardColors();
             });
             document.getElementById('black-square').addEventListener('input', (e) => {
                 this.blackSquareColor = Phaser.Display.Color.HexStringToColor(e.target.value).color;
                 this.updateBoardColors();
             });
             document.getElementById('white-piece').addEventListener('input', (e) => {
                 this.whitePieceColor = e.target.value;
                 this.updatePieceColors();
             });
             document.getElementById('black-piece').addEventListener('input', (e) => {
                 this.blackPieceColor = e.target.value;
                 this.updatePieceColors();
             });

             this.initTimers();
         }

         updateBoardColors() {
             for (let row = 0; row < 8; row++) {
                 for (let col = 0; col < 8; col++) {
                     const color = (row + col) % 2 === 0 ? this.whiteSquareColor : this.blackSquareColor;
                     this.squares[row][col].setFillStyle(color);
                 }
             }
         }

         updatePieceColors() {
             this.children.list.forEach(child => {
                 if (child.type === 'Text' && child.text) {
                     child.setFill(whitePieces.includes(child.text) ? this.whitePieceColor : this.blackPieceColor);
                 }
             });
         }

         initTimers() {
             const updateTimerDisplay = () => {
                 const formatTime = (seconds) => {
                     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                     const secs = (seconds % 60).toString().padStart(2, '0');
                     return `${mins}:${secs}`;
                 };
                 document.querySelector('#player-white .time').textContent = formatTime(this.timers.white);
                 document.querySelector('#player-black .time').textContent = formatTime(this.timers.black);

                 const whiteTimer = document.getElementById('player-white');
                 const blackTimer = document.getElementById('player-black');
                 whiteTimer.classList.toggle('active', this.timers.currentPlayer === 'white');
                 blackTimer.classList.toggle('active', this.timers.currentPlayer === 'black');

                 if (this.timers.white < 60) {
                     document.querySelector('#player-white .time').classList.add('time-critical');
                 } else {
                     document.querySelector('#player-white .time').classList.remove('time-critical');
                 }
                 if (this.timers.black < 60) {
                     document.querySelector('#player-black .time').classList.add('time-critical');
                 } else {
                     document.querySelector('#player-black .time').classList.remove('time-critical');
                 }
             };

             this.timers.interval = this.time.addEvent({
                 delay: 1000,
                 callback: () => {
                     if (!this.timers.isPaused) {
                         this.timers[this.timers.currentPlayer]--;
                         updateTimerDisplay();
                         if (this.timers[this.timers.currentPlayer] <= 0) {
                             this.timers.interval.remove();
                             alert(`${this.timers.currentPlayer === 'white' ? 'Trắng' : 'Đen'} hết giờ!`);
                             this.scene.start('MenuScene');
                         }
                     }
                 },
                 loop: true
             });

             document.querySelectorAll('.pause-btn').forEach(btn => {
                 btn.addEventListener('click', () => {
                     this.timers.isPaused = !this.timers.isPaused;
                     btn.textContent = this.timers.isPaused ? 'Tiếp tục' : 'Tạm dừng';
                     btn.style.backgroundColor = this.timers.isPaused ? '#4CAF50' : '#f44336';
                 });
             });

             document.getElementById('go-button').addEventListener('click', () => {
                 document.getElementById('notification-container').style.display = 'none';
             });
         }

         handleSquareClick(obj) {
             const row = obj.row;
             const col = obj.col;
             const piece = this.boardState[row][col];

             if (this.selectedPiece) {
                 const fromRow = this.selectedPiece.row;
                 const fromCol = this.selectedPiece.col;
                 const isWhiteTurn = this.timers.currentPlayer === 'white';
                 if (isValidMove(fromRow, fromCol, row, col, piece, isWhiteTurn, this.boardState, this.whiteKingPos, this.blackKingPos)) {
                     this.boardState[row][col] = piece;
                     this.boardState[fromRow][fromCol] = '';
                     if (piece === '♔') this.whiteKingPos = [row, col];
                     else if (piece === '♚') this.blackKingPos = [row, col];

                     const sprite = this.children.list.find(child => child.row === fromRow && child.col === fromCol && child.type === 'Text');
                     if (sprite) {
                         sprite.setPosition(obj.x + 32, obj.y + 32);
                         sprite.row = row;
                         sprite.col = col;
                     }
                     this.selectedPiece = null;
                     this.timers.currentPlayer = this.timers.currentPlayer === 'white' ? 'black' : 'white';
                 } else {
                     alert('Nước đi không hợp lệ!');
                     this.selectedPiece = null;
                 }
             } else if (piece) {
                 const isWhitePiece = whitePieces.includes(piece);
                 const isWhiteTurn = this.timers.currentPlayer === 'white';
                 if ((isWhiteTurn && isWhitePiece) || (!isWhiteTurn && !isWhitePiece)) {
                     this.selectedPiece = obj;
                 } else {
                     alert('Không phải lượt của quân này!');
                 }
             }
         }
     }