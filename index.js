const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const JSONStream = require("JSONStream");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const verifyPic = (req, res, next) => {
  const id = req.params.id;
  const userFound = pics.some(el => el.id == id);
  userFound ? next() : res.redirect(`/error/${id}`);
};

let pics = [];

fs.createReadStream("pics.json", { encoding: "utf8" }).pipe(
  JSONStream.parse("*", pic => {
    pics = [...pics, pic];
  })
);

// fs.readFile("pics.json", { encoding: "utf8" }, (err, data) => {
//   if (err) console.error(err);

//   JSON.parse(data).map(pic => {
//     pics = [...pics, pic];
//   });
// });

app.get("/", (req, res) => {
  res.render("index", { pics });
});

app.get("*.json", (req, res) => {
  if (req.path === "/.json") {
    res.send(pics);
  } else {
    const id = req.path.match(/\d/)[0];
    const pic = pics.find(el => el.id == id);
    res.send(pic);
  }
});

app.get("/:id", verifyPic, (req, res) => {
  const id = req.params.id;
  const pic = pics.find(el => el.id == id);

  res.render("pic", { pic });
});

app.get("/error/:id", (req, res) => {
  res.status(404).send(`No picture with id ${req.params.id} found`);
});

app.listen((port = 3000), () => {
  console.log(`Listening on ${port}`);
});
