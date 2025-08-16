export default class DialogueScene extends Phaser.Scene {
  constructor() {
    super("DialogueScene");
  }

  create() {
    this.add
      .text(400, 300, "Dialogue Scene", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);
  }
}
