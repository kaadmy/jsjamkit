
with (jsjk) {
  // Canvas

  var canvas = null;

  // Asset manager

  var assetManager = null;

  var assetPreloadComplete = false;

  // Sound

  var channels = [];

  var CHANNEL_MUSIC     = 0;
  var CHANNEL_PLAYER    = 1;
  var CHANNEL_SFX       = 2;
  var CHANNEL_ANNOUNCER = 3;

  // Init function

  init = function() {
    _enableDebug = true;

    // Create Canvas

    canvas = new Canvas2D(320, 180);

    canvas.setHidden(false);
    canvas.setPixelated(true);

    canvas.setBackground(20, 20, 20);

    canvas.setFont("10px monospace");
    canvas.setTextBaseline("bottom");

    // Create SoundManager

    channels[CHANNEL_MUSIC]     = new SoundChannel(assetManager, OVERLAP_RESET);
    channels[CHANNEL_PLAYER]    = new SoundChannel(assetManager, OVERLAP_NONE);
    channels[CHANNEL_SFX]       = new SoundChannel(assetManager, OVERLAP_RESET);
    channels[CHANNEL_ANNOUNCER] = new SoundChannel(assetManager, OVERLAP_QUEUE);

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

    // Draw image

    canvas.pushMatrix();

    canvas.translate(100, 20);
    canvas.rotate(Math.PI * 0.2);
    canvas.scale(0.2);

    canvas.drawImage(assetManager.get("test/baboon"), 0, 0);

    canvas.popMatrix();

    // Line

    canvas.setStroke(150, 255, 150);

    canvas.drawLine(10, 10, 120, 80 + (Math.sin(getTime() * 2) * 20));

    // Circle

    canvas.setFill(50, 50, 50, 0.8);

    canvas.drawCircle(50, 50, 40);

    // Rect

    canvas.drawRect(130, 80, 130, 80);

    // Text

    canvas.setFill(150, 255, 150);

    canvas.drawText("Left click to enable pointer lock", 120, 20);
  };

  // Callbacks

  mousePress = function(button, pos) {
    if (button === MOUSE_LEFT) {
      setPointerLock(true);
    }
  };
}
