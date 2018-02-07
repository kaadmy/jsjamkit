
/*
 *
 * JSJamKit
 *   A small and concise Javascript toolkit for rapid game development.
 *
 * Version
 *   0.1.0
 *
 * License (Unmodified MIT)
 *   Copyright (c) 2018 KaadmY
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 *
 */

// Namespace

var jsjk = {};

// Constants

jsjk.FILTER_LINEAR = 0;
jsjk.FILTER_NEAREST = 1;

jsjk.HANDLED = 1;

jsjk.KEY_LEFT = 37;
jsjk.KEY_UP = 38;
jsjk.KEY_RIGHT = 39;
jsjk.KEY_DOWN = 40;

jsjk.MOUSE_LEFT = 0;
jsjk.MOUSE_MIDDLE = 0;
jsjk.MOUSE_RIGHT = 0;

jsjk.AXIS_X = 0;
jsjk.AXIS_Y = 1;

// Utility functions

jsjk.stringifyVector = function(vec) {
    return "[" + vec[jsjk.AXIS_X] + ":" + vec[jsjk.AXIS_Y] + "]";
};

jsjk.printDebug = function(string) {
    if (jsjk._enableDebug) {
        console.debug(string);
    }
};

// Default callbacks

jsjk.init = function() {};
jsjk.tick = function(delta) {};
jsjk.keyPress = function(code, name) {};
jsjk.keyRelease = function(code, name) {};
jsjk.mousePress = function(button, pos) {};
jsjk.mouseRelease = function(button, pos) {};
jsjk.mouseMove = function(pos) {};

jsjk._init = function() {
    // Init

    jsjk._startTime = jsjk._getTime();
    jsjk._lastFrame = jsjk._getTime();

    jsjk.init();

    // Tick

    if (jsjk._frameRate === undefined) {
        jsjk.frameRate(60); // Default framerate if jsjk.init doesn't set it
    }
};

jsjk._tick = function() {
    var delta = jsjk._getTime() - jsjk._lastFrame;

    jsjk._lastFrame = jsjk._getTime();

    jsjk.tick(delta);
};

jsjk._keyPress = function(event) {
    jsjk.printDebug("Key press: " + event.which + ", " + event.key);

    if (jsjk.keyPress(event.which, event.key) === jsjk.HANDLED) {
        event.preventDefault();
    }
};

jsjk._keyRelease = function(event) {
    jsjk.printDebug("Key release: " + event.which + ", " + event.key);

    if (jsjk.keyRelease(event.which, event.key) === jsjk.HANDLED) {
        event.preventDefault();
    }
};

jsjk._mousePress = function(event) {
    var pos = [event.pageX, event.pageY];

    jsjk.printDebug("Mouse press: " + event.which + ", " + jsjk.vectorToString(pos));

    if (jsjk.mousePress(event.which, pos) === jsjk.HANDLED) {
        event.preventDefault();
    }
};

jsjk._mouseRelease = function(event) {
    var pos = [event.pageX, event.pageY];

    jsjk.printDebug("Mouse release: " + event.which + ", " + jsjk.vectorToString(pos));

    if (jsjk.mouseRelease(event.which, pos) === jsjk.HANDLED) {
        event.preventDefault();
    }
};

jsjk._mouseMove = function(event) {
    var pos = [event.pageX, event.pageY];

    jsjk.printDebug("Mouse move: " + jsjk.vectorToString(pos));

    if (jsjk.mouseMove(pos) === jsjk.HANDLED) {
        event.preventDefault();
    }
};

// Timing

jsjk._getTime = function() {
    return new Date().getTime() / 1000;
};

jsjk.getElapsedTime = function() {
    return jsjk._getTime() - jsjk._startTime;
};

jsjk.frameRate = function(frameRate) {
    if (frameRate) {
        jsjk._frameRate = frameRate;

        if (jsjk._tickInterval) {
            clearInterval(jsjk._tickInterval);
        }

        jsjk._tickInterval = setInterval(jsjk._tick, 1000 / jsjk._frameRate);
    }

    return jsjk._frameRate;
};

// Canvas

jsjk.Canvas = function(width, height) {
    this.width = width;
    this.height = height;

    this.element = null;
    this.context = null;
};

jsjk.Canvas.prototype.setFilter = function(filter) {
    if (filter === jsjk.FILTER_LINEAR) {
    } else {
    }
}

// Assign internal callbacks

window.onload = jsjk._init;
window.onkeydown = jsjk._keyPress;
window.onkeyup = jsjk._keyRelease;
window.onmousedown = jsjk._mousePress;
window.onmouseup = jsjk._mouseRelease;
window.onmousemove = jsjk._mouseMove;
