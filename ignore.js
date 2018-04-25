// This is lore. Don't look at this
const secretBlank = JSON.stringify({
	"version": version,
	"score": 0,
	"high": 0,
	"bonus": {
		"map": 0,
		"x": 2,
		"y": 4,
		"hp": 10,
		"hpmax": 10,
		"inventory": {},
		"flags": []
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
	133: "<pre style=\"font-family: monospace;\">█ █\n█ █\n███\n█ █\n█ █\n\n███\n█\n██\n█\n███\n\n█\n█\n█\n█\n███\n\n█\n█\n█\n█\n███\n\n███\n█ █\n█ █\n█ █\n███\n\n\n\n █</pre>",
	134: "Alright, here's the best level of this thing.<br />Thanks, and have fun!",
	135: "more levels tomorrow"
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
	"Spelling error? Go to NewerTab's Github page and open an issue!",
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

const maps = [
	{
		map: [
			"#######",
			"#\\_*_/#",
			"#.....#",
			"#.....>",
			"#.....#",
			"#bed.T#",
			"#######"
		],
		events: [
			{
				x: 3,
				y: 1,
				check: {
					flag: 0,
					off: {
						switch: 0,
						text: "It's a small flower in a pot. You water it."
					},
					on: {
						text: "It's a small flower in a pot. You water it daily. You already watered it today..."
					}
				}
			},
			{
				x: 1,
				y: 6,
				width: 3,
				text: "It's your bed! It's a bit of a mess..."
			},
			{
				x: 5,
				y: 6,
				check: {
					flag: 1,
					off: {
						switch: 1,
						give: {
							name: "gold",
							amount: 3
						},
						text: "It's a bedside table. It has a small lantern and... oh! There's some gold in a drawer."
					},
					on: {
						text: "It's a bedside table. It has a small lantern and an empty drawer."
					}
				},
			}
		]
	}
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

var sine, cosine, wavy, pulse;

// Setup stuff
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

function startSecret(event, options) {
	// Sine objects, will use later.
	// For now, reset them
	sine = null;
	cosine = null;
	wavy = null;
	pulse = null;
	
	secret.score = 0;
	
	// Start the dang thing
	doSecret(event, options);
}

function doSecret(event, options) {
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

function loadSecret2(map) {
	secret.bonus.map = map;
	loadedMap = maps[map].map;
	
	for (var j = 0; j < loadedMap.length; j++)
		for (var i = 0; i < loadedMap[j]; i++) {
		}
}

function playSecret2(event, options, control) {
	// Game controls
	var itemList = [
		{
			"name": "Up",
			"callback": goUp
		},
		{
			"name": "Down",
			"callback": goDown
		},
		{
			"name": "Left",
			"callback": goLeft
		},
		{
			"name": "Right",
			"callback": goRight
		}
	];
	
	var mapItem = "<pre style=\"font-family: monospace;\">";
	for (var i = 0; i < loadedMap.length; i++) {
		if (i) mapItem += "\n";
		
		if (i === secret.bonus.y) {
			for (var j = 0; j < loadedMap[i].length; j++) {
				if (j === secret.bonus.x) {
					mapItem += "@";
				} else {
					mapItem += loadedMap[i][j];
				}
			}
		} else {
			mapItem += loadedMap[i];
		}
	}
	mapItem += "</pre>";
	
	itemList.push({"name": mapItem});
	
	context(itemList, {});
}

function goUp() {}
function goDown() {}
function goLeft() {}
function goRight() {}

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
function goToLink(link) {
	return function() {
		location.assign(link);
	}
}

// Helpful
function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
