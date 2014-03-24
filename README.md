# jQuery Draggable Page Plugin #

Does what it says just doesn't say what it does. Okay that's confusing, some explanation: it's a simple piece of jQuery code in the form of a plugin that allows you to make an overlay page (fixed, 100% width and height) which is draggable to a side of the screen.

Great as a welcome page for example but could be used for anything like multiple 'stacked' pages which users can flick away like a stack of cards.

## Features ##
- Uses CSS3 transitions (working on javascript fallback)
- Can slide to any side of the screen, defaults to up
- Configurable point where the user has to let go before the page flicks away

For now just a quick plugin because I plan on using it on my site, while done I decided to share, why not aye?

So far I spent only little time on this, check the issue tracker for current things I'm working on or submit an issue yourself if you think something is missing. Only tested with one overlay, not with multiple stacked ones but that'll come.

## Getting started ##
Just include `jquery-draggable.min.js` in your page and create a `div` that serves as your overlay page. I used these CSS rules for the overlay:

	.draggable-page {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%; // doesn't matter, gets set by the plugin anyway
		overflow: hidden;
		z-index: 9999; // to make sure it's on top, feel free to experiment

		-webkit-transition: top 400ms ease-out, left 400ms ease-out;
		transition: top 400ms ease-out, left 400ms ease-out;
	}

Now in your javascript file just call the plugin like:

	$(document).ready(function() {
		$('.draggable-page').draggablePage();
	});

And Bob's your uncle, you should see your overlay and be able to flick it away by dragging it up. And if you want to know when the page has been hidden, just hang on tight to the `draggablePageHidden` event!
