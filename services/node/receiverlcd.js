var SX127x = require('sx127x');

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  spreadingFactor: 12,
  signalBandwidth: 15.6E3//10.4E3
});

var count = 0;

var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');
 
var opts = {
  width: 128,
  height: 32,
  address: 0x3C
};
 
var oled = new oled(i2cBus, opts);
var font = require('oled-font-5x7'); 
 
// open the device
sx127x.open(function(err) {
  console.log('open', err ? err : 'success');

  if (err) {
    throw err;
  }

  // add a event listener for data events
  sx127x.on('data', function(data, rssi, snr) {

    var count = data.readInt8(0);

    console.log('data:', '\'' + count + '\'', rssi, snr);
      oled.clearDisplay();
      oled.update();
      // sets cursor to x = 1, y = 1 
      oled.setCursor(1, 1);
      oled.writeString(font, 1, "Count: " +  count + " RSSI: " + rssi + " SNR: " + snr, 1, true);
      oled.update();
  });

  // enable receive mode
  sx127x.receive(function(err) {
    console.log('receive', err ? err : 'success');
  });
});

process.on('SIGINT', function() {
  // close the device
  sx127x.close(function(err) {
    console.log('close', err ? err : 'success');
    process.exit();
  });
});
