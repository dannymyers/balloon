var SX127x = require('sx127x');
var LoraMessage = require("./loraMesssage");
var Dal = require("./dal");

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  //spreadingFactor: 12
});

var count = 0;

// open the device
sx127x.open(function(err) {
  console.log('open', err ? err : 'success');

  if (err) {
    throw err;
  }

  // add a event listener for data events
  sx127x.on('data', function(buf, rssi, snr) {
    var lm = new LoraMessage();
    lm.fromBuffer(buf)
    console.log(lm, rssi, snr);
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
