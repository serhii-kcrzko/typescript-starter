import { NextFunction, Request, Response } from "express";

/**
 * Constructor
 *
 * @class BaseRoute
 */
export class BaseRoute {
  protected title: string;
  private scripts: string[];

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor() {
    this.title = "Tour of Heros";
    this.scripts = [];
  }

  /**
   * Add a JS external file to the request.
   *
   * @class BaseRoute
   * @method addScript
   * @param src {String} The source to the external JS file.
   * @return {BaseRoute} Self for chaining.
   */
  public addScript(src: string): BaseRoute {
    this.scripts.push(src);
    return this;
  }

  public render(req: Request, res: Response, view: string, options?: Object) {
    // add constraints
    res.locals.BASE_URL = "/";

    // add scripts
    res.locals.scripts = this.scripts;

    // add title
    res.locals.title = this.title;

    // render view
    res.render(view, options);
  }
}
