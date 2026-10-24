// Fetch a profile, look up several at once, and add a link to your own page.
// Run: INJURING_KEY=inj_... node profile.mjs sextinq
const KEY = process.env.INJURING_KEY;
const API = "https://injuri.ng/api/v1";

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...options.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.error.code}: ${body.error.message}`);
  return body;
}

const name = process.argv[2] ?? "sextinq";

const { data: user } = await api(`/users/${name}`);
console.log(`${user.display_name} (${user.url})`);
console.log(user.bio || "(no bio)");
for (const link of user.links ?? []) console.log(`- ${link.platform}: ${link.url}`);

// Up to 50 profiles in one request. Missing or private ones are null.
const { data: many, meta } = await api("/users/batch", { method: "POST", body: JSON.stringify({ handles: [name, "september"] }) });
console.log(`batch: found ${meta.found} of ${meta.requested}`, Object.keys(many));

// Needs a key with the links:write scope.
if (process.env.ADD_LINK) {
  const { data: link } = await api("/me/links", { method: "POST", body: JSON.stringify({ url: process.env.ADD_LINK, title: "Added from the API" }) });
  console.log("added link", link);
}
