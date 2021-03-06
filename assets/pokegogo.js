
$(document).ready(function() {
   var buttonTextOptions = ["PULL THE LEVER, KRONK!", "JUST DO IT!", "HERE WE GO AGAIN!", '"......." - RED', "GOTTA CATCH 'EM ALL!", "I PIKA CHOOSE YOU",
							"PROFESSOR WILLOW DID NOTHING WRONG", "BEGIN!", "LAUNCH!", "THERE'S NO TURNING BACK", "POKEMON GO TO THE POLLS",
							"TOP PERCENT OF ALL BUTTONS", "THANKS MICROSOFT", "GET ME MEOWTHA HERE", "IT'S SUPER EFFECTIVE!", "[META QUOTE ABOUT META QUOTES]",
							"SO HAMILTONIAN IT'S ALEXANDER"];
	$("#start-button").text(buttonTextOptions[Math.floor(Math.random() * buttonTextOptions.length)]);
      
	  
	for (var stop in stops) {
		if (stops.hasOwnProperty(stop)) {
	
			
			$("#start").append("<option class='start-option'>" + stops[stop].poke_title + "</option>");
			$("#bend").append("<option class='end-option'>" + stops[stop].poke_title + "</option>");
		}
		
	}
	GetMap();
});


 var map = null;
 var directionsManager = null;

 function GetMap()
 {
	// Initialize the map
	map = new Microsoft.Maps.Map(document.getElementById("mapDiv"),{credentials:"AmunM5dqdTYSTdKKi59eed45MbZNDSjLUu93J0nLO_u9gfaPS7085ukHhhoCkatw", enableSearchLogo: false, showMapTypeSelector: false, mapTypeId: Microsoft.Maps.MapTypeId.road});
		center = new Microsoft.Maps.Location(28.6024, -81.2001);

	map.setView({center: center, zoom: 15});
	//Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: directionsModuleLoaded });
	

 }
 
 function draw(){
	 
	$("#toHide").hide();
	 	var start = "";
	var end = "";
	for (var stop in stops) {
		if (stops.hasOwnProperty(stop)) {
			if(stops[stop].poke_title === $("#start").val())
			{
				start = stop;
			}
			if(stops[stop].poke_title === $("#bend").val())
			{
				end = stop;
			}
		}
	}
	var points = [start, end];
	console.log(points.toString());
	var variance = ($("#variance").val())/60.0 * 3.1;
	if(isNaN(variance)){
		alert("THAT ISN'T A NUMBER, JERK.");
		return;
	}
	points = get_points(points, variance);

	var pins = [];
	var locs = [];
	
	for(var point in points)
	{
		$("#stops").append( ' <li class="list-group-item">' + stops[points[point]].poke_title + '</li>');
		a = stops[points[point]].poke_lat;
		b = stops[points[point]].poke_lng;
		a = a.substring(0, 2) + "." + a.substring(2);
		b = b.substring(0, 3) + "." + b.substring(3);
		locs.push(new Microsoft.Maps.Location(a, b) );
		pins.push(new Microsoft.Maps.Pushpin(locs[locs.length-1], {icon: 'assets/pinicon.png', width: 18, height: 20, draggable: false}));
		//directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(a, b) }));
	}
	

            var line = new Microsoft.Maps.Polyline(locs,  {strokeColor: new Microsoft.Maps.Color(150,0,0,255) } );
			console.log(line);

            map.entities.push(line);
            for(pin in pins){
				map.entities.push(pins[pin]);
				console.log(pins[pin]);
			}

	
 }



 function directionsModuleLoaded()
 {
	// Initialize the DirectionsManager
	directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

	var start = "";
	var end = "";
	for (var stop in stops) {
		if (stops.hasOwnProperty(stop)) {
			if(stops[stop].poke_title === $("#start").val())
			{
				start = stop;
			}
			if(stops[stop].poke_title === $("#bend").val())
			{
				end = stop;
			}
		}
	}
	var points = [start, end];
	console.log(points.toString());
	var variance = ($("#variance").val())/60.0 * 3.1;
	points = get_points(points, variance);
	//console.log(points.toString());
	for(var point in points)
	{
		a = stops[points[point]].poke_lat;
		b = stops[points[point]].poke_lng;
		a = a.substring(0, 2) + "." + a.substring(2);
		b = b.substring(0, 3) + "." + b.substring(3);
		directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(a, b) }));
	}
	


	directionsManager.setRequestOptions({
			routeMode: Microsoft.Maps.Directions.RouteMode.walking
		});

	// Set the id of the div to use to display the directions
	directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('itineraryDiv') });

	// Specify a handler for when an error and success occurs
	Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', displayError);

	// Calculate directions, which displays a route on the map
	directionsManager.calculateDirections();
	

 } 

 function displayError(e)
 {
	// Display the error message
	alert(e.message);


 }
 
 
 function get_points(P, variance){
	var  distance = getDistance(P[0], P[1]);
	 var sumDistance = distance;
	var used = {};
	 used[P[0]] = true;
	 used[P[1]] = true;
	while(1 == 1){
		var minDistance = Number.MAX_VALUE;
		var minJ = -1;
		var minI = -1;
		var minStop = -1;
		for(i = 1; i < P.length; i++){
			
			for (var stop in stops) {
				if (stops.hasOwnProperty(stop) && !used.hasOwnProperty(stop)) {
					if(!used.hasOwnProperty(stop))
					{
						//console.log(i + " " + P[i-1] + " " + stop + " " + P[i]);
						var thisDist = getDistance(P[i - 1], stop) + getDistance(stop, P[i]) - getDistance(P[i-1], P[i]);
						//console.log(thisDist);
						if(thisDist < minDistance)
						{
							minDistance = thisDist;
							minStop = stop;
							minI = i;
							console.log(minDistance);
						}
					}
				}
			}
		}
		
		console.log("SUM " + sumDistance+ " MIN " + minDistance + " DISTANCE " + distance + " VARIANCE " + variance);
		if(sumDistance + minDistance > distance + variance)
			break;
		sumDistance += minDistance;
		used[minStop] = true;
		console.log(P.toString());
		//console.log(minStop);
		//console.log(stops[minStop]);
		P.splice(minI, 0, minStop);
		console.log(P.toString() + " " + sumDistance);
		//console.log("what");
	}
	console.log(P);
	for(point in P){
		console.log(stops[P[point]].poke_title);
	}
	return P;
	 
 }
 
	/*
	
	This script is pretty basic, but if you use it, please let me know.  Thanks!
	Andrew Hedges, andrew(at)hedges(dot)name
	
	*/
	
	var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
	var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
		
	/* main function */
	function getDistance(pointOne, pointTwo) {
		var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;
		a = stops[pointOne].poke_lat;
		b = stops[pointOne].poke_lng;
		a = a.substring(0, 2) + "." + a.substring(2);
		b = b.substring(0, 3) + "." + b.substring(3);
		
		// get values for lat1, lon1, lat2, and lon2
		t1 = a;
		n1 = b;
		
		a = stops[pointTwo].poke_lat;
		b = stops[pointTwo].poke_lng;
		
		a = a.substring(0, 2) + "." + a.substring(2);
		b = b.substring(0, 3) + "." + b.substring(3);
		t2 = a;
		n2 = b;
		
		// convert coordinates to radians
		lat1 = deg2rad(t1);
		lon1 = deg2rad(n1);
		lat2 = deg2rad(t2);
		lon2 = deg2rad(n2);
		
		// find the differences between the coordinates
		dlat = lat2 - lat1;
		dlon = lon2 - lon1;
		
		// here's the heavy lifting
		a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
		c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
		dm = c * Rm; // great circle distance in miles
		dk = c * Rk; // great circle distance in km
		
		// round the results down to the nearest 1/1000
		mi = round(dm);
		return mi;
	}
	
	
	// convert degrees to radians
	function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	}

 
 stops = {
	"229830": {
		"poke_id": "229830",
		"gym_team": "0",
		"poke_lat": "28599833",
		"poke_lng": "-81197896",
		"poke_title": "Hanging Periodic Table",
		"poke_type": "1",
		"realrand": "111119405",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "hanging-periodic-table"
	},
	"649036": {
		"poke_id": "649036",
		"gym_team": "0",
		"poke_lat": "28605345",
		"poke_lng": "-81205823",
		"poke_title": "Delta Delta Delta House",
		"poke_type": "1",
		"realrand": "116884780",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "delta-delta-delta-house"
	},
	"310171": {
		"poke_id": "310171",
		"gym_team": "0",
		"poke_lat": "28603798",
		"poke_lng": "-81206036",
		"poke_title": "AZD House at UCF",
		"poke_type": "1",
		"realrand": "121319461",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "azd-house-at-ucf"
	},
	"444569": {
		"poke_id": "444569",
		"gym_team": "0",
		"poke_lat": "28601158",
		"poke_lng": "-81200052",
		"poke_title": "College of Sciences Building",
		"poke_type": "1",
		"realrand": "147742044",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "college-of-sciences-building"
	},
	"246813": {
		"poke_id": "246813",
		"gym_team": "0",
		"poke_lat": "28602520",
		"poke_lng": "-81204807",
		"poke_title": "UCF Large Theatre",
		"poke_type": "1",
		"realrand": "148097020",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-large-theatre"
	},
	"954411": {
		"poke_id": "954411",
		"gym_team": "0",
		"poke_lat": "28600236",
		"poke_lng": "-81200525",
		"poke_title": "Technology Commons I",
		"poke_type": "1",
		"realrand": "152876751",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "technology-commons-i"
	},
	"38700726": {
		"poke_id": "38700726",
		"gym_team": "0",
		"poke_lat": "28600569",
		"poke_lng": "-81202258",
		"poke_title": "Alamar",
		"poke_type": "0",
		"realrand": "156188782",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "alamar"
	},
	"1076829": {
		"poke_id": "1076829",
		"gym_team": "0",
		"poke_lat": "28600622",
		"poke_lng": "-81198816",
		"poke_title": "Case of Lepidoptera",
		"poke_type": "1",
		"realrand": "162817231",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "case-of-lepidoptera"
	},
	"38700764": {
		"poke_id": "38700764",
		"gym_team": "0",
		"poke_lat": "28600721",
		"poke_lng": "-81199940",
		"poke_title": "UCF Conservatory Theater",
		"poke_type": "0",
		"realrand": "173839216",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-conservatory-theater"
	},
	"248725": {
		"poke_id": "248725",
		"gym_team": "0",
		"poke_lat": "28603480",
		"poke_lng": "-81200794",
		"poke_title": "Tree Talk 2",
		"poke_type": "1",
		"realrand": "174294042",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "tree-talk-2"
	},
	"363098": {
		"poke_id": "363098",
		"gym_team": "0",
		"poke_lat": "28603870",
		"poke_lng": "-81200314",
		"poke_title": "Tree Talk",
		"poke_type": "1",
		"realrand": "180269648",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "tree-talk"
	},
	"106441": {
		"poke_id": "106441",
		"gym_team": "0",
		"poke_lat": "28603133",
		"poke_lng": "-81199624",
		"poke_title": "Scenic UCF Boardwalk",
		"poke_type": "1",
		"realrand": "189071076",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "scenic-ucf-boardwalk"
	},
	"1142529": {
		"poke_id": "1142529",
		"gym_team": "0",
		"poke_lat": "28601141",
		"poke_lng": "-81200303",
		"poke_title": "College of Sciences Sculpture",
		"poke_type": "1",
		"realrand": "217491346",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "college-of-sciences-sculpture"
	},
	"553207": {
		"poke_id": "553207",
		"gym_team": "0",
		"poke_lat": "28599318",
		"poke_lng": "-81203711",
		"poke_title": "Enlightenment",
		"poke_type": "1",
		"realrand": "222130379",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "enlightenment"
	},
	"38701180": {
		"poke_id": "38701180",
		"gym_team": "0",
		"poke_lat": "28601212",
		"poke_lng": "-81198714",
		"poke_title": "National Engineering Honor Society",
		"poke_type": "0",
		"realrand": "225918046",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "national-engineering-honor-society"
	},
	"328530": {
		"poke_id": "328530",
		"gym_team": "0",
		"poke_lat": "28601308",
		"poke_lng": "-81201126",
		"poke_title": "John T. Washington Center",
		"poke_type": "1",
		"realrand": "234762950",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "john-t-washington-center"
	},
	"1009471": {
		"poke_id": "1009471",
		"gym_team": "0",
		"poke_lat": "28603007",
		"poke_lng": "-81198355",
		"poke_title": "Metal Tree",
		"poke_type": "1",
		"realrand": "259084604",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "metal-tree"
	},
	"38700771": {
		"poke_id": "38700771",
		"gym_team": "0",
		"poke_lat": "28599465",
		"poke_lng": "-81200696",
		"poke_title": "Mathematical Sciences ",
		"poke_type": "0",
		"realrand": "278792685",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "mathematical-sciences"
	},
	"38700724": {
		"poke_id": "38700724",
		"gym_team": "0",
		"poke_lat": "28600205",
		"poke_lng": "-81201962",
		"poke_title": "Glowing UCF Library Pegasus",
		"poke_type": "0",
		"realrand": "299987804",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "glowing-ucf-library-pegasus"
	},
	"940518": {
		"poke_id": "940518",
		"gym_team": "0",
		"poke_lat": "28605589",
		"poke_lng": "-81191260",
		"poke_title": "University Of Central Florida Aboretum",
		"poke_type": "1",
		"realrand": "303921488",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "university-of-central-florida-aboretum"
	},
	"38701206": {
		"poke_id": "38701206",
		"gym_team": "0",
		"poke_lat": "28601136",
		"poke_lng": "-81202030",
		"poke_title": "UCF Bookstore",
		"poke_type": "0",
		"realrand": "314012385",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-bookstore"
	},
	"177741": {
		"poke_id": "177741",
		"gym_team": "0",
		"poke_lat": "28601936",
		"poke_lng": "-81202135",
		"poke_title": "Dedication from the UCF Retirement Association",
		"poke_type": "1",
		"realrand": "318160153",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "dedication-from-the-ucf-retirement-association"
	},
	"38701166": {
		"poke_id": "38701166",
		"gym_team": "0",
		"poke_lat": "28603171",
		"poke_lng": "-81198190",
		"poke_title": "Health and Public Affairs II ",
		"poke_type": "0",
		"realrand": "349366660",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "health-and-public-affairs-ii"
	},
	"38701181": {
		"poke_id": "38701181",
		"gym_team": "0",
		"poke_lat": "28602238",
		"poke_lng": "-81201995",
		"poke_title": "Burnett Honors College Sundial",
		"poke_type": "0",
		"realrand": "355423918",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "burnett-honors-college-sundial"
	},
	"1120312": {
		"poke_id": "1120312",
		"gym_team": "0",
		"poke_lat": "28601942",
		"poke_lng": "-81203983",
		"poke_title": "UCF Music Building",
		"poke_type": "1",
		"realrand": "356405195",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-music-building"
	},
	"1063309": {
		"poke_id": "1063309",
		"gym_team": "0",
		"poke_lat": "28599981",
		"poke_lng": "-81201750",
		"poke_title": "Flame of Hope",
		"poke_type": "1",
		"realrand": "363080030",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "flame-of-hope"
	},
	"841928": {
		"poke_id": "841928",
		"gym_team": "0",
		"poke_lat": "28600235",
		"poke_lng": "-81199740",
		"poke_title": "UCF Theater",
		"poke_type": "1",
		"realrand": "363998666",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-theater"
	},
	"1113048": {
		"poke_id": "1113048",
		"gym_team": "0",
		"poke_lat": "28600769",
		"poke_lng": "-81203143",
		"poke_title": "Yellow Line UCF Statue",
		"poke_type": "1",
		"realrand": "381143031",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "yellow-line-ucf-statue"
	},
	"626929": {
		"poke_id": "626929",
		"gym_team": "0",
		"poke_lat": "28604482",
		"poke_lng": "-81201040",
		"poke_title": "Parking Garage H Plaque",
		"poke_type": "1",
		"realrand": "382736443",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "parking-garage-h-plaque"
	},
	"941491": {
		"poke_id": "941491",
		"gym_team": "0",
		"poke_lat": "28599576",
		"poke_lng": "-81199065",
		"poke_title": "Health Center Concrete Park",
		"poke_type": "1",
		"realrand": "385939612",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "health-center-concrete-park"
	},
	"411586": {
		"poke_id": "411586",
		"gym_team": "0",
		"poke_lat": "28604028",
		"poke_lng": "-81199769",
		"poke_title": "ROTC Hanging Statue",
		"poke_type": "1",
		"realrand": "392978093",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "rotc-hanging-statue"
	},
	"1028604": {
		"poke_id": "1028604",
		"gym_team": "0",
		"poke_lat": "28599128",
		"poke_lng": "-81202276",
		"poke_title": "Florida Dream for UCF",
		"poke_type": "1",
		"realrand": "402792293",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "florida-dream-for-ucf"
	},
	"38701168": {
		"poke_id": "38701168",
		"gym_team": "0",
		"poke_lat": "28602258",
		"poke_lng": "-81202249",
		"poke_title": "Allyn MacLean Stearman Meditation Garden",
		"poke_type": "0",
		"realrand": "405479219",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "allyn-maclean-stearman-meditation-garden"
	},
	"38701842": {
		"poke_id": "38701842",
		"gym_team": "0",
		"poke_lat": "28600415",
		"poke_lng": "-81202670",
		"poke_title": "Howard Phillips Dedication",
		"poke_type": "0",
		"realrand": "405764898",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "howard-phillips-dedication"
	},
	"38701176": {
		"poke_id": "38701176",
		"gym_team": "0",
		"poke_lat": "28604418",
		"poke_lng": "-81200224",
		"poke_title": "American Classroom",
		"poke_type": "0",
		"realrand": "409857936",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "american-classroom"
	},
	"38700736": {
		"poke_id": "38700736",
		"gym_team": "0",
		"poke_lat": "28600496",
		"poke_lng": "-81197752",
		"poke_title": "U.S. - India Friendship E-Pad",
		"poke_type": "0",
		"realrand": "414033400",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "u-s-india-friendship-e-pad"
	},
	"38700735": {
		"poke_id": "38700735",
		"gym_team": "0",
		"poke_lat": "28599733",
		"poke_lng": "-81199456",
		"poke_title": "In Honor of Gertrude Adams",
		"poke_type": "0",
		"realrand": "436137434",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "in-honor-of-gertrude-adams"
	},
	"509438": {
		"poke_id": "509438",
		"gym_team": "0",
		"poke_lat": "28601421",
		"poke_lng": "-81198872",
		"poke_title": "Monolith 1",
		"poke_type": "1",
		"realrand": "441506845",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "monolith-1"
	},
	"664452": {
		"poke_id": "664452",
		"gym_team": "0",
		"poke_lat": "28601852",
		"poke_lng": "-81194173",
		"poke_title": "UCF Arboretum ",
		"poke_type": "2",
		"realrand": "442082479",
		"poke_enabled": "2",
		"confirm": 2,
		"cleantitle": "ucf-arboretum"
	},
	"418333": {
		"poke_id": "418333",
		"gym_team": "0",
		"poke_lat": "28600859",
		"poke_lng": "-81196739",
		"poke_title": "UCF Arboretum",
		"poke_type": "1",
		"realrand": "446375131",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-arboretum"
	},
	"1159181": {
		"poke_id": "1159181",
		"gym_team": "0",
		"poke_lat": "28602915",
		"poke_lng": "-81201014",
		"poke_title": "UCF Shuttle Station",
		"poke_type": "1",
		"realrand": "450575568",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-shuttle-station"
	},
	"452164": {
		"poke_id": "452164",
		"gym_team": "0",
		"poke_lat": "28603523",
		"poke_lng": "-81202969",
		"poke_title": "Anthony J. Nicholson Dedication",
		"poke_type": "1",
		"realrand": "450852735",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "anthony-j-nicholson-dedication"
	},
	"38701830": {
		"poke_id": "38701830",
		"gym_team": "0",
		"poke_lat": "28599247",
		"poke_lng": "-81204172",
		"poke_title": "Teaching Academy Pegasus Seal",
		"poke_type": "0",
		"realrand": "451351566",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "teaching-academy-pegasus-seal"
	},
	"38701194": {
		"poke_id": "38701194",
		"gym_team": "0",
		"poke_lat": "28601213",
		"poke_lng": "-81197573",
		"poke_title": "Creol Color Wall",
		"poke_type": "0",
		"realrand": "455099066",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "creol-color-wall"
	},
	"251428": {
		"poke_id": "251428",
		"gym_team": "0",
		"poke_lat": "28601161",
		"poke_lng": "-81198135",
		"poke_title": "Wheatstone Bridge",
		"poke_type": "1",
		"realrand": "455166497",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "wheatstone-bridge"
	},
	"430862": {
		"poke_id": "430862",
		"gym_team": "0",
		"poke_lat": "28601731",
		"poke_lng": "-81201051",
		"poke_title": "Frosted Pegasus",
		"poke_type": "1",
		"realrand": "456161025",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "frosted-pegasus"
	},
	"320686": {
		"poke_id": "320686",
		"gym_team": "0",
		"poke_lat": "28600139",
		"poke_lng": "-81198904",
		"poke_title": "Collection of Florida Birds Nests",
		"poke_type": "1",
		"realrand": "464480935",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "collection-of-florida-birds-nests"
	},
	"38700721": {
		"poke_id": "38700721",
		"gym_team": "0",
		"poke_lat": "28600399",
		"poke_lng": "-81201280",
		"poke_title": "William J. Bryant Study Room",
		"poke_type": "0",
		"realrand": "465918805",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "william-j-bryant-study-room"
	},
	"643043": {
		"poke_id": "643043",
		"gym_team": "0",
		"poke_lat": "28604599",
		"poke_lng": "-81199608",
		"poke_title": "UCF Psychology Building",
		"poke_type": "1",
		"realrand": "468289388",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-psychology-building"
	},
	"38701158": {
		"poke_id": "38701158",
		"gym_team": "0",
		"poke_lat": "28603635",
		"poke_lng": "-81199463",
		"poke_title": "Boundary Wall",
		"poke_type": "0",
		"realrand": "470902382",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "boundary-wall"
	},
	"879554": {
		"poke_id": "879554",
		"gym_team": "0",
		"poke_lat": "28605086",
		"poke_lng": "-81197892",
		"poke_title": "UCF Parking Garage D Plaque",
		"poke_type": "1",
		"realrand": "474897223",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-parking-garage-d-plaque"
	},
	"763209": {
		"poke_id": "763209",
		"gym_team": "0",
		"poke_lat": "28601181",
		"poke_lng": "-81199432",
		"poke_title": "Mu Kappa Tau Dedication",
		"poke_type": "1",
		"realrand": "483999374",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "mu-kappa-tau-dedication"
	},
	"38700729": {
		"poke_id": "38700729",
		"gym_team": "0",
		"poke_lat": "28599881",
		"poke_lng": "-81198328",
		"poke_title": "Beach Mural",
		"poke_type": "0",
		"realrand": "484250418",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "beach-mural"
	},
	"615288": {
		"poke_id": "615288",
		"gym_team": "0",
		"poke_lat": "28601668",
		"poke_lng": "-81198641",
		"poke_title": "Working Together ",
		"poke_type": "1",
		"realrand": "484546845",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "working-together"
	},
	"35780": {
		"poke_id": "35780",
		"gym_team": "0",
		"poke_lat": "28604371",
		"poke_lng": "-81202848",
		"poke_title": "Nicholson School of Communication",
		"poke_type": "1",
		"realrand": "485568306",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "nicholson-school-of-communication"
	},
	"38700749": {
		"poke_id": "38700749",
		"gym_team": "0",
		"poke_lat": "28600761",
		"poke_lng": "-81199115",
		"poke_title": "Beta Gamma Sigma",
		"poke_type": "0",
		"realrand": "498081252",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "beta-gamma-sigma"
	},
	"921220": {
		"poke_id": "921220",
		"gym_team": "0",
		"poke_lat": "28602148",
		"poke_lng": "-81200327",
		"poke_title": "Pegasus Grand Ballroom Knight 1",
		"poke_type": "1",
		"realrand": "500335998",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "pegasus-grand-ballroom-knight-1"
	},
	"38700733": {
		"poke_id": "38700733",
		"gym_team": "0",
		"poke_lat": "28600724",
		"poke_lng": "-81197709",
		"poke_title": "UCF Harris Engineering Corporation",
		"poke_type": "0",
		"realrand": "508778050",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-harris-engineering-corporation"
	},
	"67415": {
		"poke_id": "67415",
		"gym_team": "0",
		"poke_lat": "28604587",
		"poke_lng": "-81205865",
		"poke_title": "Lion of Alpha Delta Pi Sorority",
		"poke_type": "1",
		"realrand": "510715445",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "lion-of-alpha-delta-pi-sorority"
	},
	"608162": {
		"poke_id": "608162",
		"gym_team": "0",
		"poke_lat": "28603951",
		"poke_lng": "-81190231",
		"poke_title": "UCF Natural Areas",
		"poke_type": "2",
		"realrand": "511945464",
		"poke_enabled": "2",
		"confirm": 2,
		"cleantitle": "ucf-natural-areas"
	},
	"38700772": {
		"poke_id": "38700772",
		"gym_team": "0",
		"poke_lat": "28600100",
		"poke_lng": "-81201296",
		"poke_title": "Wisdom Temple",
		"poke_type": "0",
		"realrand": "522973928",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "wisdom-temple"
	},
	"38701152": {
		"poke_id": "38701152",
		"gym_team": "0",
		"poke_lat": "28601483",
		"poke_lng": "-81202169",
		"poke_title": "Drigger&#039;s Field Plaque",
		"poke_type": "0",
		"realrand": "527439152",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "drigger-039-s-field-plaque"
	},
	"38701162": {
		"poke_id": "38701162",
		"gym_team": "0",
		"poke_lat": "28603469",
		"poke_lng": "-81200262",
		"poke_title": "Classroom Building 1 Plaque",
		"poke_type": "0",
		"realrand": "534918057",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "classroom-building-1-plaque"
	},
	"302884": {
		"poke_id": "302884",
		"gym_team": "0",
		"poke_lat": "28602169",
		"poke_lng": "-81199094",
		"poke_title": "Light Vane of Engineering ",
		"poke_type": "1",
		"realrand": "545820032",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "light-vane-of-engineering"
	},
	"714624": {
		"poke_id": "714624",
		"gym_team": "0",
		"poke_lat": "28605590",
		"poke_lng": "-81220248",
		"poke_title": "Quadrangle Fountain",
		"poke_type": "1",
		"realrand": "553139413",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "quadrangle-fountain"
	},
	"1064444": {
		"poke_id": "1064444",
		"gym_team": "0",
		"poke_lat": "28603840",
		"poke_lng": "-81203206",
		"poke_title": "Dialogue in the NSOC",
		"poke_type": "1",
		"realrand": "554505113",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "dialogue-in-the-nsoc"
	},
	"38701215": {
		"poke_id": "38701215",
		"gym_team": "0",
		"poke_lat": "28601915",
		"poke_lng": "-81200511",
		"poke_title": "UCF Student Union Pegasus",
		"poke_type": "0",
		"realrand": "555507076",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-student-union-pegasus"
	},
	"38701163": {
		"poke_id": "38701163",
		"gym_team": "0",
		"poke_lat": "28602614",
		"poke_lng": "-81198863",
		"poke_title": "Linda Howards Space West",
		"poke_type": "0",
		"realrand": "565042624",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "linda-howards-space-west"
	},
	"38700768": {
		"poke_id": "38700768",
		"gym_team": "0",
		"poke_lat": "28600479",
		"poke_lng": "-81198585",
		"poke_title": "Bug Closet",
		"poke_type": "0",
		"realrand": "587988464",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "bug-closet"
	},
	"839119": {
		"poke_id": "839119",
		"gym_team": "0",
		"poke_lat": "28599833",
		"poke_lng": "-81208280",
		"poke_title": "UCF Knight",
		"poke_type": "1",
		"realrand": "606767303",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-knight"
	},
	"586645": {
		"poke_id": "586645",
		"gym_team": "0",
		"poke_lat": "28600354",
		"poke_lng": "-81201015",
		"poke_title": "Library Loading Dock and Lot",
		"poke_type": "1",
		"realrand": "620992374",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "library-loading-dock-and-lot"
	},
	"730017": {
		"poke_id": "730017",
		"gym_team": "0",
		"poke_lat": "28605310",
		"poke_lng": "-81198439",
		"poke_title": "Robocop",
		"poke_type": "1",
		"realrand": "627900405",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "robocop"
	},
	"38700741": {
		"poke_id": "38700741",
		"gym_team": "0",
		"poke_lat": "28599146",
		"poke_lng": "-81199423",
		"poke_title": "Ruschak&#039;s Requiem",
		"poke_type": "0",
		"realrand": "632288662",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ruschak-039-s-requiem"
	},
	"1091363": {
		"poke_id": "1091363",
		"gym_team": "0",
		"poke_lat": "28601396",
		"poke_lng": "-81202489",
		"poke_title": "Colbourn Hall Statue",
		"poke_type": "1",
		"realrand": "642246088",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "colbourn-hall-statue"
	},
	"38701164": {
		"poke_id": "38701164",
		"gym_team": "0",
		"poke_lat": "28603194",
		"poke_lng": "-81198440",
		"poke_title": "Metal Tree 2",
		"poke_type": "0",
		"realrand": "645494689",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "metal-tree-2"
	},
	"103982": {
		"poke_id": "103982",
		"gym_team": "0",
		"poke_lat": "28602204",
		"poke_lng": "-81197946",
		"poke_title": "Steel Teaching Sculpture",
		"poke_type": "1",
		"realrand": "654153019",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "steel-teaching-sculpture"
	},
	"913249": {
		"poke_id": "913249",
		"gym_team": "0",
		"poke_lat": "28600074",
		"poke_lng": "-81202910",
		"poke_title": "Howard Phillips Hall",
		"poke_type": "1",
		"realrand": "664158682",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "howard-phillips-hall"
	},
	"38701187": {
		"poke_id": "38701187",
		"gym_team": "0",
		"poke_lat": "28601345",
		"poke_lng": "-81196822",
		"poke_title": "CREOL Building at UCF",
		"poke_type": "0",
		"realrand": "668853196",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "creol-building-at-ucf"
	},
	"114416": {
		"poke_id": "114416",
		"gym_team": "0",
		"poke_lat": "28602800",
		"poke_lng": "-81203533",
		"poke_title": "Narrative Sculptures",
		"poke_type": "1",
		"realrand": "670698646",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "narrative-sculptures"
	},
	"1054855": {
		"poke_id": "1054855",
		"gym_team": "0",
		"poke_lat": "28599807",
		"poke_lng": "-81201825",
		"poke_title": "UCF Reflection Pond",
		"poke_type": "2",
		"realrand": "674067024",
		"poke_enabled": "2",
		"confirm": 2,
		"cleantitle": "ucf-reflection-pond"
	},
	"1190447": {
		"poke_id": "1190447",
		"gym_team": "0",
		"poke_lat": "28600494",
		"poke_lng": "-81197371",
		"poke_title": "History of Electrical Engineering and Computer Science",
		"poke_type": "1",
		"realrand": "676660463",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "history-of-electrical-engineering-and-computer-science"
	},
	"644467": {
		"poke_id": "644467",
		"gym_team": "0",
		"poke_lat": "28602291",
		"poke_lng": "-81202536",
		"poke_title": "BHC Pegasus",
		"poke_type": "1",
		"realrand": "682504947",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "bhc-pegasus"
	},
	"38700743": {
		"poke_id": "38700743",
		"gym_team": "0",
		"poke_lat": "28599472",
		"poke_lng": "-81202039",
		"poke_title": "Reflection Pond Beautification Plaque",
		"poke_type": "0",
		"realrand": "686640397",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "reflection-pond-beautification-plaque"
	},
	"661111": {
		"poke_id": "661111",
		"gym_team": "0",
		"poke_lat": "28605097",
		"poke_lng": "-81198896",
		"poke_title": "Career Services",
		"poke_type": "1",
		"realrand": "697246063",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "career-services"
	},
	"38700756": {
		"poke_id": "38700756",
		"gym_team": "0",
		"poke_lat": "28601113",
		"poke_lng": "-81201573",
		"poke_title": "Dr. Washington Plaque",
		"poke_type": "0",
		"realrand": "701842927",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "dr-washington-plaque"
	},
	"736333": {
		"poke_id": "736333",
		"gym_team": "0",
		"poke_lat": "28602155",
		"poke_lng": "-81201703",
		"poke_title": "Koi Fish Pond",
		"poke_type": "1",
		"realrand": "705084532",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "koi-fish-pond"
	},
	"541619": {
		"poke_id": "541619",
		"gym_team": "0",
		"poke_lat": "28600804",
		"poke_lng": "-81202191",
		"poke_title": "Washington Pegasus",
		"poke_type": "1",
		"realrand": "707596069",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "washington-pegasus"
	},
	"944612": {
		"poke_id": "944612",
		"gym_team": "0",
		"poke_lat": "28602111",
		"poke_lng": "-81202560",
		"poke_title": "Wind Dancer Pegasus",
		"poke_type": "1",
		"realrand": "719269343",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "wind-dancer-pegasus"
	},
	"38700719": {
		"poke_id": "38700719",
		"gym_team": "0",
		"poke_lat": "28600939",
		"poke_lng": "-81199631",
		"poke_title": "Icons of Business&#039;s Changes",
		"poke_type": "0",
		"realrand": "727067540",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "icons-of-business-039-s-changes"
	},
	"30007": {
		"poke_id": "30007",
		"gym_team": "0",
		"poke_lat": "28599028",
		"poke_lng": "-81205620",
		"poke_title": "Main Entrance Pegasus",
		"poke_type": "1",
		"realrand": "770739572",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "main-entrance-pegasus"
	},
	"741352": {
		"poke_id": "741352",
		"gym_team": "0",
		"poke_lat": "28603735",
		"poke_lng": "-81198796",
		"poke_title": "Nesting",
		"poke_type": "1",
		"realrand": "784187381",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "nesting"
	},
	"358072": {
		"poke_id": "358072",
		"gym_team": "0",
		"poke_lat": "28601633",
		"poke_lng": "-81197603",
		"poke_title": "UCF Map Scorpious Court",
		"poke_type": "1",
		"realrand": "793837003",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "ucf-map-scorpious-court"
	},
	"327879": {
		"poke_id": "327879",
		"gym_team": "0",
		"poke_lat": "28600013",
		"poke_lng": "-81203686",
		"poke_title": "Recumbent Knight",
		"poke_type": "1",
		"realrand": "795659311",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "recumbent-knight"
	},
	"38701155": {
		"poke_id": "38701155",
		"gym_team": "0",
		"poke_lat": "28602078",
		"poke_lng": "-81200825",
		"poke_title": "UCF Student Union Metal Stars",
		"poke_type": "0",
		"realrand": "799836391",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-student-union-metal-stars"
	},
	"930368": {
		"poke_id": "930368",
		"gym_team": "0",
		"poke_lat": "28601904",
		"poke_lng": "-81200596",
		"poke_title": "Trio,  UCF Student Union",
		"poke_type": "1",
		"realrand": "801873751",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "trio-ucf-student-union"
	},
	"38701150": {
		"poke_id": "38701150",
		"gym_team": "0",
		"poke_lat": "28603055",
		"poke_lng": "-81198611",
		"poke_title": "Hpa Human Art",
		"poke_type": "0",
		"realrand": "809603886",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "hpa-human-art"
	},
	"76369": {
		"poke_id": "76369",
		"gym_team": "0",
		"poke_lat": "28599712",
		"poke_lng": "-81200553",
		"poke_title": "Foucault Pendulum",
		"poke_type": "1",
		"realrand": "815461599",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "foucault-pendulum"
	},
	"1074757": {
		"poke_id": "1074757",
		"gym_team": "0",
		"poke_lat": "28599463",
		"poke_lng": "-81201076",
		"poke_title": "Honor Garden",
		"poke_type": "1",
		"realrand": "852888947",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "honor-garden"
	},
	"907668": {
		"poke_id": "907668",
		"gym_team": "0",
		"poke_lat": "28600336",
		"poke_lng": "-81198711",
		"poke_title": "Bio Life",
		"poke_type": "1",
		"realrand": "854321972",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "bio-life"
	},
	"38700758": {
		"poke_id": "38700758",
		"gym_team": "0",
		"poke_lat": "28600944",
		"poke_lng": "-81201884",
		"poke_title": "UCF Bookstore Knightro",
		"poke_type": "0",
		"realrand": "857227240",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-bookstore-knightro"
	},
	"38701203": {
		"poke_id": "38701203",
		"gym_team": "0",
		"poke_lat": "28603804",
		"poke_lng": "-81200734",
		"poke_title": "Karen L. Smith Faculty Center for Teaching and Learning",
		"poke_type": "0",
		"realrand": "858845888",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "karen-l-smith-faculty-center-for-teaching-and-learning"
	},
	"655509": {
		"poke_id": "655509",
		"gym_team": "0",
		"poke_lat": "28599818",
		"poke_lng": "-81203674",
		"poke_title": "Bishop and Queen",
		"poke_type": "1",
		"realrand": "879235163",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "bishop-and-queen"
	},
	"756957": {
		"poke_id": "756957",
		"gym_team": "0",
		"poke_lat": "28603561",
		"poke_lng": "-81199454",
		"poke_title": "Veterans Commemorative Site",
		"poke_type": "2",
		"realrand": "888271578",
		"poke_enabled": "2",
		"confirm": 2,
		"cleantitle": "veterans-commemorative-site"
	},
	"38700763": {
		"poke_id": "38700763",
		"gym_team": "0",
		"poke_lat": "28599562",
		"poke_lng": "-81201259",
		"poke_title": "John R. Bolte Dedication",
		"poke_type": "0",
		"realrand": "888998479",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "john-r-bolte-dedication"
	},
	"342075": {
		"poke_id": "342075",
		"gym_team": "0",
		"poke_lat": "28604122",
		"poke_lng": "-81198801",
		"poke_title": "Shield Walkway",
		"poke_type": "1",
		"realrand": "907248462",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "shield-walkway"
	},
	"1180417": {
		"poke_id": "1180417",
		"gym_team": "0",
		"poke_lat": "28604783",
		"poke_lng": "-81203392",
		"poke_title": "Lake Claire Mail Office",
		"poke_type": "1",
		"realrand": "916527474",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "lake-claire-mail-office"
	},
	"38701102": {
		"poke_id": "38701102",
		"gym_team": "0",
		"poke_lat": "28604419",
		"poke_lng": "-81203405",
		"poke_title": "Dr John C Hitt Memorial",
		"poke_type": "0",
		"realrand": "932024095",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "dr-john-c-hitt-memorial"
	},
	"876155": {
		"poke_id": "876155",
		"gym_team": "0",
		"poke_lat": "28602412",
		"poke_lng": "-81204151",
		"poke_title": "Cyclorama",
		"poke_type": "1",
		"realrand": "936113727",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "cyclorama"
	},
	"38701097": {
		"poke_id": "38701097",
		"gym_team": "0",
		"poke_lat": "28602629",
		"poke_lng": "-81203387",
		"poke_title": "Painting the World as It Turns",
		"poke_type": "0",
		"realrand": "979588395",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "painting-the-world-as-it-turns"
	},
	"38701196": {
		"poke_id": "38701196",
		"gym_team": "0",
		"poke_lat": "28605356",
		"poke_lng": "-81198920",
		"poke_title": "UCF Alumni Center",
		"poke_type": "0",
		"realrand": "987498873",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "ucf-alumni-center"
	},
	"919596": {
		"poke_id": "919596",
		"gym_team": "0",
		"poke_lat": "28601169",
		"poke_lng": "-81197369",
		"poke_title": "Sail",
		"poke_type": "1",
		"realrand": "993034115",
		"poke_enabled": "2",
		"confirm": 1,
		"cleantitle": "sail"
	},
	"38701214": {
		"poke_id": "38701214",
		"gym_team": "0",
		"poke_lat": "28603491",
		"poke_lng": "-81198865",
		"poke_title": "Earthy Knights",
		"poke_type": "0",
		"realrand": "999424365",
		"poke_enabled": "8",
		"confirm": 0,
		"cleantitle": "earthy-knights"
	}
}
