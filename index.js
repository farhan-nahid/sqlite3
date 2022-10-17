var sqlite3 = require("sqlite3").verbose();
const { query } = require("express");
var express = require("express");
var http = require("http");

const app = express();
var server = http.createServer(app);
var db = new sqlite3.Database("./database/image.db");

app.use(express.json());
db.run("CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)");

app.get("/", function (req, res) {
  res.json({ name: "Farhan Ahmed Nahid" });
});

app.post("/add", function (req, res) {
  console.log(req.body);
  db.serialize(() => {
    db.run(
      "INSERT INTO emp(id,name) VALUES(?,?)",
      [req.body.id, req.body.image],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("New employee has been added");
        res.json({ id: req.body.id, image: req.body.image });
      }
    );
  });
});

app.get("/view/:id", function (req, res) {
  db.serialize(() => {
    db.each(
      "SELECT id ID, name NAME FROM emp WHERE id =?",
      [req.params.id],
      function (err, row) {
        console.log(row);
        if (err) {
          res.send("Error encountered while displaying");
          return console.error(err.message);
        }
        res.json({ message: "Success", id: row.ID, image: row.NAME });
      }
    );
  });
});

app.put("/update/:id", async (req, res) => {
  db.serialize(() => {
    db.run(
      "UPDATE emp SET name = ? WHERE id = ?",
      [req.body.image, req.params.id],
      function (err) {
        if (err) {
          res.send("Error encountered while updating");
          return console.error(err.message);
        }
        res.json({ message: "Entry updated successfully" });
        console.log("Entry updated successfully");
      }
    );
  });
});

app.get("/del/:id", function (req, res) {
  db.serialize(() => {
    db.run("DELETE FROM emp WHERE id = ?", req.params.id, function (err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });
});

app.get("/close", function (req, res) {
  db.close((err) => {
    if (err) {
      res.send("There is some error in closing the database");
      return console.error(err.message);
    }
    console.log("Closing the database connection.");
    res.send("Database connection successfully closed");
  });
});

server.listen(8080, function () {
  console.log("Server listening on port: 8080");
});
