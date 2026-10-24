"""Fetch a profile, look up several at once, and check a username.

pip install -r requirements.txt
INJURING_KEY=inj_... python profile.py sextinq
"""
import os
import sys

import requests

API = "https://injuri.ng/api/v1"
session = requests.Session()
session.headers["Authorization"] = f"Bearer {os.environ['INJURING_KEY']}"


def api(method: str, path: str, **kwargs) -> dict:
    r = session.request(method, f"{API}{path}", **kwargs)
    body = r.json()
    if not r.ok:
        raise RuntimeError(f"{body['error']['code']}: {body['error']['message']}")
    return body


name = sys.argv[1] if len(sys.argv) > 1 else "sextinq"
user = api("GET", f"/users/{name}")["data"]
print(f"{user['display_name']} ({user['url']})")
print(user["bio"] or "(no bio)")
for link in user["links"] or []:
    print(f"- {link['platform']}: {link['url']}")

batch = api("POST", "/users/batch", json={"handles": [name, "september"]})
print(f"batch: found {batch['meta']['found']} of {batch['meta']['requested']}")

print(api("GET", "/check/coolname")["data"])
