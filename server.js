const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const schema = require('./graphql/schema/schema');
const resolvers = require('./graphql/resolvers/resolvers');
const mongoose = require('mongoose');

const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServerPluginDrainHttpServer } = require ("apollo-server-core");
const { WebSocketServer } = require ('ws');
const { useServer } = require ('graphql-ws/lib/use/ws');
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/graphql-subscriptions-chatapp');

const app = express();
app.use(cors())


const httpServer = createServer(app);

const PORT = 9999;


const schema2 = makeExecutableSchema({ typeDefs: schema, resolvers });
// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if your ApolloServer serves at
  // a different path.
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema: schema2 }, wsServer);


const server = new ApolloServer({
schema: schema2,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  context: ({ req }) => {
    // console.log('apollo context req:', req)
    return {
      test: 'context test'
    }
  }

});

(async () => {
  await server.start();
  server.applyMiddleware({app})
})()

httpServer.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})