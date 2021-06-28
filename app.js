const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const mongoose = require("mongoose");
const credsForConnection = require("./credsForConnection.json");
const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth");
const cors = require("cors");

app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Contorl-Allow-Origin", "*");
//   res.setHeader("Access-Contorl-Allow-Methods", "POST,GET,OPTIONS");
//   res.setHeader("Access-Contorl-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
app.use(require("cors")());
mongoose
  .connect(
    `mongodb+srv://${credsForConnection.env.MONGO_USER}:${credsForConnection.env.MONGO_PASSWORD}@cluster0.cow9c.mongodb.net/${credsForConnection.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
