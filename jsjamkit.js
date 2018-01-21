
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

/* Global namespaces */

var jsjk = {} // Public API
var _jsjk = {} // Internal API

/* Exposed API */

jsjk.options = {};
jsjk.options.frameRate = 60;

jsjk.callbacks = {};
jsjk.callbacks.init = function() {};
jsjk.callbacks.tick = function(delta) {};
jsjk.callbacks.keyPress = function(key) {};
jsjk.callbacks.keyRelease = function(key) {};
jsjk.callbacks.mousePress = function(button, pos) {};
jsjk.callbacks.mouseRelease = function(button, pos) {};
jsjk.callbacks.mouseMotion = function(pos, rel) {};

jsjk.delta = 0;

jsjk.getElapsedTime = function() {
    return _jsjk.getTime() - _jsjk.time.start;
};

jsjk.Canvas = function() {
};

/* Internal API; don't touch this */

_jsjk.time = {}
_jsjk.time.start = 0;
_jsjk.time.lastFrame = 0;

_jsjk.getTime = function() {
    return new Date().getTime() / 1000;
};

_jsjk.init = function() {
    _jsjk.time.start = _jsjk.getTime();

    jsjk.callbacks.init();

    setInterval(_jsjk.tick, 1000 / jsjk.options.frameRate);
};

_jsjk.tick = function() {
    var time = new Date().getTime() / 1000;

    jsjk.time.delta = time - _jsjk.time.lastFrame;
    _jsjk.time.lastFrame = jsjk.getElapsedTime();

    jsjk.tick(delta);
};
