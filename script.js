window.addEventListener("DOMContentLoaded", init);

const version = "0.6";
const settingsBlank = JSON.stringify({
	"version": version,
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

var storage = window.localStorage;
var secretLoad = false;

if (storage.getItem("settings")) {
	try {
		settings = JSON.parse(storage.getItem("settings"));
		if (settings.version != version) {
			console.log("Settings is out of date. Here's old settings, just so you can copy it:\n");
			console.log(JSON.stringify(settings));
			settings = JSON.parse(settingsBlank);
			saveSettings();
		}
	} catch(error) {
		console.log("Settings item is missing or corrupt.\n" + error);
		settings = JSON.parse(settingsBlank);
		saveSettings();
	}
} else {
	console.log("No settings, making a new one");
	settings = JSON.parse(settingsBlank);
	saveSettings();
}

var blurOverride = false;

function init() {
	clean(document.body);
	
	background = {
		current: null,
		element: document.body //hmm
	}
	
	secretContent = document.getElementById("content");
	
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
	
	icons = {
		parent: document.getElementById("icons"),
		elements: document.getElementsByClassName("icon")
	};
	
	// Clock
	clock.blink.innerHTML = ":";
	
	// Search
	search.parent.addEventListener("submit", function() {doSearch(false);});
	
	if (settings.search.focus) {
		search.box.focus();
		search.box.select();
	}
	
	// CSS Rule map:
	// 0 - 5: icons
	// 6: background
	for (i = 0; i < 6; i++)
		document.styleSheets[0].insertRule("a.icon.icon" + i + ":hover, a.icon.icon" + i + ".contextopen {}", i);
	document.styleSheets[0].insertRule("body {}", 6);
	
	updateBackground();
	updateClock();
	updateIcons();
	
	// Context menu fun
	background.element.addEventListener("contextmenu", function(event) {
		if (event.target === background.element) {
			context([
				{
					name: "Change background set",
					callback: function(event, options) {
						var i;
						var optionList = [
							[
								{"type": "image", "src": "background-new1.jpg"},
								{"type": "image", "src": "background-new2.jpg"},
								{"type": "image", "src": "background-new3.jpg"}
							],
							[
								{"type": "image", "src": "background1.jpg"},
								{"type": "image", "src": "background2.jpg"},
								{"type": "image", "src": "background3.jpg"}
							],
							[
								{"type": "gradient", "from": "#283c86", "to": "#45a247", "angle": "100deg"},
								{"type": "gradient", "from": "#c21500", "to": "#ffc500", "angle": "200deg"},
								{"type": "gradient", "from": "#5c258d", "to": "#4389a2", "angle": "300deg"}
							]
						];
						
						for (i = 0; i < optionList.length; i++) {
							if (JSON.stringify(settings.backgrounds) === JSON.stringify(optionList[i])) {
								settings.backgrounds = optionList[mod(i + 1, optionList.length)];
								break;
							}
						}
						
						if (i === optionList.length)
							settings.backgrounds = optionList[0];
						
						updateBackground();
						saveSettings();
					}
				},
				{
					name: "Change theme",
					callback: function(event, options) {
						var optionList = ["dark", "light"];
						
						document.body.parentNode.classList.remove(settings.theme);
						
						settings.theme = optionList[mod(optionList.indexOf(settings.theme) + 1, optionList.length)];
						
						document.body.parentNode.classList.add(settings.theme);
						saveSettings();
					}
				},
				{},
				{
					name: "NewerTab v" + version,
					callback: function(event, options) {
						location.assign("https://github.com/TheV360/NewerTab#newertab");
					}
				},
				{
					name: "By V360",
					callback: function(event, options) {
						location.assign("https://thev360.github.io");
					}
				}
			], {x: event.clientX, y: event.clientY, origin: background.element});
			
			event.preventDefault();
		}
		return false;
	});
	secretContent.addEventListener("contextmenu", function(event) {
		if (event.target === secretContent) {
			var itemList = [
				{
					"name": "Secret Bonus Menu!"
				},
				{},
				{
					"name": "Directly edit JSON settings",
					"callback": function(event, options) {
						var old = JSON.stringify(settings);
						var tmp = old;
						
						tmp = prompt("JSON data here, I'mJustGoingToMakeThisDialogReallyLongForDesktopUsersMobileUsersAreOutOfLuck", tmp);
						
						if (tmp === "") tmp = old;
						
						console.log("old version");
						console.log(old);
						console.log("\nnew version");
						console.log(tmp);
					}
				},
				{
					"name": "Create another context menu",
					"callback": loadSecret
				},
				{},
				{
					"name": "Delete everything",
					"callback": function(event, options) {
						if (confirm("Are you sure?"))
							if (confirm("Really sure?"))
								if (!confirm("Are you not sure?")) {
									console.log("Backup:");
									console.log(JSON.stringify(settings));
									localStorage.removeItem("settings");
									alert("deleted");
								}
					}
				}
			];
			
			if (secretLoad)
				itemList[3].callback = startSecret;
			
			context(itemList, {x: event.clientX, y: event.clientY, origin: secretContent});
			
			event.preventDefault();
			return false;
		}
	});
	clock.parent.addEventListener("contextmenu", function(event) {
		context([
			{
				name: "Toggle seconds",
				callback: function(event, options) {
					settings.clock.seconds = !settings.clock.seconds;
					
					saveSettings();
				}
			},
			{
				name: "Toggle military time",
				callback: function(event, options) {
					settings.clock.military = !settings.clock.military;
					
					saveSettings();
				}
			},
			{
				name: "Change date in search bar",
				callback: function(event, options) {
					var optionList = ["none", "short", "long"];
					settings.search.date = optionList[mod(optionList.indexOf(settings.search.date) + 1, optionList.length)];
					
					saveSettings();
				}
			}
		], {x: event.clientX, y: event.clientY, origin: clock.parent});
		
		event.preventDefault();
		return false;
	});
	search.box.addEventListener("contextmenu", function(event) {
		context([
			{
				name: "Search",
				callback: function(event, options) {
					doSearch(false);
				}
			},
			{
				name: "Search in new tab",
				callback: function(event, options) {
					doSearch(true);
				}
			},
			{},
			{
				name: "Toggle focus on open",
				callback: function(event, options) {
					settings.search.focus = !settings.search.focus;
					
					saveSettings();
				}
			},
			{
				name: "Edit provider URL",
				callback: function(event, options) {
					settings.search.provider = prompt("What's the provider URL?\n\nUse %s as a substitute for the actual search.", settings.search.provider);
					
					saveSettings();
				}
			}
		], {x: event.clientX, y: event.clientY, origin: search.box});
		
		event.preventDefault();
		return false;
	});
	icons.parent.addEventListener("contextmenu", function(event) {
		var source = getParentWithTagName(event.target, "a");
		
		context([
			{
				name: "Open link",
				callback: function(event, options) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(options.origin);
					
					location.assign(settings.icons[iconIndex].link);
				}
			},
			{
				name: "Open link in new tab",
				callback: function(event, options) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(options.origin);
					
					window.open(settings.icons[iconIndex].link);
				}
			},
			{},
			{
				name: "Edit icon",
				callback: function(event, options) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(options.origin);
					
					settings.icons[iconIndex].link = prompt("What's the website link?", settings.icons[iconIndex].link);
					settings.icons[iconIndex].icon = prompt("What's the SVG?\n\nYou can use font awesome as fa-solid.svg, fa-regular.svg, and fa-brands.svg!", settings.icons[iconIndex].icon);
					settings.icons[iconIndex].highlight = prompt("What's the website color?", settings.icons[iconIndex].highlight);
					
					updateIcons();
					saveSettings();
				}
			}
		], {x: event.clientX, y: event.clientY, origin: source});
		
		event.preventDefault();
		return false;
	});
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
	
	window.requestAnimationFrame(updateClock);
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

