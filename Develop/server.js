const express = require('express');
const path = require('path');
const fs = require('fs');

let dbFile = require('./db/db.json');

// Creates the server here...
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
    res.json(dbFile);
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    let idNumber = dbFile.length;
        
    newNote["id"] = JSON.stringify(idNumber); 
    // console.log(newNote);
    
    dbFile.push(newNote);
    res.json(true);
});

app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;

    const toDelete = dbFile.find(item => item.id === id)
    
    if(toDelete) {
        dbFile = dbFile.filter(item => item.id != id)
        res.status(200).json(toDelete);
    }
    else{
        res
            .status(404)
            .json({message: `Item with id number '${id}' does not exist`});
    }
  
});

// * route goes at end...
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// PORT Listening here...
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
    // console.log(noteArray);
});