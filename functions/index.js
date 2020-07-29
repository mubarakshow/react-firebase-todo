const functions = require('firebase-functions');
const auth = require('./util/auth');
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./APIs/users');
const { 
  getAllTodos,
  getTodoById,
  postOneTodo,
  deleteTodo,
  editTodo,
} = require('./APIs/todos');


const app = require('express')();

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.put('/user', auth, updateUserDetails)

// Todos
app.get('/todos', auth, getAllTodos);
app.get('/todo/:todoId', auth, getTodoById);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

exports.api = functions.https.onRequest(app);