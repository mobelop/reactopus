import express from "express";

export interface HttpServer {
    app: express.Express
}
