const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving all notes
notes.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);
  
// POST Route for submitting notes
notes.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
        title,
        text,
        note_id: uuidv4(),
        };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

// DELETE Route for deleting a note by ID
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  
  readFromFile('./db/db.json')
      .then((data) => {
          let notes = JSON.parse(data);
          // Check if the data is not empty before parsing
          if (!notes) {
              notes = [];
          }
          const updatedNotes = notes.filter((note) => note.note_id !== noteId);
          writeToFile('./db/db.json', updatedNotes);
          res.json({ message: 'Note deleted successfully' });
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Failed to delete note' });
      });
});

module.exports = notes;