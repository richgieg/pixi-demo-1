import * as PIXI from "pixi.js";
import { App } from "../system/App";

export class Background {
    sprites: PIXI.Sprite[];
    speed: number;
    container: PIXI.Container;

    constructor() {
        this.sprites = [];
        this.speed = App.config.bgSpeed;
        this.container = new PIXI.Container();
        this.createSprites();
    }

    createSprites() {
        for (let i = 0; i < 3; i++) {
            this.createSprite(i);
        }
    }

    createSprite(i: number) {
        const sprite = App.sprite("bg");

        sprite.x = sprite.width * i;
        sprite.y = 0;
        this.container.addChild(sprite);
        this.sprites.push(sprite);
    }

    move(sprite: PIXI.Sprite, offset: number) {
        const spriteRightX = sprite.x + sprite.width;

        const screenLeftX  = 0;

        if (spriteRightX <= screenLeftX) {
            sprite.x += sprite.width * this.sprites.length;
        }
        
        sprite.x -= offset;
    }

    update(dt: number) {
        const offset = this.speed * dt;

        this.sprites.forEach(sprite => {
            this.move(sprite, offset);
        });
    }

    destroy() {
        this.container.destroy();
    }
}