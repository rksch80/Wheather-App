const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const projectData = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("", express.static("static"));

app.get("/data", (req, res) => res.send(projectData));

app.post("/data", (req, res) => {
  projectData.push(req.body);
  res.send(projectData);
});

app.listen(PORT, () => console.log(`Application running on port: ${PORT}`));
