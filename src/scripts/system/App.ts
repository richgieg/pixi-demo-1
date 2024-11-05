import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";
import { Config } from "scripts/game/Config";

class Application {
    config!: Config;
    app!: PIXI.Application;
    private loader!: Loader;
    scenes!: ScenesManager;
    physics!: Matter.Engine;

    run(config: Config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({resizeTo: window});
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        // [06]
        this.createPhysics();
    }

    private createPhysics() {
        this.physics = Matter.Engine.create();
    }
    // [/06]

    res(key: string) {
        return (this.loader.resources as any)[key].texture;
    }

    sprite(key: string) {
        return new PIXI.Sprite(this.res(key));
    }

    private start() {
        this.scenes.start("Game");
    }
}

export const App = new Application();