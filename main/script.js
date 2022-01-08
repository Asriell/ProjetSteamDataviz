function traitement_data(x) {
    return Math.log(x);
}

function transform_data(dataset) {
    dataset.sort((a, b) => {
        return b.playtime_forever-a.playtime_forever;
    })
    let newId = 0;
    dataset.forEach(element => {
        // Logify les données pour lisibilité
        element.playtime_forever = traitement_data(element.playtime_forever);

        // Ajouter id pour le bar chart
        element.id = newId;
        newId++;
    });
    console.log(dataset);
}

$.get( "https://store.steampowered.com/api/appdetails/?appids=242050", function( data ) {
    $( ".result" ).html( data );
    alert( "Load was performed." );
    console.log(data);
  });

const urlRaw = "https://raw.githubusercontent.com/Asriell/ProjetSteamDataviz/main/main/games.csv"

function display_graph1() {

    let distance_between_bars = 10
    let start_margin = 50;
    let margin = 20;
    let width = 800;
    let height = 650;
    let total_height = height*1.1;
    let total_width = width*1.1;
    let bar_width = 10;


    d3.csv(urlRaw).then(function (data) {
        transform_data(data);

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
        .domain([0, d3.max(data, function(d) { return d.playtime_forever; })])
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
            return yScale(d.playtime_forever);
        })
         .attr("width", bar_width)
         .attr("height", function(d) { return height - yScale(d.playtime_forever); });
    });
}

function display_graph2() {
    let width = 600
    height = 450
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg2 = d3.select("svg2")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    d3.csv(urlRaw).then(function (data) {
        transform_data(data);
        // set the color scale
        var color = d3.scaleOrdinal()
        .domain([0, d3.max(data, function(d) { return d.playtime_forever; })])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .value(function(d) {return d.playtime_forever; })
        var data_ready = pie(data)
        console.log(data_ready);

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg2
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.appid)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
    })
}