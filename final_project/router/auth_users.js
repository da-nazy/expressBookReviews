const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 let isValidUserName=users.filter((user)=>{
  return user.username===username;
 })
 if(isValidUserName.length>0){
  return true;
 }else{
  return false;
 }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let isValidUser=users.filter((user)=>{
  return (user.username===username&&user.password===password)
});

if(isValidUser.length>0){
  return true;
}else {
  return false; 
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
 if(!password||!username){
  return res.status(404).json({message: "Error logging in"});
 }
 if(authenticatedUser(username,password)){
  let accessToken=jwt.sign({
    data:{username,password}
  },'access',{expiresIn:120*60} );
  req.session.authorization={
    accessToken,username
  }

  return res.status(200).send(JSON.stringify("User successfully logged in"));
 }else{
 
  return res.status(208).json({message: "Invalid Login. Check username and password"});
 }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let reviews=books[`${req.params.isbn}`]?.reviews;
  let user=req.user.data.username;
  let newReview=reviews.filter((value)=>value.by!==user);
  books[`${req.params.isbn}`].reviews=newReview;
  return res.status(200).send(JSON.stringify({message:`${user} review removed`}));
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let reviews=books[`${req.params.isbn}`]?.reviews;
  let user=req.user.data.username;
  let userIndex = reviews.findIndex(item => item.by ==user);
  if (userIndex !== -1) {
    //found
    reviews[userIndex].review=req.query.review
  }else{
    //not found
    reviews.push({by:user,review:req.query.review})
  }
  books[`${req.params.isbn}`].reviews=reviews;

  return res.status(200).send(JSON.stringify(reviews));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
