import type { VercelRequest, VercelResponse } from "@vercel/node";
import { applyCors, checkMethod } from "../utils/middleware";
import withMiddleware from "../hooks/with-middleware";

const html = `
      <div class="container">
        <p class="heading">projects/backend</p>
        <style>
          .container {
            height: 80vh;
            width: 95vw;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 5rem
          }
          .heading {
            font-size: 3rem;
          }
        </style>
      </div>
    `;

async function handler(req: VercelRequest, res: VercelResponse) {
  return res.setHeader("Content-Type", "text/html").status(200).send(html);
}

export default withMiddleware(handler, [applyCors, checkMethod("GET")]);
