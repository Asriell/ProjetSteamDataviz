function traitement_data(x) {
    return Math.log(x);
}

const urlRaw = "https://raw.githubusercontent.com/Asriell/ProjetSteamDataviz/main/main/games.csv"

function display_graph1() {

    var distance_between_bars = 10
    var start_margin = 50;
    var margin = 20;
    var width = 800;
    var height = 650;
    var total_height = height*1.1;
    var total_width = width*1.1;
    var bar_width = 10;


    d3.csv(urlRaw).then(function (data) {
        data.sort((a, b) => {
            return b.playtime_forever-a.playtime_forever;
        })
        let newId = 0;
        data.forEach(element => {
            element.id = newId;
            newId++;
        });
        console.log(data);

        var nbApps = d3.range(data.length);


        var svg1 = d3.select("svg1")
                .append("svg")
                .attr("width", total_width)
                .attr("height", total_height)
                .attr("transform", "translate(" + start_margin + "," + margin + ")");

        var xScale = d3.scaleLinear()
        .domain(nbApps)
        .range([0, distance_between_bars+bar_width]);

        var x_axis = d3.axisBottom()
                   .scale(xScale);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return traitement_data(d.playtime_forever); })])
        .range([height, margin]);

        var y_axis = d3.axisLeft()
                    .scale(yScale);

        svg1.append("g")
        .attr("transform", "translate(" + start_margin + "," + height + ")")
        .call(x_axis);

        svg1.append("g")
        .call(y_axis)
        .attr("transform", "translate(" + margin + ",0)");

        svg1.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) {
             //console.log(xScale(d.id));
             return xScale(d.id) + start_margin;
            })
         .attr("y", function(d) {
            //console.log(d.playtime_forever);
            return yScale(traitement_data(d.playtime_forever));
        })
         .attr("width", bar_width)
         .attr("height", function(d) { return height - yScale(traitement_data(d.playtime_forever)); });
    });
}