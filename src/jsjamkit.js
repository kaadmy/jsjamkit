
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

jsjk.HANDLED = 1;

jsjk.KEY_LEFT = 37;
jsjk.KEY_UP = 38;
jsjk.KEY_RIGHT = 39;
jsjk.KEY_DOWN = 40;

jsjk.MOUSE_LEFT = 0;
jsjk.MOUSE_MIDDLE = 1;
jsjk.MOUSE_RIGHT = 2;

jsjk.AXIS_X = 0;
jsjk.AXIS_Y = 1;

// Utility functions

jsjk.stringifyVector = function(vec) { // ??? Should we support arbitrary length vectors?
  return "[" + vec[jsjk.AXIS_X] + ":" + vec[jsjk.AXIS_Y] + "]";
};

jsjk.printDebug = function(string) {
  if (jsjk._enableDebug) { // Variable doesn't exist by default; create it to enable debugging
    console.debug(string);
  }
};

jsjk.printInfo = function(string) {
  console.log(string);
};

jsjk.printWarning = function(string) {
  console.warn(string);
};

// Default callbacks

jsjk.init = function() {};
jsjk.tick = function(delta) {};
jsjk.draw = function(delta) {};
jsjk.keyPress = function(code, name) {};
jsjk.keyRelease = function(code, name) {};
jsjk.mousePress = function(button, pos) {};
jsjk.mouseRelease = function(button, pos) {};
jsjk.mouseMove = function(pos) {};

jsjk._elements = {
  canvases: null,

  debug: null,
  debugCont: {},
};

jsjk._init = function() {
  // Get container elements

  jsjk._elements.canvases = document.getElementById("jsjk_canvases");
  jsjk._elements.debug = document.getElementById("jsjk_debug");

  // Create debug info

  function addDebugLine(name) {
    jsjk._elements.debugCont[name] = document.createElement("p");

    jsjk._elements.debug.appendChild(jsjk._elements.debugCont[name]);

    jsjk._elements.debugCont[name].classList.add("jsjk_debug_text");

    jsjk._elements.debugCont[name].textContent = name;
  };

  addDebugLine("timing");

  jsjk._nextDebugUpdate = 0;

  // Init

  jsjk._startTime = jsjk._getTime();
  jsjk._lastFrame = jsjk._getTime();
  jsjk._delta = 0.0001; // Can't be zero in case of divide by zero

  jsjk.init();

  setInterval(jsjk._tick, 1000 / 60); // 60 frames per second
  requestAnimationFrame(jsjk._draw); // Variable but typically 60 fps; pauses when the tab is inactive
};

jsjk._tick = function() {
  jsjk._delta = jsjk._getTime() - jsjk._lastFrame;

  jsjk._lastFrame = jsjk._getTime();

  if (jsjk._lastFrame > jsjk._nextDebugUpdate) {
    jsjk._nextDebugUpdate = jsjk._lastFrame + 0.5;

    jsjk._elements.debugCont.timing.textContent = "FPS: " + Math.floor(1.0 / jsjk._delta);
  }

  jsjk.tick(jsjk._delta);
};

jsjk._draw = function(time) {
  jsjk.draw(jsjk._delta);

  requestAnimationFrame(jsjk._draw);
};

jsjk._keyPress = function(event) {
  //jsjk.printDebug("Key press: " + event.which + ", " + event.key);

  if (jsjk.keyPress(event.which, event.key) === jsjk.HANDLED) {
    event.preventDefault();
  }
};

jsjk._keyRelease = function(event) {
  //jsjk.printDebug("Key release: " + event.which + ", " + event.key);

  if (jsjk.keyRelease(event.which, event.key) === jsjk.HANDLED) {
    event.preventDefault();
  }
};

jsjk._mousePress = function(event) {
  var pos = [event.clientX, event.clientY];

  //jsjk.printDebug("Mouse press: " + event.which + ", " + jsjk.stringifyVector(pos));

  if (jsjk.mousePress(event.which, pos) === jsjk.HANDLED) {
    event.preventDefault();
  }
};

jsjk._mouseRelease = function(event) {
  var pos = [event.clientX, event.clientY];

  //jsjk.printDebug("Mouse release: " + event.which + ", " + jsjk.stringifyVector(pos));

  if (jsjk.mouseRelease(event.which, pos) === jsjk.HANDLED) {
    event.preventDefault();
  }
};

jsjk._mouseMove = function(event) {
  var pos = [event.clientX, event.clientY];

  //jsjk.printDebug("Mouse move: " + jsjk.stringifyVector(pos));

  if (jsjk.mouseMove(pos) === jsjk.HANDLED) {
    event.preventDefault();
  }
};

// Timing

jsjk._getTime = function() {
  return new Date().getTime() / 1000;
};

jsjk.getTime = function() {
  return jsjk._getTime() - jsjk._startTime;
};

// Color

