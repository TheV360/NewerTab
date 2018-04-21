window.addEventListener("DOMContentLoaded", init);

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
			"type": "image",
			"src": "background-new2.jpg"
		},
		{
			"type": "image",
			"src": "background-new3.jpg"
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

const date = {
	day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

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
	
	background = {
		current: null,
		element: document.body //hmm
	}
	
	clock = {
		parent: document.getElementById("clock"),
		hour: document.getElementById("hour"),
		blink: document.getElementById("blink"),
		minute: document.getElementById("minute"),
		second: document.getElementById("second"),
		suffix: document.getElementById("suffix")
	};
	
	search = {
		parent: document.getElementById("search"),
		box: document.getElementById("searchbox")
	};
	
	// Background
	background.element.addEventListener("contextmenu", function(event) {
		if (event.target === background.element) {
			context(event.clientX, event.clientY, [
				{
					name: "Toggle background set",
					callback: function(event, origin) {
						var i;
						var optionList = [
							[
								{
									"type": "image",
									"src": "background-new1.jpg"
								},
								{
									"type": "image",
									"src": "background-new2.jpg"
								},
								{
									"type": "image",
									"src": "background-new3.jpg"
								}
							],
							[
								{
									"type": "image",
									"src": "background1.jpg"
								},
								{
									"type": "image",
									"src": "background2.jpg"
								},
								{
									"type": "image",
									"src": "background3.jpg"
								}
							],
							[
								{
									"type": "gradient",
									"from": "#283c86",
									"to": "#45a247",
									"angle": "100deg"
								},
								{
									"type": "gradient",
									"from": "#c21500",
									"to": "#ffc500",
									"angle": "200deg"
								},
								{
									"type": "gradient",
									"from": "#5c258d",
									"to": "#4389a2",
									"angle": "300deg"
								},
							]
						];
						
						for (i = 0; i < optionList.length; i++) {
							if (JSON.stringify(settings.backgrounds) === JSON.stringify(optionList[i])) {
								settings.backgrounds = optionList[mod(i + 1, optionList.length)];
								break;
							}
						}
						
						updateBackground();
						saveSettings();
					}
				},
				{
					name: "Toggle theme",
					callback: function(event, origin) {
						var optionList = ["dark", "light"];
						
						document.body.parentNode.classList.remove(settings.theme);
						
						settings.theme = optionList[mod(optionList.indexOf(settings.theme) + 1, optionList.length)];
						
						document.body.parentNode.classList.add(settings.theme);
						saveSettings();
					}
				},
				{
					name: "About NewerTab",
					callback: function(event, origin) {
						location.assign("https://github.com/TheV360/NewerTab#newertab");
					}
				}
			], background.element);
			
			event.preventDefault();
		}
		return false;
	});
	
	// Clock
	clock.blink.innerHTML = ":";
	clock.parent.addEventListener("contextmenu", function(event) {
		context(event.clientX, event.clientY, [
			{
				name: "Toggle seconds",
				callback: function(event, origin) {
					settings.clock.seconds = !settings.clock.seconds;
					
					saveSettings();
				}
			},
			{
				name: "Toggle military time",
				callback: function(event, origin) {
					settings.clock.military = !settings.clock.military;
					
					saveSettings();
				}
			},
			{
				name: "Change date in search bar",
				callback: function(event, origin) {
					var optionList = ["none", "short", "long"];
					settings.search.date = optionList[mod(optionList.indexOf(settings.search.date) + 1, optionList.length)];
					
					saveSettings();
				}
			}
		], clock.parent);
		
		event.preventDefault();
		return false;
	});
	
	// Search
	search.parent.addEventListener("submit", function() {doSearch(false);});
	search.box.addEventListener("contextmenu", function(event) {
		context(event.clientX, event.clientY, [
			{
				name: "Search",
				callback: function(event, origin) {
					doSearch(false);
				}
			},
			{
				name: "Search in new tab",
				callback: function(event, origin) {
					doSearch(true);
				}
			},
			{
				name: "Properties",
				callback: function(event, origin) {
					settings.search.provider = prompt("What's the provider URL?\n\nUse %s as a substitute for the actual search.", settings.search.provider);
					
					saveSettings();
				}
			}
		], search.box);
		
		event.preventDefault();
		return false;
	});
	
	if (settings.search.focus) {
		search.box.focus();
		search.box.select();
	}
	
	// Icons
	icons = {
		parent: document.getElementById("icons"),
		elements: document.getElementsByClassName("icon")
	};
	icons.parent.addEventListener("contextmenu", function(event) {
		var source = getParentWithTagName(event.target, "a");
		
		context(event.clientX, event.clientY, [
			{
				name: "Open link",
				callback: function(event, origin) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(origin);
					
					location.assign(settings.icons[iconIndex].link);
				}
			},
			{
				name: "Open link in new tab",
				callback: function(event, origin) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(origin);
					
					window.open(settings.icons[iconIndex].link);
				}
			},
			{
				name: "Edit icon",
				callback: function(event, origin) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(origin);
					
					settings.icons[iconIndex].link = prompt("What's the website link?", settings.icons[iconIndex].link);
					settings.icons[iconIndex].icon = prompt("What's the SVG?\n\nYou can use font awesome as fa-solid.svg, fa-regular.svg, and fa-brands.svg!", settings.icons[iconIndex].icon);
					settings.icons[iconIndex].highlight = prompt("What's the website color?", settings.icons[iconIndex].highlight);
					
					updateIcons();
					saveSettings();
				}
			}
		], source);
		
		event.preventDefault();
		return false;
	});
	
	// CSS Rule map:
	// 0 - 5: icons
	// 6: background
	for (i = 0; i < 6; i++)
		document.styleSheets[0].insertRule("a.icon.icon" + i + ":hover, a.icon.icon" + i + ".contextopen {}", i);
	document.styleSheets[0].insertRule("body {}", 6);
	
	updateBackground();
	updateClock();
	updateIcons();
}

