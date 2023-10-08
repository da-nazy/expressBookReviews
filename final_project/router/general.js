const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
//let fs = require('fs');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(username&&password){
    if(!isValid(username)){
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else{
      // user already exists
      return res.status(404).json({message: "User already exists!"});  
    }
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const getAllBooks=new Promise((resolve,reject)=>{
   try{
    const allBooks=books;
    if(allBooks){
      resolve(allBooks);
    }else{
      throw new Error("All books not found!")
    }
   }catch(error){
    reject(error.message)
   }
  })

  try{
    const allBooks=await getAllBooks;
    return  res.send(JSON.stringify(allBooks));
  }catch(error){
    return  res.send(JSON.stringify(error.message));
  }
 
 });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const getDetails=new Promise((resolve,reject)=>{
    try{
      let book=books[`${req.params.isbn}`];
      if(book){
        resolve(book);
      }else{
        throw new Error("Book not found!")
      }
    }catch(error){
      reject(error.message);
    }
  })
  getDetails.then(
    (data)=>{return res.status(200).send(JSON.stringify(data))},
   (err)=>{
    return res.status(404).send(JSON.stringify(err))
  });
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const getAuthor=new Promise((resolve,reject)=>{
   try{
    let author;
    for(var a=1; a<=Object.keys(books).length;a++){
      if(books[`${a}`].author===req.params.author){
        author=books[`${a}`];
      }
    }
    if(author){
      resolve(author);
    }else{
      throw new Error("Author not found!")
    }
   }catch(error){
    reject(error.message);
   }
  });
  getAuthor.then(
    (data)=>{return res.status(200).send(JSON.stringify(data))},
   (err)=>{
    return res.status(404).send(JSON.stringify(err))
  });
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const getTitle=new Promise((resolve,reject)=>{
    try{
      let title;
      for(var a=1; a<=Object.keys(books).length;a++){
        if(books[`${a}`].title===req.params.title){
          title=books[`${a}`];
        }
      }
     if(title){
       resolve(title);
     }else{
       throw new Error("Title not found!")
     }
    }catch(error){
     reject(error.message);
    }
   });
   getTitle.then(
     (data)=>{return res.status(200).send(JSON.stringify(data))},
    (err)=>{
     return res.status(404).send(JSON.stringify(err))
   });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const getReviews=new Promise((resolve,reject)=>{
    try{
   
     let review=books[`${req.params.isbn}`]?.reviews;
     if(review){
       resolve(review);
     }else{
       throw new Error("Review not found!")
     }
    }catch(error){
     reject(error.message);
    }
   });
   getReviews.then(
     (data)=>{return res.status(200).send(JSON.stringify(data))},
    (err)=>{
     return res.status(404).send(JSON.stringify(err))
   });
 });
 
module.exports.general = public_users;
