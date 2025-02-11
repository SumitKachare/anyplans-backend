import { NextFunction, Request, Response } from "express-serve-static-core";
import { loginService, registerService } from "./auth.service";
import { asyncHandler } from "../../utils/error";
import { createUserValidation, loginUserValidation } from "./auth.validation";
import { successResponse } from "../../utils/utils";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRegisterPayload = createUserValidation.parse(req.body);

    const { name, email, password, bio } = userRegisterPayload;

    const data = await registerService(name, email, password, bio);
    req.session.user = { id: data.id, email: data.email };

    // to avoid session fixation attack
    req.session.regenerate(function (err) {
      if (err) next(err);

      // add session data
      req.session.user = { id: data.id, email: data.email };

      req.session.save(function (err) {
        if (err) return next(err);

        const response = successResponse(data, "Registration Successfull");

        res.status(201).json(response);
      });
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userLoginPayload = loginUserValidation.parse(req.body);

    const { email, password } = userLoginPayload;

    const data = await loginService(email, password);

    req.session.user = { id: data.id, email: data.email };

    // to avoid session fixation attack
    req.session.regenerate(function (err) {
      if (err) next(err);

      // add session data
      req.session.user = { id: data.id, email: data.email };

      req.session.save(function (err) {
        if (err) return next(err);

        const response = successResponse(data, "Login Successfull");

        res.status(200).json(response);
      });
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.save(function (err) {
      if (err) next(err);

      // req.session.user = null;
      // delete session
      req.session.destroy(function (err) {
        if (err) next(err);
        const response = successResponse(null, "Logout Successful");

        res.status(200).json(response);
      });
    });
  }
);
