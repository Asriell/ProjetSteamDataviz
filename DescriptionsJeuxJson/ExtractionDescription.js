const SteamAPI = require('steamapi');
const fs = require('fs');
const steam = new SteamAPI('F6F2A22B759FEE0F79940A8783603562');
json = {
  "Crab Game": "1782210",
  "Terraria": "105600",
  "Danganronpa V3: Killing Harmony": "567640",
  "Age of Empires IV": "1466860",
  "Hades": "1145360", 
  "Among Us": "945360", 
  "ARK: Survival Evolved": "346110",
  "Worms W.M.D": "327030",
  "Left 4 Dead 2": "550",
  "The Elder Scrolls III: Morrowind": "22320",
  "The Stanley Parable": "221910", 
  "Back 4 Blood": "924970",
  "Project Zomboid": "108600",
  "Don't Starve Together": "322330", 
  "Monster Hunter: World": "582010", 
  "Dota 2": "570",
  "Apex Legends": "1172470",
  "Total War: NAPOLEON - Definitive Edition": "34030",
  "PUBG: BATTLEGROUND" : "578080"
}


steam.getGameDetails("578080").then((data) => fs.writeFileSync('578080.json', JSON.stringify(data)));