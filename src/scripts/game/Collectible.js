import * as Matter from 'matter-js';
import { App } from '../system/App';

export class Collectible {
    constructor(kind, value, x, y) {
        this.createSprite(kind, x, y);
        App.app.ticker.add(this.update, this);
        this.value = value;
    }

    createSprite(kind, x, y) {
        this.sprite = App.sprite(kind);
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update() {
        if (this.sprite) {
            Matter.Body.setPosition(this.body, {x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y});
        }
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, {friction: 0, isStatic: true, render: { fillStyle: '#060a19' }});
        this.body.isSensor = true;
        this.body.gameCollectible = this;
        Matter.World.add(App.physics.world, this.body);
    }

    // [14]
    destroy() {
        if (this.sprite) {
            App.app.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}