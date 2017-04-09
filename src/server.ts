import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");

// routes
import { IndexRoute } from "./routes/index";

// interfaces
import { IUser } from "./interfaces/user";

// models
import { IModel } from "./models/model";
import { IUserModel } from "./models/user";

// schemas
import { userSchema } from "./schemas/userSchema";

/**
 * The server
 *
 * @class Sever
 */
export class Server {
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  public app: express.Application;
  private model: IModel;

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.model = Object();

    // create ExpressJS application
    this.app = express();

    // configure application
    this.config();

    // add routes
    this.routes();

    // add API
    this.api();
  }

  // TODO: create public api
  public api() {
    // empty
  }

  /**
   * Configure application.
   *
   * @class Server
   * @method config
   */
  public config(): void {
    const MONGODB_CONNECTION: string = "mongodb://localhost:27017/heros";

    // add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    // configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    // use logger middleware
    this.app.use(logger("dev"));

    // use json form parser middleware
    this.app.use(bodyParser.json());

    // use query string parser middleware
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // user cookie parser middleware
    this.app.use(cookieParser("SECRETS_GO_HERE"));

    // use override middleware
    this.app.use(methodOverride());

    // connect to mongoose
    const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    // create models
    this.model.user = connection.model<IUserModel>("User", userSchema);

    // catch 404 and forwared to error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      err.status = 404;
      next(err);
    });

    this.app.use(errorHandler());
  }

  /**
   * Create router.
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes(): void {
    const router: express.Router = express.Router();

    // IndexRoute
    IndexRoute.create(router);

    // use router middleware
    this.app.use(router);
  }
}
