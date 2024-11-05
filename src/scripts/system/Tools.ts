export class Tools {
    static massiveRequire(req: any) {
        const files: { key: string, data: any }[] = [];

        req.keys().forEach((key: any) => {
            files.push({
                key, data: req(key)
            });
        });

        return files;
    }
}