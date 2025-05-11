"use strict";

const version = "0.8.0";
const date = {
	day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
const backgroundsets = [
	[
		{"type": "image", "src": "img/newer/1.jpg", "author": "John Towner", "link": "https://unsplash.com/photos/JgOeRuGD_Y4"},
		{"type": "image", "src": "img/newer/2.jpg", "author": "Alexander Slattery", "link": "https://unsplash.com/photos/LI748t0BK8w"},
		{"type": "image", "src": "img/newer/3.jpg", "author": "Marcelo Quinan", "link": "https://unsplash.com/photos/R3pUGn5YiTg"},
		{"type": "image", "src": "img/newer/4.jpg", "author": "Sophie Dale", "link": "https://unsplash.com/photos/4wG_qIjrd5U"}
	],
	[
		{"type": "image", "src": "img/new/1.jpg", "author": "Joey Kyber", "link": "https://www.pexels.com/photo/time-lapse-cars-on-fast-motion-134643/"},
		{"type": "image", "src": "img/new/2.jpg", "author": "Nodar Chernishev", "link": "https://www.pexels.com/photo/architecture-blur-bridge-buildings-390023/"},
		{"type": "image", "src": "img/new/3.jpg", "author": "Karol D.", "link": "https://www.pexels.com/photo/blur-cars-city-commuting-409701/"},
		{"type": "image", "src": "img/new/4.jpg", "author": "Tobias-Steinert", "link": "https://www.pexels.com/photo/light-trails-on-road-at-night-315939/"}
	],
	[
		{"type": "gradient", "from": "#283c86", "to": "#45a247", "angle": "100deg", "author": "uiGradients", "link": "https://uigradients.com/#Meridian"},
		{"type": "gradient", "from": "#c21500", "to": "#ffc500", "angle": "200deg", "author": "uiGradients", "link": "https://uigradients.com/#Kyoto"},
		{"type": "gradient", "from": "#5c258d", "to": "#4389a2", "angle": "300deg", "author": "uiGradients", "link": "https://uigradients.com/#ShroomHaze"}
	],
	[
		{"type": "reddit", "src": "EarthPorn", "offsetrandom": 5}
	]
];

var storage = window.localStorage;
var settings = {};

function loadSettings(andThen) {
	var validSettings = false;
	
	if (storage.getItem("settings")) {
		try {
			settings = JSON.parse(storage.getItem("settings"));
			if (settings.version !== version) {
				console.log("Settings is out of date. Here's old settings, just so you can copy it:\n\n" + JSON.stringify(settings));
			} else {
				validSettings = true;
			}
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
			
			document.body.classList.remove("loading");
			andThen();
		});
	} else {
		andThen();
	}
	
	return validSettings;
}

loadSettings(setup);

// Normal NewerTab stuff
var background, backgroundinfo, popup, clock, search, icons;
var fadeout;

// Secret trash
var secretContent;
var secretLoad = false;

// Style sheet stuff
var internalStyles, customStylesElement;

// Hacks
var blurOverride = false;

function setup() {
	// Remove all empty whitespace nodes.
	clean(document.body);
	
	// Add animations class if you have animations enabled.
	document.body.parentNode.classList.add(settings.theme);
	if (settings.animations) document.body.parentNode.classList.add("animations");
	if (settings.quickblur) document.body.parentNode.classList.add("quickblur");
	
	// Set up all these things
	setupElementReferences();
	
	// Set up general event listeners
	setupElementEventListeners();
	
	// Set up context menus
	setupElementContextMenus();
	
	// Set up "dynamic" CSS & custom CSS
	updateCSS();
	
	// Focus search box if you selected that option.
	if (settings.search && settings.search.focus) {
		search.box.focus();
		search.box.select();
	}
	
	updateBackground();
	updateClock();
	updateIcons();
	
	if (document.querySelector("style.darkreader")) {
		makePopup("Dark Reader Support", [
			{
				type: "notice",
				value: "Hey! This site looks horrible with Dark Reader on, so it would be best to disable it. Thanks for using NewerTab!"
			}
		]);
	}
	
	setup = undefined;
}

