import * as Matter from 'matter-js';
import { gsap } from "gsap";
import { App } from '../system/App';

export class Collectible {
    constructor(kind, value, platformX, platformTileSize, y) {
        this.value = value;
        this.y = y;
        this.createSprite(kind, platformX, platformTileSize);
        App.app.ticker.add(this.update, this);
        this.startFloating();
    }

    createSprite(kind, platformX, platformTileSize) {
        this.sprite = App.sprite(kind);
        // Center the collectible within the platform tile.
        this.sprite.x = platformX + ((platformTileSize - this.sprite.width) / 2);
        this.sprite.y = this.y;
    }

    startFloating() {
        gsap.to(this, {
            y: this.y - 2,
            duration: 0.25,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 0.25,
        });
    }

    update() {
        if (this.sprite) {
            this.sprite.y = this.y;
            Matter.Body.setPosition(this.body, {x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.y + this.sprite.parent.y});
        }
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }});
        this.body.isSensor = true;
        this.body.gameCollectible = this;
        Matter.World.add(App.physics.world, this.body);
    }

    destroy() {
        if (this.sprite) {
            App.app.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            this.sprite = null;
            gsap.killTweensOf(this);
        }
    }
}