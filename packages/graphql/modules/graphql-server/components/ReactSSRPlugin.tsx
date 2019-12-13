import { ApolloClient, InMemoryCache } from "apollo-boost";
import { ComponentPlugin } from "@reactopus/ioc";
import React from "react";
import { GraphQLSchema } from "graphql";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-common";
// @ts-ignore
import fetch from "node-fetch";
import { getDataFromTree } from "@apollo/react-ssr";

export function getClient() {
  // schema: GraphQLSchema, context: Object
  const cache = new InMemoryCache();

  // @ts-ignore
  const client = new ApolloClient({
    ssrMode: true,

    // shouldBatch: true,

    // link: new SchemaLink({
    //   schema,
    //   context
    // }),

    link: createHttpLink({
      uri: "http://0.0.0.0:7080/graphql",
      fetch
    }),

    cache
  });

  return client;
}

@ComponentPlugin("server/react-ssr")
export default class ReactSSRPlugin {
  afterGetTree(
    self: any,
    result: React.ReactElement<any>,
    renderContext: any
  ): React.ReactElement<any> {
    console.log("in react ssr plugin");
    const client = getClient();
    renderContext['client'] = client
    return <ApolloProvider client={client}>{result}</ApolloProvider>;
  }

  async aroundRender(self: any, original: Function, args: any) {
    const tree = args[0];
    const renderContext = args[1];

    await getDataFromTree(tree);

    console.log('client state:', renderContext.client.extract())

    return await original.apply(self, args);
  }
}
