const mongoose = require('mongoose');

let moviesSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    FirstName:{type: String, required: true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: {type: String, date: true},
    Password: {type: String, required: true},
    
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }]
  });

  let Movie = mongoose.model("Movie", moviesSchema);
  let User = mongoose.model("Users", userSchema);
  
  module.exports.Movie = Movie;
  module.exports.users = User;