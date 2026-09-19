import { createClient } from "redis"
import { env } from "../../config/env.service.js";

export const client = createClient({
    url: env.redis_url
});

export const connection_redis = async () => {
    try {
        client.on("error", function (err) {
            throw err;
        });
        await client.connect()
        console.log("redis is connection");


    } catch (error) {
        console.log("redis is connection error", error);


    }

}



