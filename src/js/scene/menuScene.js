export default class MenuScene extends Phaser.Scene {
         constructor() {
             super('MenuScene');
         }

         create() {
             this.add.image(400, 300, 'bg').setOrigin(0.5);
             const notification = document.getElementById('notification-container');
             notification.style.display = 'flex';

             const goButton = document.getElementById('go-button');
             goButton.addEventListener('mouseenter', () => {
                 for (let i = 0; i < 20; i++) {
                     this.createFlyingPiece();
                 }
             });

             goButton.addEventListener('click', () => {
                 notification.style.display = 'none';
                 this.scene.start('ChessScene');
             });
         }

         createFlyingPiece() {
             const pieces = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"];
             const piece = this.add.text(400, 300, pieces[Math.floor(Math.random() * pieces.length)], {
                 fontSize: '30px',
                 color: `hsl(${Math.random() * 360}, 70%, 50%)`
             }).setOrigin(0.5);

             const angle = Math.random() * Math.PI * 2;
             const distance = 200 + Math.random() * 300;
             const tx = Math.cos(angle) * distance;
             const ty = Math.sin(angle) * distance;

             this.tweens.add({
                 targets: piece,
                 x: piece.x + tx,
                 y: piece.y + ty,
                 angle: 360,
                 alpha: 0,
                 duration: 3000,
                 onComplete: () => piece.destroy()
             });
         }
     }