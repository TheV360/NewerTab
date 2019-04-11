# [NewerTab](https://thev360.github.io/NewerTab)

It's my new tab page, but it isn't held together with duct tape!

# Features

You can customize most settings by right clicking them. Some features may require you to edit JSON, but I'm going to fix that soon.

* Pretty interface
* Customizable everything! (backgrounds, icons, themes)
* Dark theme!
* Backgrounds support (gradients, images, top posts of subreddits, most recent posts of tumblr blogs)
* Backgrounds credit (author and link to page)
* Nice selection of default images.
* Search bar with date

# To-do

* ~~Custom CSS~~
* Background Wizard (make new JSON Background objects)
* ~~More polish, maybe animations?~~
* More empty space in the ignore.js file. Ignore the ignore.js file. There's nothing in it. (Will add items, fix map 2, remove existential crisis)
* ~~Migrate NewerTab CSS to SCSS, for easier maintaining.~~

# Known Issues

* Dark Reader completely breaks page. Disable for my github.io site anyway, it already has a dark theme.

# Custom CSS Samples

### Google Chrome-style search bar (rounded edges)

```css
:root input#searchbox {
	padding: .5rem 1rem;
	border-radius: 1rem;
}
```

### No solid highlight color for search bar

```css
:root input#searchbox:focus,
:root input#searchbox.contextopen {
	color: var(--text-color);
	background-color: transparent;
	--highlight-foreground-color: var(--alt-color);
	--highlight-background-color: var(--text-color);
}
```

### Neat border for search bar

```css
:root input#searchbox {
	border: 1px solid transparent;	
}
:root input#searchbox:focus,
:root input#searchbox.contextopen {
	border-color: var(--text-color);
}
```

### Sharper corners on everything
```css
:root {
	--border-radius: 0;
}
```

### Kid's budget Android tablet UI
```css
html:root {
	--border-radius: 50%;
}
```

Please don't actually use this last one.

# Credits

* Me for the HTML, CSS, and Javascript
* That one frosted glass tutorial and the Codepen of one person who did it
* Pexels and Unsplash for the default backgrounds, specifically...
	* new/1.jpg by [Joey Kyber, via Pexels.](https://www.pexels.com/photo/time-lapse-cars-on-fast-motion-134643/)
	* new/2.jpg by [Nodar Chernishev, via Snapwire, via Pexels.](https://www.pexels.com/photo/architecture-blur-bridge-buildings-390023/)
	* new/3.jpg by [Karol D., via Pexels.](https://www.pexels.com/photo/blur-cars-city-commuting-409701/)
	* new/4.jpg by [Tobias-Steinert, via Pixabay, via Pexels.](https://www.pexels.com/photo/light-trails-on-road-at-night-315939/)
	* newer/1.jpg by [John Towner, via Unsplash.](https://unsplash.com/photos/JgOeRuGD_Y4)
	* newer/2.jpg by [Alexander Slattery, via Unsplash.](https://unsplash.com/photos/LI748t0BK8w)
	* newer/3.jpg by [Marcelo Quinan, via Unsplash.](https://unsplash.com/photos/R3pUGn5YiTg)
	* newer/4.jpg by [Sophie Dale, via Unsplash.](https://unsplash.com/photos/4wG_qIjrd5U)
	* Previous newer/4.jpg by [Bryan Minear, via Unsplash](https://unsplash.com/photos/daArlleh6b8)
	* Previous previous newer/4.jpg by [Andre Benz, via Unsplash.](https://unsplash.com/photos/cXU6tNxhub0)
* Reddit for the amazing API. I am not associated with Reddit.
* Tumblr for the awesome API. I am not associated with Tumblr.
