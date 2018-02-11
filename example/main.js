
with (jsjk) {
  // Canvas

  var canvas = null;

  // Asset manager

  var assetManager = null;

  var assetPreloadComplete = false;

  // Init function

  init = function() {
    _enableDebug = true;

    // Create Canvas

    canvas = new Canvas2D(320, 180);

    canvas.setHidden(false);
    canvas.setPixelated(true);

    canvas.setBackground(20, 20, 20);

    canvas.setFont("monospace", 10);
    canvas.setTextBaseline("bottom");

    // Create AssetManager

    assetManager = new AssetManager();

    // Preload assets

    assetManager.queueAsset(ASSET_IMAGE, "images/baboon", "images/baboon.png");

    assetManager.beginPreload(function() {
      assetPreloadComplete = true;
    });
  };

  var drawWall = function(canvas, image, sx, st, sb, ex, et, eb, res) {
    if (ex < sx) { // Swap start and end for right-to-left walls
      var temp;

      temp = sx;
      sx = ex;
      ex = temp;

      temp = st;
      st = et;
      et = temp;

      temp = sb;
      sb = eb;
      eb = temp;
    }

    var texRes = Math.floor(image.width / (ex - sx));

    for (var x = sx; x < ex; x += res) {
      var ratio = (x - sx) / (ex - sx);

      var y = Math.floor(lerp(st, et, ratio));
      var height = Math.ceil(lerp(sb, eb, ratio) - y);

      var texX = Math.floor(lerp(0, image.width, ratio));

      canvas.drawImage(image, texX, 0, texRes, image.height, x, y, res, height);
    }
  };

  // Loading

  var loading = function() {
    var progress = assetManager.getPreloadProgress();

    // Loading bar

    canvas.setStroke();
    canvas.setFill(255, 170, 70);

    canvas.drawRect(
      0,
      Math.floor(canvas.height * 0.95),
      Math.ceil(canvas.width * progress.fraction),
      Math.ceil(canvas.height * 0.05)
    );

    // Loading progress

    canvas.drawText(
      "Loading " + Math.round(progress.fraction * 100) + "%",
      3,
      Math.round(canvas.height * 0.95) - 3
    );
  };

  // Update functions

  tick = function(delta) {
  };

  draw = function(delta) {
    // Adjust viewport position and scaling to be nice and pixelly

    canvas.adjustViewport(true, true, true, true);

    if (!assetPreloadComplete) {
      loading();

      return;
    }

    // Clear canvas

    canvas.clear();

    // Draw some stuff

    var img = assetManager.get("images/baboon");

    for (var i = 0; i < 20; i++) {
      drawWall(canvas, img, 10, 10, 90, 50, 30, 70, 2);
    }

    // Image reference

    canvas.drawImage(img, 10, 90, 80, 80);

    // Image border

    canvas.setFill();
    canvas.setStroke(255);

    canvas.drawRect(10, 10, 80, 80);
    canvas.drawRect(10, 90, 80, 80);
  };

  // Callbacks

  keyPress = function(code, name) {
  };
}
