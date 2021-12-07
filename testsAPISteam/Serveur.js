var express = require("express");
var app = express();
var request = require("request");
app.set("port", 3000);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/getnews", function (req, res) {
  var qParams = [];
  for (var p in req.query) {
    qParams.push({ name: p, value: req.query[p] });
  }
  var url =
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=B2CC00FC1583FF260283481A727719E0&steamids=76561198119517741";
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    }
  });
});


app.get("/getgames", function (req, res) {
	console.log("reçu")
  var url =
    "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=B2CC00FC1583FF260283481A727719E0&steamids=76561198119517741&format=json";
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    } else {
		console.log(response.statusCode)
	}
  });
});


app.get("/getrecentlyplayed", function (req, res) {
  var qParams = [];
  for (var p in req.query) {
    qParams.push({ name: p, value: req.query[p] });
  }
  var url =
    "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=B2CC00FC1583FF260283481A727719E0&steamids=76561198119517741&format=json";
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    }
  });
});

app.use(function (req, res) {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type("plain/text");
  res.status(500);
  res.send("500 - Server Error");
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
