const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;
const configPath = "/home/tms/MagicMirror/config/config.js";
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/api", (req, res) => {
  res.send(
    "MMM-API welcomes you! \n Please, check the readme at www.github.com/tmsBodnar/MMM-API#readme"
  );
});

app.get("/api/config", (req, res) => {
  const readedConfig = fs.readFileSync(configPath, "utf8");
  let config = eval(readedConfig);
  res.send(config);
});

app.put("/api/config", (req, res) => {
  let config = req.body;
  const origConfig = fs.readFileSync(configPath, "utf8");
  let regex = new RegExp(/(?<=let config = )([\S\s]*?)(?=;\n\n)/);
  const newConfig = origConfig.replace(
    regex,
    JSON.stringify(config, null, "\t")
  );
  fs.writeFileSync(configPath, newConfig, "utf-8");
  const readedConfig = fs.readFileSync(configPath, "utf8");
  let configRes = eval(readedConfig);
  res.send(configRes);
});
