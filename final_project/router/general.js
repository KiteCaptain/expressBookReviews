const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// Task 10: Get the book list available using async callback function
public_users.get('/', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });
    
    res.send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  let getBookByISBN = new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  });

  getBookByISBN.then((book) => {
    res.send(book);
  }).catch((err) => {
    res.status(404).json(err);
  });
 });
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let getBooksByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if(filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({message: "No books found for this author"});
    }
  });

  getBooksByAuthor.then((bks) => {
    res.send({booksByAuthor: bks});
  }).catch((err) => {
    res.status(404).json(err);
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  let getBooksByTitle = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if(filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({message: "No books found with this title"});
    }
  });

  getBooksByTitle.then((bks) => {
    res.send({booksByTitle: bks});
  }).catch((err) => {
    res.status(404).json(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
