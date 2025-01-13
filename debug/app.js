const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');

app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});