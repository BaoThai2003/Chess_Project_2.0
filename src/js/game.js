import BootScene from './scenes/BootScene.js';
     import MenuScene from './scenes/MenuScene.js';
     import OverworldScene from './scenes/OverworldScene.js';
     import DialogueScene from './scenes/DialogueScene.js';
     import ChessScene from './scenes/ChessScene.js';
     import StoryScene from './scenes/StoryScene.js';

     const config = {
         type: Phaser.AUTO,
         width: 800,
         height: 600,
         parent: 'game-container',
         pixelArt: true,
         physics: {
             default: 'arcade',
             arcade: { debug: false }
         },
         scene: [
             BootScene,
             MenuScene,
             OverworldScene,
             DialogueScene,
             ChessScene,
             StoryScene
         ]
     };

     const game = new Phaser.Game(config);