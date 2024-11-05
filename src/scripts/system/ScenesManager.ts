import * as PIXI from "pixi.js";
import { App } from "./App";
import { Scene } from "./Scene";

export class ScenesManager {
    container: PIXI.Container;
    scene: Scene | null;

    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.scene = null;
    }

    start(scene: string) {
        if (this.scene) {
            this.scene.destroy();
        }

        this.scene = new (App.config.scenes as any)[scene]();
        this.container.addChild(this.scene!.container); // TODO: fix me
    }

    update(dt: number) {
        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}