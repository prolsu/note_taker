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
    
    const assignRandomId = () => {
        let newNote = req.body;
        let title = newNote.title;

        //dbFileIds array collects all 'IDs' from each object in the array 'dbFile'(notes)
        let dbFileIds = [];
        dbFile.forEach(x => dbFileIds.push(x.id));
        
        //'identifier' array will collect all letters in the title and remove any empty spaces
        let identifier = [];
        for(let i = 0; i < title.length; i++){
            identifier.push(title.charAt(i));
        }
        identifier = identifier.filter(x => x != " "); 

        //'id' will be assigned to each 'note' POSTED to 'dbFile'
        //it will take each letter from the 'identifier' array and randomly rearrange them
        let id = "";
        identifier.forEach(x => id += identifier[Math.floor(Math.random() * identifier.length)]);

        //if user enters a single lette, the id will be created using the letter concatenated with a random number
        if(id.length == 1){
            id += id.toUpperCase() + Math.floor(Math.random() * 1000);
        }
        
        //a new property is created assigning a unique 'id' to each 'newNote' then pushed to 'dbFile'
        newNote["id"] = id; 
        console.log(`Succesfully created your unique id: '${id}'`);
        dbFile.push(newNote);
    }
    assignRandomId();
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