function updateBackground() {
	background.current = Math.floor(Math.random() * settings.backgrounds.length);
	
	var currentBackground = settings.backgrounds[background.current];
	var style;
	
	if (currentBackground.type === "image") {
		style = "url(" + currentBackground.src + ")";
	} else if (currentBackground.type === "gradient") {
		style = "linear-gradient(" + currentBackground.angle + ", " + currentBackground.from +", " + currentBackground.to + ")";
	} else {
		style = "black";
	}
	document.styleSheets[0].cssRules[6].style.backgroundImage = style;
}

function updateIcons() {
	var style;
	
	for (var i = 0; i < icons.elements.length; i++) {
		// Set link
		console.log(settings.icons[i].link);
		icons.elements[i].href = settings.icons[i].link;
		
		// Get icon color working
		icons.elements[i].className = "icon icon" + i;
		document.styleSheets[0].cssRules[i].style.backgroundColor = settings.icons[i].highlight;
		document.styleSheets[0].cssRules[i].style.fill = settings.icons[i].highlight;
		
		// Set icon
		icons.elements[i].childNodes[0].childNodes[0].setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", settings.icons[i].icon);
	}
}

function updateClock() {
	var now = new Date();
	
	// Hour
	if (settings.clock.military)
		clock.hour.innerHTML = now.getHours();
	else
		clock.hour.innerHTML = mod((now.getHours() - 1), 12) + 1;
	
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
	if (settings.clock.military)
		clock.suffix.innerHTML = "";
	else
		if (now.getHours() < 12)
			clock.suffix.innerHTML = " AM";
		else
			clock.suffix.innerHTML = " PM";
	
	// Date
	if (settings.search.date != "none") {
		if (!search.box.classList.contains("date"))
			search.box.classList.add("date");
		search.box.title = "Click to Search";
		
		if (settings.search.date == "long") {
			search.box.placeholder = date.day[now.getDay()] + ", " + date.month[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
		} else {
			search.box.placeholder = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
		}
	} else {
		if (search.box.classList.contains("date"))
			search.box.classList.remove("date");
		search.box.title = "";
		search.box.placeholder = "Search";
	}
	
	window.setTimeout(updateClock, 100);
}

function doSearch(newtab = false) {
	if (search.box.value.length)
		if (newtab)
			window.open(settings.search.provider.replace("%s", encodeURIComponent(search.box.value)));
		else
			location.assign(settings.search.provider.replace("%s", encodeURIComponent(search.box.value)));
}

function saveSettings() {
	storage.setItem("settings", JSON.stringify(settings));
}

function context(x, y, options = [{name: "No options?", callback: function() {}}], origin) {
	origin.classList.add("contextopen");
	
	var contextlist = document.createElement("ul");
	
	contextlist.className = "contextlist";
	contextlist.style.left = (x - 4) + "px";
	contextlist.style.top = (y - 4) + "px";
	contextlist.tabIndex = 100;
	
	for (var i = 0; i < options.length; i++) {
		var contextoption = contextOption(options[i], origin);
		
		contextlist.appendChild(contextoption);
	}
	
	contextlist.addEventListener("blur", function(event) {
		origin.classList.remove("contextopen");
		event.target.remove();
	});
	
	contextlist = document.body.appendChild(contextlist);
	contextlist.style.setProperty("--tmp-size-width", contextlist.offsetWidth + "px");
	contextlist.style.setProperty("--tmp-size-height", contextlist.offsetHeight + "px");
	contextlist.focus();
}

// Small hack fixing a variable scope problem
function contextOption(option, origin) {
	var contextoption = document.createElement("li");
	var callback = option.callback;
	
	contextoption.innerHTML = option.name;
	contextoption.addEventListener("click", function(event) {callback(event, origin);});
	contextoption.addEventListener("contextmenu", function(event) {callback(event, origin); event.preventDefault(); return false;});
	
	return contextoption;
}

function getParentWithTagName(element, name) {
	var node = element;
	name = name.toUpperCase();
	while (node.parentNode != null) {
		if (node.tagName === name)
			return node;
		node = node.parentNode;
	}
	console.log("Couldn't find parent with name " + name + "!");
	return element;
}

function mod(n, m) {
	return ((n % m) + m) % m;
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
