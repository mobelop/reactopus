import { ComponentPlugin, getInstance } from "@reactopus/ioc";
import { ApolloServer } from "apollo-server-express";
import HttpServer from "~/core-modules/modules/http/components/HttpServer";
import GraphQLSchemaGenerator from "./GraphQLSchemaGenerator";
import express from "express";

@ComponentPlugin("server/http")
export default class GraphQLPlugin {
  beforeStart() {
    const app = express();
    const schemaGenerator = getInstance<GraphQLSchemaGenerator>(
      "graphql/schema"
    );

    const server = new ApolloServer({
      schema: schemaGenerator.getSchema(),
      context: {}
    });

    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(4112, () =>
      console.log(
        `GraphQL server is running on http://${process.env.VIRTUAL_HOST}:4112`
      )
    );
  }
}
