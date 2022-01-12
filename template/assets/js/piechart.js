function display_graph2(svg_already_exists) {

    if(svg_already_exists) {
        svg2.selectAll('*').remove();
    }
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "hidden tooltip");
    let width = 700;
    let height = 550;
    let margin = 80;
    let total_height = height * 1.1;
    let total_width = width * 1.1;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin

    var arcGenerator = d3.arc()
        .innerRadius(100)
        .outerRadius(radius)

    // append the svg object to the div called 'my_dataviz'
    if(!svg_already_exists) {
        svg2 = d3.select("svg2")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    }

    d3.json(urlplayersjson).then((json) => {
        //console.log(json);
        transform_data_for_bar(json);
        data = DataCleaning(
            json,
            document.getElementById("user-select").value
        );
        //console.log(data);

        inf = "1970-01-01";
        nbJours = get_nb_days_to_display();
        todate = new Date(TODAY);
        inf = formatDate(
            new Date(todate.setDate(todate.getDate() - nbJours))
        );
        inf2 = formatDate(
            new Date(new Date(inf).setDate(new Date(inf).getDate() + 1))
        );
        //console.log(TODAY, " | ", inf, " | ", inf2);
        gameTimePerDay = {};
        while (inf != TODAY) {
            if (document.getElementById("details-checkbox").checked) {
                games = [];
                for (entry of Object.values(data)) {
                    if ((!games.includes(entry.game_name)) && entry.game_end.includes(inf)) {
                        games.push(entry.game_name)
                    }
                    gameTimePerDay[inf] = {}
                    gameTimePerDay[inf]["total"] = "0:0:0";
                    if (games.length != 0) {
                        for (game of games) {
                            gameTimePerDay[inf][game] = "0:0:0";
                            for (entry of Object.keys(data)) {
                                if (data[entry].game_end.includes(inf) && game == data[entry].game_name) {
                                    gameTimePerDay[inf][game] = SumDurations(
                                        gameTimePerDay[inf][game],
                                        data[entry].game_duration
                                    );

                                    gameTimePerDay[inf]["total"] = SumDurations(
                                        gameTimePerDay[inf]["total"],
                                        data[entry].game_duration
                                    );
                                }
                            }
                        }
                    }
                }
            } else {
                gameTimePerDay[inf] = "0:0:0";
                for (entry of Object.keys(data)) {
                    if (data[entry].game_end.includes(inf)) {
                        gameTimePerDay[inf] = SumDurations(
                            gameTimePerDay[inf],
                            data[entry].game_duration
                        );
                        //console.log(
                        // "inf : " + inf + "   " + data[entry].game_duration
                        //);
                    }
                }
            }
            inf = formatDate(
                new Date(new Date(inf).setDate(new Date(inf).getDate() + 1))
            );
        }
        //console.log("GTPD : ", gameTimePerDay);
        datas = [];
        var id = 0;
        if (document.getElementById("details-checkbox").checked) {
            gamesPlayed = [];
            for (val of Object.values(gameTimePerDay)) {
                element = {}
                element["date"] = Object.keys(gameTimePerDay)[id];
                element["id"] = id
                for (game of Object.keys(val)) {
                    if (game != "total") {
                        if (!gamesPlayed.includes(game)) gamesPlayed.push(game);
                        splitVal = val[game].split(":");
                        valInSeconds =
                            splitVal[2] * Math.pow(60, 0) +
                            splitVal[1] * Math.pow(60, 1) +
                            splitVal[0] * Math.pow(60, 2);
                        element[game] = valInSeconds;
                    }
                }
                datas.push(element);
                id++;
            }
        } else {
            for (val of Object.values(gameTimePerDay)) {
                element = {};
                element["id"] = id;

                // Date formatting
                element["date"] = Object.keys(gameTimePerDay)[id];

                splitVal = val.split(":");
                valInSeconds =
                    splitVal[2] * Math.pow(60, 0) +
                    splitVal[1] * Math.pow(60, 1) +
                    splitVal[0] * Math.pow(60, 2);
                element["playtime"] = valInSeconds;
                //console.log(splitVal, " | ", valInSeconds);
                datas.push(element);
                id++;
            }
        }

        //get total playtime par jour
        datas.forEach(function (entry) {
            Object.keys(entry).forEach(function (d) {
                let total_p = 0;
                if (d != "id" && d != "date") {
                    total_p += parseInt(entry[d]);
                }
                //console.log(entry[d]);
                entry.total_playtime = total_p;
            });
        });

        //console.log(datas);


        // Pie : pour chaque jour, je veux le playtime total
        // set the color scale
        var color = d3.scaleOrdinal()
            .domain([0, d3.max(datas, function (d) { return d.total_playtime; })])
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

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) {
                return d.total_playtime;
            })

        var data_ready = pie(datas)
        //console.log(data_ready);

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg2
            .selectAll('arcs')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data.date)) })
            .attr("class","pie")
            .on("mousemove", function (e, d) {
                // on recupere la position de la souris,
                // e est l'object event d
                theData = d.data;
                var mousePosition = [e.x, e.y];
                //console.log(mousePosition);
                // on affiche le toolip
                tooltip
                    .classed("hidden", false)
                    // on positionne le tooltip en fonction
                    // de la position de la souris


                d3.select('#date-jeu').text(theData.date);
                d3.select('#duree2-jeu').text(
                    parseInt(theData.total_playtime / 3600) +
                    " h " +
                    parseInt(
                        (theData.total_playtime - parseInt(theData.total_playtime / 3600) * 3600) / 60
                    ) +
                    " m " +
                    (theData.total_playtime -
                        (parseInt(theData.total_playtime / 3600) * 3600 +
                            parseInt(
                                (theData.total_playtime - parseInt(theData.total_playtime / 3600) * 3600) / 60
                            ) *
                            60)) +
                    " s."
                );
                d3.select("#nom-jeu").text(" -- ");
                /*d3.select("#nom-jeu").text( Object.keys(theData).find(key => theData[key] === theData.total_playtime));*/

                    // on recupere le nom de l'etat
                    /*.html(
                        theData.date +
                        " | Temps de jeu : " +
                        parseInt(theData.total_playtime / 3600) +
                        " h " +
                        parseInt(
                            (theData.total_playtime - parseInt(theData.total_playtime / 3600) * 3600) / 60
                        ) +
                        " m " +
                        (theData.total_playtime -
                            (parseInt(theData.total_playtime / 3600) * 3600 +
                                parseInt(
                                    (theData.total_playtime - parseInt(theData.total_playtime / 3600) * 3600) / 60
                                ) *
                                60)) +
                        " s."
                    )*/;
            })
            .on("mouseout", function () {
                tooltip.classed("hidden", true);
            });

        let very_total_playtime = get_total_playtime_of_all_data(datas);
        svg2
            .selectAll('arcs')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d){
                return "";  //Enlever cette ligne pour marquer du texte dans les sections du pie
                if(d.data.playtime > very_total_playtime/20) {
                    return d.data.date;
                }
            })
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 17)

        addLegend_pie(color,datas,total_width,0,0);

        d3.select("#user-select").on("change", (event) => {
            //console.log("change");
            display_graph1(true, svg1);
            display_graph2(true, svg2);

        });

        d3.select("#period-select").on("change", (event) => {
            //console.log("change");
            display_graph1(true, svg1);
            display_graph2(true, svg2);
        }); 
    });
}

function addLegend_pie(colors,keys,total_width,start_margin,margin) {
    d3.select("svg2").selectAll(".legendDetails").remove();
    let legendCellSize = 20;
    let maxCarac = d3.max(keys,(d)=> d.date.length);
    var spacingBetweenCells = legendCellSize + maxCarac * 7 + 5;
    colorsKeys = [];
    for (let i=0;i<keys.length;++i) {
        colorsKeys.push(colors(keys[i].date));
    }
    //console.log("legend removed");
    let legend = d3
        .select("svg2")
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
            return i%4 * spacingBetweenCells;
        })
        .attr('y', function (d,i) {
            return Math.floor(i/4)*legendCellSize+Math.floor(i/4)*10;
        })
        .style("fill", d => d);

    legend.selectAll()
        .data(keys)
        .enter().append('text')
        .attr("transform", (d,i) => "translate(" + (i%4 * spacingBetweenCells + legendCellSize + 5) + ", " + 0 + ")")
        .attr("dy", function (d, i) {
            return Math.floor(i/4)*legendCellSize+Math.floor(i/4)*10 + legendCellSize / 1.6;
        }) // Pour centrer le texte par rapport aux carrés
        .style("font-size", "13px")
        .style("fill", "grey")
        .text(d => d.date);
}