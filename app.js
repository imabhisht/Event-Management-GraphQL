const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
const mongoose = require('mongoose');
const credsForConnection = require('./credsForConnection.json') 
const graphQlSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers')

app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));


mongoose
    .connect(`mongodb+srv://${credsForConnection.env.MONGO_USER}:${credsForConnection.env.MONGO_PASSWORD}@cluster0.cow9c.mongodb.net/${credsForConnection.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(3000);
    }).catch(err=>{
        console.log(err)
    })
