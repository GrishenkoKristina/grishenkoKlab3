export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.buttons = { left: false, right: false };
    this.jumpQueued = false;
    this.active = false;

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", " ", "a", "d", "w"].includes(key)) {
        if (this.active) event.preventDefault();
      }
      if (!this.keys.has(key) && [" ", "w", "arrowup"].includes(key)) {
        this.jumpQueued = true;
      }
      this.keys.add(key);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.key.toLowerCase()));
    window.addEventListener("blur", () => this.clear());

    document.querySelectorAll("[data-control]").forEach((button) => {
      const control = button.dataset.control;
      const down = (event) => {
        event.preventDefault();
        if (control === "jump") this.jumpQueued = true;
        else this.buttons[control] = true;
      };
      const up = (event) => {
        event.preventDefault();
        if (control !== "jump") this.buttons[control] = false;
      };
      button.addEventListener("pointerdown", down);
      button.addEventListener("pointerup", up);
      button.addEventListener("pointercancel", up);
      button.addEventListener("pointerleave", up);
      button.addEventListener("contextmenu", (e) => e.preventDefault());
    });
  }

  getAxis() {
    const left = this.keys.has("arrowleft") || this.keys.has("a") || this.buttons.left;
    const right = this.keys.has("arrowright") || this.keys.has("d") || this.buttons.right;
    return (right ? 1 : 0) - (left ? 1 : 0);
  }

  consumeJump() {
    const value = this.jumpQueued;
    this.jumpQueued = false;
    return value;
  }

  clear() {
    this.keys.clear();
    this.buttons.left = false;
    this.buttons.right = false;
    this.jumpQueued = false;
  }
}
