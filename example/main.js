
with (jsjk) {
  // State classes

  var canvas = null;
  var assetManager = null;

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

    // Create SoundManager

    channels[CHANNEL_MUSIC]     = new SoundChannel(assetManager, OVERLAP_RESET);
    channels[CHANNEL_PLAYER]    = new SoundChannel(assetManager, OVERLAP_NONE);
    channels[CHANNEL_SFX]       = new SoundChannel(assetManager, OVERLAP_RESET);
    channels[CHANNEL_ANNOUNCER] = new SoundChannel(assetManager, OVERLAP_QUEUE);

    // Create AssetManager

    assetManager = new AssetManager();

    // Preload assets

    assetManager.queueAsset(ASSET_IMAGE, "test/baboon", "images/baboon.png");

    assetManager.beginPreload(jsjk.initComplete);
  };

  // Update functions

  tick = function(delta) {
  };

  draw = function(delta) {
    // Adjust viewport position and scaling to be nice and pixelly

    canvas.adjustViewport(true, true, true, true);

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

    canvas.drawRect(130, 80, 130, 100);
  };

  // Callbacks

  keyPress = function(code, name) {
  };

  keyRelease = function(code, name) {
  };

  mousePress = function(button, pos) {
  };

  mouseRelease = function(button, pos) {
  };

  mouseMove = function(pos) {
  };
}
