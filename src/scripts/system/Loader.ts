import { Config } from "scripts/game/Config";

export class Loader {
    private loader: any;
    private config: Config;
    resources: any;

    constructor(loader: any, config: Config) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }

    preload() {
        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                this.loader.add(key, asset.data.default)
            }
        }

        return new Promise<void>(resolve => {
            this.loader.load((loader: any, resources: any) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}