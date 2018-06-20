"use strict";

// This is lore. Don't look at this
const secretBlank = JSON.stringify({
	"version": version,
	"score": 0,
	"high": 0,
	"bonus": {
		"map": 0,
		"x": 3,
		"y": 4,
		"hp": 10,
		"hpmax": 10,
		"inventory": [],
		"flags": {}
	}
});

const dialogue = {
	69: "Nice",
	70: "Wait, why are you still making new context menus?",
	71: "There's nothing but a single number going up. How is this entertaining to you?",
	72: "Ooh, wait... how about this?",
	73: "There, now it's harder to click the context menus.",
	74: "One single misclick and you start from the beginning.",
	86: "If you even click away to another window, you will lose this.",
	87: "Also, don't click any other options! You'll probably lose your progress.",
	88: "Please be careful. See you at 100 clicks.",
	101: "Sorry, I'm late.",
	102: "Anyway, congrats on wasting a few minutes of your life on my New Tab page.",
	103: "As a reward for getting this far, here's a worse sine thing.",
	104: "Good luck! I'll be right back. I need some food.",
	120: "I'm back! How's it going? Hopefully you didn't restart that much trying to get here.",
	121: "This entire part of NewerTab is inspired by one XKCD comic.",
	122: "I forget what the comic is named... can you search that for me? You do have a search bar right in front of you.",
	124: "...Nevermind, I found it. It's XKCD #1975.",
	126: "That was a really cool April Fools joke.",
	127: "I especially liked all the secrets and easter eggs.",
	128: "Oh yeah, it's been a while without another awful sine effect.",
	129: "Some people say there's a prize when you get to 150. Not an even worse sine effect, but... well... yep it's a worse sine effect.",
	130: "But 200. That's where the finish line is. Once you reach that, you've won.",
	131: "Yep, you can finally 100% a new tab page. Thank god.",
	132: "Oh, I forgot this is actually fully-featured HTML.",
	133: "<pre class=\"monospaced\">█ █\n█ █\n███\n█ █\n█ █\n\n███\n█\n██\n█\n███\n\n█\n█\n█\n█\n███\n\n█\n█\n█\n█\n███\n\n███\n█ █\n█ █\n█ █\n███\n\n\n\n █</pre>",
	134: "Alright, here's the best level of this thing.<br />Thanks, and have fun!",
	135: "more levels as soon as I finish this page completely."
};

const randomDialogue = [
	"This option is the right one",
	"Make another",
	"Needle in a haystack",
	"Scrollbars on context menus",
	"Anime is good",
	"This is a line of text",
	"<img src=\"https://i.imgur.com/0uicUuw.png\" />",
	"Hope you're having fun",
	"Sorry about the lag",
	"Loving this sine thing",
	"Do it for click #200",
	"You won! Click here to claim your prize!",
	"I am not lying, you just scrolled past the right one",
	"Lorem ipsum dolor sit amet",
	"Create a mistake",
	"Create another <span style=\"color: white;\">bamboozle</span>",
	"YOU JUST GOT PRANKED!",
	"I think you just got an important email",
	"Wait... is that a new video? From your favorite Youtuber?",
	"Are you procrastinating? Don't! Do your work!",
	"In advance, I want to say sorry to mobile users",
	"Hello, I am an option",
	"Some people say that there's nothing at click #200",
	"Beep beep beep",
	"Spelling error? Go to NewerTab's GitHub page and open an issue!",
	"I have been trapped in vim for the past 3 weeks. Send help.",
	"Wow, that's a lot of options",
	"Life is short. Quit now and do something more interesting than searching for a button.",
	"Create a bunch of anger",
	"🐝",
	"Write shorter options",
	"Shoutouts to the great people who made these backgrounds",
	"Create another one",
	"Remember, exact words",
	"TVTropes is good",
	"Wikipedia's featured article is amazing today!",
	"[Fakeout option here]",
	"Delay REALLY GREAT RPG 2", // Ouch
	"Click wrong option",
	"Push another broken commit"
];

const solid = /[^\s«».■□]/imu;

