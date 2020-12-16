const express = require('express');
const path = require('path');
const fs = require('fs');

const noteArray = require('./db/db.json');

// Creates the server here...
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
    res.json(noteArray);
    // console.log(noteArray);
    console.log(noteArray.length);
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    
    newNote["id"] = noteArray.length;
    console.log(newNote);
    
    noteArray.push(newNote);
    res.json(true);
});

// app.delete("/api/notes/:id", function(req, res) {
//     res.send("Testing");
// });

// * route goes at end...
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// PORT Listening here...
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
    // console.log(noteArray);
});