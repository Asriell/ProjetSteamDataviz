# ProjetSteamDataviz
```
Projet de data visualisation du groupe 6 : Données d'utilisation des jeux vidéos.

Outils utilisés : Javacript (avec bibliothèque D3js), html/css, Python, Shell, Cron, Firebase Realtime Database, Steam API.

```

### Problématiques auquelles Nos visualisations vont apporter des réponses : 
+ A quelle fréquence joue-t-on aux jeux vidéos par unité de temps ?
+ Qui est le joueur qui joue le plus ? (Comparaison du temps de jeu de chaque membre du groupe)
+ Quelles sont les catégories les plus populaires ? Quelles sont les tendances ?


### Nos visualisations 
* Lien Github pages : https://asriell.github.io/ProjetSteamDataviz/template/template/dashboard.html

+ Nos visualisations sont disponibles dans la branche gh-pages, dossier template : 
  - Notre code javascript est disponible dans assets/js
  - Notre code css est disponible dans assets/css/style.css
  - Notre code html est disponible dans template/dashboard.html

### Le Data Scraping 

Nos scripts utilisés pour le scraping de données dans le dossier scrapingScript. Un readme y est associé pour plus de précisions.

#### La VM pour le data scraping
```
address : 192.168.74.201
password : steam
```


### A Propos de l'API Steam 

##### Doc Steam API
La Doc sur l'API Steam : https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29
Autre Doc de l'API Steam : https://steamcommunity.com/dev?l=french
##### Clé Steam
Pour les différentes requêtes, il faut ajouter une clé Steam que l'on réclame ici : https://steamcommunity.com/dev/apikey
