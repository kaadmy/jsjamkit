
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

jsjk.HANDLED = 1; // If an event has been handled

jsjk.KEY_LEFT = 37;
jsjk.KEY_UP = 38;
jsjk.KEY_RIGHT = 39;
jsjk.KEY_DOWN = 40;

jsjk.MOUSE_LEFT = 0;
jsjk.MOUSE_MIDDLE = 1;
jsjk.MOUSE_RIGHT = 2;

jsjk.AXIS_X = 0;
jsjk.AXIS_Y = 1;

jsjk.ASSET_IMAGE = 0;
jsjk.ASSET_SOUND = 1;

jsjk.OVERLAP_NONE = 0; // Sounds will only play if the channel is currently inactive
jsjk.OVERLAP_RESET = 1; // Only the last sound played will be active
jsjk.OVERLAP_QUEUE = 2; // Sounds will be added to a queue and played in FIFO order

// Generic state

jsjk._enableDebug = false;

// Utility functions

jsjk.stringifyVector = function(vec) { // ??? Should we support arbitrary length vectors?
  return "[" + vec[jsjk.AXIS_X] + ":" + vec[jsjk.AXIS_Y] + "]";
};

jsjk.printDebug = function(string) {
  if (jsjk._enableDebug) {
    console.debug(string);
  }
};

jsjk.printInfo = function(string) {
  console.log(string);
};

jsjk.printWarning = function(string) {
  console.warn(string);
};

