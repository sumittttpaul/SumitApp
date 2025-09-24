import express from "express";
import handler from "./api/index";

const app = express();
const port = 5000;

app.use(async (req, res) => {
  await handler(req as any, res as any);
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