jsjk.getColorString = function(r, g, b, a) {
  if (g === undefined) { // Grayscale
    return "rgb(" + r + "," + r + "," + r + ")";
  } else if (b === undefined) { // Grayscale + alpha
    return "rgba(" + r + "," + r + "," + r + "," + g + ")";
  } else if (a === undefined) { // RGB
    return "rgb(" + r + "," + g + "," + b + ")";
  } else { // Full RGBA
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
};

// Class:Canvas

jsjk.Canvas = Class.extend({
  init: function(width, height) {
    this.width = width;
    this.height = height;

    this.viewWidth = width;
    this.viewHeight = height;

    // Create element

    this.element = document.createElement("canvas");

    jsjk._elements.canvases.appendChild(this.element);

    this.element.classList.add("jsjk_canvas");

    this.setHidden(true);

    this.adjustViewport(false, false, false, false);

    // Define context but don't create it yet

    this.context = null;
  },

  createContext: function(type, attr) {
    if (this.context !== null) {
      jsjk.printWarning("Attempted to create a preexisting existing context");
    }

    this.context = this.element.getContext(type, attr);
  },

  // Options/flags

  setHidden: function(enable) {
    this.element.hidden = enable;
  },

  // Viewport

  adjustViewport: function(fullscreen, keepAspect, keepPixelRatio, centered) {
    this.element.width = this.width;
    this.element.height = this.height;

    if (fullscreen) {
      if (keepAspect) {
        var fit = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);

        if (keepPixelRatio) {
          fit = Math.floor(fit);
        }

        this.viewWidth = this.width * fit;
        this.viewHeight = this.height * fit;
      } else {
        if (keepPixelRatio) {
          this.viewWidth = this.width * Math.floor(window.innerWidth / this.width);
          this.viewHeight = this.height * Math.floor(window.innerHeight / this.height);
        } else {
          this.viewWidth = window.innerWidth;
          this.viewHeight = window.innerHeight;
        }
      }

      this.element.style.width = this.viewWidth + "px";
      this.element.style.height = this.viewHeight + "px";
    } else {
      this.viewWidth = this.width;
      this.viewHeight = this.height;

      this.element.style.width = "";
      this.element.style.height = "";
    }

    if (centered) {
      this.element.style.left = ((window.innerWidth / 2) - (this.viewWidth / 2)) + "px";
      this.element.style.top = ((window.innerHeight / 2) - (this.viewHeight / 2)) + "px";
    } else {
      this.element.style.left = "";
      this.element.style.top = "";
    }
  },
});

// Class:Canvas>Canvas2D

jsjk.Canvas2D = jsjk.Canvas.extend({
  init: function(width, height) {
    this._super(width, height);

    this.createContext("2d");

    this.setStroke(0, 255);
    this.setFill(255, 255);
  },

  // Options/flags

  setPixelated: function(enable) {
    if (enable) {
      this.element.classList.add("jsjk_pixelated");
    } else {
      this.element.classList.remove("jsjk_pixelated");
    }
  },

  // Matrix operations

  pushMatrix: function() {
    this.context.save();
  },
  popMatrix: function() {
    this.context.restore();
  },
  identityMatrix: function() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  },

  // Background

  setBackground: function(r, g, b, a) {
    if (r === undefined) {
      this.element.style.backgroundColor = "";
    } else {
      this.element.style.backgroundColor = jsjk.getColorString(r, g, b, a);
    }
  },
  clear: function() {
    this.pushMatrix();

    this.identityMatrix();

    this.context.clearRect(0, 0, this.width, this.height);

    this.popMatrix();
  },

  // Stroke color

  setStroke: function(r, g, b, a) {
    if (r === undefined) {
      this.enableStroke = false;
    } else {
      this.enableStroke = true;

      this.context.strokeStyle = jsjk.getColorString(r, g, b, a);
    }
  },
  applyStroke: function() {
    if (this.enableStroke) {
      this.context.stroke();
    }
  },

  // Fill color

  setFill: function(r, g, b, a) {
    if (r === undefined) {
      this.enableFill = false;
    } else {
      this.enableFill = true;

      this.context.fillStyle = jsjk.getColorString(r, g, b, a);
    }
  },
  applyFill: function() {
    if (this.enableFill) {
      this.context.fill();
    }
  },

  // Shapes

  beginShape: function() {
    this.context.beginPath();
  },
  endShape: function() { // If possible, call applyStroke/applyFill seperately as some operations only affect one
    this.applyFill();
    this.applyStroke();
  },

  closeShape: function() { // Joins start and end points of a shape
    this.context.closePath();
  },

  // Drawing

  drawLine: function(sx, sy, ex, ey) {
    this.beginShape();

    this.context.moveTo(sx, sy);
    this.context.lineTo(ex, ey);

    this.applyStroke();
  },

  drawRect: function(x, y, w, h) {
    if (this.enableFill) {
      this.context.fillRect(x, y, w, h);
    }

    if (this.enableStroke) {
      this.context.strokeRect(x, y, w, h);
    }
  },

  drawArc: function(x, y, radius, sr, er, cc) {
    this.beginShape();

    this.context.arc(x, y, radius, sr, er, cc);

    this.endShape();
  },

  drawCircle: function(x, y, radius) {
    this.drawArc(x, y, radius, 0, Math.PI * 2, false);
  },
});

// Assign internal callbacks

window.onload = jsjk._init;
window.onkeydown = jsjk._keyPress;
window.onkeyup = jsjk._keyRelease;
window.onmousedown = jsjk._mousePress;
window.onmouseup = jsjk._mouseRelease;
window.onmousemove = jsjk._mouseMove;
