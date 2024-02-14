require("dotenv").config();

const express = require("express");
const app = express("express");

const bodyParser = require("body-parser");
uuid = require("uuid");

const mongoose = require("mongoose");
const Models = require("./models.js");

//integrating mongoose with rest api
const movies = Models.Movie;
const users = Models.Users;

//middleware for CORS
const cors = require("cors");
app.use(cors());

// connect datebase to api
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//security
const bcryptjs = require("bcryptjs");

let auth = require("./auth.js")(app);

//authentication logic
const passport = require("passport");
require("./passport");

// include(s) new validator as middleware to the routes that require validation
const { check, validationResult } = require("express-validator");

let allowedOrigins = [
  "http://localhost:8080",
  "https://cinemark-movie-flix-d567da194f3d.herokuapp.com",
  "http://localhost:1234",
];

/* creates a list of allowed domains within the variable(allowedOrigins),
then compares the domains of any incoming request with this list and either allows (if the domain is on the list) it
or return an error (if the domain isn't on the list) */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// add new user
/* expected in JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

// allow new users to register
app.post(
  "/users/",
  /*
    Validation logic here for request
    -you can either use a chain of methods like .not().isEmpty()
    -which means "opposite of isEmpty" in plain english "is not empty"
    -or use .isLength({min: 5}) which means
    -minimum value of 5 characters are only allowed
    */
  /*[
    check("Username", "Username is required").isLength({min: 5}),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],*/
  async (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    let hashedPassword = users.hashPassword(req.body.Password);
    await users
      .findOne({ Username: req.body.Username })
      // search to see if a user with the requested user name already exists
      .then((user) => {
        if (user) {
          // if the user is found, spend appropriate response
          return res.status(400).send(req.body.Username + " already exists!");
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday,
            })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    // condition ends
    await users
      .findOneAndUpdate(
        { Username: req.params.Username },
        {
          $push: { Favoritemovies: req.params.MovieID },
        },
        { new: true }
      )
      // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

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
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    // condition ends
    await users
      .findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      )
      // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    // condition ends
    users
      .findOneAndDelete({ Username: req.params.Username })
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
  }
);


/*
// Allow users to remove a movie from their list of favorites
  app.delete("/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { Username, MovieID } = req.params;
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: Username },
        {
          $pull: { FavoriteMovies: MovieID },
        },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  });
*/


/*

//NEEDS work
//NEED TO ADD MOVIE TITLE FIRST
//Deletes a users movie title...
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.Favoriteovies = user.Favoriteovies.filter(title => title !== movieTitle)
    res.status(200).send(' ${movieTitle} has been removed from ${id}s array');
  } else {
    res.status(400).send('no such movie')
  };
});


*/

//READ SECTION

// read the welcome page
app.get(
  "/",
  async (req, res) => {
    res.send("Welcome to my movie club and theater!");
  }
);

// read current users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    // condition ends
    await users
      .find()
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// read current users by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission Denied");
    }
    // condition ends
    await users
      .findOne({ Username: req.params.Username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// generate a list of the entire movie collection
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await movies
      .find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// return data about a single movie by title to the user
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await movies
      .findOne({ Title: req.params.Title })
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// read movies by genre
app.get(
  "/movies/genres/:GenreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .find({ Genre: req.params.GenreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);


// needswork!
//input 1 director, sends another specific director......

// read movie(s) by director
app.get(
  "/movies/directors/:DirectorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await movies
      .findOne({ "Director.Name": req.params.directorName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);


// serves the documentation.html page
app.get(
  "/documentation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
  }
);

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Port
const port = process.env.PORT || 8080;

// listen for request
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});


//END NOTES
/*

TO-DO LIST
-add/delete a users movie from their favorites list
-read director by name

Bonus tasks
//allo users to see which actors star in which movies
//allow users to view information about different actors
//allow users to view more information about different movies
//allow users to crate a to watch list
// install... txt.log recording code...

*/
