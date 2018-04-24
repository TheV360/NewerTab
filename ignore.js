// This is lore. Don't look at this

const maps = [
	{
		map: [
			"#######",
			"#\\__*_/#",
			"#.....#",
			"#.....>",
			"#.@...#",
			"#bed.T#",
			"#######"
		],
		dialogue: [
			{
				x: 4,
				y: 1,
				text: "It's a small flower in a pot. You water it daily. You already watered it today..."
			},
			{
				x: 1,
				y: 6,
				width: 3,
				text: "It's your bed! It's a bit of a mess..."
			},
			{
				check: -1,
				x: 5,
				y: 6,
				text: "It's a bedside table. It has a small lantern and an empty drawer."
			},
			{
				check: 0,
				switch: 0,
				x: 5,
				y: 6,
				give: {
					type: "gold",
					amount: 3
				},
				text: "It's a bedside table. It has a small lantern and... oh! There's some gold in a drawer."
			}
		]
	}
];

// Event specs:
//	Check: checks if flag x is set (may change to have two different events that happen, like check: {flag: 0, yep: {}, nope: {}})
//	Switch: after event is done, switch flag x
//	X, Y: coordinates
//	Width: width of object. If not defined, assumed to be 1.
//	Height: like width, but height.
//	Give:
//	  Type:
//	    if gold, increment gold by amount
//	    otherwise, make item in inventory and give amount.
//	Text: text to show when looking at item

// TODO: move settings.secret to secret, make new secret localStorage entry, make saveSecret(); a function.

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
	"Click wrong option"
]

var tmpBag = [];

var sine, cosine, wavy, time;

function startSecret(event, origin) {
	// Sine objects, will use later.
	// For now, reset them
	sine = null;
	cosine = null;
	wavy = null;
	
	// Reset sine time
	time = 0;
	
	// Setup stuff
	if (settings.secret)
		settings.secret.score = 0;
	else
		settings.secret = {
			"score": 0,
			"high": 10,
			"bonus": {
				"map": 0,
				"x": 0,
				"y": 0,
				"hp": 10,
			}
		};
	
	// Start the dang thing
	doSecret(event, origin);
}

function doSecret(event, origin) {
	// The first option
	var itemList = [
		{
			"name": "Create another",
			"callback": doSecret
		}
	];
	
	// Increment score
	settings.secret.score++;
	
	// Things that will most likely try to fake you out
	if (settings.secret.score === 131) itemList.push({"name": "Create another <span style=\"color: white;\">context menu from the beginning</span>", "callback": fail});
	if (settings.secret.score === 134) {
		tmpBag = randomDialogue;
		
		for (var i = 0; i < tmpBag.length; i++) {
			tmpBag[i] = {"name": tmpBag[i], "callback": fail};
		}
		
		tmpBag = tmpBag.concat(itemList);
		itemList = [];
		
		tmpBag = shuffle(tmpBag);
	}
	
	// Show score
	if (settings.secret.score > 10) {
		if (settings.secret.score > settings.secret.high)
			settings.secret.high = settings.secret.score;
		
		itemList.push({"name": "Score: " + settings.secret.score});
		itemList.push({"name": "High Score: " + settings.secret.high});
	}
	
	// If there's dialogue for this, please show it
	if (dialogue[settings.secret.score]) itemList.push({"name": dialogue[settings.secret.score]});
	
	// Don't mess up
	if (settings.secret.score >= 75 && settings.secret.score <= 85) itemList.push({"name": "Don't mess up."});
	
	// Sine effects
	if (settings.secret.score === 73) sine = {"cycle": 90, "height": 16};
	if (settings.secret.score === 103) cosine = {"cycle": 80, "height": 8};
	if (settings.secret.score === 128) wavy = {"cycle": 90, "height": 15};
	
	// Clickable links
	if (settings.secret.score === 125) itemList.push({"name": "Here's a link to it.", "callback": goToLink("https://xkcd.com/1975/")});
	if (settings.secret.score === 130) itemList.unshift({"name": "Create an otter", "callback": goToLink("https://commons.wikimedia.org/wiki/File:Fischotter,_Lutra_Lutra.JPG")});
	
	// Add shuffled list
	if (settings.secret.score === 134) itemList = itemList.concat(tmpBag);
	
	// Make the menu
	var contextElement = context(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight), itemList, origin);
	
	// Move the first node to the last spot
	if (settings.secret.score === 131) contextElement.appendChild(contextElement.childNodes[0]);
	
	// Do the wavy things
	if (sine || cosine || wavy)
		applyEffects(contextElement);
	
	// Save the settings again
	saveSettings();
}

/*function loadSecret2(map) {
	settings.secret.bonus.map = map;
	loadedMap = maps[map];
	
	for (var j = 0; j < loadedMap.length; j++)
		for (var i = 0; i < loadedMap[j]; i++) {
			if (loadedMap[j][i] === "@")
				loadedMap[j][i] = ".";
		}
}

function playSecret2(event, origin, control) {
	// Game controls
	var itemList = [
		{
			"name": "Up",
			"callback": doSecret
		},
		{
			"name": "Down",
			"callback": doSecret
		},
		{
			"name": "Left",
			"callback": doSecret
		},
		{
			"name": "Right",
			"callback": doSecret
		}
	];
	
	for (var i = 0; i < map[i].length; i++) {
		
	}
}*/

function applyEffects(element) {
	// Better version of contextSine
	elementFit = element.getBoundingClientRect();
	
	if (sine) element.style.setProperty("--anim-sine", sine.height + "px");
	if (cosine) element.style.setProperty("--anim-cosine", cosine.height + "px");
	if (wavy) element.style.setProperty("--anim-wavy", wavy.height + "deg");
	
	if (sine) element = applyEffect(element, "sine " + (sine.cycle / 120) + "s " + (-1 * Math.random() * (sine.cycle / 60)) + "s ease-in-out alternate infinite");
	if (cosine) element = applyEffect(element, "cosine " + (cosine.cycle / 120) + "s " + (-1 * Math.random() * (cosine.cycle / 60)) + "s ease-in-out alternate infinite");
	if (wavy) element = applyEffect(element, "wavy " + (wavy.cycle / 120) + "s " + (-1 * Math.random() * (wavy.cycle / 60)) + "s ease-in-out alternate infinite");
	
	element.focus();
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
	
	// Steal child (yikes)
	newParent = newChild.parentNode.appendChild(newParent);
	newParent.appendChild(newChild);
	
	// Return new child
	return newChild;
}

function contextSine(element, centerX, centerY, hell) {
	time += 1;
	
	// Wave around <->
	if (centerX && sine)
		element.style.left = Math.floor(centerX + (Math.sin(2 * Math.PI * (time / sine.cycle)) * sine.height)) + "px";
	
	// Wave around ^ v
	if (centerY && cosine)
		element.style.top = Math.floor(centerY + (Math.cos(2 * Math.PI * (time / cosine.cycle)) * cosine.height)) + "px";
	
	// Wave around ⤹ ⤸
	if (hell && wavy)
		element.style.transform = "rotate(" + (Math.cos(2 * Math.PI * (time / sine.cycle)) * 15) + "deg)";
	
	if (document.contains(element))
		window.requestAnimationFrame(function() {contextSine(element, centerX, centerY, hell);});
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