jsjk.printError = function(string) {
  console.error(string);
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

jsjk._cache = { // Runtime data cache
  assetsElem: null,
  soundsElem: null,
  canvasesElem: null,
  debugElem: null,

  sounds: [], // List of currently playing sounds
  debug: {},
};

jsjk._init = function() {
  // Get container elements

  jsjk._cache.assetsElem = document.getElementById("jsjk_assets");

  jsjk._cache.soundsElem = document.getElementById("jsjk_sounds");

  jsjk._cache.canvasesElem = document.getElementById("jsjk_canvases");
  jsjk._cache.debugElem = document.getElementById("jsjk_debug");

  // Init

  jsjk._startTime = jsjk._getTime();
  jsjk._lastFrame = jsjk._getTime();
  jsjk._delta = 0.0001; // Can't be zero in case of divide by zero

  jsjk.init();

  // Create debug info (always create these but hide them incase so you can enable debugging at runtime)

  function addDebugLine(name) {
    jsjk._cache.debug[name] = document.createElement("p");
    jsjk._cache.debugElem.appendChild(jsjk._cache.debug[name]);

    jsjk._cache.debug[name].classList.add("jsjk_debug_text");
    jsjk._cache.debug[name].textContent = name;
    jsjk._cache.debug[name].hidden = true;
  };

  addDebugLine("timing");

  jsjk._nextDebugUpdate = 0;

  // Setup callbacks for mainloop(s)

  setInterval(jsjk._tick, 1000 / 60); // 60 frames per second
  requestAnimationFrame(jsjk._draw); // Variable but typically 60 fps; pauses when the tab is inactive
};

jsjk._tick = function() {
  jsjk._delta = jsjk._getTime() - jsjk._lastFrame;

  jsjk._lastFrame = jsjk._getTime();

  // Debugging info

  for (var name in jsjk._cache.debug) {
    jsjk._cache.debug[name].hidden = !jsjk._enableDebug;
  }

  if (jsjk._enableDebug) {
    if (jsjk._lastFrame > jsjk._nextDebugUpdate) {
      jsjk._nextDebugUpdate = jsjk._lastFrame + 0.5;

      jsjk._cache.debug.timing.textContent = "FPS: " + Math.floor(1.0 / jsjk._delta);
    }
  }

  // Main callback

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

// Class->AssetManager

jsjk.AssetManager = Class.extend({
  init: function() {
    this.element = jsjk._cache.assetsElem;

    this.assets = {};

    this.queue = [];
    this.queueItems = 0;

    this.queueStartItems = 0;
    this.queueLatestName = "null";
  },

  // Loading

  load: function(type, name, path, complete) {
    jsjk.printInfo("Loading " + name + " from " + path);

    if (this.assets[name] !== undefined) {
      jsjk.printWarning("Tried to load asset " + name + " but is already loaded");
      return;
    }

    this.assets[name] = {type: type};

    if (type === jsjk.ASSET_IMAGE) {
      this.loadImage(name, path, complete);
    } else if (type === jsjk.ASSET_SOUND) {
      this.loadSound(name, path, complete); // Function does not exist yet; will add after other stuff is more complete
    } else {
      jsjk.printError("Unknown asset type " + type);
      delete this.assets[name];
    }
  },

  loadImage: function(name, path, complete) {
    this.assets[name].element = document.createElement("img");
    this.element.appendChild(this.assets[name].element);

    this.assets[name].element.src = path;

    this.assets[name].element.onload = complete;
  },

  // Preloading

  queueAsset: function(type, name, path) {
    this.queue.push({type: type, name: name, path: path});
    this.queueItems++;
  },

  beginPreload: function(complete) {
    var items = this.queueItems; // Guarantee that the variable never changes due to async
    var am = this;

    this.queueStartItems = this.queueItems;

    for (var i = 0; i < items; i++) {
      var last = this.queue.shift();

      this.queueLatestName = last.name;

      this.load(last.type, last.name, last.path, function() {
        am.queueItems--;

        if (am.queueItems <= 0 && complete !== undefined) {
          complete();
        }
      });
    }
  },

  getPreloadProgress: function() {
    return {fraction: 1.0 - (this.queueItems / this.queueStartItems), name: this.queueLatestName};
  },

  // Getters

  getType: function(name) {
    if (this.assets[name] !== undefined) {
      return this.assets[name].type;
    }

    jsjk.printWarning("Tried to get type of asset " + name + " but not loaded");
    return;
  },

  get: function(name) {
    if (this.assets[name] !== undefined) {
      var type = this.assets[name].type;

      if (type == jsjk.ASSET_IMAGE || type == jsjk.ASSET_SOUND) {
        return this.assets[name].element;
      } else {
        // The type is valid as determined by jsjk.AssetManager.load; exception JIC since this could be hard to debug
        jsjk.printWarning("Tried to get asset " + name + " but type is invalid. This is a developer error!");
        return;
      }
    }

    jsjk.printWarning("Tried to get asset " + name + " but not loaded");
    return;
  },
});

// Class->SoundChannel

jsjk.SoundChannel = Class.extend({
  init: function(overlapMode) {
    this.overlapMode = overlapMode;

    this.queue = [];
  },
});

// Class->Canvas

jsjk.Canvas = Class.extend({
  init: function(width, height) {
    this.width = width;
    this.height = height;

    this.viewWidth = width;
    this.viewHeight = height;

    // Create element

    this.element = document.createElement("canvas");
    jsjk._cache.canvasesElem.appendChild(this.element);

    this.element.classList.add("jsjk_canvas");
    this.setHidden(true);

    this.adjustViewport(false, false, false, false);

    // Define context but don't create it yet

    this.context = null;
  },

  createContext: function(type, attr) {
    if (this.context !== null) {
      jsjk.printWarning("Attempted to create a preexisting context");
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
        var fit = Math.max(1, Math.min(window.innerWidth / this.width, window.innerHeight / this.height));

        if (keepPixelRatio) {
          fit = Math.floor(fit);
        }

        this.viewWidth = this.width * fit;
        this.viewHeight = this.height * fit;
      } else {
        if (keepPixelRatio) {
          this.viewWidth = this.width * Math.max(1, Math.floor(window.innerWidth / this.width));
          this.viewHeight = this.height * Math.max(1, Math.floor(window.innerHeight / this.height));
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
  }
});

// Class->Canvas->Canvas2D

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

  translate: function(x, y) {
    this.context.translate(x, y);
  },

  rotate: function(r) {
    this.context.rotate(r);
  },

  scale: function(x, y) {
    if (y === undefined) {
      y = x;
    }

    this.context.scale(x, y);
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

  // Stroke

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

  setLineWidth: function(width) {
    this.context.lineWidth = width;
  },

  // Fill

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

  // Text

  setFont: function(font) {
    this.context.font = font;
  },

  setTextAlign: function(align) {
    this.context.textAlign = align;
  },

  setTextBaseline: function(baseline) {
    this.context.textBaseline = baseline;
  },

  textWidth: function(text) {
    return this.context.measureText(text).width;
  },

  // Shapes

  beginShape: function() {
    this.context.beginPath();
  },

  closeShape: function() { // Joins start and end points of a shape
    this.context.closePath();
  },

  applyShape: function() { // If possible, call applyStroke/applyFill seperately as some operations only affect one
    this.applyFill();
    this.applyStroke();
  },

  // Drawing

  drawLine: function(sx, sy, ex, ey) {
    this.beginShape();

    this.context.lineWidth = this.lineWidth;

    this.context.moveTo(sx, sy);
    this.context.lineTo(ex, ey);

    this.applyStroke();
  },

  drawRect: function(x, y, w, h) { // ??? Add drawRoundedRect
    this.context.lineWidth = this.lineWidth;

    this.context.rect(x, y, w, h);

    this.applyShape();
  },

  drawArc: function(x, y, radius, sr, er, cc, close) {
    this.beginShape();

    this.context.lineWidth = this.lineWidth;

    this.context.arc(x, y, radius, sr, er, cc);

    this.applyShape();

    if (close) {
      this.closeShape();
    }
  },

  drawCircle: function(x, y, radius) {
    this.drawArc(x, y, radius, 0, Math.PI * 2, false, true);
  },

  drawImage: function(image, sx, sy, sw, sh, x, y, w, h) {
    if (image === undefined) {
      jsjk.printWarning("Null image to draw");
      return;
    }

    if (sw === undefined) { // x/y
      this.context.drawImage(image, sx, sy);
    } else if (x === undefined) { // x/y/w/h
      this.context.drawImage(image, sx, sy, sw, sh);
    } else { // sx/sy/sw/sh/x/y/w/h
      this.context.drawImage(image, sx, sy, sw, sh, x, y, w, h);
    }
  },

  drawText: function(text, x, y) {
    if (this.enableFill) {
      this.context.fillText(text, x, y);
    }
  }
});

// Assign internal callbacks

window.onload = jsjk._init;
window.onkeydown = jsjk._keyPress;
window.onkeyup = jsjk._keyRelease;
window.onmousedown = jsjk._mousePress;
window.onmouseup = jsjk._mouseRelease;
window.onmousemove = jsjk._mouseMove;
