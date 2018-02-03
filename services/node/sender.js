var SX127x = require('sx127x');

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  spreadingFactor: 12,
  signalBandwidth: 15.6E3//10.4E3
});

var count = 0;

// open the device
sx127x.open(function(err) {
  console.log('open', err ? err : 'success');

  if (err) {
    throw err;
  }

  // send a message every second
  setInterval(function() {
    console.log('write: ' + count);
    const buf = Buffer.allocUnsafe(22);
    buf.writeUInt16BE(count, 0);//Count 16
    buf.writeFloatBE(count, 0);//Lat 32 (32.980277)
    buf.writeFloatBE(count, 0);//Lng 32 (-117.058365)
    buf.writeUInt16BE(count, 0);//Altitude Meters 16
    buf.writeUInt16BE(count, 0);//Max Altitude Meters 16
    buf.writeInt8(count, 0);//Temp 8
    buf.writeInt8(count, 0);//Min Temp 8
    buf.writeInt8(count, 0);//Connected 8 - Bit
    buf.writeInt8(count, 0);//Strengh DB 8
    buf.writeInt8(count, 0);//Battery % Full 8
    buf.writeInt8(count, 0);//Volts 8
    buf.writeInt8(count, 0);//Fix Status 8 - Bit
    buf.writeInt8(count, 0);//Speed Over Ground 8
    console.log(buf);
    count++;
    sx127x.write(buf, function(err) {
      console.log('\t', err ? err : 'success');
    });
  }, 5000);
});

process.on('SIGINT', function() {
  // close the device
  sx127x.close(function(err) {
    console.log('close', err ? err : 'success');
    process.exit();
  });
});
