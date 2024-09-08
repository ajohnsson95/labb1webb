const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Ställ in mappen för statiska filer
app.use(express.static(path.join(__dirname, 'public')));

// Starta servern
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});