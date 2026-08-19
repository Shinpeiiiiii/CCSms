const {createClient} = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

const connectRedis = async () => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log("redis connected");
    }    

    
};
console.log(redisClient.isOpen);

module.exports = {redisClient, connectRedis};