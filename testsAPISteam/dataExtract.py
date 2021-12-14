# Extraction de donnees

import steam
from steam.webapi import WebAPI
from steam.webapi import webapi_request
import pandas as pd


url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
key = "F6F2A22B759FEE0F79940A8783603562"
dictionary = {"key" : "F6F2A22B759FEE0F79940A8783603562", "steamId":"76561198119517741"}
req = webapi_request(url,params=dictionary)
df = pd.DataFrame(req["response"]["games"])
df.to_csv("~/games.csv")

