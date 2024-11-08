import * as Matter from 'matter-js';
import { LabelScore } from "./LabelScore";
import { App } from '../system/App';
import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";

export class GameScene extends Scene {
    create() {
        this.createBackground();
        this.createHero();
        this.createPlatforms();
        this.setEvents();
        //[13]
        this.createUI();
        //[/13]
    }
    //[13]
    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }
    //[13]

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
        event.pairs.forEach(pair => {
            const colliders = [pair.bodyA, pair.bodyB];
            const hero = colliders.find(body => body.gameHero);
            const platform = colliders.find(body => body.gamePlatform);

            if (hero && platform) {
                this.hero.stayOnPlatform(platform.gamePlatform);
            }

            const collectible = colliders.find(body => body.gameCollectible);

            if (hero && collectible) {
                this.hero.collectCollectible(collectible.gameCollectible);
            }

            const enemy = colliders.find(body => body.gameEnemy);

            if (hero && enemy) {
                if (!this.hero.platform && hero.velocity.y > 0) {
                    this.hero.killEnemy(enemy.gameEnemy);
                } else {
                    this.hero.resetScore();
                }
            }
        });
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);

        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.startJump();
        });

        // [14]
        this.hero.sprite.once("die", () => {
            App.scenes.start("Game");
        });
        // [/14]
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    createPlatforms() {
        this.platfroms = new Platforms();
        this.container.addChild(this.platfroms.container);
    }

    update(dt) {
        Matter.Engine.update(App.physics, App.app.ticker.deltaMS);
        this.bg.update(dt);
        this.platfroms.update(dt);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.hero.destroy();
        this.platfroms.destroy();
        this.labelScore.destroy();
    }
}