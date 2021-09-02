// *** Import JSON file
var mydata = JSON.parse(data);
console.log(mydata.plans);


// *** <div id="app"> Tag
var container:HTMLElement|any = document.getElementById('app');


function get_time_part(from:number, to:number) {
	var part:string = "";
	var time:number = from;

	while(time <= to) {
		part += time % 100 == 0 ? `<div class="time-basic time-${time}"><p><b>${time / 100}:00</b></p></div>`: `<div class="time-basic time-${time}"><p>${(time / 100).toFixed(0)}:30</p></div>`;
		time += time % 100 == 0 ? 30 : 70;
	}

	return part;
}



// *** PROCESSING PLANS *** //
var sorted_plans = [];

function get_events_data(start_index:number, plans:any) { // *** Recursion function
	var index:number = start_index;

	if (index > plans.length - 1) {
		return;
	} else {
		var line_events = [];
		var min_from:number = plans[index].from, max_to:number = plans[index].to;

		for (var i:number = index; i < plans.length; i ++) {
			if (line_events.length == 0) {
				line_events.push(plans[i]);
				continue;
			}

			if (plans[i].from < max_to && plans[i].from > min_from) {
				line_events.push(plans[i]);
				if (max_to < plans[i].to) max_to = plans[i].to;
			} else {
				index = i;
				get_events_data(index, plans);
				break;
			}
		}

		sorted_plans.push(line_events);

	}
}

function get_events() {
	var start_index:number = 0;
	var plans = [...mydata.plans];
	plans.sort((a, b) => {return a.from - b.from});

	get_events_data(start_index, plans);
}

// *** Sorting and Get all events *** //
get_events();

function event_number(plans:any, i:number, j:number) {
	return Math.floor((plans[i][j].from - 900) / 100) * 2 + ((plans[i][j].from - 900) % 100 == 0 ? 0 : 1) + 1;
}

function getWidth(plans:any, i:number) {
	return `calc(${75 / plans[i].length}% - 20px)`;
}

function getHeight(plans:any, i:number, j:number) {
	var diff:number = Math.floor(((plans[i][j].to - plans[i][j].from) / 100)) * 2 + ((plans[i][j].to - plans[i][j].from) % 100 == 0 ? 0 : 1);
	return diff == 1 ? diff * 50 : diff * (50 + 1.2);
}

function getRight(plans:any, i:number, j:number) {
	return (plans[i].length - j - 1) * 75 / plans[i].length;
}

function display_plans() {
	var plans:string = "";
	sorted_plans.reverse();

	console.log(sorted_plans);

	for (var i:number = 0; i < sorted_plans.length; i ++) {
		for (var j:number = 0; j < sorted_plans[i].length; j ++) {
			plans += `<div class="event-basic event-${event_number(sorted_plans, i, j)}" style="width: ${getWidth(sorted_plans, i)}; height: ${getHeight(sorted_plans, i, j)}px; right: ${getRight(sorted_plans, i, j)}%;">

						<div class="${Math.floor((sorted_plans[i][j].to - sorted_plans[i][j].from) / 100) == 0 ? 'plr-3 float' : 'plr-3'}">

							<p>${Math.floor(sorted_plans[i][j].from / 100)}:${sorted_plans[i][j].from % 100 == 0? "00" : "30"} ~ ${Math.floor(sorted_plans[i][j].to / 100)}:${sorted_plans[i][j].to % 100 == 0 ? "00" : "30"}</p>
							<p class="title-text"><b>${sorted_plans[i][j].title}</b></p>
							<p class="location-text">${sorted_plans[i][j].location}</p>

						</div>
					</div>`;

		}
	}

	return plans;

}


// *** Main Page ***//
container.innerHTML = `
	<div class="date">
		<p>${mydata.date}</p>
	</div>
	<div class="flex-container justify-content-flex-end pl-2">
		<div class="day-event">
			<p class="ml-3">ALL DAY - <b>${mydata.day_schedule.title}</b> <span class="location-text">${mydata.day_schedule.location}</span></p>
		</div>
	</div>


	<div class="position-relative">

		<div class="flex-container am-bg">
			<div class="flex-1">
				<h1 class="am-text">AM</h1>
			</div>
			<div id="am" class="flex-6">
				${get_time_part(900, 1130)}
			</div>

		</div>

		<div class="flex-container pm-bg">
			<div class="flex-1">
				<h1 class="pm-text">PM</h1>
			</div>
			<div id="pm" class="flex-6">
				${get_time_part(1200, 2030)}
				<div style="height: 50px; border-top: 2px solid lightgrey;"></div>
			</div>

		</div>



		${display_plans()}


		

	</div>
		
`;



