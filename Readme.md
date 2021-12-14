# ProjetSteamDataviz
### Tests de l'API Steam
##### Doc Steam API
La Doc sur l'API Steam : https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29
##### Clé Steam
Pour les différentes requêtes, il faut ajouter une clé Steam que l'on réclame ici : https://steamcommunity.com/dev/apikey
##### Notes
J'ai lancé un serveur Node.js avec le script Serveur.js, pour pouvoir requêter dessus. Si on requête steam directement, ça fait une erreur de CORS.
Pour le client, j'ai été capable de récupérer les infos de mon compte. Par contre, j'ai une erreur 500 lorsque je veux récupérer les jeux. (Je pense que c est une protection de mon compte qu'il faut désactiver)


#### Piste lecture des données : 
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
