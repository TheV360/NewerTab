"use strict";

window.addEventListener("DOMContentLoaded", setup);

const version = "0.6.2";
const date = {
	day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

var storage = window.localStorage;
var settings = {};

function loadSettings(additional) {
	var validSettings = false;
	
	if (storage.getItem("settings")) {
		try {
			settings = JSON.parse(storage.getItem("settings"));
			if (settings.version != version)
				console.log("Settings is out of date. Here's old settings, just so you can copy it:\n\n" + JSON.stringify(settings));
		 	else
				validSettings = true;
		} catch(error) {
			console.log("Settings item is missing or corrupt.\n" + error);
		}
	}

	if (!validSettings) {
		document.body.classList.add("loading");
		loadJSON("default.json", (response)=>{
			settings = JSON.parse(response);
			settings.version = version;
			
			saveSettings();
			
			document.body.parentNode.classList.add(settings.theme);
			document.body.classList.remove("loading");
			additional();
		});
	} else {
		document.body.parentNode.classList.add(settings.theme);
	}
	
	return validSettings;
}

loadSettings(()=>{setup();});

// Normal Programming Stuff
var i, j;

// Normal NewerTab stuff
var background, popup, clock, search, icons;

// Secret trash
var secretContent;
var secretLoad = false;

// Hacks
var blurOverride = false;

function setup() {
	clean(document.body);
	
	background = {
		current: null,
		element: document.body //hmm
	}
	
	popup = {
		parent: document.getElementById("popup"),
		header: document.getElementById("popupheader"),
		content: document.getElementById("popupcontent"),
		title: document.getElementById("popuptitle"),
		close: document.getElementById("popupclose")
	};
	
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
	
	// Popup
	popup.close.addEventListener("click", function() {
		saveSettings();
		popup.parent.classList.remove("show");
		popup.title.innerHTML = "";
		popup.content.innerHTML = "";
	});
	
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
	for (var i = 0; i < 6; i++)
		document.styleSheets[0].insertRule("a.icon.icon" + i + ":hover, a.icon.icon" + i + ".contextopen {}", i);
	document.styleSheets[0].insertRule("body {}", 6);
	
	updateBackground();
	updateClock();
	updateIcons();
	
	// Context menu fun
	background.element.addEventListener("contextmenu", (event)=>{
		if (event.target === background.element) {
			context([
				{
					name: "Look and Feel settings...",
					callback: function(event, options) {
						var setIndex;
						var setList = [
							[
								{"type": "image", "src": "img/newer/1.jpg"},
								{"type": "image", "src": "img/newer/2.jpg"},
								{"type": "image", "src": "img/newer/3.jpg"}
							],
							[
								{"type": "image", "src": "img/new/1.jpg"},
								{"type": "image", "src": "img/new/2.jpg"},
								{"type": "image", "src": "img/new/3.jpg"}
							],
							[
								{"type": "gradient", "from": "#283c86", "to": "#45a247", "angle": "100deg"},
								{"type": "gradient", "from": "#c21500", "to": "#ffc500", "angle": "200deg"},
								{"type": "gradient", "from": "#5c258d", "to": "#4389a2", "angle": "300deg"}
							]
						];
						var themeList = ["dark", "light"];
						
						for (setIndex = 0; i < setList.length; i++)
							if (JSON.stringify(settings.backgrounds) === JSON.stringify(setList[setIndex]))
								break;
						
						if (setIndex === setList.length)
							settings.backgrounds = setList[0];
						
						makePopup("Look and Feel Settings", [
							{
								label: "Background set",
								type: "select",
								index: setIndex,
								options: [
									{
										label: "Newer Tab",
										value: 0
									},
									{
										label: "New Tab",
										value: 1
									},
									{
										label: "Gradients",
										value: 2
									}
								],
								callback: (event)=>{
									console.log(event.target.value);
									settings.backgrounds = setList[event.target.value];
									
									updateBackground();
								}
							},
							{
								label: "Theme",
								type: "select",
								index: themeList.indexOf(settings.theme),
								options: [
									{
										label: "Dark",
										value: "dark"
									},
									{
										label: "Light",
										value: "light"
									}
								],
								callback: (event)=>{
									document.body.parentNode.classList.remove(settings.theme);
									settings.theme = event.target.value;
									document.body.parentNode.classList.add(settings.theme);
									
									updateBackground();
								}
							}
						]);
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
	secretContent.addEventListener("contextmenu", (event)=>{
		if (event.target === secretContent) {
			var itemList = [
				{
					name: "Secret Bonus Menu!"
				},
				{},
				{
					name: "Directly edit JSON settings...",
					callback: function(event, options) {
						var old = JSON.stringify(settings, null, "\t");
						var tmp = old;
						
						makePopup("JSON Settings", [
							{
								label: "Data",
								type: "textarea",
								value: tmp,
								callback: (event)=>{
									try {
										tmp = JSON.parse(event.target.value);
										
										console.log("old version");
										console.log(old);
										console.log("\nnew version");
										console.log(tmp);
									} catch (error) {
										console.log("parsing error! " + error);
									}
									
									settings = tmp;
								}
							}
						]);
					}
				},
				{
					name: "Create another context menu",
					callback: loadSecret
				},
				{},
				{
					name: "Delete everything",
					callback: function(event, options) {
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
	clock.parent.addEventListener("contextmenu", (event)=>{
		var dateList = ["none", "short", "long"];
		context([
			{
				name: "Clock settings...",
				callback: function(event, options) {
					makePopup("Clock Settings", [
						{
							label: "Show seconds",
							type: "checkbox",
							checked: settings.clock.seconds,
							callback: (event)=>{
								settings.clock.seconds = !settings.clock.seconds;
								event.target.checked = settings.clock.seconds;
							}
						},
						{
							label: "Show military time",
							type: "checkbox",
							checked: settings.clock.military,
							callback: (event)=>{
								settings.clock.military = !settings.clock.military;
								event.target.checked = settings.clock.military;
							}
						},
						{
							label: "Date in search bar",
							type: "select",
							index: dateList.indexOf(settings.search.date),
							options: [
								{
									label: "None",
									value: "none"
								},
								{
									label: "Short",
									value: "short"
								},
								{
									label: "Long",
									value: "long"
								}
							],
							callback: (event)=>{
								settings.search.date = event.target.value;
							}
						},
					]);
				}
			}
		], {x: event.clientX, y: event.clientY, origin: clock.parent});
		
		event.preventDefault();
		return false;
	});
	search.box.addEventListener("contextmenu", (event)=>{
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
				name: "Search settings...",
				callback: function(event, options) {
					makePopup("Search settings", [
						{
							label: "Focus on open",
							type: "checkbox",
							checked: settings.search.focus,
							callback: (event)=>{
								settings.search.focus = !settings.search.focus;
								event.target.checked = settings.search.focus;
							}
						},
						{
							label: "Edit provider URL",
							type: "text",
							value: settings.search.provider,
							callback: (event)=>{
								settings.search.provider = event.target.value;
							}
						}
					]);
				}
			}
		], {x: event.clientX, y: event.clientY, origin: search.box});
		
		event.preventDefault();
		return false;
	});
	icons.parent.addEventListener("contextmenu", (event)=>{
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
				name: "Icon settings...",
				callback: function(event, options) {
					// Massive hack
					var iconIndex = Array.from(icons.elements).indexOf(options.origin);
					
					makePopup("Icon settings", [
						{
							label: "Editing icon #" + (iconIndex + 1)
						},
						{
							label: "Link",
							type: "text",
							value: settings.icons[iconIndex].link,
							callback: (event)=>{
								settings.icons[iconIndex].link = event.target.value;
								updateIcons();
							}
						},
						{
							label: "SVG Icon <a href=\"https://thev360.github.io/NewerTab/icons.html\">(?)</a>",
							type: "text",
							value: settings.icons[iconIndex].icon,
							callback: (event)=>{
								settings.icons[iconIndex].icon = event.target.value;
								updateIcons();
							}
						},
						{
							label: "Highlight Color",
							type: "color",
							value: settings.icons[iconIndex].highlight,
							callback: (event)=>{
								settings.icons[iconIndex].highlight = event.target.value;
								updateIcons();
							}
						}
					]);
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
	
	if (isNumber(options.x))
		contextlist.style.left = (options.x - 4) + "px";
	if (isNumber(options.y))
		contextlist.style.top = (options.y - 4) + "px";
	
	for (var i = 0; i < items.length; i++) {
		var contextoption = contextOption(items[i], options);
		
		contextoption = contextlist.appendChild(contextoption);
	}
	
	contextlist.addEventListener("blur", (event)=>{
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
function contextOption(item, options) {
	var contextoption;
	var callback;
	
	if (item.callback) {
		callback = item.callback;
		
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.addEventListener("click", (event)=>{callback(event, options);});
		contextoption.addEventListener("contextmenu", (event)=>{callback(event, options); event.preventDefault(); return false;});
	} else if (item.name) {
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.classList.add("contextdisabled");
	} else {
		contextoption = document.createElement("hr");
	}
	
	return contextoption;
}

function makePopup(title, items = [{name: "nothing"}]) {
	popup.title.innerHTML = title;
	popup.content.innerHTML = "";
	
	for (var i = 0; i < items.length; i++) {
		popup.content.appendChild(popupItem(items[i], i));
	}
	
	popup.parent.classList.add("show");
	popup.close.focus();
}
function popupItem(item, index) {
	var set = document.createElement("div");
	var label, input;
	var option;
	var callback;
	
	set.className = "popupset";
	
	if (item.label) {
		label = document.createElement("label");
		label.htmlFor = "popupoption" + index;
		
		label.innerHTML = item.label;
	}
	
	if (item.type) {
		if (item.type === "select") {
			input = document.createElement("select");
			
			if (item.options)
				for (var i = 0; i < item.options.length; i++) {
					var option = document.createElement("option");
				
					if (item.options[i].label)
						option.innerHTML = item.options[i].label;
					
					if (item.options[i].value != undefined)
						option.value = item.options[i].value;
					
					if (item.options[i].default)
						option.selected = true;
					
					input.appendChild(option);
				}
				
				if (isNumber(item.index))
					input.selectedIndex = item.index;
		} else if (item.type === "textarea") {
			input = document.createElement("textarea");
			input.spellcheck = false;
			
			if (item.value)
				input.innerHTML = item.value;
			
			if (item.placeholder)
				input.placeholder = item.placeholder;
		} else {
			input = document.createElement("input");
			
			input.type = item.type;
			
			if (item.value != undefined)
				input.value = item.value;
			
			if (item.checked)
				input.checked = true;
			
			if (item.placeholder)
				input.placeholder = item.placeholder;
		}
		
		input.id = "popupoption" + index;
		input.tabIndex = 200 + index;
		
		if (item.callback) {
			callback = item.callback;
			input.addEventListener("change", function(event) {callback(event);});
		}
	}
	
	if (label) label = set.appendChild(label);
	if (input) input = set.appendChild(input);
	
	if (item.type === "checkbox")
		label = set.appendChild(label);
	
	return set;
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

function isNumber(n) {
	return !isNaN(n) && isFinite(n)
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
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

// Stolen from codepen.io
function loadJSON(file, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4 && xhr.status === 200)
			callback(xhr.responseText);
	}
	xhr.open("GET", file, true);
	xhr.send();
}
