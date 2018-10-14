const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");

const functions = ["get", "set", "hget", "hset"];
let e = { client };
for (let fn of functions) {
  e[fn] = promisify(client[fn]).bind(client);
}

module.exports = e;
