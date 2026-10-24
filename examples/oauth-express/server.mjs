// "Log in with injuri.ng" in Express, with PKCE.
// 1. Dashboard > Developer > Log in with injuri.ng > New app, redirect URI http://localhost:3000/callback
// 2. npm install express
// 3. CLIENT_ID=... CLIENT_SECRET=... node server.mjs, then open http://localhost:3000
import crypto from "node:crypto";
import express from "express";

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const REDIRECT = "http://localhost:3000/callback";
const pending = new Map(); // state -> code_verifier (use your session store in a real app)
const app = express();

app.get("/", (_req, res) => res.send('<a href="/login">Log in with injuri.ng</a>'));

app.get("/login", (_req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  pending.set(state, verifier);
  const url = new URL("https://injuri.ng/oauth/authorize");
  url.search = new URLSearchParams({ client_id: CLIENT_ID, redirect_uri: REDIRECT, scope: "identify", state, code_challenge: challenge, code_challenge_method: "S256" });
  res.redirect(url.toString());
});

app.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.send(`Cancelled: ${error}`);
  const verifier = pending.get(state);
  pending.delete(state);
  if (!verifier) return res.status(400).send("Unknown state");

  const token = await fetch("https://injuri.ng/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: CLIENT_ID, code_verifier: verifier }),
  }).then((r) => r.json());
  if (!token.access_token) return res.status(400).send(token.error_description);

  const me = await fetch("https://injuri.ng/api/oauth2/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } }).then((r) => r.json());
  res.send(`Hi ${me.display_name}! Your page is <a href="${me.url}">${me.url}</a>.`);
});

app.listen(3000, () => console.log("http://localhost:3000"));
