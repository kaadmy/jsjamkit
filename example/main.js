
with (jsjk) {
  var canvas = null;

  init = function() {
    _enableDebug = true;

    canvas = new Canvas2D(320, 180);

    canvas.setHidden(false);
    canvas.setPixelated(true);

    canvas.setBackground(20, 20, 20);
  };

  tick = function(delta) {
  };

  draw = function(delta) {
    canvas.adjustViewport(true, true, true, true);

    canvas.clear();

    canvas.setStroke(255, 255, 255);
    canvas.drawLine(10, 10, 120, 80 + (Math.sin(getTime() * 2) * 20));

    canvas.setStroke(255, 255, 255);
    canvas.setFill(50, 50, 100, 0.8);
    canvas.drawCircle(50, 50, 40);
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
