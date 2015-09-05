function GUI(gui) {
  var builder = this;

  this.gui = {};
  this.getGUI = getGUI;

  parse(gui);

  function getGUI() {
    return builder.gui;
  }

  function parse(gui) {
    var rooms = {};

    angular.forEach(gui, function (device, deviceKey) {
      device.group.forEach(function (room) {
        if (rooms[room] === undefined) {
          rooms[room] = {};
        }
        device.id = deviceKey;
        rooms[room][deviceKey] = (device);
      });
    });
    builder.gui = rooms;
  }
}
