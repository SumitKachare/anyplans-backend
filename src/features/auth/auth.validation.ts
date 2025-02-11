import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

export const createUserValidation = z
  .object({
    name: z
      .string({ message: "Name is required." })
      .trim()
      .min(2, { message: "Name should be 2 characters minimum." })
      .max(20, { message: "Name should not exceed 20 characters." }),
    email: z
      .string({ message: "Email is reuired." })
      .trim()
      .email({ message: "Invalid email address." }),

    password: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password should be of 8 characters minimium." })
      .max(30, { message: "Password should not exceed 30 characters." })
      .regex(passwordRegex, {
        message:
          "Password must include at least one uppercase letter, one number, one special character.",
      }),
    bio: z
      .string({ message: "Bio is required." })
      .trim()
      .min(5, { message: "Bio should be 5 characters minimum." })
      .max(50, { message: "Name should not exceed 50 characters." }),
  })
  .strict();

export const loginUserValidation = z
  .object({
    email: z
      .string({ message: "Email is reuired." })
      .trim()
      .email({ message: "Invalid email address." }),
    password: z.string({ message: "Password is required." }),
  })
  .strict();
