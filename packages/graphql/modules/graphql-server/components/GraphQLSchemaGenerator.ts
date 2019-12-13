import { Component } from "@reactopus/ioc";
import {makeSchema} from "nexus";
import {GraphQLSchema} from "graphql";
import * as path from "path";

@Component("graphql/schema")
export default class GraphQLSchemaGenerator {
    getTypes(): any {
        return []
    }

    getSchema(): GraphQLSchema {
        return makeSchema({
            types: this.getTypes(),
            outputs: {
                schema: path.join(process.cwd(), "./schema.graphql"),
                // typegen: path.join(__dirname, "../../my-generated-types.d.ts"),
            }
        });
    }
}