const maps = [
	[ // 0123456789012
		"╔╤═══╤╦═════╗",
		"║└O☼ˇ┘║/    ║",
		"║b    ║    J║",
		"╠═■═══╣     ║",
		"║     ■     ║",
		"║     ║     ■",
		"║bed T║     ║",
		"╚═════╩═════╝"
	]
];
const mapInfo = [
	{
		name: "House",
		events: [
			{
				x: 2,
				y: 2,
				width: 4,
				text: "It's the bathroom, complete with sink and toilet."
			},
			{
				x: 3,
				y: 2,
				check: {
					flag: "waterFlower",
					off: {
						switch: "waterFlower",
						text: "It's a small flower in a pot. You water it."
					},
					on: {
						text: "It's a small flower in a pot. You water it daily. You already watered it today..."
					}
				}
			},
			{
				x: 4,
				y: 2,
				text: "It's a mug you use to water the flower."
			},
			{
				x: 1,
				y: 5,
				width: 3,
				text: "It's your bed! It's a bit of a mess..."
			},
			{
				x: 5,
				y: 5,
				check: {
					flag: "bedsideGold",
					off: {
						switch: "bedsideGold",
						give: {
							name: "Gold",
							amount: 3
						},
						text: "It's a bedside table. It has a small lantern and... oh! There's some gold in a drawer."
					},
					on: {
						text: "It's a bedside table. It has a small lantern and an empty drawer."
					}
				},
			},
			{
				x: 8,
				y: 1,
				text: "The TV! You waste too much time staring at this flat rectangle.",
				check: {
					flag: "chairDecision",
					off: {
						text: "It's showing the pause screen of your favorite game, Superb Platforming Guy. You're only on world 3, but that's just because you got the game a week ago."
					},
					on: {
						text: "It's tuned to your favorite channel, the weather. Something about that channel is just calming, and the music is good to browse through social media to."
					}
				}
			},
			{
				x: 10,
				y: 2,
				check: {
					flag: "chairDecision",
					off: {
						switch: "chairDecision",
						text: "Your chair! You sit down and watch some TV."
					},
					on: {
						switch: "chairDecision",
						text: "Your chair! You sit down and play a game."
					}
				}
			}
		]
	}
];

const itemInfo = [
	{name: "Gold", usable: false},
	{name: "Map", usable: true}
];

// Event specs:
//	Check: checks if flag x is set, does on/off event based on flag status
//	Switch: after event is done, switch flag x
//	X, Y: coordinates, if not given, will immediately
//	Width: width of object. If not defined, assumed to be 1. If negative, it spans the entire map.
//	Height: like width, but height. If not defined, assumed to be 1. If negative, it spans the entire map.
//	Give:
//	  Name:
//	    make item in inventory and give amount.
//	Text: text to show when looking at item

var secret = {};
var tmpBag = [];
var elementFit;

var sine, cosine, wavy, pulse;

// Set up stuff
if (storage.getItem("secret")) {
	try {
		secret = JSON.parse(storage.getItem("secret"));
		if (secret.version != version) {
			console.log("Secret is out of date. Here's old secret, just so you can copy it:\n");
			console.log(JSON.stringify(secret));
			secret = JSON.parse(secretBlank);
			saveSecret();
		}
	} catch(error) {
		console.log("Secret item is missing or corrupt.\n" + error);
		secret = JSON.parse(secretBlank);
		saveSecret();
	}
} else {
	console.log("No secret, making a new one");
	secret = JSON.parse(secretBlank);
	saveSecret();
}

function startSecret() {
	// Sine objects, will use later.
	// For now, reset them
	sine = null;
	cosine = null;
	wavy = null;
	pulse = null;
	
	secret.score = 0;
	
	// Start the dang thing
	doSecret();
}

function doSecret() {
	// The first option
	var itemList = [
		{
			"name": "Create another",
			"callback": doSecret
		}
	];
	
	// Increment score
	secret.score++;
	
	// Things that will most likely try to fake you out
	if (secret.score === 131) itemList.push({"name": "Create another <span style=\"color: white;\">context menu from the beginning</span>", "callback": fail});
	if (secret.score === 134) {
		tmpBag = randomDialogue;
		
		for (var i = 0; i < tmpBag.length; i++) {
			tmpBag[i] = {"name": tmpBag[i], "callback": fail};
		}
		
		tmpBag = tmpBag.concat(itemList);
		itemList = [];
		
		tmpBag = shuffle(tmpBag);
	}
	
	// Show score
	if (secret.score > 10) {
		if (secret.score > secret.high)
			secret.high = secret.score;
		
		itemList.push({"name": "Score: " + secret.score});
		itemList.push({"name": "High Score: " + secret.high});
	}
	
	// If there's dialogue for this, please show it
	if (dialogue[secret.score]) itemList.push({"name": dialogue[secret.score]});
	
	// Don't mess up
	if (secret.score >= 75 && secret.score <= 85) itemList.push({"name": "Don't mess up."});
	
	// Sine effects
	if (secret.score === 73) sine = {"cycle": 90, "height": 16};
	if (secret.score === 103) cosine = {"cycle": 80, "height": 8};
	if (secret.score === 128) wavy = {"cycle": 90, "height": 15};
	
	// Clickable links
	if (secret.score === 125) itemList.push({"name": "Here's a link to it.", "callback": goToLink("https://xkcd.com/1975/")});
	if (secret.score === 130) itemList.unshift({"name": "Create an otter", "callback": goToLink("https://commons.wikimedia.org/wiki/File:Fischotter,_Lutra_Lutra.JPG")});
	
	// Add shuffled list
	if (secret.score === 134) itemList = itemList.concat(tmpBag);
	
	// Make the menu
	var contextElement = context(itemList, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight)});
	
	// Move the first node to the last spot
	if (secret.score === 131) contextElement.appendChild(contextElement.childNodes[0]);
	
	// Do the wavy things
	if (sine || cosine || wavy || pulse)
		applyEffects(contextElement);
	
	// Save the settings again
	saveSecret();
}

