import { and, eq, getTableColumns } from "drizzle-orm";
import db from "../config/db.config";
import { categoriesTable, usersTable } from "../db/schema";
import { compare, hash } from "bcrypt";
import { CustomError } from "../utils/error";

// register
export const registerService = async (
  name: string,
  email: string,
  password: string,
  bio: string
) => {
  // check if user with the mail exists
  const isUserExist = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (isUserExist.length > 0) {
    throw new CustomError("Email already in use.", 409);
  }

  // hash the password using bcrypt
  const hashedPass = await hash(password, 10);

  // save the user in db
  const user = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPass,
      bio,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      bio: usersTable.bio,
    });

  return user[0];
};

// login
export const loginService = async (emailId: string, password: string) => {
  // get the user by email
  const isUserExist = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, emailId));

  if (isUserExist.length !== 1) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const user = isUserExist[0];

  // compare the password using bcrypt
  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("Invalid Credentials", 401);
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
