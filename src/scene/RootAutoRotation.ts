export class RootAutoRotation {
  private enabled = true;

  stopForDraw() {
    this.enabled = false;
  }

  advance(current: number, delta: number, idle: boolean) {
    return this.enabled && idle ? current + delta * 0.055 : current;
  }
}
