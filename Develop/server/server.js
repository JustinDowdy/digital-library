const express = require('express');
// adding Apollo Server 
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// adding typedefs and resolvers
const { typeDefs, resolvers } = require('./schema');

const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT || 3000;

//adding server for Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware({ app }); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//adding routes
const routes = require('./routes');
app.use(routes);

// retrieving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
