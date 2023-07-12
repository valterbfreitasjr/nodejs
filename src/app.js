import "dotenv/config";

import express from "express";
import * as Sentry from "@sentry/node";
import Youch from "youch";
import "express-async-errors";

//import authMiddleware from "./app/middlewares/auth";
import routes from "./routes";

import "./database";

import sentryConfig from "./config/sentry";

class App {
  constructor() {
    this.server = express();
    Sentry.init({
      dsn: sentryConfig.dsn,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ App }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // RequestHandler creates a separate execution context, so that all
    // transactions/spans/breadcrumbs are isolated across requests
    this.server.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    this.server.use(Sentry.Handlers.tracingHandler());

    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    //this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === "development") {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json({ errors });
      }
      return res.status(500).json({ error: "Internal server error!" });
    });
  }
}

export default new App().server;
