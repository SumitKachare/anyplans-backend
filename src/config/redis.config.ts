import Redis from "ioredis";

const redis = new Redis({
  host: "localhost", // Redis server hostname or IP
  port: 6379, // Redis server port
});

// Listen for Redis successful connection
redis.on("connect", () => {
  console.log("Successfully connected to Redis");
});

// Listen for Redis error connection
redis.on("error", (err) => {
  console.log("Redis connection error");
});

export default redis;
