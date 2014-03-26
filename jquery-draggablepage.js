/*
	jQuery Draggable Page plugin
	Copyright (C) 2014  Maarten de Boer <info@maartendeboer.net>

	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

var DraggablePage = {

	// Target element
  _target: null,

	// Allow dragging?
  _allowDrag: false,

	// Boolean to prevent multiple events firing on mouseup and mouseleave
	_isHandlingReleaseEvent: false,

	// CSS3 transition support
	_useCSS3: false,

	// Initial coordinates
	_targetX: null,
  _targetY: null,
	_mouseX: null,
  _mouseY: null,

	// Options and defaults
	_options: {},
	_defaults: {
		direction: 'up',
		pivotPoint: 0.8,
		animation: {
			duration: 400, // only for fallback
			fade: false // fade-out on hide
		}
	},

	// Init
  init: function(target, options) {
		// Load options
		this._options = $.extend(true, {}, this._defaults, options);

		// Check options
		this.checkOptions();

		// Define target
		this._target = target;

		// Check for CSS3 transition support otherwise use fallback
		if(typeof Modernizr !== 'undefined') {
			this._useCSS3 = Modernizr.csstransitions;
		}

		// Bind events
		this.bindEvents();
  },

	// Bind events
	bindEvents: function() {
		// Define event context
		var context = this;

		// Resize event
		$(window).on('orientationchange resize', function(e) {
			context.onResize(e, context);
		});

		// Trigger resize event to set initial size
		$(window).triggerHandler('resize');

		// Grab event
    this._target.on('mousedown', function(e) {
			context.onGrab(e, context);
		});

		// Release event
    this._target.one('mouseup mouseleave', function(e) {
			if(this._isHandlingReleaseEvent) return;

			this._isHandlingReleaseEvent = true;
			context.onRelease(e, context);
		});

		// Move event
    this._target.on('mousemove', function(e) {
			context.onMove(e, context);
		});
	},

	// Check options for errors
	checkOptions: function() {
		// Direction
		if($.inArray(this._options.direction, ['up','down','left','right']) == -1) {
			throw "Invalid direction given for jQuery DraggablePage";
		}

		// Pivot point
		if(this._options.pivotPoint < 0 || this._options.pivotPoint > 1) {
			throw "Invalid pivot point given, please specify a value between 0 and 1";
		}
	},

	// Resize event (also for initial size)
	onResize: function(e, context) {
		context._target.height($(window).height());
	},

	// Grab event
  onGrab: function(e, context) {
		// Allow dragging
    context._allowDrag = true;

		// Save initial coordinates
    context._targetX = context._target.position().left;
    context._targetY = context._target.position().top;
    context._mouseX = e.pageX;
    context._mouseY = e.pageY;

		// Re-enable CSS3 transitions
		context._target.addClass('no-transitions');

		// Re-enable text selection
		context._target.addClass('no-select');
		$(document.body).attr('unselectable', 'on');
  },

	// Release event
  onRelease: function(e, context) {
		// Direction to be dragged
		var direction = context._options.direction;

		// Pivot point
		var pivotPoint = null;

		// Re-enable CSS3 transitions
		context._target.removeClass('no-transitions');

		// Re-enable text selection
		context._target.removeClass('no-select');
		$(document.body).removeAttr('unselectable');

		// Slide page out if over pivot point
		if(direction == 'up') {

			// Get page bottom coordinate
			var pageBottom = context._target.position().top + context._target.height();

			// Calculate pivot point
			pivotPoint = Math.floor($(document).height() * context._options.pivotPoint);

			// Slide out if beyond pivot point
			if(pageBottom < pivotPoint) {
				context.animateProp('top', 0 - context._target.height(), true);
			}
			else {
				context.animateProp('top', 0, false);
			}
		}
		else if(direction == 'down') {
			// Calculate pivot point
			pivotPoint = Math.floor($(document).height() - ($(document).height() * context._options.pivotPoint));

			// Slide out if beyond pivot point
			if(context._target.position().top > pivotPoint) {
				context.animateProp('top', context._target.height(), true);
			}
			else {
				context.animateProp('top', 0, false);
			}
		}
		else if(direction == 'left') {

			// Get page right coordinate
			var pageRight = context._target.position().left + context._target.width();

			// Calculate pivot point
			pivotPoint = Math.floor($(document).width() * context._options.pivotPoint);

			// Slide out if beyond pivot point
			if(pageRight < pivotPoint) {
				context.animateProp('left', 0 - context._target.width(), true);
			}
			else {
				context.animateProp('left', 0, false);
			}
		}
		else if(direction == 'right') {
			// Calculate pivot point
			pivotPoint = Math.floor($(document).width() - ($(document).width() * context._options.pivotPoint));

			// Slide out if beyond pivot point
			if(context._target.position().left > pivotPoint) {
				context.animateProp('left', context._target.width(), true);
			}
			else {
				context.animateProp('left', 0, false);
			}
		}

		// Disable dragging
    context._allowDrag = false;

		// Reset initial coordinate properties
    context._targetX = null;
    context._targetY = null;
    context._mouseX = null;
    context._mouseY = null;
  },

	// Move event
  onMove: function(e, context) {
		// Return if not draggable
    if(!context._allowDrag) return;

		// Direction to be dragged
		var direction = context._options.direction;

		// Calculate delta position
		var dragY = context._targetY + (e.pageY - context._mouseY);
		var dragX = context._targetX + (e.pageX - context._mouseX);

		// Don't change position if reached bottom
		if(direction == 'up') {
			if(dragY > 0) {
				dragY = 0;
			}
		}
		else if(direction == 'down') {
			if(dragY < 0) {
				dragY = 0;
			}
		}
		else if(direction == 'left') {
			if(dragX > 0) {
				dragX = 0;
			}
		}
		else if(direction == 'right') {
			if(dragX < 0) {
				dragX = 0;
			}
		}

		// Update position
		if(direction == 'up' || direction == 'down') {
			context._target.css('top', dragY);
		} else {
			context._target.css('left', dragX);
		}
  },

	// Animate property with CSS3 or fallback
	animateProp: function(property, value, hiding) {
		// CSS 3
		if(this._useCSS3) {
			this._target.css(property, value);

			if(hiding) {
				// Fade out
				if(this._options.animation.fade) {
					this._target.css('opacity', 0);
				}

				// Listen for TransitionEnd to really hide the target
				this._target.on('transitionend', function(e) {
					if(e.propertyName == property) {
						// Hide target
						$(e.target).hide();

						// Trigger custom event draggablePageHidden
						$(e.target).triggerHandler('draggablePageHidden');

						// Unbind event
						$(e.target).unbind('transitionend');
					}
				});
			}
		}
		else { // Fallback
			var animProps = {};

			// Set our property to animate
			animProps[property] = value;

			// Fade out if hiding
			if(hiding && this._options.animation.fade) {
				animProps.opacity = 0;
			}

			// Animate
			this._target.animate(animProps, this._options.animation.duration, 'swing', function() {
				if(hiding) {
					// Hide target
					$(this).hide();

					// Trigger custom event draggablePageHidden
					$(this).triggerHandler('draggablePageHidden');
				}
			});
		}
	}
};

$.fn.draggablePage = function(options) {
  DraggablePage.init(this, options);
	return this;
};