function setupElementReferences() {
	background = {
		element: document.body //hmm
	}
	
	customStylesElement = document.getElementById("custom-styles");
	
	fadeout = document.getElementById("fadeout");
	
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
}

function setupElementEventListeners() {
	// Transition fix
	window.addEventListener("pageshow", ()=>{
		fadeout.classList.remove("on");
	});
	
	// Popup
	popup.close.addEventListener("click", ()=>{
		saveSettings();
		popup.parent.classList.remove("show");
		popup.title.innerHTML = "";
		popup.content.innerHTML = "";
	});
	
	// Search
	search.box.addEventListener("input", ()=>{
		if (search.box.value.length) {
			search.box.classList.add("text");
		} else {
			search.box.classList.remove("text");
		}
	});
	search.parent.addEventListener("submit", ()=>{doSearch(false);});
	
	// My attempt at a closure.
	function makeIconHandler(index) {
		return (e)=>{
			if (e.button === 0 && settings.transitions) {
				transitionTo(icons.elements[index].href);
				e.preventDefault();
			}
		};
	}
	
	// Icons
	for (var i = 0; i < icons.elements.length; i++) {
		icons.elements[i].addEventListener("click", makeIconHandler(i));
	}
}
function setupElementContextMenus() {
	background.element.addEventListener("contextmenu", (event)=>{
		if (event.target === background.element) {
			var itemList = [
				{
					name: "Look and Feel settings...",
					callback: function(event, options) {
						var setIndex;
						var themeList = ["dark", "light", "darkclear", "lightclear"];
						
						for (setIndex = 0; setIndex < backgroundsets.length; setIndex++)
							if (JSON.stringify(settings.backgrounds) === JSON.stringify(backgroundsets[setIndex]))
								break;
						
						makePopup("Look and Feel Settings", [
							{
								label: "Animations",
								type: "checkbox",
								checked: settings.animations,
								callback: (event)=>{
									settings.animations = !settings.animations;
									event.target.checked = settings.animations;
									
									document.body.parentNode.classList.toggle("animations");
								}
							},
							{
								label: "Transitions",
								type: "checkbox",
								checked: settings.transitions,
								callback: (event)=>{
									settings.transitions = !settings.transitions;
									event.target.checked = settings.transitions;
								}
							},
							{
								label: "Quick Blur (only on static background sets) <a href=\"https://thev360.github.io/NewerTab/quickblur.html\">(?)</a>",
								type: "checkbox",
								checked: settings.quickblur,
								disabled: setIndex > 1,
								callback: (event)=>{
									settings.quickblur = !settings.quickblur;
									event.target.checked = settings.quickblur;
									
									document.body.parentNode.classList.toggle("quickblur");
									
									updateBackground();
								}
							},
							{
								label: "Background set",
								type: "select",
								index: setIndex,
								options: [
									{ label: "NewerTab (Landscapes)", value: 0 },
									{ label: "New Tab (Cityscapes)", value: 1 },
									{ label: "Gradients", value: 2 },
									{ label: "EarthPorn (Reddit)", value: 3 }
								],
								callback: (event)=>{
									settings.backgrounds = backgroundsets[event.target.value];
									
									if (event.target.value > 1) settings.quickblur = false;
									
									updateBackground();
								}
							},
							{
								label: "Theme",
								type: "select",
								index: themeList.indexOf(settings.theme),
								options: [
									{ label: "Dark", value: "dark" },
									{ label: "Light", value: "light" },
									{ label: "Dark Clear", value: "darkclear" },
									{ label: "Light Clear", value: "lightclear" }
								],
								callback: (event)=>{
									document.body.parentNode.classList.remove(settings.theme);
									settings.theme = event.target.value;
									document.body.parentNode.classList.add(settings.theme);
								}
							},
							{
								type: "notice",
								value: "Advanced CSS settings below! Do not edit if you don't know what you're doing! Also, put <code>:root</code> in front of selectors to have them more easily override NewerTab's default styles."
							},
							{
								label: "Custom CSS",
								type: "textarea",
								value: settings.css,
								height: "8em",
								callback: (event)=>{
									settings.css = event.target.value;
									updateCustomCSS();
								}
							}
						]);
					}
				},
				{},
				{
					name: "NewerTab v" + version,
					callback: goToLink("https://github.com/TheV360/NewerTab#newertab")
				},
				{
					name: "By V360",
					callback: goToLink("https://thev360.github.io")
				}
			];
			
			if (backgroundinfo) {
				itemList.splice(1, 0, {});
				itemList.splice(2, 0, {
					name: "Background by<br />" + backgroundinfo.author,
					callback: goToLink(backgroundinfo.link)
				});
			}
			
			context(itemList, {x: event.clientX, y: event.clientY, origin: background.element});
			
			event.preventDefault();
		}
		return false;
	});
	secretContent.addEventListener("contextmenu", (event)=>{
		if (event.target === secretContent) {
			var itemList = [
				{ name: "Secret Bonus Menu!" },
				{},
				{
					name: "Directly edit JSON settings...",
					callback: ()=>{
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
				{ name: "Create another context menu", callback: loadSecret },
				{
					name: "Debug RPG",
					callback: (event)=>{ // Whoops
						if (prompt("What's the password, the one that's definitely not stored in plaintext?") === "☺") {
							if (confirm("Reset?")) {
								localStorage.removeItem("secret");
								loadSecret(event);
							}
							
							window.setTimeout(()=>{
								loadSecret2(0);
								playSecret2();
							}, 0.5e3);
						} else {
							alert("Nope, try again.");
						}
					}
				},
				{},
				{
					name: "Delete everything",
					callback: ()=>{
						if (confirm("Are you sure?"))
							if (confirm("Really sure?"))
								if (!confirm("Are you not sure?")) {
									console.log("Backup:");
									console.log(JSON.stringify(settings));
									localStorage.removeItem("settings");
									alert("Deleted. Reload page to get defaults.");
								}
					}
				}
			];
			
			if (secretLoad) itemList[3].callback = startSecret;
			
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
								{label: "None", value: "none"},
								{label: "Short", value: "short"},
								{label: "Long", value: "long"}
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
			{ name: "Search", callback: (event, options)=>{ doSearch(false); } },
			{ name: "Search in new tab", callback: (event, options)=>{ doSearch(true); } },
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
							type: "notice",
							value: "Editing icon #" + (iconIndex + 1)
						},
						{
							label: "Link",
							type: "text",
							value: settings.icons[iconIndex].link,
							callback: (event)=>{
								settings.icons[iconIndex].link = event.target.value;
								updateIcon(iconIndex);
							}
						},
						{
							label: "SVG Icon <a href=\"https://thev360.github.io/NewerTab/icons.html\">(?)</a>",
							type: "text",
							value: settings.icons[iconIndex].icon,
							callback: (event)=>{
								settings.icons[iconIndex].icon = event.target.value;
								updateIcon(iconIndex);
							}
						},
						{
							label: "Highlight Color",
							type: "color",
							value: settings.icons[iconIndex].highlight,
							callback: (event)=>{
								settings.icons[iconIndex].highlight = event.target.value;
								updateIcon(iconIndex);
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
function updateCSS() {
	// CSS Rule map:
	// 	Custom Styles:
	// 		0 - NaN: All your styles.
	// 	Internal Styles:
	// 		0: Background
	// 		1+: Icons
	internalStyles = document.getElementById("internal-styles").sheet;
	
	while (internalStyles.cssRules.length > 0)
		internalStyles.deleteRule(0);
	
	internalStyles.insertRule("body {}", 0);
	for (var i = 0; i < 6; i++)
		internalStyles.insertRule("a.icon.icon" + i + ":hover, a.icon.icon" + i + ":focus, a.icon.icon" + i + ".contextopen {}", i + 1);
	
	// hopefully this is enough.
	updateCustomCSS();
}

function updateBackground() {
	var c = Math.floor(Math.random() * settings.backgrounds.length);
	
	var currentBackground = settings.backgrounds[c];
	var style = "black";
	
	if (currentBackground.type === "image") {
		style = "url(\"" + currentBackground.src + "\")";
		if (settings.quickblur) internalStyles.cssRules[0].style.setProperty("--blur-image", "url(\"../" + currentBackground.src.replace(".", "b.") + "\")");
		// Want to know why there's a ../ in there? Me too! It only works when that's there because of how CSS variables deal with URL values.
		// URL values are most likely internally stored as strings, until they're used like: `background-image: var(--blur-image);`.
		// The browser then actually searches out and finds the file.
		// I **think** this is to stop malicious people from loading a bunch of content you don't need.
		// Anyway, with my folder structure, the CSS that uses my CSS variable is in /css/. I assumed it would automatically know "we are in the root", but no.
		// It tried looking in /css/js/.
		//
		// Can I quit web development please?
		
		backgroundinfo = {
			author: currentBackground.author,
			link: currentBackground.link
		};
	} else if (currentBackground.type === "gradient") {
		if (!currentBackground.angle) currentBackground.angle = "90deg";
		
		if (currentBackground.from && currentBackground.to) {
			style = "linear-gradient(" + currentBackground.angle + ", " + currentBackground.from +", " + currentBackground.to + ")";
		} else if (currentBackground.stops) {
			style = "linear-gradient(" + currentBackground.angle;
			
			for (var i = 0; i < currentBackground.stops.length; i++) {
				style += ", " + currentBackground.stops[i].color + " " + currentBackground.stops[i].percentage;
			}
			
			style += ")";
		} else {
			console.log("Invalid gradient.");
		}
		
		backgroundinfo = {
			author: currentBackground.author,
			link: currentBackground.link
		};
	} else if (currentBackground.type === "reddit") {
		getFromReddit(currentBackground);
	} else if (currentBackground.type === "tumblr") {
		getFromTumblr(currentBackground);
	}
	
	internalStyles.cssRules[0].style.backgroundImage = style;
}
function updateIcons() {
	for (var i = 0; i < icons.elements.length; i++) {
		updateIcon(i);
	}
}
function updateIcon(index) {
	// Set link
	icons.elements[index].href = settings.icons[index].link;
	
	// Get icon color working
	icons.elements[index].className = "icon icon" + index;
	internalStyles.cssRules[index + 1].style.backgroundColor = settings.icons[index].highlight;
	internalStyles.cssRules[index + 1].style.fill = settings.icons[index].highlight;
	
	// Set icon
	icons.elements[index].childNodes[0].childNodes[0].setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", settings.icons[index].icon);
}

function updateCustomCSS() {
	if (settings.css) {
		// var cssRules = settings.css.split("}");
		// 
		// for (var i = 0; i < cssRules.length; i++) {
		// 	cssRules[i] = cssRules[i].trim();
		// 		
		// 	if (!cssRules[i]) continue;
		// 	
		// 	if (cssRules[i].startsWith(":root")) {
		// 		customStyles.insertRule("html" + cssRules[i] + "}", 7 + i);
		// 	} else {
		// 		customStyles.insertRule(":root " + cssRules[i] + "}", 7 + i);
		// 	}
		// }
		
		customStylesElement.innerHTML = settings.css;
	}
}
function updateClock() {
	var now = new Date();
	
	// Hour
	if (settings.clock.military) {
		clock.hour.innerHTML = now.getHours();
	} else {
		clock.hour.innerHTML = mod((now.getHours() - 1), 12) + 1;
	}
	
	// Blinking colon
	if (now.getSeconds() % 2 > 0 && !settings.clock.seconds) {
		clock.blink.className = "off";
	} else {
		clock.blink.className = "on";
	}
	
	// Minute
	clock.minute.innerHTML = ("0" + now.getMinutes()).slice(-2);
	
	// Second
	if (settings.clock.seconds) {
		clock.second.innerHTML = ":" + ("0" + now.getSeconds()).slice(-2);
	} else {
		clock.second.innerHTML = "";
	}
	
	// Suffix
	if (settings.clock.military) {
		clock.suffix.innerHTML = "";
	} else {
		if (now.getHours() < 12) {
			clock.suffix.innerHTML = " AM";
		} else {
			clock.suffix.innerHTML = " PM";
		}
	}
	
	// Date
	if (settings.search.date !== "none") {
		if (!search.box.classList.contains("date")) {
			search.box.classList.add("date");
		}
		search.box.title = "Click to Search";
		
		if (settings.search.date === "long") {
			search.box.placeholder = date.day[now.getDay()] + ", " + date.month[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
		} else {
			search.box.placeholder = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
		}
	} else {
		if (search.box.classList.contains("date")) {
			search.box.classList.remove("date");
		}
		search.box.title = "";
		search.box.placeholder = "Search";
	}
	
	window.setTimeout(updateClock, 250);
}

function doSearch(newtab = false) {
	if (search.box.value) {
		if (newtab) {
			window.open(settings.search.provider.replace("%s", encodeURIComponent(search.box.value)));
		} else {
			transitionTo(settings.search.provider.replace("%s", encodeURIComponent(search.box.value)));
		}
	}
}

function transitionTo(url) {
	if (!settings.transitions) location.assign(url);
	
	window.setTimeout(()=>{location.assign(url);}, 500);
	fadeout.classList.add("on");
}

function saveSettings() {
	storage.setItem("settings", JSON.stringify(settings));
}

function context(items = [{name: "No options?", callback: function() {}}], options) {
	if (options.origin) options.origin.classList.add("contextopen");
	
	// Let's make a context menu!
	var contextlist = document.createElement("ul");
	
	// It should look like a context menu.
	contextlist.classList.add("contextlist");
	contextlist.tabIndex = 100;
	
	if (options.width) contextlist.style.width = options.width;
	if (options.height) contextlist.style.height = options.height;
	
	for (var i = 0; i < items.length; i++) {
		var contextoption = contextOption(items[i], options);
		
		contextoption = contextlist.appendChild(contextoption);
	}
	
	contextlist.addEventListener("blur", (event)=>{
		var deletThis = event.target;
		
		if (blurOverride) {
			deletThis.focus();
		} else {
			while (deletThis.parentNode !== document.body)
				deletThis = deletThis.parentNode;
			
			if (options.origin) options.origin.classList.remove("contextopen");
			
			deletThis.remove();
		}
	});
	
	if (options.parent) contextlist = options.parent.appendChild(contextlist);
	else contextlist = document.body.appendChild(contextlist);
	
	var contextfit = contextlist.getBoundingClientRect();
	
	if (isNumber(options.x)) contextlist.style.left = Math.max(0, Math.min(options.x - 4, window.innerWidth - contextfit.width)) + "px";
	if (isNumber(options.y)) contextlist.style.top = Math.max(0, Math.min(options.y - 4, window.innerHeight - contextfit.height)) + "px";
	
	contextlist.focus();
	
	return contextlist;
}
function contextOption(item, options) {
	var contextoption;
	var callback;
	
	if (item.callback) {
		// If the option has a callback, do this.
		// This makes options you can click and have something happen.
		
		callback = item.callback;
		
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.addEventListener("click", (event)=>{callback(event, options);});
		contextoption.addEventListener("contextmenu", (event)=>{callback(event, options); event.preventDefault(); return false;});
		
		if (item.class) contextoption.classList.add(item.class);
	} else if (item.name) {
		// If the option does not have a callback, but does have a name, do this.
		// This makes greyed-out options, such as the "Secret Bonus Menu!" option that shows up.
		
		contextoption = document.createElement("li");
		contextoption.innerHTML = item.name;
		
		contextoption.classList.add("contextdisabled");
		
		if (item.class) contextoption.classList.add(item.class);
	} else {
		// If the option doesn't have anything of use, do this.
		// This makes the short dividers that show up frequently.
		
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
	
	if (popup.content.childNodes.length) {
		// If there's at least one popupItem, focus it.
		popup.content.childNodes[0].childNodes[0].focus();
	} else {
		// ???
		popup.close.focus();
	}
}
function popupItem(item, index) {
	// A set <div> contains both the label and input elements.
	var set = document.createElement("div");
	var label, input;
	var option;
	var callback;
	
	set.classList.add("popupset");
	
	// This makes the <label> element and properly links it to the input element.
	if (item.label) {
		label = document.createElement("label");
		label.htmlFor = "popupoption" + index;
		
		label.innerHTML = item.label;
	}
	
	// This makes the input element. It doesn't have to be an <input>.
	if (item.type) {
		if (item.type === "select") {
			input = document.createElement("select");
			
			if (item.options) {
				for (var i = 0; i < item.options.length; i++) {
					var option = document.createElement("option");
				
					if (item.options[i].label)
						option.innerHTML = item.options[i].label;
					
					if (item.options[i].value !== undefined)
						option.value = item.options[i].value;
					
					if (item.options[i].default)
						option.selected = true;
					
					input.appendChild(option);
				}
				
				if (isNumber(item.index)) {
					if (item.index < 0 || item.index >= item.options.length) {
						option = document.createElement("option");
						
						option.innerHTML = "Other";
						option.disabled = true;
						
						input.appendChild(option);
						input.selectedIndex = item.options.length;
					} else {
						input.selectedIndex = item.index;
					}
				}
			}
		} else if (item.type === "textarea") {
			input = document.createElement("textarea");
			input.spellcheck = false;
			
			if (item.value) input.innerHTML = item.value;
			if (item.placeholder) input.placeholder = item.placeholder;
			if (item.readOnly) input.readOnly = item.readOnly;
			
			input.addEventListener("keydown", textAreaTabEvent);
		} else if (item.type === "notice") {
			input = document.createElement("p");
			
			if (item.value) input.innerHTML = item.value;
		} else {
			input = document.createElement("input");
			
			input.type = item.type;
			
			if (item.value !== undefined) input.value = item.value;
			if (item.checked) input.checked = true;
			if (item.disabled) input.disabled = true;
			if (item.placeholder) input.placeholder = item.placeholder;
		}
		
		input.id = "popupoption" + index;
		input.tabIndex = 201 + index;
		
		if (item.width ) input.style.width  = item.width ;
		if (item.height) input.style.height = item.height;
		
		if (item.callback) {
			callback = item.callback;
			input.addEventListener("change", function(event) {callback(event);});
		}
	}
	
	// Add both the label and/or input to the set <div>.
	if (label) label = set.appendChild(label);
	if (input) input = set.appendChild(input);
	
	// If it's a checkbox, swap the <label> and <input>.
	if (item.type === "checkbox")
		label = set.appendChild(label);
	
	return set;
}

function loadSecret(event, options) {
	if (!secretLoad) {
		var secretScript = document.createElement("script");
		
		secretScript.type = "text/ecmascript";
		secretScript.onload = function(event) {
			startSecret(event, options);
			secretScript.onload = null;
		};
		secretScript.src = "js/ignore.js";
		
		document.body.appendChild(secretScript);
		secretLoad = true;
	}
	
	event.preventDefault();
	return false;
}

function getFromReddit(background) {
	console.log(background);
	
	loadJSON("https://api.reddit.com/r/" + background.src + "/top.json?t=week", (response)=>{
		var redditJSON = JSON.parse(response);
		var postIndex = 0;
		var post;
		var imageURL;
		
		// Random post offset
		
		if (background.offset) {
			postIndex = Math.min(redditJSON.data.children.length, background.offset);
		}
		
		if (background.offsetrandom) {
			postIndex += randomInt(background.offsetrandom);
		}
		
		post = redditJSON.data.children[postIndex].data;
		
		// Get a post that matches the criteria
		while (post.post_hint !== "image" || (post.over_18 && !background.nsfw) || (post.spoiler && !background.spoiler) || (!post.preview.enabled && background.previews)) {
			postIndex++;
			
			if (redditJSON.data.children[postIndex])
				post = redditJSON.data.children[postIndex].data;
			else {
				console.log("Error while retrieving subreddit " + background.src + ". Criteria not met. Either:\n• This subreddit's top posts only had text or non-image links.\n• All of the posts were NSFW/Spoilers.");
				return;
			}
		}
		
		if (post.preview.enabled) {
			var imageList = post.preview.images[randomInt(post.preview.images.length)];
			
			console.log(imageList);
			
			// Is the maxresolution greater than the source images' resolution?
			if (background.maxresolution > 0 && background.maxresolution < Math.min(imageList.source.width, imageList.source.height)) {
				for (var i = 0; i < imageList.resolutions.length; i++) {
					// Get the largest post that fits the criteria
					
					if (Math.min(imageList.resolutions[i].width, imageList.resolutions[i].height) <= background.maxresolution) {
						imageURL = imageList.resolutions[i].url;
						console.log("Found image with max resolution of " + Math.min(imageList.resolutions[i].width, imageList.resolutions[i].height) + "!");
					}
				}
			} else {
				console.log("Largest image is already within maxresolution!");
				
				imageURL = post.url;
			}
		} else {
			console.log("Warning while retrieving subreddit " + background.src + ". Post's preview was disabled. This may lead to ridiculously big images being loaded and slow loading.");
			
			if (background.previews) {
				return;
			} else {
				imageURL = post.url;
			}
		}
		
		backgroundinfo = {
			author: "/u/" + post.author,
			link: "https://reddit.com" + post.permalink
		};
		
		imageURL = decodeEntities(imageURL);
		
		// console.log("Set URL to " + imageURL);
		internalStyles.cssRules[0].style.backgroundImage = "url(\"" + imageURL + "\")";
	});
}

function getFromTumblr(background) {
	const APIKey = "x3BjA367hUvdXMmo1yTfMMus0ijKCJkyDECkaHlTCREuq0NFe4"; // what theh
	
	loadJSON("https://api.tumblr.com/v2/blog/" + background.src + "/posts/photo?api_key=" + APIKey, (response)=>{
		var tumblrJSON = JSON.parse(response);
		var postIndex = 0;
		var post;
		var imageURL;
		
		if (tumblrJSON.response.posts.length) {
			if (background.offset) {
				postIndex = Math.min(tumblrJSON.response.posts.length, background.offset);
			}
			
			post = tumblrJSON.response.posts[postIndex];
			
			backgroundinfo = {
				author: post.blog_name, // TODO: actually find source
				link: post.post_url
			};
			
			imageURL = post.photos[Math.floor(Math.random() * post.photos.length)].original_size.url;
			
			internalStyles.cssRules[0].style.backgroundImage = "url(\"" + imageURL + "\")";
		} else {
			console.log("Error while retrieving posts for Tumblr user " + background.src + ". Couldn't find any posts.");
		}
	});
}

function getParentWithTagName(element, name) {
	var node = element;
	name = name.toUpperCase();
	while (node.parentNode !== null) {
		if (node.tagName === name) {
			return node;
		}
		node = node.parentNode;
	}
	console.log("Couldn't find parent with name " + name + "!");
	return element;
}

function textAreaTabEvent(e) {
	var t = e.target;
	if (e.keyCode === 9) {
		var s = t.selectionStart;
		
		t.value = t.value.substring(0, t.selectionStart) + "\t" + t.value.substring(t.selectionEnd);
		t.selectionEnd = s + 1;
		
		e.preventDefault();
	}
}

function randomInt(n) {
	return Math.floor(Math.random() * n);
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function isNumber(n) {
	return !isNaN(n) && isFinite(n)
}

function goToLink(link) {
	return ()=>{ location.assign(link); }
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

// From https://stackoverflow.com/a/7394787/8659088
function decodeEntities(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

function loadJSON(file, callback) {
	var xhr = new XMLHttpRequest();
	
	xhr.open("GET", file, true);
	
	xhr.onload = function() {
		if(xhr.readyState === 4 && xhr.status === 200)
			callback(xhr.responseText);
	};
	xhr.onerror = function(error) {
		console.log("Failed to load.");
	};
	
	xhr.send();
}
