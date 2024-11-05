import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Collectible } from './Collectible';
import { Enemy } from './Enemy';

type PlatformBody = Matter.Body & { gamePlatform: Platform };

export class Platform {
    private readonly rows: number;
    private readonly cols: number;
    private readonly tileSize: number;
    private readonly width: number;
    private readonly height: number;
    private readonly dx: number;
    readonly container: PIXI.Container;
    private readonly body: PlatformBody;
    private readonly collectibles: Collectible[];
    private readonly enemy: Enemy | null;

    constructor(rows: number, cols: number, x: number) {
        this.rows = rows;
        this.cols = cols;

        this.tileSize = PIXI.Texture.from("tile").width;
        this.width = this.tileSize * this.cols;
        this.height = this.tileSize * this.rows;

        this.container = this.createContainer(x);
        this.createTiles();

        this.dx = App.config.platforms.moveSpeed;
        this.body = this.createBody();

        this.collectibles = this.createCollectibles();
        this.enemy = this.maybeCreateEnemy();
    }

    private maybeCreateEnemy(): Enemy | null {
        App.config.enemies.sort((a, b) => a.chance - b.chance);
        const random = Math.random();
        for (const { kind, value, chance, animationSpeed, patrollingSpeed } of App.config.enemies) {
            if (random < chance) {
                return new Enemy(this.container, kind, value, animationSpeed, patrollingSpeed, this.tileSize * this.cols);
            }
        }
        return null;
    }

    private createCollectibles() {
        const collectibles: Collectible[] = [];
        for (let i = 0; i < this.cols; i++) {
            for (const { kind, value, chance, offset } of App.config.collectibles) {
                if (Math.random() < chance) {
                    collectibles.push(
                        new Collectible(this.container, kind, value, this.tileSize * i, this.tileSize, -offset)
                    );
                }
            }
        }
        return collectibles;
    }

    private createBody() {
        const body = Matter.Bodies.rectangle(this.width / 2 + this.container.x, this.height / 2 + this.container.y, this.width, this.height, {friction: 0, isStatic: true}) as PlatformBody;
        body.gamePlatform = this;
        Matter.World.add(App.physics.world, body);
        return body;
    }

    private createContainer(x: number) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = window.innerHeight - this.height;
        return container;
    }

    private createTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createTile(row, col);
            }
        }
    }

    private createTile(row: number, col: number) {
        const texture = row === 0 ? "platform" : "tile" 
        const tile = App.sprite(texture);
        this.container.addChild(tile);
        tile.x = col * tile.width;
        tile.y = row * tile.height;
    }


    // 06
    update(dt: number) {
        if (this.body) {
            Matter.Body.setPosition(this.body, {x: this.body.position.x + this.dx * dt, y: this.body.position.y});
            this.container.x = this.body.position.x - this.width / 2;
            this.container.y = this.body.position.y - this.height / 2;
        }
    }

    destroy() {
        Matter.World.remove(App.physics.world, this.body);
        this.collectibles.forEach(collectible => collectible.destroy());
        if (this.enemy) {
            this.enemy.destroy();
        }
        this.container.destroy();
    }

    static isPlatformBody(body: Matter.Body): body is PlatformBody {
        return "gamePlatform" in body;
    }
}