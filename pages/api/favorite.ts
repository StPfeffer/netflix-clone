import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      const movie = await prisma.movie.findUnique({
        where: {
          id: movieId
        }
      });

      if (!movie) {
        throw new Error("Invalid movie ID");
      }

      const user = await prisma.user.update({
        where: {
          email: currentUser.email || ""
        },
        data: {
          favoriteIds: {
            push: movieId
          }
        }
      });

      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req);

      const { movieId } = req.body;

      const movie = await prisma.movie.findUnique({
        where: {
          id: movieId
        }
      });

      if (!movie) {
        throw new Error("Invalid movie ID");
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      const user = await prisma.user.update({
        where: {
          email: currentUser.email || ""
        },
        data: {
          favoriteIds: updatedFavoriteIds
        }
      });

      return res.status(200).json(user);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(400).end();
  }
}
