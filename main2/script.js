function display() {
  alert("Hammer time");
}

const urlRaw =
  "https://raw.githubusercontent.com/Asriell/ProjetSteamDataviz/main/main/games.csv";
function display_graph1() {
  var distance_between_bars = 10;
  var start_margin = 50;
  var margin = 20;
  var width = 800;
  var height = 650;
  var total_height = height * 1.1;
  var total_width = width * 1.1;
  d3.csv(urlRaw).then(function (data) {
    data.sort((a, b) => {
      return b.playtime_forever - a.playtime_forever;
    });
    let newId = 0;
    data.forEach((element) => {
      element.id = newId;
      newId++;
    });
    console.log(data);

    var nbApps = d3.range(data.length);

    var svg1 = d3
      .select("svg1")
      .append("svg")
      .attr("width", total_width)
      .attr("height", total_height)
      .attr("transform", "translate(" + start_margin + "," + margin + ")");

    var xScale = d3
      .scaleLinear()
      .domain(nbApps)
      .range([0, distance_between_bars]);

    var x_axis = d3.axisBottom().scale(xScale);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return Math.log(d.playtime_forever);
        })
      ])
      .range([height, margin]);

    var y_axis = d3.axisLeft().scale(yScale);

    svg1
      .append("g")
      .attr("transform", "translate(" + start_margin + "," + height + ")")
      .call(x_axis);

    svg1
      .append("g")
      .call(y_axis)
      .attr("transform", "translate(" + margin + ",0)");

    svg1
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        //console.log(xScale(d.id));
        return xScale(d.id) + start_margin;
      })
      .attr("y", function (d) {
        //console.log(d.playtime_forever);
        return yScale(Math.log(d.playtime_forever));
      })
      .attr("width", 5)
      .attr("height", function (d) {
        return height - yScale(Math.log(d.playtime_forever));
      });
  });

  USER = "Asriel";
  PERIOD = "2 Weeks";
  TODAY = new Date();
  dd = String(TODAY.getDate()).padStart(2, "0");
  mm = String(TODAY.getMonth() + 1).padStart(2, "0"); //January is 0!
  yyyy = TODAY.getFullYear();
  TODAY = yyyy + "-" + mm + "-" + dd;
  d3.json("steam-players-data.json").then((json) => {
    //console.log(json);
    var data = Object.values(json.players).filter(
      (player) => player.persona_name == USER
    );
    //console.log(data);
    tmpData = {};
    for (var entry of data) {
      if (!entry.game_duration.includes("day")) {
        tmpData[entry.game_end] = entry;
      }
    }
    data = tmpData;
    console.log(data);
    //console.log(TODAY);
    inf = "1970-01-01";
    if (PERIOD == "2 Weeks") {
      /*[inf, yyyyInf, mmInf, ddInf] = DifferenceDate(
      30,
      parseInt(dd),
      parseInt(mm),
      parseInt(yyyy)
      );*/
      inf = new Date(TODAY);
      console.log(inf);
      //console.log(inf, +"   " + yyyyInf + "    " + mmInf + "    " + ddInf);
      /*
      gameTimePerDay = {};
      while (inf != TODAY) {
      console.log(inf);
      gameTimePerDay[inf] = "0:0:0";
      for (entry of Object.keys(data)) {
          if (data[entry].game_end.includes(inf)) {
          gameTimePerDay[inf] = SumDurations(
              gameTimePerDay[inf],
              data[entry].game_duration
          );
          console.log("inf : " + inf + "   " + data[entry].game_duration);
          }
      }
      [inf, yyyyInf, mmInf, ddInf] = SumDate(1, ddInf, mmInf, yyyyInf);
      }
      console.log(gameTimePerDay);*/
    }
  });
}

//