var i, j;
var loadedMap, loadedInfo, nextMap;
var itemList, mapItem;
var texts = [];

function loadSecret2(map) {
	sine = null;
	cosine = null;
	wavy = null;
	pulse = null;
	
	secret.bonus.map = map;
	
	loadedMap = maps[map].slice();
	loadedInfo = mapInfo[map];
}

function playSecret2() {
	// Game controls
	itemList = [
		{"name": "Up", "callback": goUp, "class": "up"},
		{"name": "Left", "callback": goLeft, "class": "left"},
		{"name": "Right", "callback": goRight, "class": "right"},
		{"name": "Down", "callback": goDown, "class": "down"},
		{}
	];
	
	// for (i = 0; i < loadedMap.length; i++) {
	// 	loadedMap[i] = loadedMap[i].substr(1) + loadedMap[i][0];
	// }
	// loadedMap.push(loadedMap.shift());
	
	// Fix controls
	if (mapCollide(loadedMap, secret.bonus.x, secret.bonus.y - 1)) itemList[0].callback = undefined;
	if (mapCollide(loadedMap, secret.bonus.x - 1, secret.bonus.y)) itemList[1].callback = undefined;
	if (mapCollide(loadedMap, secret.bonus.x + 1, secret.bonus.y)) itemList[2].callback = undefined;
	if (mapCollide(loadedMap, secret.bonus.x, secret.bonus.y + 1)) itemList[3].callback = undefined;
	
	// Do events
	texts = [];
	for (i = 0; i < loadedInfo.events.length; i++) {
		doEvent(loadedInfo.events[i]);
	}
	
	// Draw the map, insert player character.
	mapItem = "<div style=\"text-align: center;\">" + loadedInfo.name + "<pre class=\"monospaced\">";
	for (i = 0; i < loadedMap.length; i++) {
		mapItem += "\n";
		
		if (i === secret.bonus.y) {
			for (j = 0; j < loadedMap[i].length; j++) {
				if (j === secret.bonus.x) {
					mapItem += "☺";
					
					if (loadedMap[i][j] === "■") loadedMap[i] = replaceChar(loadedMap[i], j, "□");
				} else {
					mapItem += loadedMap[i][j];
				}
			}
		} else {
			mapItem += loadedMap[i];
		}
	}
	mapItem += "</pre></div>";
	
	itemList.push({"name": mapItem});
	
	if (texts.length) {
		itemList.push({});
		
		for (var i = 0; i < texts.length; i++) {
			itemList.push({"name": texts[i]});
		}
	}
	
	if (secret.bonus.inventory.length) {
		itemList.push({}, {"name": "<div style=\"text-align: center;\">Inventory</div>"});
		
		for (var i = 0; i < secret.bonus.inventory.length; i++) {
			itemList.push({"name": secret.bonus.inventory[i].amount + " × " + secret.bonus.inventory[i].name});
		}
	}
	
	saveSecret();
	context(itemList, {noAnimations: true, y: 8, width: "24rem"});
	
	if (nextMap) {
		loadSecret2(nextMap.map);
		
		secret.bonus.x = nextMap.x;
		secret.bonus.y = nextMap.y;
		
		nextMap = undefined;
	}
}

function goUp() {secret.bonus.y--; playSecret2();}
function goLeft() {secret.bonus.x--; playSecret2();}
function goRight() {secret.bonus.x++; playSecret2();}
function goDown() {secret.bonus.y++; playSecret2();}

function makeUseItem(itemIndex) {
	return function() {
		
	}
}

