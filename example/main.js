
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

    assetManager.queueAsset(ASSET_IMAGE, "test/baboon", "images/baboon.png");

    assetManager.beginPreload(function() {
      assetPreloadComplete = true;
    });
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

    // Get pixel data

    var pixelData = canvas.getPixelData();
    var pixels = pixelData.data;

    // Write pixel data

    for (var x = 0; x < pixelData.width; x++) {
      for (var y = 0; y < pixelData.height; y++) {
        var pi = (x + (y * pixelData.width)) * 4;
        pixels[pi] = (x * 16) % 255;
        pixels[pi + 1] = (y * 16) % 255;
        pixels[pi + 2] = (x + y) % 255;
        pixels[pi + 3] = 255;
      }
    }

    // Set pixel data

    canvas.setPixelData(pixelData);
  };

  // Callbacks

  keyPress = function(code, name) {
  };
}
