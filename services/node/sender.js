var sqlite3=require('sqlite3-promise')
var db = new sqlite3.Database('/share/balloon.db');
var SX127x = require('sx127x');

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  spreadingFactor: 12
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
    const buf = Buffer.allocUnsafe(25);

    var latestGpsReading = "SELECT Latitude, Longitude, ReadingTime, FixStatus, MslAltitude, SpeedOverGround FROM GpsReading ORDER BY 1 DESC LIMIT 1";
    var maxAltitude = "SELECT MAX(CAST(MslAltitude AS REAL)) FROM GpsReading WHERE MslAltitude <> ''";
    var latestAltitudeReading = "select ReadingTime, TemperatureInFahrenheit, PressureInPascals, AltitudeInFeet FROM AltitudeReading ORDER BY 1 DESC LIMIT 1";
    var maxAltitude = "SELECT MAX(CAST(MslAltitude AS REAL)) FROM GpsReading WHERE MslAltitude <> ''";
    buf.writeUInt16BE(count, 0);//Count 16 Unsigned (0->65,535)
    buf.writeUInt8(count, 0);//BITS -> Connected|GpsFixed|AltitudeWorking|CameraWorking|CellWorking|ExternalTempWorking|GpsWorking|GyroWorking
    buf.writeFloatBE(count, 0);//Lat 32 (32.980277)
    buf.writeFloatBE(count, 0);//Lng 32 (-117.058365)
    buf.writeUInt16BE(count, 0);//MSL Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(count, 0);//MSL Max Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(count, 0);//Altimeter Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(count, 0);//Altimeter Max Altitude Meters 16 Unsigned (0->65,535)
    buf.writeInt8(count, 0);//Internal Temp In Fahrenheit 8 (-128=>127)
    buf.writeInt8(count, 0);//External Temp In Fahrenheit 8 (-128=>127)
    buf.writeInt8(count, 0);//External Min In Fahrenheit Temp 8 (-128=>127)
    buf.writeInt8(count, 0);//Strengh DB 8 (-128=>127)
    buf.writeUInt8(count, 0);//Battery % Full 8 (0=>255)
    buf.writeUInt8(count, 0);//Speed Over Ground 8 Kilometers Per Hour (0->255)
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
