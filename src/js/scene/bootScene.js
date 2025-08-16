export default class BootScene extends Phaser.Scene {
         constructor() {
             super('BootScene');
         }

         preload() {
             this.load.image('bg', 'assets/bg/bg.jpeg');
             // Thêm các tài nguyên khác (tilesets, pieces, sounds...)
         }

         create() {
             this.scene.start('MenuScene');
         }
     }