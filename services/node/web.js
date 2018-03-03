var express = require('express')
var serveIndex = require('serve-index');
var app = express()
var Dal = require("./dal");
var sqlite3=require('sqlite3-promise')
var moment=require('moment')
var db = new sqlite3.Database('/share/balloon.db');
const path = require('path');

var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('/share/server-key.pem'),
  cert: fs.readFileSync('/share/server-cert.pem')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

function first(arr){
  if(arr == null || arr.length == 0)
    return null;
  return arr[0];
}

moment.updateLocale('en', {
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s  : '%d seconds',
      ss : '%d seconds',
      m:  "%d minutes",
      mm: "%d minutes",
      h:  "%d hour(s)",
      hh: "%d hour(s)",
      d:  "a day",
      dd: "%d days",
      M:  "a month",
      MM: "%d months",
      y:  "a year",
      yy: "%d years"
  }
});

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

app.get('/mapData', async (req, res) => {    
  let dal = new Dal(db);
  var id = req.query.id
  var data = await dal.getAllGpsReadingsAsync(id);
  res.send(data);
})

app.get('/deleteimages', async (req, res) => {    
  var directory = "/share/images";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;  
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
  res.send("Done");
})

app.get('/emptydatabase', async (req, res) => {    
  let dal = new Dal(db);
  console.log('Empty Database')
  await db.runAsync('DELETE FROM AltitudeReading');
  await db.runAsync('DELETE FROM CameraReading');
  await db.runAsync('DELETE FROM CellNetworkReading');
  await db.runAsync('DELETE FROM GpsReading');
  await db.runAsync('DELETE FROM GyroReading');
  await db.runAsync('DELETE FROM ExternalTemperatureReading');
  res.send("Done");
})
 
sendChartAsync = async (res, col1, dateColumn, table) => {
  var script = "SELECT " + col1  + " AS a, " + dateColumn + " AS b FROM " + table + " ORDER BY " + dateColumn;
  var data = await db.allAsync(script);
  var toReturn = [];
  data.forEach(element => {
    toReturn.push([moment(element.b).unix() * 1000, Number(element.a)]);
  });
  res.send(toReturn);
}

app.get('/altitude', async (req, res) => {    
  await sendChartAsync(res ,"AltitudeInFeet", "ReadingTime", "AltitudeReading");
})
 
app.get('/pressure', async (req, res) => {    
  await sendChartAsync(res ,"PressureInPascals", "ReadingTime", "AltitudeReading");
})

app.get('/gpsAltitude', async (req, res) => {    
  await sendChartAsync(res ,"(MslAltitude * 3.28084)", "ReadingTime", "GpsReading");
})

app.get('/cellSignal', async (req, res) => {    
  await sendChartAsync(res ,"SignalStrengthDecibals", "ReadingTime", "CellNetworkReading");
})

app.get('/batteryPercentFull', async (req, res) => {    
  await sendChartAsync(res ,"BatteryPercentFull", "ReadingTime", "CellNetworkReading");
})

app.get('/voltageMillivolts', async (req, res) => {    
  await sendChartAsync(res ,"VoltageMillivolts", "ReadingTime", "CellNetworkReading");
})

app.get('/speed', async (req, res) => {    
  await sendChartAsync(res ,"CAST(SpeedOverGround as decimal) * 0.621371", "ReadingTime", "GpsReading");
})

app.get('/internalTemperature', async (req, res) => {    
  await sendChartAsync(res ,"TemperatureInFahrenheit", "ReadingTime", "AltitudeReading");
})

app.get('/externalTemperature', async (req, res) => {    
  await sendChartAsync(res ,"TemperatureInFahrenheit", "ReadingTime", "AltitudeReading");
})
 
app.get('/reboot', async (req, res) => {    
  console.log('Reboot')
  require('child_process').exec('sudo shutdown -r now', console.log)
  res.send("Done");
})
 
app.get('/shutdown', async (req, res) => {    
  console.log('Shutdown')
  require('child_process').exec('sudo shutdown -h now', console.log)
  res.send("Done");
})
 
//console.log(__dirname);
//app.use('/', express.static('public/index'));

app.get('/', function(req, res) {
  res.render('index', {title:"Main"});
});

app.get('/map', function(req, res) {
  res.render('map', {title:"Map"});
});

app.get('/admin', function(req, res) {
  res.render('admin', {title:"Admin"});
});

app.get('/charts', function(req, res) {
  res.render('charts', {title:"Charts"});
});

app.get('/images', function(req, res) {
  res.render('images', {title:"Images"});
});


app.use('/camera', serveIndex('/share/images'));
app.use('/camera', express.static('/share/images'));
app.use(express.static('public'));
app.use('/map', express.static('/share/map/'));
app.use('/scripts', express.static(__dirname + '/node_modules/leaflet/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/highcharts/js/'));
app.use('/css', express.static(__dirname + '/node_modules/highcharts/css/'));

app.use('/balloon.db', express.static('/share/balloon.db'));

app.locals.scripts = [];
app.locals.addScripts=function (all) {
app.locals.scripts = [];
    if (all != undefined) {
        app.locals.scripts =  all.map(function(script) {
            return "<script src='/" + script + "'></script>";
        }).join('\n ');
    }

};
app.locals.getScripts = function(req, res) {
    return app.locals.scripts;
};