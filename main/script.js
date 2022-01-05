function display() {  
    alert("Hammer time");  
    } 

const margin = { top: 0, right: 30, bottom: 20, left: 10 },
    width = 960,
    height = 960;
    
var svg1 = d3
.select("#visu-activite1")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
