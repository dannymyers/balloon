var socket = io();

var vm = new Vue({
  el: '#app',
  data: {
    sensor: {
      currentExternalTemperature: 0,
      currentInternalTemperature: 0,
      currentPressure: 0,
      maxExternalTemperature: 0,
      maxInternalTemperature: 0,
      maxPressure: 0,
      minExternalTemperature: 0,
      minInternalTemperature: 0,
      minPressure: 0,
      time: ''
    }
  },
  created: function() {
    socket.on('update-telemetry', function(sensorData) {
      console.log(sensorData);
      this.sensor = sensorData;
    }.bind(this));
  }
});