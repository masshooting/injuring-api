// Live events for your own account: views, followers, comments and notifications as they happen.
// Good for stream overlays and Discord bots. Run: INJURING_KEY=inj_... node events.mjs
// The server closes each connection after 10 minutes; this loop reconnects and resumes from the last event.
const KEY = process.env.INJURING_KEY;
let lastId = "";

async function listen() {
  const res = await fetch("https://injuri.ng/api/v1/me/events", {
    headers: { Authorization: `Bearer ${KEY}`, ...(lastId && { "Last-Event-ID": lastId }) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value;
    let end;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const event = /^event: (.+)$/m.exec(chunk)?.[1];
      const data = /^data: (.+)$/m.exec(chunk)?.[1];
      lastId = /^id: (.+)$/m.exec(chunk)?.[1] ?? lastId;
      if (!event || !data) continue;
      const e = JSON.parse(data);
      if (event === "view") console.log(`new view from ${e.country ?? "somewhere"} (${e.device ?? "unknown device"})`);
      if (event === "follow") console.log(`@${e.username} followed you`);
      if (event === "comment") console.log(`${e.name} signed your guestbook: ${e.body}`);
      if (event === "notification") console.log(`notification: ${e.title}`);
    }
  }
}

for (;;) {
  try { await listen(); } catch (e) { console.error(e.message); }
  await new Promise((r) => setTimeout(r, 5000));
}
