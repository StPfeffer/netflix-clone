import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    await serverAuth(req);

    const { movieId } = req.query;

    if (typeof movieId !== "string") {
      throw new Error("Invalid movie ID");
    }

    if (!movieId) {
      throw new Error("Invalid movie ID");
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId
      }
    });

    if (!movie) {
      throw new Error("Invalid movie ID");
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);

    return res.status(400).end();
  }
}
