import { MikroORM } from "@mikro-orm/core";

const main = async () => {
    const orm = await MikroORM.init({
        dbName: 'tsdb',
        type: 'postgresql',
        debug: process.env.NODE_ENV !== 'production'
    });
}

main();