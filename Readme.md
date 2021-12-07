# ProjetSteamDataviz
### Tests de l'API Steam
##### Doc Steam API
La Doc sur l'API Steam : https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29
##### Clé Steam
Pour les différentes requêtes, il faut ajouter une clé Steam que l'on réclame ici : https://steamcommunity.com/dev/apikey
##### Notes
J'ai lancé un serveur Node.js avec le script Serveur.js, pour pouvoir requêter dessus. Si on requête steam directement, ça fait une erreur de CORS.
Pour le client, j'ai été capable de récupérer les infos de mon compte. Par contre, j'ai une erreur 500 lorsque je veux récupérer les jeux. (Je pense que c est une protection de mon compte qu'il faut désactiver)

