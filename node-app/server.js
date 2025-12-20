const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`Hello from Node app! Path: ${req.path}\n`);
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`);
});
