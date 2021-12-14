# Extraction de donnees

import steam
from steam.webapi import WebAPI
from steam.webapi import webapi_request
import pandas as pd


url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
url2 = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/"
url3 = "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/"
key = "F6F2A22B759FEE0F79940A8783603562"
dictionary = {"key" : "F6F2A22B759FEE0F79940A8783603562", "steamId":"76561198119517741", "appId" : "567640"}
req = webapi_request(url3,params=dictionary)
print(req)
df = pd.DataFrame(req["playerstats"])
df.to_csv("~/danganronpa.csv")

