// Receive injuri.ng webhooks and check they're genuine.
// Dashboard > Developer > Webhooks: add your URL, pick events, copy the signing secret.
// npm install express && WEBHOOK_SECRET=... node server.mjs
import crypto from "node:crypto";
import express from "express";

const app = express();

app.post("/injuring", express.raw({ type: "application/json" }), (req, res) => {
  // X-Injuring-Signature is "sha256=" + HMAC-SHA256 of the raw body with your secret.
  const expected = "sha256=" + crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(req.body).digest("hex");
  const got = req.get("X-Injuring-Signature") ?? "";
  if (got.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected))) return res.sendStatus(401);

  const event = req.get("X-Injuring-Event"); // e.g. follow.created, comment.created, profile.liked
  const payload = JSON.parse(req.body);
  console.log(event, payload);
  res.sendStatus(200); // answer quickly; do slow work afterwards
});

app.listen(3001, () => console.log("Listening on http://localhost:3001/injuring"));
