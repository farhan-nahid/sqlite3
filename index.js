const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const db = new sqlite3.Database("./database/image.db");

app.use(express.json());
db.run("CREATE TABLE IF NOT EXISTS emp(id TEXT, image TEXT)");

app.get("/", function (_req, res) {
  res.json({ name: "Farhan Ahmed Nahid" });
});

app.post("/image", function (req, res) {
  db.serialize(() => {
    db.run(
      "INSERT INTO emp(id,image) VALUES(?,?)",
      [req.body.id, req.body.image],
      function (err) {
        if (err) {
          return res.json({ message: err.message });
        }

        res.statusCode = 201;
        res.json({ message: "Image successfully added" });
      }
    );
  });
});

app.get("/image", function (req, res) {
  db.serialize(() => {
    db.each("SELECT id ID, image IMAGE FROM emp WHERE id =?", ["1"], function (err, row) {
      if (err) {
        res.json({ message: err.message });
      }
      if (row?.ID) {
        res.json({ message: "Success", id: row.ID, image: row.IMAGE });
      }
      res.statusCode = 400;
      res.json({ message: "Data not found" });
    });
  });
});

app.put("/image/:id", async (req, res) => {
  db.serialize(() => {
    db.run(
      "UPDATE emp SET image = ? WHERE id = ?",
      [req.body.image, req.params.id],
      function (err) {
        if (err) {
          res.json({ message: err.message });
        }
        res.json({ message: "Entry updated successfully" });
      }
    );
  });
});

app.delete("/image/:id", function (req, res) {
  db.serialize(() => {
    db.run("DELETE FROM emp WHERE id = ?", req.params.id, function (err) {
      if (err) {
        res.json({ message: err.message });
      }
      res.json({ message: "Successfully Deleted" });
    });
  });
});

app.get("/close", function (req, res) {
  db.close((err) => {
    if (err) {
      res.send("There is some error in closing the database");
    }

    res.json({ message: "Database connection successfully closed" });
  });
});

server.listen(8080, function () {
  console.log("Server listening on port: 8080");
});
