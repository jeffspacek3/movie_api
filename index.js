
const express = require("express");
const app = express("express");

const bodyParser = require("body-parser");
uuid = require("uuid");

const mongoose = require("mongoose");
const Models = require("./models.js");

const movies = Models.Movie;
const users = Models.Users;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require("./auth")(app);
const passport = require("passport");

require("./passport");

mongoose.connect("mongodb://localhost:27017/myflixcollection",
  { useNewUrlParser: true, useUnifiedTopology: true });





// serves the documentation.html page
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});


//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

//Add a new user to the database
app.post("/users/", async (req, res) => {
  users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists!");
      } else {
        users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
}
);



// Allow users to add a movie to their list of favorites... NEEDS WORK
app.post("/users/:Username/movies/:movieTitle", async (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.movieTitle }
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


// Update a user's info, by username
/* JSON required in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) { return res.status(400).send("Permission Denied") };
    // condition ends
    await users.findOneAndUpdate({ Username: req.params.Username }, {
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

//6.9 complete
// delete a user by username
app.delete("/users/:Username",
passport.authenticate("jwt", {session: false}),
  async (req, res) => {
//condition to check added here
if (req.user.Username !== req.params.Username) { return res.status(400).send("Permission Denied") };
// condition ends
    users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });


  //this needs work
//Deletes a users movie title...
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


//READ SECTION

// read the welcome page
app.get("/", (req, res) => {
  res.send("Welcome to my movie club and theater!");
});


//6.9 complete
// read current users
app.get("/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await users.find()
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });



// read current users by username
app.get("/users/:UserName", (req, res) => {
  users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//6.9 complete
// generate a list of the entire movie collection
app.get("/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await movies.find()
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });


// read one movie by its title
app.get("/movies/:Title", (req, res) => {
  movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});


// read movies by genre
app.get("/movies/genres/:genreName", (req, res) => {
  movies.find({ Genre: req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
}
);



// needswork!
// read movie(s) by director
app.get("/movies/directors/:director", (req, res) => {
  movies.find({ Director: req.params.director })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
}
);



// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});


// listen for requests
app.listen(8080, () => {
  console.log("listening on 8080");
});

/*
NOTES AND TO-DO LIST

updating a users favorite movie array isn't working. (thats app.post)
app.get movie directors by name needs work.... parameters and the string needs work

allo users to add a movie to their list of favorties
allow users to removed a movie from their list fo favorites
allow existing users to deregister

//optional
//allo users to see which actors star in which movies
//allow users to view information about different actors
//allow users to view more information about different movies
//allow users to crate a to watch list
/// install... txt.log recording code...




//duplicate...?
//Add a movie to a users list of favoriteMovies
//app.post("/users/:id/:movietitle", (req, res) => {
//const { id, movieTitle } = req.params;

let user = users.find(user => user.id == id);

if (user) {user.FavoriteMovies.push(movieTitle);res.status(200).send(' ${movieTitle} has been added to user ${id}s array');
} else {res.status(400).send('no such movie')
};

//});
//duplicate...?
*/