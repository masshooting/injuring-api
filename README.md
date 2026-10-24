# injuri.ng API

**injuri.ng: free link-in-bio pages with live widgets, badges and music.**

This repo has examples for the [injuri.ng](https://injuri.ng) public API: read profiles, manage your own page, stream live events, receive webhooks, embed profile cards and add "Log in with injuri.ng" to your app.

Full reference: **[injuri.ng/docs/api](https://injuri.ng/docs/api)**

## What is injuri.ng?

[injuri.ng](https://injuri.ng) is a free link-in-bio and profile page site, an alternative to Linktree, guns.lol and Carrd. Members get a page at `injuri.ng/name` with links, music, 30+ live widgets (Discord, Spotify, Roblox, GitHub, Steam and more), badges, sections, a guestbook and 25 layouts.

## Quick start

1. Make a free account at [injuri.ng/register](https://injuri.ng/register).
2. Open **Dashboard > Developer** and press **Create key**.
3. Call the API:

```bash
curl https://injuri.ng/api/v1/users/sextinq \
  -H "Authorization: Bearer $INJURING_KEY"
```

```json
{ "data": { "uid": 1, "username": "sextinq", "display_name": "lou", "url": "https://injuri.ng/sextinq" } }
```

Every response is `{ "data": ..., "meta"?: ... }` or `{ "error": { "code": "...", "message": "..." } }`.

## Endpoints

Base URL: `https://injuri.ng/api/v1`

| Method | Path | What it does | Scope |
|---|---|---|---|
| GET | `/users/{name}` | Profile, links, badges, stats | read |
| GET | `/users/{name}/links` | Their links | read |
| GET | `/users/{name}/badges` | Their badges | read |
| GET | `/users/{name}/widgets` | Their widgets | read |
| GET | `/users/{name}/stats` | Daily views | read |
| GET | `/users/{name}/posts` | Social posts | read |
| GET | `/users/{name}/followers` | Followers (and `/following`) | read |
| POST | `/users/batch` | Up to 50 profiles in one call | read |
| GET | `/uid/{uid}` | Look up by UID | read |
| GET | `/search?q=` | Find people | read |
| GET | `/check/{name}` | Is a username free? | read |
| GET | `/leaderboard` | Most viewed pages | read |
| GET | `/badges` | Every badge on the site | read |
| GET | `/stats` | Site-wide numbers | read |
| GET | `/me` | Your account | read |
| GET | `/me/analytics` | Your views, devices, countries | analytics:read |
| GET | `/me/notifications` | Your notifications | read |
| GET | `/me/events` | Live views, follows, comments (server-sent events) | read |
| POST | `/me/links` | Add a link | links:write |
| PATCH | `/me/links/{id}` | Edit a link | links:write |
| DELETE | `/me/links/{id}` | Remove a link | links:write |
| PATCH | `/me/profile` | Edit display name, bio, colours | profile:write |
| POST | `/me/posts` | Post to Social | social:write |

`{name}` can be a username, an alias, or `#123` for a UID.

## Limits

- 60 requests a minute (120 with injuring+). Check `X-RateLimit-Remaining` and `X-RateLimit-Reset`.
- Keys go in the `Authorization` header only. Never put them in URLs.
- People can hide parts of their profile from the API. Hidden data comes back as `null`.

## Examples

| Folder | What's in it |
|---|---|
| [`examples/javascript`](examples/javascript) | Fetch a profile, batch lookups, add a link, live events (Node 18+) |
| [`examples/python`](examples/python) | The same in Python |
| [`examples/discord-bot`](examples/discord-bot) | A `/page` command that shows someone's injuri.ng page |
| [`examples/oauth-express`](examples/oauth-express) | "Log in with injuri.ng" with Express and PKCE |
| [`examples/webhooks`](examples/webhooks) | Receive and verify webhooks |
| [`examples/embed`](examples/embed) | Show a live profile card on any website |

## Embed a profile card

No key needed:

```html
<script src="https://injuri.ng/embed.js" data-user="sextinq" async></script>
```

Add `data-theme="light"` for the light card.

## Log in with injuri.ng

Create an app in **Dashboard > Developer > Log in with injuri.ng**, then:

1. Send people to `https://injuri.ng/oauth/authorize?client_id=...&redirect_uri=...&scope=identify&state=...`
2. Swap the `code` at `POST https://injuri.ng/api/oauth2/token`
3. Read the member at `GET https://injuri.ng/api/oauth2/userinfo`

Scopes: `identify`, `email`, `links`. PKCE (`S256`) is supported. See [`examples/oauth-express`](examples/oauth-express).

## Links

- Website: [injuri.ng](https://injuri.ng)
- API docs: [injuri.ng/docs/api](https://injuri.ng/docs/api)
- Help center: [injuri.ng/docs](https://injuri.ng/docs)
- Compare: [injuri.ng/compare](https://injuri.ng/compare)

## License

MIT. Use these examples however you like.
