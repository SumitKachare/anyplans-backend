import Redis from "ioredis";

const redis = new Redis({
  host: "localhost", // Redis server hostname or IP
  port: 6379, // Redis server port
});

export default redis;
