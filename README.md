# Movie API Documentation
## Description

This API provide users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies.

## Dependencies

* Node.js: JavaScript runtime for server-side scripting.
* Express: Back end web application framework for building RESTful APIs with Node.js.
* MongoDB with Mongoose: NoSQL database and Object Data Modeling library for Node.js.
* Postman: Allows you to design, develop, test and monitor APIs.
* body-parser: Express middleware for parsing request bodies.
* express-validator: Middleware for input validation in Express.
* jsonwebtoken: Library for JWT ( JSON Web Token) generation and verification.
* lodash: Utility library for JavaScript.
* passport: Authentication middleware for Node.js.
* passport-jwt: Passport strategy for JWT authentication.
* passport-local: Passport strategy for username/password authentication.
* uuid: Library for generating unique identifiers.

## Endpoints

### Get All movies
* URL: ``` /movies ```
* Request Body: None
* Response Body: A JSON object holding data about all movies

### Get a Single Movie
* URL: ``` /movies/[title] ```
* Request body: None
* Response Body: A JSON object holding data about a single genre, containting genre name, and description

### Get Director Information
* URL: ``` /movies/genre/[genreName] ```
* Request body: None
* Response body: A JSON object holding data about a single directon, containing director name, bio, birth and death year

### Get Genre Information
* URL: ``` /movies/directors/[directorName] ```
* Request body: None
* Response body: A JSON object holding data about a single genre, containting genre name, description
  
### Get All users
* URL: ``` /users ```
* Request body: None
* Response body: A JSON object holding data about all users
  
### Ger a Single User
* URL: ``` /users/[Username] ```
* Request body: None
* Response body: AS JSON object holding data about a single user, containing username, passowrd, email, birthday, favorite movies

### Post New User (Register)
* URL: ``` /users ```
* Request body: A JSON object holding data about the user which needs to be updated.
* Response body: A JSON object holding data about the updated user information.

### Put (Update) User Information
* URL: ``` /users/[Username] ```
* Request body: A JSON object holding data about the user which needs to be update.
* Response body: A JSON object holding data about the updated user information

### Post Movie to Users Favorite Movies List
* URL:``` /users/[Username]/movies/[MovieID] ```
* Request body: None
* Response body; A JSON obejct holdign datea about the updated user information

### Delete Movie from Users Favorite Movie List
* URL: 
* Request body: none
* Response body: A JSON object holding data about the update duser information

### Delete User
* URL:
* Request Body: None
* Response Body: Text message indicating whether the user deregister successfully
