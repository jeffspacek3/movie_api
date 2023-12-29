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





let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["Free Guy"]
  },

];

let movies = [
  {
    "Title": "Free Guy",
    "Description": "A good movie with actor Ryan Reynolds at his best",
    "Genre": {
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
    "Genre": {
      "Name": "Sci-Fi",
      "Description": "In film and televesion, sci-fi creates curiosity of whats possible"
    },
    "Director": {
      "Name": "Joseph Kosinski",
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
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Bad Request')
  }

});


//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  };

});

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(' ${movieTitle} has been added to user ${id}s array');
  } else {
    res.status(400).send('no such movie')
  };

});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle)
    res.status(200).send(' ${movieTitle} has been removed from ${id}s array');
  } else {
    res.status(400).send('no such movie')
  };
});

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send('user ${id} has been deleted');
  } else {
    res.status(400).send('no such user')
  };
});

//READ
app.get('/', (req, res) => {
  res.send('Welcome to my movie club and theater!');
});

//READ
app.get('/movies', (req, res) => {
  res.json(movies);
  res.status(200).json(movies);
  res.send('Successful Get request returning data on all movies')
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
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre Not Found')
  }

});

//READ
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Director Not Found')
  }

});

//ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// listen for requests
app.listen(8080, () => {
  console.log('listening on 8080.');
});