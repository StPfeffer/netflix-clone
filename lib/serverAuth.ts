import { NextApiRequest } from "next";

import prisma from "./prismadb";
import { getToken } from "next-auth/jwt";

const serverAuth = async (req: NextApiRequest) => {
  // This uses the JWT token to get the logged user
  const user = await getToken({
    req,
    secret: process.env.NEXTAUTH_JWT_SECRET,
    cookieName: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token"
  });

  if (!user?.email) {
    throw new Error("Not signed in");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  });

  // Maybe the user was delete?
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