function context(items = [{name: "No options?", callback: function() {}}], options) {
	if (options.origin)
		options.origin.classList.add("contextopen");
	
	var contextlist = document.createElement("ul");
	
	contextlist.className = "contextlist";
	contextlist.tabIndex = 100;
	
	if (options.x)
		contextlist.style.left = (options.x - 4) + "px";
	if (options.y)
		contextlist.style.top = (options.y - 4) + "px";
	
	for (var i = 0; i < items.length; i++) {
		var contextoption = contextOption(items[i], options);
		
		contextoption = contextlist.appendChild(contextoption);
	}
	
	contextlist.addEventListener("blur", function(event) {
		var deletThis = event.target;
		
		if (blurOverride) {
			deletThis.focus();
		} else {
			while (deletThis.parentNode != document.body)
				deletThis = deletThis.parentNode;
			
			if (options.origin)
				options.origin.classList.remove("contextopen");
			
			deletThis.remove();
		}
	});
	
	if (options.parent)
		contextlist = options.parent.appendChild(contextlist);
	else
		contextlist = document.body.appendChild(contextlist);
	
	var contextfit = contextlist.getBoundingClientRect();
	
	if (contextfit.x + contextfit.width > window.innerWidth)
		contextlist.style.left = (window.innerWidth - contextfit.width) + "px";
	if (contextfit.y + contextfit.height > window.innerHeight)
		contextlist.style.top = (window.innerHeight - contextfit.height) + "px";
	
	contextlist.focus();
	
	return contextlist;
}

// Small hack fixing a variable scope problem
function contextOption(item, options) {
	var contextoption;
	var callback;
	
	if (item.callback) {
		callback = item.callback;
		
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.addEventListener("click", function(event) {callback(event, options);});
		contextoption.addEventListener("contextmenu", function(event) {callback(event, options); event.preventDefault(); return false;});
	} else if (item.name) {
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.classList.add("contextdisabled");
	} else {
		contextoption = document.createElement("hr");
	}
	
	return contextoption;
}

function loadSecret(event, options) {
	if (!secretLoad) {
		var secretScript = document.createElement("script");
		
		secretScript.type = "text/ecmascript";
		secretScript.addEventListener("load", function(event) {startSecret(event, options);});
		secretScript.src = "ignore.js";
		
		document.body.appendChild(secretScript);
		secretLoad = true;
	}
	
	event.preventDefault();
	return false;
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
