# ProjetSteamDataviz
Lien Github pages : https://asriell.github.io/ProjetSteamDataviz/main/index.html

### Tests de l'API Steam
##### Doc Steam API
La Doc sur l'API Steam : https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29
Autre Doc de l'API Steam : https://steamcommunity.com/dev?l=french
##### Clé Steam
Pour les différentes requêtes, il faut ajouter une clé Steam que l'on réclame ici : https://steamcommunity.com/dev/apikey

#### Piste lecture des données : 
```python
(pip install steam)
>>> import steam
>>> api = WebAPI(key)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'WebAPI' is not defined
>>> from steam import WebAPI
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: cannot import name 'WebAPI'
>>> from steam.webapi import WebAPI
>>> key = "F6F2A22B759FEE0F79940A8783603562"
>>> api = WebAPI(key)
>>> api.call('ISteamUser.ResolveVanityURL', vanityurl="valve", url_type=2)
{'response': {'steamid': '103582791429521412', 'success': 1}}
>>> api.ISteamUser.ResolveVanityURL(vanityurl="valve", url_type=2)
{'response': {'steamid': '103582791429521412', 'success': 1}}
>>>  api.ISteamUser.ResolveVanityURL_v1(vanityurl="valve", url_type=2)
  File "<stdin>", line 1
    api.ISteamUser.ResolveVanityURL_v1(vanityurl="valve", url_type=2)
    ^
IndentationError: unexpected indent
>>> api.ISteamUser.ResolveVanityURL_v1(vanityurl="valve", url_type=2)
{'response': {'steamid': '103582791429521412', 'success': 1}}

>>> from steam.webapi import webapi_request
>>> url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
>>> dictionary = {"key" : "F6F2A22B759FEE0F79940A8783603562", "steamId":"76561198119517741"}
>>> req = webapi_request(url,params=dictionary)
>>> print(req)

  >>> import pandas as pd
>>> df = pd.DataFrame(req["response"]["games"])
>>> df.head()
   appid  playtime_forever  playtime_windows_forever  playtime_mac_forever  playtime_linux_forever  playtime_2weeks
0     70                 0                         0                     0                       0              NaN
1   4000              1500                       475                     0                       0              NaN
2   2700                14                        12                     0                       0              NaN
3  10090              5280                       248                     0                       0              NaN
4  17390               274                        82                     0                       0              NaN
>>> df.to_csv("~/games.csv")
```
#### La VM : 
ubuntu@192.168.166.214
passwd : steam

Lecture de JSON ne marche pas en local (erreur de CORS). Le codesandbox : https://codesandbox.io/s/optimistic-fire-wcrvl?file=/index.html

