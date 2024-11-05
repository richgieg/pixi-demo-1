import * as PIXI from "pixi.js";
import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";

export type Config = typeof Config;

export const Config = {
    loader: Tools.massiveRequire((require as any)["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    bgSpeed: 2,
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FF7F50"]
        }
    },
    collectibles: [
        {
            kind: "ruby",
            value: 1,
            chance: 1,
            offset: 50
        },
        {
            kind: "emerald",
            value: 2,
            chance: 0.4,
            offset: 225
        },
        {
            kind: "sapphire",
            value: 5,
            chance: 0.2,
            offset: 375
        },
        {
            kind: "amethyst",
            value: 10,
            chance: 0.1,
            offset: 475
        },
        {
            kind: "diamond",
            value: 25,
            chance: 0.05,
            offset: 560
        }
    ],
    enemies: [
        {
            kind: "slow",
            value: 5,
            chance: 0.5,
            animationSpeed: 0.05,
            patrollingSpeed: 25
        },
        {
            kind: "medium",
            value: 10,
            chance: 0.3,
            animationSpeed: 0.1,
            patrollingSpeed: 50
        },
        {
            kind: "fast",
            value: 25,
            chance: 0.1,
            animationSpeed: 0.2,
            patrollingSpeed: 100
        }
    ],
    platforms: {
        moveSpeed: -1.5,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 90,
                max: 200
            }
        }
    },
    hero: {
        jumpSpeed: 15,
        maxJumps: 2,
        position: {
            x: 350,
            y: 595
        }
    },
    scenes: {
        "Game": GameScene
    }
} satisfies {
    [key: string]: any,
    score: {
        [key: string]: any,
        style: Partial<PIXI.ITextStyle>
    }
};