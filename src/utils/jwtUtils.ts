import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param payload - The data to include in the token (e.g., user ID, roles)
 * @returns A signed JWT token
 */

const SECRET_KEY = process.env.JWT_SECRET;
if(!SECRET_KEY) {
  throw new Error("JWT_SECRET must be defined");
}

export const generateToken = (payload: object, expiresIn = "1h"): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};
