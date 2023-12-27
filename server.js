const express = require('express');
morgan = require('morgan'),
  fs = require('fs'), //import built in node modules fs and path
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');


const app = express();

app.use(bodyParser.json());


//A 'LOG.TXT' FILE IS CREATED IN ROOT DIRECTORY
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

//EXPRESS STATIC
app.use(express.static('public'));

//LOGGER
app.use(morgan('combined', { stream: accessLogStream }));


//ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('oops!');

  //GET REQUESTS
  app.get((req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
  });
});


let users = []

let movies = [
  {
    "Title": "Free Guy",
    "Description": "A good movie with actor Ryan Reynolds at his best",
    "Gentre": {
      "Name": "Comedy",
      "Description": "In film and televesion, comedy is healing to the soul"
    },
    "Director": {
      "Name": "Shawn Levy",
      "Bio": "Shawn Levy was born and raised Canadian. Later in life he directed films",
      "Birth": "1968"
    },

    "imageurl": "a nice image",
    "featured": false
  },

  {
    "Title": "Oblivion",
    "Description": "A good movie with actor Tom Cruise",
    "Gentre": {
      "Name": "Sci-Fi",
      "Description": "In film and televesion, sci-fi creates curiosity of whats possible"
    },
    "Director": {
      "Name": "Joseph kosinski",
      "Bio": "Shawn Levy directed films",
      "Birth": "1974"
    },

    "imageurl": "a neat image",
    "featured": false
  },
]

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v9();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users not found')
  }

});




//UPDATE




//READ
app.get('/', (req, res) => {
  res.send('Welcome to my movie club and theater! Your awesome');
});


//READ
app.get('/movie/:genres', (req, res) => {
  res.json(genre);
  res.send('Successful Get request returning date on all the genres')
});

//READ
app.get('/movie/:directors', (req, res) => {
  res.json(director);
  res.send('Successful Get request returning date on all the directors')
});

//READ
app.get('/imageurl', (req, res) => {
  res.json(imageurl);
});



//READ
app.get('/movies', (req, res) => {
  res.json(movies);
  res.status(200).json(movies);
  res.send('Successful Get request returning date on all the movies')
});

//READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('Movie Not Found')
  }

});


//READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const movie = movies.find(movie => movie.genreName === genre).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre Not Found')
  }

});


//READ
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const movie = movies.find(movie => movie.directorName === director).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }

});



// listen for requests
app.listen(8080, () => {
  console.log('listening on 8080.');
});