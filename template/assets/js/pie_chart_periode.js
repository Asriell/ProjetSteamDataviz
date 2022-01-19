function display_graph4(svg_already_exists) {

    if(svg_already_exists) {
        svg4.selectAll('*').remove();
    }
    let width = 700;
    let height = 550;
    let margin = 40;
    let total_height = height * 1.1;
    let total_width = width * 1.1;

    let radius = Math.min(width, height) / 2 - margin

    var arcGenerator = d3.arc()
        .innerRadius(100)
        .outerRadius(radius)

    // append the svg object to the div called 'my_dataviz'
    if(!svg_already_exists) {
        svg4 = d3.select("svg4")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    }

    d3.json(urlplayersjson).then((json) => {
        transform_data_for_bar(json);
        data = DataCleaning(
            json,
            document.getElementById("user-select").value
        );

        inf = "1970-01-01";
        nbJours = get_nb_days_to_display();
        todate = new Date(TODAY);
        inf = formatDate(
            new Date(todate.setDate(todate.getDate() - nbJours))
        );
        inf2 = formatDate(
            new Date(new Date(inf).setDate(new Date(inf).getDate() + 1))
        );

        gameTimePerPeriod = {
            "matin": "0:0:0",
            "apres-midi": "0:0:0",
            "soir": "0:0:0",
            "nuit": "0:0:0"
        }
        /*
        gameTimePerDay = {};
        while (inf != TODAY) {
            games = [];
            for (entry of Object.values(data)) {
                if ((!games.includes(entry.game_name)) && entry.game_end.includes(inf)) {
                    games.push(entry.game_name)
                }
                gameTimePerDay[inf] = {}
                gameTimePerDay[inf]["total"] = "0:0:0";
                if (games.length != 0) {
                    for (game of games) {
                        gameTimePerDay[inf][game] = {}
                        gameTimePerDay[inf][game]["time"] = "0:0:0";
                        for (entry of Object.keys(data)) {
                            if (data[entry].game_end.includes(inf) && game == data[entry].game_name) {
                                gameTimePerDay[inf][game]["time"] = SumDurations(
                                    gameTimePerDay[inf][game]["time"],
                                    data[entry].game_duration
                                );

                                gameTimePerDay[inf]["total"] = SumDurations(
                                    gameTimePerDay[inf]["total"],
                                    data[entry].game_duration
                                );
                                gameTimePerDay[inf][game]["id"] = data[entry].game_id;
                            }
                        }
                    }
                }
            }
            inf = formatDate(
                new Date(new Date(inf).setDate(new Date(inf).getDate() + 1))
            );
        }

        var gamesIds = {}
        for(date of Object.values(gameTimePerDay)) {
            for (game of Object.keys(date)) {
                if(!Object.keys(gamesIds).includes(game)) {
                    gamesIds[game] = date[game]["id"];
                }
            }
        }

        gameDescriptions = json.games;
        gameInfos = {}
        for(id of Object.keys(gamesIds)) {
            if (id != "total") {
                gameInfos[id] = {}
                gameInfos[id]["genres"] = gameDescriptions[gamesIds[id]].genres;
                gameInfos[id]["is_free"] = gameDescriptions[gamesIds[id]].is_free;
                gameInfos[id]["controller_support"] = gameDescriptions[gamesIds[id]].controller_support;
                gameInfos[id]["header_image"] = gameDescriptions[gamesIds[id]].header_image;
                gameInfos[id]["developers"] = gameDescriptions[gamesIds[id]].developers;
                gameInfos[id]["price_overview"] = gameDescriptions[gamesIds[id]].price_overview;
                gameInfos[id]["platforms"] = gameDescriptions[gamesIds[id]].platforms;
                gameInfos[id]["metacritic"] = gameDescriptions[gamesIds[id]].metacritic;
                gameInfos[id]["movies"] = gameDescriptions[gamesIds[id]].movies;
                gameInfos[id]["mp4"] = gameDescriptions[gamesIds[id]].mp4;
            }
        }
        genreTimePerPeriod = {};
        for(day of Object.keys(gameTimePerDay)) {
            if(gameTimePerDay[day].total == "0:0:0") {
                continue;
            } else {
                for(game of Object.keys(gameTimePerDay[day])) {
                    if(game == "total") {
                        continue;
                    } else {
                        tags = gameInfos[game]["genres"];
                        for (tag of tags) {
                            if (!Object.keys(genreTimePerPeriod).includes(tag.description)) {
                                genreTimePerPeriod[tag.description] = gameTimePerDay[day][game]["time"];
                            } else {
                                genreTimePerPeriod[tag.description] = SumDurations(genreTimePerPeriod[tag.description], gameTimePerDay[day][game]["time"]);
                            }
                        }
                    }
                }
            }
        }
        delete genreTimePerPeriod["Early Access"];
        delete genreTimePerPeriod["Free to Play"];
        id = 0;
        for(genre of Object.keys(genreTimePerPeriod)) {
            timeArray = genreTimePerPeriod[genre].split(":");
            genreTimePerPeriod[genre] = timeArray[0]*3600 + timeArray[1] * 60 + parseInt(timeArray[2]);
        }
*/
        indexData = 0;
        KeysData = Object.keys(data);
        filteredData = {}
        while (inf != TODAY) {
            filteredData[KeysData[indexData]] = data[KeysData[indexData]];
            indexData++;
            inf = formatDate(
                new Date(new Date(inf).setDate(new Date(inf).getDate() + 1))
            );
        }
        data = filteredData;
        for (entry of Object.values(data)) {
            day_period = check_day_period(entry.game_end)
            if (day_period == 0) {
                gameTimePerPeriod["matin"] = SumDurations(gameTimePerPeriod["matin"], entry.game_duration)
            } else if (day_period == 1) {
                gameTimePerPeriod["apres-midi"] = SumDurations(gameTimePerPeriod["apres-midi"], entry.game_duration)
            } else if (day_period == 2) {
                gameTimePerPeriod["soir"] = SumDurations(gameTimePerPeriod["soir"], entry.game_duration)
            } else {
                gameTimePerPeriod["nuit"] = SumDurations(gameTimePerPeriod["nuit"], entry.game_duration)
            }
        }
        datas = [];
        id = 0;
        for (period of Object.keys(gameTimePerPeriod)) {
            obj = {}
            obj["id"] = id;
            obj["period"] = period;
            obj["time"] = parseInt(gameTimePerPeriod[period].split(":")[0])*3600 + parseInt(gameTimePerPeriod[period].split(":")[1])*60 + parseInt(gameTimePerPeriod[period].split(":")[2]);
            datas.push(obj);
            id ++;
        }
        var color = d3.scaleOrdinal()
            .domain([0, d3.max(datas, function (d) { return d.id; })])
            .range(['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'])
        var pie = d3.pie()
            .value(function (d) {
                return d.time;
            })
        var data_ready = pie(datas);
        svg4
            .selectAll('arcs')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data.id)) })
            .attr("class","pie")
            .on("mousemove", function (e, d) {
                // on recupere la position de la souris,
                // e est l'object event d
                theData = d.data;
                var mousePosition = [e.x, e.y];
                // on affiche le toolip
                d3.select('#date-jeu').text("--");
                d3.select('#duree2-jeu').text(
                    parseInt(theData.time / 3600) +
                    " h " +
                    parseInt(
                        (theData.time - parseInt(theData.time / 3600) * 3600) / 60
                    ) +
                    " m " +
                    (theData.time -
                        (parseInt(theData.time / 3600) * 3600 +
                            parseInt(
                                (theData.time - parseInt(theData.time / 3600) * 3600) / 60
                            ) *
                            60)) +
                    " s."
                );
                d3.select("#nom-jeu").text(theData.period);
            })

        addLegend_donut2(color,datas,total_width,0,0);

        d3.select("#user-select").on("change", (event) => {
            //svg2.selectAll('*').remove();
            display_graph2(true);
            display_graph1(true, svg1);
            display_graph3(true);
            display_graph4(true);
        });

        d3.select("#period-select").on("change", (event) => {
            //svg2.selectAll('*').remove();
            display_graph1(true, svg1);
            display_graph2(true);
            display_graph3(true);
            display_graph4(true);
        });

    });

}

