import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prismadb from "./prismadb";

const serverAuth = async (req: NextApiRequest) => {
  // This uses the JWT token to get the logged user
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email
    }
  });

  // Maybe the user was delete?
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
