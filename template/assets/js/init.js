var svg1;
var svg2;
var svg3;
var svg4;
var axisColor = "#FFE4B5";

function traitement_data(x) {
    return parseInt(x);
}


function transform_data_for_bar(dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
        value.playtime = traitement_data(value.playtime);
    });
}

function set_legende_graph1(datas) {
    let periode = document.getElementById("period-select").value;
    let final_text = periode + " du " + d3.min(datas, (d) => d.date) + " au " + d3.max(datas, (d) => d.date);
    document.getElementById("legende1").innerHTML = final_text;
}

function transform_data_for_pie(dataset) {
    dataset.sort((a, b) => {
        return b.playtime_forever - a.playtime_forever;
    })
    let newId = 0;
    dataset.forEach(element => {
        // Logify les données pour lisibilité
        element.playtime_forever = traitement_data(element.playtime_forever);

        // Ajouter id pour le bar chart
        element.id = newId;
        newId++;
    });
}


function get_nb_days_to_display() {
    let periode = document.getElementById("period-select").value;
    if(periode == "semaine") {
        return 7;
    }
    if(periode == "mois") {
        return 30;
    }
    else {
        //console.error("WRONG DAYS ARGH");
    }
}

function formatDate(date) {
    let ddDate = String(date.getDate()).padStart(2, "0");
    let mmDate = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyyDate = date.getFullYear();
    return yyyyDate + "-" + mmDate + "-" + ddDate;
}

function formatDateObject(date) {
    let ddDate = String(date.getDate()).padStart(2, "0");
    let mmDate = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyyDate = date.getFullYear();
    return new Date(yyyyDate, mmDate, ddDate);
}

var ParseDuration = function (duration) {
    return duration.split(":");
};

var SumDurations = function (duration1, duration2) {
    let d1 = ParseDuration(duration1).map((d) => parseInt(d));
    let d2 = ParseDuration(duration2).map((d) => parseInt(d));
    let h = d1[0] + d2[0];
    let m = d1[1] + d2[1];
    let s = d1[2] + d2[2];
    if (s > 60) {
        m += 1;
        s = s % 60;
    }
    if (m > 60) {
        h += 1;
        m = m % 60;
    }
    return String(h) + ":" + String(m) + ":" + String(s);
};

var DataCleaning = function (data, user) {
    var datasUser = Object.values(data.players).filter(
        (player) => player.persona_name == user
        //document.getElementById("user-select").value
    );

    tmpData = {};
    for (var entry in datasUser) {
        if (!datasUser[entry].game_duration.includes("day")) {
            if (entry != 0) {
                if (!check_duration(datasUser[entry].game_duration)) {
                    continue
                }
                date1 = new Date(datasUser[entry - 1].game_end);
                date2 = new Date(datasUser[entry].game_end);
                datediff = Math.abs(date2 - date1) / 1000;
                dureeJeuSecondes = parseInt(
                    parseInt(ParseDuration(datasUser[entry].game_duration)[0]) *
                    3600 +
                    parseInt(ParseDuration(datasUser[entry].game_duration)[1]) *
                    60 +
                    parseInt(ParseDuration(datasUser[entry].game_duration)[2])
                );
                if (datediff > 5 && datediff >= dureeJeuSecondes) {
                    tmpData[datasUser[entry].game_end] = datasUser[entry];
                    if (
                        parseInt(ParseDuration(datasUser[entry].game_duration)[0]) >
                        12
                    ) {
                        tmpData[datasUser[entry].game_end].game_duration = "12:00:00";
                    }
                }
            } else {
                tmpData[datasUser[entry].game_end] = datasUser[entry];
                if (
                    parseInt(ParseDuration(datasUser[entry].game_duration)[0]) > 12
                ) {
                    tmpData[datasUser[entry].game_end].game_duration = "12:00:00";
                }
            }
        }
    }
    return tmpData;
};


//var USER = "Asriel";
//var PERIOD = "1 Month";
var TODAY = formatDate(new Date());
//const urlRaw = "https://raw.githubusercontent.com/Asriell/ProjetSteamDataviz/gh-pages/data/games.csv"
const urlRaw = "https://raw.githubusercontent.com/Asriell/SteamGamingTimeVisualization/gh-pages/data/games.csv"
//const urlplayersjson = "https://raw.githubusercontent.com/Asriell/ProjetSteamDataviz/gh-pages/data/steam-players-data.json"
const urlplayersjson = "https://raw.githubusercontent.com/Asriell/SteamGamingTimeVisualization/gh-pages/data/steam-players-data.json"

function get_total_playtime_of_all_data(dataset) {
    let total = 0;
    Object.entries(dataset).forEach(([key, value]) => {
        total += traitement_data(value.playtime);
    });
    return total;
}

var hhmmss = function (time) {
    return String(parseInt(time / 3600)).padStart(2, "0") +
        ":" +
        String(parseInt(
            (time - parseInt(time / 3600) * 3600) / 60
        )).padStart(2, "0") +
        ":" +
        String((time -
            (parseInt(time / 3600) * 3600 +
                parseInt(
                    (time - parseInt(time / 3600) * 3600) / 60
                ) *
                60))).padStart(2, "0");
}

function check_duration(str_duration) {
    hh_mm_ss = str_duration.split(":")
    if ((parseInt(hh_mm_ss[0]) == 0) && (parseInt(hh_mm_ss[1]) <= 5)) {
        return false;
    }
    return true;
}
function calculate_duration(dur1, dur2) {

    var hour=0;
    var minute=0;
    var second=0;

    var splitTime1= dur1.split(':');
    var splitTime2= dur2.split(':');

    hour = parseInt(splitTime1[0])+parseInt(splitTime2[0])
    minute = parseInt(splitTime1[1])+parseInt(splitTime2[1])
    hour = hour + minute/60;
    minute = minute%60;
    second = parseInt(splitTime1[2])+parseInt(splitTime2[2])
    minute = minute + second/60;
    second = second%60;

    return Math.floor(hour).toString() + ":" + Math.floor(minute).toString() + ":" + Math.floor(second).toString()
}

function check_day_period(daytime) {

    var hours = parseInt(daytime.split(" ")[1].split(":")[0])

    if (hours >= 5 && hours < 12) {
        return 0
    } else if (hours >= 12 && hours < 17) {
        return 1
    } else if (hours >= 17 && hours < 22) {
        return 2
    } else if ( hours < 5  && hours >= 22) {
        return 3
    }
}

function hours_to_days(time) {
    time = time.split(":")
    var hours = time[0]
    var mn = time[1]
    var s = time[2]

    hours = parseInt(hours) %24
    var days =  parseInt(hours) / 24
    return days + "day " + hours + ":" + mn + ":" + s;
}
function string_to_date(string_date) {
    time = new Date(currentDate.getTime());
    time.setHours(string_date.split(":")[0]);
    time.setMinutes(string_date.split(":")[1]);
    time.setSeconds(string_date.split(":")[2]);

    return time;
}
