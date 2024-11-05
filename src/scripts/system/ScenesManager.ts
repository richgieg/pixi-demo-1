import * as PIXI from "pixi.js";
import { App } from "./App";
import { Scene } from "./Scene";

export class ScenesManager {
    container: PIXI.Container;
    private scene: Scene | null;

    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.scene = null;
    }

    start(scene: keyof typeof App.config.scenes) {
        if (this.scene) {
            this.scene.destroy();
        }

        this.scene = new App.config.scenes[scene]();
        this.container.addChild(this.scene.container);
    }

    update(dt: number) {
        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}