var LoraMessage = require("./loraMesssage");
var Dal = require("./dal");
var sqlite3=require('sqlite3-promise')
var moment=require('moment')
var db = new sqlite3.Database('/share/balloon.db');
var SX127x = require('sx127x');

var sx127x = new SX127x({
  frequency: 433E6,
  resetPin:	6,
  dio0Pin:	5,
  //spreadingFactor: 12
});

var count = 0;

function isWorking(time, numberOfSecondsUntilReportProblem) {
  var x = moment().diff(moment(time), "seconds") < numberOfSecondsUntilReportProblem;
  return x;
}

// open the device
sx127x.open(function(err) {
  console.log('open', err ? err : 'success');

  if (err) {
    throw err;
  }

  // send a message every second
  setInterval(async function() {

    var dal = new Dal(db);
    var launch = await dal.getLatestLaunchAsync();
    if(launch == null)
      return;
    var altitudeReading = await dal.getLatestAltitudeReadingAsync(launch.LaunchKey);
    var cameraReading = await dal.getLatestCameraReadingAsync(launch.LaunchKey);
    var cellNetworkReading = await dal.getLatestCellNetworkReadingAsync(launch.LaunchKey);
    var externalTemperatureReading = await dal.getLatestExternalTemperatureReadingAsync(launch.LaunchKey);
    var gpsReading = await dal.getLatestGpsReadingAsync(launch.LaunchKey);
    var gyroReading = await dal.getLatestGyroReadingAsync(launch.LaunchKey);
    var maxGpsAltitudeReading = await dal.getMaxAltitudeFromGpsReadingAsync(launch.LaunchKey);
    var maxAltitudeReading = await dal.getMaxAltitudeFromAltitudeReadingAsync(launch.LaunchKey);
    var minExternalTemperatureReading = await dal.getMinExternalTemperatureReadingAsync(launch.LaunchKey);
    var lm = new LoraMessage();
    lm.count = count++;

    if(altitudeReading != null) {
      lm.isAltitudeWorking = isWorking(altitudeReading.ReadingTime, 60);
      lm.currentAltitudeMeters = altitudeReading.AltitudeInFeet * 0.3048;
      lm.internalTemperatureInFahrenheit = altitudeReading.TemperatureInFahrenheit;
    }

    if(cameraReading != null) {
      lm.isCameraWorking = isWorking(cameraReading.ReadingTime, 120);//Give it 2 minutes to be safe
    }

    if(cellNetworkReading != null) {
      lm.isCellWorking = isWorking(cellNetworkReading.ReadingTime, 60);
      lm.isConnected = cellNetworkReading.IsConnected != 0;
      lm.strengthInDecibel = cellNetworkReading.SignalStrengthDecibals;
      lm.batteryPercentFull = cellNetworkReading.BatteryPercentFull;
    }

    if(externalTemperatureReading != null) {
      lm.isExternalTempWorking = isWorking(externalTemperatureReading.ReadingTime, 60)
      lm.externalTemperatureInFahrenheit = externalTemperatureReading.TemperatureInFahrenheit;
    }

    if(cameraReading != null) {
      lm.isGpsFixed = gpsReading.FixStatus != "0";
      lm.isGpsWorking = isWorking(gpsReading.ReadingTime, 60);
      lm.latitude = gpsReading.Latitude;
      lm.longitude = gpsReading.Longitude;
      lm.speedOverGroundInKilometersPerHour = gpsReading.SpeedOverGround;
      lm.mslCurrentAltitudeMeters = gpsReading.MslAltitude;
    }

    if(gyroReading != null) {
      lm.isGyroWorking = isWorking(gyroReading.ReadingTime, 60);
    }

    if(maxGpsAltitudeReading != null){
      lm.mslMaxAltitudeMeters = maxGpsAltitudeReading.MslAltitude;
    }

    if(maxAltitudeReading != null){
      lm.maxAltitudeMeters = maxAltitudeReading.AltitudeInFeet * 0.3048;
    }

    if(minExternalTemperatureReading != null)
    {
      lm.minExternalTemperatureInFahrenheit = minExternalTemperatureReading.TemperatureInFahrenheit;
    }

    var buf = lm.toBuffer();
    var lm2 = new LoraMessage();
    lm2.fromBuffer(buf);
    console.log('write:', buf);
    console.log(lm2);
    sx127x.write(buf, function(err) {
      console.log('\t', err ? err : 'success');
    });
  }, 30000);
});

process.on('SIGINT', function() {
  // close the device
  sx127x.close(function(err) {
    console.log('close', err ? err : 'success');
    process.exit();
  });
});
