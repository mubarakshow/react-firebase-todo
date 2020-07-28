const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
  db
    .collection('todos')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        });
      })
      return response.json(todos)
    })
    .catch((err) => {
      console.log(
        "======================\nerror getting todos\n======================"
      );
      return response.status(500).json({error: err.code})
    })
}

exports.postOneTodo = (request, response) => {
  if (request.body.body.trim() === '') {
    return response.status(400).json({ body: 'Must not be empty' })
  }

  if (request.body.title.trim() === '') {
    return response.status(400).json({title: 'Must not be empty'})
  }

  const { title, body, createdAt } = request.body;
  
  const newTodoItem = {
    title: title,
    body: body,
    createdAt: new Date().toISOString()
  }

  db
    .collection('todos')
    .add(newTodoItem)
    .then((doc) => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem)
    })
    .catch((err) => {
      response.status(500).json({error: 'Something went wrong'})
      console.error(err)
    })
}

exports.deleteTodo = (request, response) => {
  const document = db.doc(`/todo/${request.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if(!doc.exists) {
        return response.status(404).json({ error: 'Todo not found'})
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: 'Deleted successfully' })
    })
    .catch((err) => {
      console.log('err', err)
      return response.status(500).json({ error: err.code })
    })
}
