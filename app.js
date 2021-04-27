const express = require("express");
const path = require("path");
const redis = require("redis");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//Serve up our static resources
app.get("/", (req, res) => {
  res.send("./public/index.html");
});

let clients = [];
//Poll endpoint
app.get("/poll/*", (req, res) => {
  clients.push(res);
});

//Msg endpoint
app.post("/msg", (req, res) => {
  message = req.body;
  publisher.publish("chat", JSON.stringify(message));
  return res.status(200).json("Updated Successfully");
});

const credentials = { host: "127.0.0.1", port: 6379 };

const subscriber = redis.createClient(credentials.port, credentials.host);
const publisher = redis.createClient(credentials.port, credentials.host);

subscriber.on("message", (channel, msg) => {
  if (channel === "chat") {
    while (clients.length > 0) {
      let client = clients.pop();
      client.end(msg);
    }
  }
});

subscriber.subscribe("chat");

app.listen(3000, () => console.log("Running on PORT 3000"));
