import { authorize } from "@liveblocks/node";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors'

function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  })
)

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res)
  if (!API_KEY) {
    return res.status(403).end();
  }

  const room = req.body.room;

  // For the avatar example, we're generating random users
  // and set their info from the authentication endpoint
  // See https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
  if (room === "example-live-avatars") {
    const response = await authorize({
      room,
      secret: API_KEY,
      userInfo: {
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        picture: `/assets/avatars/${Math.floor(Math.random() * 10)}.png`,
      },
    });
    return res.status(response.status).end(response.body);
  }

  const response = await authorize({
    room,
    secret: API_KEY,
  });
  return res.status(response.status).end(response.body);
}

const NAMES = [
  "Charlie Layne",
  "Mislav Abha",
  "Tatum Paolo",
  "Anjali Wanda",
  "Jody Hekla",
  "Emil Joyce",
  "Jory Quispe",
  "Quinn Elton",
];
