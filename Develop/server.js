const express = require('express');
const path = require('path');
const fs = require('fs');

const dbFile = require('./db/db.json');

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
    res.json(dbFile);
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    
    let idNumber = dbFile.length;
        
    newNote["id"] = JSON.stringify(idNumber); 
    console.log(newNote);
    
    dbFile.unshift(newNote);
    res.json(true);
});

app.delete("/api/notes/:id", function(req, res) {
    let toDelete = req.params.id;
    console.log(typeof(toDelete));
    
    // console.log(dbFile)

    let filtered = dbFile.filter(x => x != null);
    
    for (let  i = 0; i < filtered.length; i++){
            
        if(filtered[i].id == toDelete){
            console.log(typeof(filtered[i].id))
            delete filtered[i];
        }
        }

    const updatedNoteArray = filtered.filter(x => x != null);
    console.log(updatedNoteArray);

    fs.writeFile('./db/db.json', JSON.stringify(updatedNoteArray), 'utf8', (err) =>
        err ? console.log(err) : console.log(`Item with id ${toDelete} was deleted.`))

    return res.json(true);
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