import { Request, Response, NextFunction } from "express-serve-static-core";
import { NODE_ENV } from "../config/env.config";
import { ZodError } from "zod";
import { CustomError } from "../utils/error";
import { DEVELOPMENT } from "../constants";

interface CustomErrorInterface extends Error {
  status?: number;
  code?: string;
  table?: string;
}

type ZodErrorType = {
  message: string;
};

type ErrorResponseType = {
  errorMessage: string;
  success: boolean;
  stack?: string;
};

// : Record<string, number>

const databaseStatusMap = {
  "23505": 409, // Conflict
  "23502": 400, // Bad Request
  "23503": 403, // Forbidden
};

const databaseErrorMap = {
  users: {
    "23505": "An account with this email already exists.",
    "23502": "A required field is missing. Please fill out all the fields.",
    "23503": "Invalid reference. Please check the associated data.",
  },
  spots: {
    "23505": "A spot with this name or location already exists.",
    "23502": "A required field is missing. Please fill out all the fields.",
    "23503": "Invalid spot or category reference for the spot.",
  },
  categories: {
    "23505": "A category with this name already exists.",
    "23502": "A required field is missing. Please fill out all the fields.",
    "23503": "Invalid user reference for the category.",
  },
  default: {
    "23505": "Duplicate entry. The value already exists.",
    "23502": "Missing required data.",
    "23503": "Invalid reference provided.",
  },
};

// errorHandler.js
const errorHandler = (
  err: CustomErrorInterface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default status code and message to avoid showing internal server errors
  let statusCode = 500;
  let message = "Internal Server Error";

  // Log the error (for debugging purposes)
  // console.error(`[ERROR]: ${err}`);
  console.log("err", err);

  // show custom error messages
  if (err instanceof CustomError) {
    statusCode = err.status;
    message = err.message;
  }

  // Handle database error
  // Here we get code and table properties on postgres errors
  if (err?.code && err instanceof CustomError === false && err?.table) {
    const errCode = err.code as keyof typeof databaseStatusMap;
    const table = err.table as keyof typeof databaseErrorMap;

    let tableErrors = databaseErrorMap[table];

    if (!tableErrors) {
      tableErrors = databaseErrorMap["default"];
    }

    message = tableErrors[errCode];
    statusCode = databaseStatusMap[errCode];
  }

  // handle validation error
  if (err instanceof ZodError) {
    const parsedErrors: ZodErrorType[] = JSON.parse(err.message);

    if (parsedErrors.length > 0 && parsedErrors[0]?.message) {
      message = parsedErrors[0].message;
      statusCode = 400;
    }
  }

  const response: ErrorResponseType = {
    success: false,
    errorMessage: message,
  };

  if (NODE_ENV === DEVELOPMENT) {
    response.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(response);
};

export default errorHandler;
