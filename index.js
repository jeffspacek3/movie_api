
const express = require("express");
morgan = require("morgan");
const app = express("express");
const bodyParser = require("body-parser");
uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.Users;

app.use(bodyParser.json()); // USE JSON FORMATTING
app.use(bodyParser.urlencoded({ extended: true }));

//IMPORT auth.js
let auth = require("./auth")(app);

//IMPORT passport and passport.js
const passport = require("passport");
require("./passport");

//LOG ALL REQUESTS
app.use(morgan("common"));

mongoose.connect("mongodb://localhost:27017/myflixcollection",
  { useNewUrlParser: true, useUnifiedTopology: true });




//CREATE NEW USER
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      };
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


// Add a movie to a user's list of favorites
app.post('/Users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//CREATE
app.post("/users/:id/:movietitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(' ${movieTitle} has been added to user ${id}s array');
  } else {
    res.status(400).send('no such movie')
  };

});



// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })

});



//UPDATE
app.put("/users/:UserName", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  };

});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
    res.status(200).send(' ${movieTitle} has been removed from ${id}s array');
  } else {
    res.status(400).send('no such movie')
  };
});

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send('user ${id} has been deleted');
  } else {
    res.status(400).send('no such user')
  };
});


// Delete a user by username
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      };
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


//READ SECTION


//READ MAIN PAGE
app.get("/", (req, res) => {
  res.send('Welcome to my movie club and theater!');
});

// READ USERS
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ USERS BY USERNAME
app.get("/users/:UserName", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((Users) => {
      res.status(201).json(Users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ MOVIES
app.get("/movies", (req, res) => {
  Movies.find()
    .then((Movies) => {
      res.status(201).json(Movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ MOVIES TITLE
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});


//READ MOVIE GENRE.....
app.get("/movies/genres/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
  .then((movie) => {
res.status (200).json(movie.Genre);
  })
.catch((err) => {
console.error(err);
res.status(500).send("Error:" + error );
});
});


//READ Director by name
app.get("/movies/directors/:directorName", async (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((Movie) => {
      res.json(Movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + error);
    });
});


//ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});


// listen for requests
app.listen(8080, () => {
  console.log('listening on 8080.');
});