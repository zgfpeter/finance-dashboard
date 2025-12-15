import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index"; // import your Express app
import { createServer } from "http";

// Create an HTTP server from Express app
const server = createServer(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  server.emit("request", req, res);
}
