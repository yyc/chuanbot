const express = require("express");
const router = express.Router();
const { init } = require("../lib/check.js");
const client = require("../lib/redis.js");

/* GET home page. */
router.get("/auth", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/authresponse", async function(req, res, next) {
  res.send(JSON.stringify(req.query));
  if (req.query["token"] !== undefined) {
    await client.set("token", req.query["token"]);
    console.log("token set");
  }
  res.end();
});

router.get("/", function(req, res, next) {
  init();
});

init().catch(console.log);
module.exports = router;
