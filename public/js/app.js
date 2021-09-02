"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
// *** Import JSON file
var mydata = JSON.parse(data);
console.log(mydata.plans);
// *** <div id="app"> Tag
var container = document.getElementById('app');
function get_time_part(from, to) {
    var part = "";
    var time = from;
    while (time <= to) {
        part += time % 100 == 0 ? "<div class=\"time-basic time-" + time + "\"><p><b>" + time / 100 + ":00</b></p></div>" : "<div class=\"time-basic time-" + time + "\"><p>" + (time / 100).toFixed(0) + ":30</p></div>";
        time += time % 100 == 0 ? 30 : 70;
    }
    return part;
}
// *** PROCESSING PLANS *** //
var sorted_plans = [];
function get_events_data(start_index, plans) {
    var index = start_index;
    if (index > plans.length - 1) {
        return;
    }
    else {
        var line_events = [];
        var min_from = plans[index].from, max_to = plans[index].to;
        for (var i = index; i < plans.length; i++) {
            if (line_events.length == 0) {
                line_events.push(plans[i]);
                continue;
            }
            if (plans[i].from < max_to && plans[i].from > min_from) {
                line_events.push(plans[i]);
                if (max_to < plans[i].to)
                    max_to = plans[i].to;
            }
            else {
                index = i;
                get_events_data(index, plans);
                break;
            }
        }
        sorted_plans.push(line_events);
    }
}
function get_events() {
    var start_index = 0;
    var plans = __spreadArray([], mydata.plans);
    plans.sort(function (a, b) { return a.from - b.from; });
    get_events_data(start_index, plans);
}
// *** Sorting and Get all events *** //
get_events();
function event_number(plans, i, j) {
    return Math.floor((plans[i][j].from - 900) / 100) * 2 + ((plans[i][j].from - 900) % 100 == 0 ? 0 : 1) + 1;
}
function getWidth(plans, i) {
    return "calc(" + 75 / plans[i].length + "% - 20px)";
}
function getHeight(plans, i, j) {
    var diff = Math.floor(((plans[i][j].to - plans[i][j].from) / 100)) * 2 + ((plans[i][j].to - plans[i][j].from) % 100 == 0 ? 0 : 1);
    return diff == 1 ? diff * 50 : diff * (50 + 1.2);
}
function getRight(plans, i, j) {
    return (plans[i].length - j - 1) * 75 / plans[i].length;
}
function display_plans() {
    var plans = "";
    sorted_plans.reverse();
    console.log(sorted_plans);
    for (var i = 0; i < sorted_plans.length; i++) {
        for (var j = 0; j < sorted_plans[i].length; j++) {
            plans += "<div class=\"event-basic event-" + event_number(sorted_plans, i, j) + "\" style=\"width: " + getWidth(sorted_plans, i) + "; height: " + getHeight(sorted_plans, i, j) + "px; right: " + getRight(sorted_plans, i, j) + "%;\">\n\n\t\t\t\t\t\t<div class=\"" + (Math.floor((sorted_plans[i][j].to - sorted_plans[i][j].from) / 100) == 0 ? 'plr-3 float' : 'plr-3') + "\">\n\n\t\t\t\t\t\t\t<p>" + Math.floor(sorted_plans[i][j].from / 100) + ":" + (sorted_plans[i][j].from % 100 == 0 ? "00" : "30") + " ~ " + Math.floor(sorted_plans[i][j].to / 100) + ":" + (sorted_plans[i][j].to % 100 == 0 ? "00" : "30") + "</p>\n\t\t\t\t\t\t\t<p class=\"title-text\"><b>" + sorted_plans[i][j].title + "</b></p>\n\t\t\t\t\t\t\t<p class=\"location-text\">" + sorted_plans[i][j].location + "</p>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>";
        }
    }
    return plans;
}
// *** Main Page ***//
container.innerHTML = "\n\t<div class=\"date\">\n\t\t<p>" + mydata.date + "</p>\n\t</div>\n\t<div class=\"flex-container justify-content-flex-end pl-2\">\n\t\t<div class=\"day-event\">\n\t\t\t<p class=\"ml-3\">ALL DAY - <b>" + mydata.day_schedule.title + "</b> <span class=\"location-text\">" + mydata.day_schedule.location + "</span></p>\n\t\t</div>\n\t</div>\n\n\n\t<div class=\"position-relative\">\n\n\t\t<div class=\"flex-container am-bg\">\n\t\t\t<div class=\"flex-1\">\n\t\t\t\t<h1 class=\"am-text\">AM</h1>\n\t\t\t</div>\n\t\t\t<div id=\"am\" class=\"flex-6\">\n\t\t\t\t" + get_time_part(900, 1130) + "\n\t\t\t</div>\n\n\t\t</div>\n\n\t\t<div class=\"flex-container pm-bg\">\n\t\t\t<div class=\"flex-1\">\n\t\t\t\t<h1 class=\"pm-text\">PM</h1>\n\t\t\t</div>\n\t\t\t<div id=\"pm\" class=\"flex-6\">\n\t\t\t\t" + get_time_part(1200, 2030) + "\n\t\t\t\t<div style=\"height: 50px; border-top: 2px solid lightgrey;\"></div>\n\t\t\t</div>\n\n\t\t</div>\n\n\n\n\t\t" + display_plans() + "\n\n\n\t\t\n\n\t</div>\n\t\t\n";
