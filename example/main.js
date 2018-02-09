
with (jsjk) {
  var canvas = null;
  var asset = null;

  init = function() {
    _enableDebug = true;

    canvas = new Canvas2D(320, 180);

    canvas.setHidden(false);
    canvas.setPixelated(true);

    canvas.setBackground(20, 20, 20);

    asset = new Asset(ASSET_IMAGE, "images/baboon.png"); // This will be moved into an AssetLoader
  };

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

    canvas.drawImage(asset.get(), 0, 0, 100, 100);

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
