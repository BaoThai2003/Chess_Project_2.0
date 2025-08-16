export default class StoryScene extends Phaser.Scene {
  constructor() {
    super("StoryScene");
  }

  create() {
    this.add
      .text(400, 300, "Story Scene", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);
  }
}
