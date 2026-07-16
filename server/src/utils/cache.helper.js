const {getCache, setCache, deleteCache} = require("../utils/cache");


const remember = async (key, ttl, callback) => {
    console.log("Hit: ",key);
    const cached = await getCache(key);

    if(cached) {
        console.log(`Cache hits: ${key}`);
        return cached;
    }

    console.log(`Cache missed: ${key}`);
    const result = await callback();
    await setCache(key, result, ttl);

    return result;
}

const clearCache = async (...keys) => {
    await Promise.all(
        keys.map(key => deleteCache(key))
    );
};

module.exports = { remember, clearCache };