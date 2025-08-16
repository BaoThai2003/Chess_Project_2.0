export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  create() {
    this.add
      .text(400, 300, "Overworld Scene", { fontSize: "32px", color: "#fff" })
      .setOrigin(0.5);
  }
}
