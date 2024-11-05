import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { App } from '../system/App';

export class Enemy {
    value: number;
    x: number;
    sprite!: PIXI.AnimatedSprite;
    body!: Matter.Body;
    
    constructor(kind: string, value: number, animationSpeed: number, patrollingSpeed: number, platformWidth: number) {
        this.value = value;
        this.x = 0;
        this.createSprite(kind, animationSpeed);
        App.app.ticker.add(this.update, this);
        this.startPatrolling(patrollingSpeed, platformWidth);
    }

    createSprite(kind: string, animationSpeed: number) {
        this.sprite = new PIXI.AnimatedSprite([
            App.res(`${kind}-enemy-walk1`),
            App.res(`${kind}-enemy-walk2`)
        ]);

        this.sprite.x = this.x;
        this.sprite.y = -this.sprite.height;
        this.sprite.loop = true;
        this.sprite.animationSpeed = animationSpeed;
        this.sprite.play();
    }

    startPatrolling(patrollingSpeed: number, platformWidth: number) {
        gsap.to(this, {
            x: platformWidth - this.sprite.width,
            duration: 1 / patrollingSpeed * platformWidth,
            ease: "none",
            repeat: -1,
            yoyo: true
        });
    }

    update() {
        if (this.sprite) {
            this.sprite.x = this.x;
            Matter.Body.setPosition(this.body, {x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y});
        }
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }});
        this.body.isSensor = true;
        (this.body as any).gameEnemy = this;
        Matter.World.add(App.physics.world, this.body);
    }

    destroy() {
        if (this.sprite) {
            App.app.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            (this.sprite as any) = null;
            gsap.killTweensOf(this);
        }
    }
}