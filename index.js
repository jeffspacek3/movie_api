const express = require('express');
morgan = require('morgan'),
  fs = require('fs'), //import built in node modules fs and path
  path = require('path');

const app = express();

let topmovies = [
  {
    title: 'My Top 10 Movies',
    h1: 'Lord of the Rings',
    h2: 'Star Wars',
    h3: 'Oblivion',
    h4: 'Deadpool',
    h5: 'Guardians of the Galaxy',
    h6: 'Minority Report',
    h7: 'Men in Black',
    h8: 'Braveheart',
    h9: 'Live Die Repeat',
    h10: 'Fast and Furious'
  }
];


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club and theater!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topmovies);
});


// express static
app.use('documentation.html', express.static('public'));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })


// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});


//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});