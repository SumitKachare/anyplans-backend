import { compare, hash } from "bcrypt";
import { CustomError } from "../utils/error";
import { query } from "../config/db.config";

// register
export const registerService = async (
  name: string,
  email: string,
  password: string,
  bio: string
) => {
  // check if user with the mail exists
  const isUserExist = await query(
    `
    SELECT * from users 
    WHERE email = $1
    `,
    [email]
  );

  if (isUserExist && isUserExist?.rows?.length > 0) {
    throw new CustomError("Email already in use.", 409);
  }

  // hash the password using bcrypt
  const hashedPass = await hash(password, 10);

  // save the user in db
  const user = await query(
    `
    INSERT INTO users (name , email , password , bio)
    VALUES ($1 , $2 , $3 , $4)
    returning id, name , email , bio
    `,
    [name, email, hashedPass, bio]
  );

  return user && user?.rows[0];
};

// login
export const loginService = async (emailId: string, password: string) => {
  // get the user by email

  const isUserExist = await query(
    `
      SELECT * from users 
      WHERE email = $1
      `,
    [emailId]
  );

  if (!isUserExist || isUserExist?.rows?.length === 0) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const user = isUserExist.rows[0];

  // compare the password using bcrypt
  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
