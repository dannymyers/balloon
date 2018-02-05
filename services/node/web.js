var express = require('express')
var serveIndex = require('serve-index');
var app = express()
var sqlite3=require('sqlite3-promise')
var db = new sqlite3.Database('/share/balloon.db');

function first(arr){
  if(arr == null || arr.length == 0)
    return null;
  return arr[0];
}

app.get('/data', async (req, res) => {    
  var data = {}
  data.Launch = first(await db.allAsync('SELECT * FROM Launch ORDER BY LaunchKey DESC LIMIT 1'));
  data.AltitudeReading = first(await db.allAsync('SELECT * FROM AltitudeReading ORDER BY AltitudeReadingKey DESC LIMIT 1'));
  data.CameraReading = first(await db.allAsync('SELECT * FROM CameraReading ORDER BY CameraReadingKey DESC LIMIT 1'));
  data.CellNetworkReading = first(await db.allAsync('SELECT * FROM CellNetworkReading ORDER BY CellNetworkReadingKey DESC LIMIT 1'));
  data.GpsReading = first(await db.allAsync('SELECT * FROM GpsReading ORDER BY GpsReadingKey DESC LIMIT 1'));
  data.GyroReading = first(await db.allAsync('SELECT * FROM GyroReading ORDER BY GyroReadingKey DESC LIMIT 1'));
  data.ExternalTemperatureReading = first(await db.allAsync('SELECT * FROM ExternalTemperatureReading ORDER BY ExternalTemperatureReadingKey DESC LIMIT 1'));
  res.send(data);
})
 
app.listen(8080)

console.log(__dirname);
app.use('/', express.static('public/index.html'));
app.use('/camera', serveIndex('/share/images'));
app.use('/camera', express.static('/share/images'));
app.use('/socket.io', express.static('node_modules/socket.io-client/dist'));
app.use(express.static('public'));