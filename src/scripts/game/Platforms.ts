import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Platform } from "./Platform";

export class Platforms {
    platforms: Platform[];
    container: PIXI.Container;
    current: Platform;

    constructor() {
        this.platforms = [];
        this.container = new PIXI.Container();

        this.current = this.createPlatform({
            rows: 4,
            cols: 6,
            x: 200
        });
    }

    private get randomData() {
        const ranges = App.config.platforms.ranges;
        let data = { rows: 0, cols: 0, x: 0 };

        const offset = ranges.offset.min + Math.round(Math.random() * (ranges.offset.max - ranges.offset.min));

        data.x = this.current.container.x + this.current.container.width + offset;
        data.cols = ranges.cols.min + Math.round(Math.random() * (ranges.cols.max - ranges.cols.min));
        data.rows = ranges.rows.min + Math.round(Math.random() * (ranges.rows.max - ranges.rows.min));

        return data;
    }

    
    private createPlatform(data: { rows: number, cols: number, x: number }) {
        const platform = new Platform(data.rows, data.cols, data.x);
        this.container.addChild(platform.container);
        this.platforms.push(platform);
        return platform;
    }

    update(dt: number) {
        if (this.current.container.x + this.current.container.width < window.innerWidth) {
            this.current = this.createPlatform(this.randomData);
        }

        // 06
        this.platforms.forEach(platform => platform.update(dt));
    }

    // [14]
    destroy() {
        this.platforms.forEach(platform => platform.destroy());
        this.container.destroy();
    }
}