function doEvent(table) {
	if (collide(secret.bonus.x, secret.bonus.y, table.x, table.y, table.width, table.height)) {
		// console.log("Event okayed!");
		// console.log(table);
		
		if (table.text) {
			texts.push(table.text);
		}
		
		if (table.switch) {
			// console.log("Encountered a switch! It's switching the " + table.switch + " flag.");
			
			secret.bonus.flags[table.switch] = !secret.bonus.flags[table.switch];
		}
		
		if (table.give) {
			// console.log("Encountered a give! It wants to give the player " + table.give.amount + " " + table.give.name + "(s).");
			
			var itemIndex = secret.bonus.inventory.findIndex(inventoryItem(table.give.name, table.give.amount));
			
			if (itemIndex < 0) {
				itemIndex = secret.bonus.inventory.push({name: table.give.name, amount: 0}) - 1;
			}
			
			if (table.give.amount) {
				secret.bonus.inventory[itemIndex].amount += table.give.amount;
			} else {
				secret.bonus.inventory[itemIndex].amount += 1;
			}
			
			texts.push("You found " + table.give.amount + " " + table.give.name + ".");
		}
		
		if (table.check) {
			// console.log("Encountered a check! It's checking for the " + table.check.flag + " flag.");
			
			if (secret.bonus.flags[table.check.flag]) {
				// console.log("The check succeeded. table.check.on is running.");
				
				doEvent(table.check.on);
			} else {
				// console.log("The check failed. table.check.off is running.");
				
				doEvent(table.check.off);
			}
				
			// console.log("Event should've been okayed!");
		}
		
		if (table.move) {
			nextMap = table.move;
		}
		
		if (table.also) {
			doEvent(table.also);
		}
	} else {
		// console.log("Event failed.");
		// console.log("collide(" + secret.bonus.x + ", " + secret.bonus.y + ", " + table.x + ", " + table.y + ", " + table.width + ", " + table.height + ") == false");
	}
}

function collide(sx, sy, tx, ty, width, height) {
	var x = false;
	var y = false;
	
	if (tx === undefined) {
		x = true;
	} else if (width === undefined) {
		x = sx === tx;
	} else {
		x = sx >= tx && sx < tx + width;
	}
	
	if (ty === undefined) {
		y = true;
	} else if (height === undefined) {
		y = sy === ty;
	} else {
		y = sy >= ty && sy < ty + height;
	}
	
	return x && y;
}

function mapCollide(map, x, y) {
	if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) return true;
	
	return solid.test(map[y][x]);
}

function inventoryItem(name, amount) {
	if (!amount) amount = 1;
	
	return function(element) {
		return element.name === name && element.amount >= amount;
	}
}

function debug_everyEffect() {
	sine = {"cycle": 90, "height": 16};
	cosine = {"cycle": 80, "height": 8};
	wavy = {"cycle": 90, "height": 15};
	pulse = {"cycle": 180, "height": .5};
}

function debug_skipAFew() {
	window.setTimeout(function(){debug_everyEffect(); secret.score = 120; console.log("!");}, 2500);
}

function applyEffects(element) {
	// Better version of contextSine
	elementFit = element.getBoundingClientRect();
	
	// Disarm blur event
	blurOverride = true;
	
	if (sine) element.style.setProperty("--anim-sine", sine.height + "px");
	if (cosine) element.style.setProperty("--anim-cosine", cosine.height + "px");
	if (wavy) element.style.setProperty("--anim-wavy", wavy.height + "deg");
	if (pulse) element.style.setProperty("--anim-pulse", pulse.height);
	
	if (sine) element = applyEffect(element, "sine " + (sine.cycle / 120) + "s " + (-1 * Math.random() * (sine.cycle / 60)) + "s ease-in-out alternate infinite");
	if (cosine) element = applyEffect(element, "cosine " + (cosine.cycle / 120) + "s " + (-1 * Math.random() * (cosine.cycle / 60)) + "s ease-in-out alternate infinite");
	if (wavy) element = applyEffect(element, "wavy " + (wavy.cycle / 120) + "s " + (-1 * Math.random() * (wavy.cycle / 60)) + "s ease-in-out alternate infinite");
	if (pulse) element = applyEffect(element, "pulse " + (pulse.cycle / 120) + "s " + (-1 * Math.random() * (pulse.cycle / 60)) + "s ease-in-out alternate infinite");
	
	// Good.
	element.focus();
	blurOverride = false;
}

function applyEffect(element, effectName) {
	var newChild = element;
	var newParent = document.createElement("div");
	newParent.className = "dummy";
	
	// Steal CSS properties
	newParent.style.cssText = element.style.cssText;
	newChild.style.cssText = "";
	
	// Awful hack to fix width and height
	newParent.style.setProperty("width", elementFit.width + "px");
	newParent.style.setProperty("height", elementFit.height + "px");
	
	// Add new Animations
	newParent.style.setProperty("animation", effectName);
	
	// Move child into new parent
	newParent = newChild.parentNode.appendChild(newParent);
	newParent.appendChild(newChild);
	
	// Return new child
	return newChild;
}

function saveSecret() {
	storage.setItem("secret", JSON.stringify(secret));
}

// Evil
function fail() {
	document.body.focus();
}

// Helpful
function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function replaceChar(string, index, replacement) {
	return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}
