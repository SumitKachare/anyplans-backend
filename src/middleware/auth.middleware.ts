import { NextFunction, Request, Response } from "express-serve-static-core";
import { CustomError } from "../utils/error";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: number;
      email: string;
    };
  }
}

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user || !req.session.user.id) {
    throw new CustomError("Please Authenticate", 401);
  } else {
    console.log("req.session.user", req.session.user);

    req.user = {
      userId: req.session.user.id,
      email: req.session.user.email,
    };

    next();
  }
};
