"""A Discord bot with a /page command that shows someone's injuri.ng page.

pip install -r requirements.txt
DISCORD_TOKEN=... INJURING_KEY=inj_... python bot.py
"""
import os

import aiohttp
import discord
from discord import app_commands

API = "https://injuri.ng/api/v1"
client = discord.Client(intents=discord.Intents.default())
tree = app_commands.CommandTree(client)


@tree.command(description="Show someone's injuri.ng page")
@app_commands.describe(username="Their injuri.ng username")
async def page(interaction: discord.Interaction, username: str):
    async with aiohttp.ClientSession(headers={"Authorization": f"Bearer {os.environ['INJURING_KEY']}"}) as s:
        async with s.get(f"{API}/users/{username}") as r:
            body = await r.json()
            ok = r.status == 200
    if not ok:
        await interaction.response.send_message(body["error"]["message"], ephemeral=True)
        return
    u = body["data"]
    embed = discord.Embed(title=u["display_name"], url=u["url"], description=u["bio"] or None, colour=int(u["theme"]["accent"][1:], 16))
    if u["avatar_url"]:
        embed.set_thumbnail(url=u["avatar_url"])
    if u["stats"] and u["stats"]["views"] is not None:
        embed.add_field(name="Views", value=f"{u['stats']['views']:,}")
    if u["badges"]:
        embed.add_field(name="Badges", value=", ".join(b["name"] for b in u["badges"][:10]))
    if u["links"]:
        embed.add_field(name="Links", value="\n".join(f"[{l['title'] or l['platform']}]({l['url']})" for l in u["links"][:8]), inline=False)
    await interaction.response.send_message(embed=embed)


@client.event
async def on_ready():
    await tree.sync()
    print(f"Ready as {client.user}")


client.run(os.environ["DISCORD_TOKEN"])
