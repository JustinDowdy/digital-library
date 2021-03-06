const express = require('express');
// adding Apollo Server 
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// adding typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;


//adding server for Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

async function startServer() {
  await server.start()
server.applyMiddleware({ app })
}

startServer()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// retrieving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
