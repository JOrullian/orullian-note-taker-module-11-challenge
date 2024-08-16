const router = require('express').Router();

// Import modular routers for /notes and future routes
const notesRouter = require('./notes');

router.use('/notes', notesRouter);

module.exports = router;