var addLegend_donut2 = function (colors,keys,total_width,start_margin,margin) {
    d3.select("svg4").selectAll(".legendDetails").remove();
    let legendCellSize = 20;
    let maxCarac = d3.max(keys,(d)=> d.period.length);
    var spacingBetweenCells = legendCellSize + maxCarac * 7 + 5;
    colorsKeys = [];
    for (let i=0;i<keys.length;++i) {
        colorsKeys.push(colors(keys[i].id));
    }

    let legend = d3
        .select("svg4")
        .append("svg")
        .attr("width", total_width)
        .attr("height", 400)
        .attr(
            "transform",
            "translate(" + start_margin + "," + margin + ")"
        )
        .attr("class","legendDetails");

    legend.selectAll()
        .data(colorsKeys)
        .enter().append('rect')
        .attr('height', legendCellSize + 'px')
        .attr('width', legendCellSize + 'px')
        .attr('x', function (d,i) {
            return i%1 * spacingBetweenCells;
        })
        .attr('y', function (d,i) {
            return Math.floor(i/1)*legendCellSize+Math.floor(i/1)*10;
        })
        .style("fill", d => d);
    legend.selectAll()
        .data(keys)
        .enter().append('text')
        .attr("transform", (d,i) => "translate(" + (i%1 * spacingBetweenCells + legendCellSize + 5) + ", " + 0 + ")")
        .attr("dy", function (d, i) {
            return Math.floor(i/1)*legendCellSize+Math.floor(i/1)*10 + legendCellSize / 1.6;
        }) // Pour centrer le texte par rapport aux carrés
        .style("font-size", "13px")
        .style("fill", axisColor)
        .text(d => d.period);

}