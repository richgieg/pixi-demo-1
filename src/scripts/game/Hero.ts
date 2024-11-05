import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';
import { Platform } from './Platform';

type HeroBody = Matter.Body & { gameHero: Hero };

export class Hero {
    sprite: PIXI.AnimatedSprite;
    body: HeroBody;
    dy: number;
    maxJumps: number;
    jumpIndex: number;
    score: number;
    platform: Platform | null;

    constructor() {
        this.sprite = this.createSprite();
        this.body = this.createBody();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;
        this.platform = null;
    }

    collectCollectible(collectible: Collectible) {
        this.score += collectible.value;
        this.sprite.emit("score");
        collectible.destroy();
    }

    killEnemy(enemy: Enemy) {
        this.score += enemy.value;
        this.sprite.emit("score");
        enemy.destroy();
    }

    resetScore() {
        this.score = 0;
        this.sprite.emit("score");
    }

    startJump() {
        if (this.platform || this.jumpIndex === 1) {
            ++this.jumpIndex;
            this.platform = null;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
        }
    }

    // [08]
    stayOnPlatform(platform: Platform) {
        this.platform = platform;
        this.jumpIndex = 0;
    }
    // [/08]

    private createBody() {
        const body = Matter.Bodies.rectangle(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, {friction: 0}) as HeroBody;
        body.gameHero = this;
        Matter.World.add(App.physics.world, body);
        return body;
    }

    update() {
        this.sprite.x = this.body.position.x - this.sprite.width / 2;
        this.sprite.y = this.body.position.y - this.sprite.height / 2;

        // [14]
        if (this.sprite.y > window.innerHeight) {
            this.sprite.emit("die");
        }
        // [/14]
    }

    private createSprite() {
        const sprite = new PIXI.AnimatedSprite([
            App.res("walk1"),
            App.res("walk2")
        ]);

        sprite.x = App.config.hero.position.x;
        sprite.y = App.config.hero.position.y;
        sprite.loop = true;
        sprite.animationSpeed = 0.1;
        sprite.play();
        return sprite;
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        this.sprite.destroy();
    }

    static isHeroBody(body: Matter.Body): body is HeroBody {
        return "gameHero" in body;
    }
}