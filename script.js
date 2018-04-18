window.addEventListener("load", init);

storage = window.localStorage;

const settingsBlank = JSON.stringify({
	"version": "beta or something",
	"theme": "dark",
	"backgrounds": [
		{
			"type": "image",
			"src": "background-new1.jpg"
		},
		{
			"type": "gradient",
			"from": "#1f2f3f",
			"to": "#000f1f",
			"angle": 0
		}
	],
	"clock": {
		"military": false,
		"seconds": false
	},
	"search": {
		"date": "long",
		"focus": false,
		"provider": "https://encrypted.google.com/search?q=%s",
	},
	"icons": [
		{
			"icon": "fa-brands.svg#youtube",
			"link": "https://www.youtube.com/feed/subscriptions",
			"highlight": "#ff0000"
		},
		{
			"icon": "fa-brands.svg#twitter",
			"link": "https://www.twitter.com/",
			"highlight": "#1da1f2"
		},
		{
			"icon": "fa-brands.svg#tumblr",
			"link": "https://www.tumblr.com",
			"highlight": "#36465d"
		},
		{
			"icon": "fa-brands.svg#reddit-alien",
			"link": "https://www.reddit.com",
			"highlight": "#ff4500"
		},
		{
			"icon": "fa-brands.svg#smilebasic-source",
			"link": "https://smilebasicsource.com/activity",
			"highlight": "#009688"
		},
		{
			"icon": "fa-brands.svg#github",
			"link": "https://www.github.com",
			"highlight": "#191717"
		}
	]
});

if (storage.getItem("settings"))
	try {
		settings = JSON.parse(storage.getItem("settings"));
	} catch(error) {
		console.log("Settings item is missing or corrupt.\n" + error);
		settings = JSON.parse(settingsBlank);
		saveSettings();
	}
else {
	console.log("No settings, making a new one");
	settings = JSON.parse(settingsBlank);
	saveSettings();
}

function init() {
	clean(document.body);
	
	clock = {
		hour: document.getElementById("hour"),
		blink: document.getElementById("blink"),
		minute: document.getElementById("minute"),
		second: document.getElementById("second"),
		suffix: document.getElementById("suffix")
	};
	
	date = {
		day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	};
	
	search = {
		parent: document.getElementById("search"),
		box: document.getElementById("searchbox")
	};
	
	// Clock
	clock.blink.innerHTML = ":";
	
	// Search
	search.parent.addEventListener("submit", doSearch);
	
	// Icons
	icons = document.getElementsByClassName("icon");
	
	updateClock();
	updateIcons();
}

function updateIcons() {
	var style;
	
	document.styleSheets[0].innerHTML = "";
	
	for (var i = 0; i < icons.length; i++) {
		// Set link
		console.log(settings.icons[i].link);
		icons[i].href = settings.icons[i].link;
		
		// Get icon color working
		icons[i].className = "icon icon" + i;
		//icons[i].dataset.highlight = settings.icons[i].highlight;
		style = "a.icon.icon" + i + ":hover { background-color: " + settings.icons[i].highlight + "; fill: " + settings.icons[i].highlight + "; }";
		document.styleSheets[0].insertRule(style);
		
		// Set icon
		icons[i].childNodes[0].childNodes[0].setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", settings.icons[i].icon);
	}
}

function updateClock() {
	var now = new Date();
	
	// Hour
	if (settings.clock.military)
		clock.hour.innerHTML = now.getHours();
	else
		clock.hour.innerHTML = ((now.getHours() - 1) % 12) + 1;
	
	// Blinking colon
	if (now.getSeconds() % 2 > 0 && !settings.clock.seconds)
		clock.blink.className = "off";
	else
		clock.blink.className = "on";
	
	// Minute
	clock.minute.innerHTML = ("0" + now.getMinutes()).slice(-2);
	
	// Second
	if (settings.clock.seconds)
		clock.second.innerHTML = ":" + ("0" + now.getSeconds()).slice(-2);
	else
		clock.second.innerHTML = "";
	
	// Suffix
	if (now.getHours() < 12)
		clock.suffix.innerHTML = " AM";
	else
		clock.suffix.innerHTML = " PM";
	
	// Date
	if (settings.search.date != "none") {
		search.box.className = "date";
		search.box.title = "Click to Search";
		
		if (settings.search.date == "long") {
			search.box.placeholder = date.day[now.getDay()] + ", " + date.month[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
		} else {
			search.box.placeholder = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
		}
	} else {
		search.box.className = "";
		search.box.title = "";
		search.box.placeholder = "Search";
	}
	
	window.setTimeout(updateClock, 100);
}

function doSearch(event) {
	window.open(settings.search.provider.replace("%s", encodeURIComponent(search.box.value)));
}

function saveSettings() {
	storage.setItem("settings", JSON.stringify(settings));
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
// I just fixed their awful formatting
// and made it not mess with syntax highlighting
function clean(node) {
	for (var n = 0; n < node.childNodes.length; n++) {
		var child = node.childNodes[n];
		
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			n--;
		} else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
			clean(child);
		}
	}
}
