import React from "react";
import { Component } from "@reactopus/ioc";
import express from "express";
import { renderToString, renderToStaticMarkup } from "react-dom/server";

@Component("server/react-ssr")
export default class ReactSSR {
  async getTree(renderContext: any): Promise<React.ReactElement<any>> {
    return <div>Test SSR</div>;
  }

  async render(tree: React.ReactElement<any>, renderContext: any) {
    return renderToString(tree);
  }

  async execute(self: ReactSSR, req: express.Request, res: express.Response) {
    const renderContext = {};
    const tree = await self.getTree(renderContext);
    const content = await self.render(tree, renderContext);
    res.send(content);
  }
}
