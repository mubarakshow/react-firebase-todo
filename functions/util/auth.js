const { admin, db } = require('./admin');

module.exports = (request, response, next) => {
  let idToken;
  const { authorization } = request.headers;
  if (authorization && authorization.startsWith('Bearer ')) {
    idToken = authorization.split('Bearer ')[1]
  } else {
    console.error('No token found');
    return response.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.testingTheReqApi = "trying to understand how the request obeject works"
      request.user = decodedToken;
      console.log('req.testingTheReqApi:', request.testingTheReqApi);
      console.log('req.user:', request.user)
      return db.collection('users').where('userId',  '==', request.user.uid).limit(1).get();
    })
    .then((data) => {
      console.log(".then(data) =>", data.docs[0].data())
      request.user.username = data.docs[0].data().username;
      request.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token", err);
      return response.status(403).json(err)
    })
}