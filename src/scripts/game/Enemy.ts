import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { App } from '../system/App';

type EnemyBody = Matter.Body & { gameEnemy: Enemy };

export class Enemy {
    readonly value: number;
    private x: number;
    private readonly sprite: PIXI.AnimatedSprite;
    private readonly body: EnemyBody;
    
    constructor(container: PIXI.Container, kind: string, value: number, animationSpeed: number, patrollingSpeed: number, platformWidth: number) {
        this.value = value;
        this.x = 0;
        this.sprite = this.createSprite(kind, animationSpeed);
        container.addChild(this.sprite);
        this.body = this.createBody();
        App.app.ticker.add(this.update, this);
        this.startPatrolling(patrollingSpeed, platformWidth);
    }

    private createSprite(kind: string, animationSpeed: number) {
        const sprite = new PIXI.AnimatedSprite([
            App.res(`${kind}-enemy-walk1`),
            App.res(`${kind}-enemy-walk2`)
        ]);

        sprite.x = this.x;
        sprite.y = -sprite.height;
        sprite.loop = true;
        sprite.animationSpeed = animationSpeed;
        sprite.play();
        return sprite;
    }

    private startPatrolling(patrollingSpeed: number, platformWidth: number) {
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

    private createBody() {
        const body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }}) as EnemyBody;
        body.isSensor = true;
        body.gameEnemy = this;
        Matter.World.add(App.physics.world, body);
        return body;
    }

    destroy() {
        if (!this.sprite.destroyed) {
            App.app.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            gsap.killTweensOf(this);
        }
    }

    static isEnemyBody(body: Matter.Body): body is EnemyBody {
        return "gameEnemy" in body;
    }
}