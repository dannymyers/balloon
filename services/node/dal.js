class Dal {

  constructor(db) {
    this.db = db
  }

  first(arr) {
    if(arr == null || arr.length == 0)
      return null;
    return arr[0];
  }
  
  async getLatestLaunchAsync(){
    var data = this.first(await this.db.allAsync("SELECT * FROM Launch ORDER BY LaunchKey DESC LIMIT 1"));
    return data;
  }
  
  async getLatestAltitudeReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM AltitudeReading WHERE LaunchKey = "  + launchKey + " ORDER BY AltitudeReadingKey DESC LIMIT 1"));
    return data;
  }

  async getLatestCameraReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM CameraReading WHERE LaunchKey = "  + launchKey + " ORDER BY CameraReadingKey DESC LIMIT 1"));
    return data;
  }

  async getLatestCellNetworkReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM CellNetworkReading WHERE LaunchKey = "  + launchKey + " ORDER BY CellNetworkReadingKey DESC LIMIT 1"));
    return data;
  }

  async getLatestGpsReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM GpsReading WHERE LaunchKey = "  + launchKey + " ORDER BY GpsReadingKey DESC LIMIT 1"));
    return data;
  }

  async getMaxAltitudeFromGpsReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT MAX(CAST(MslAltitude AS REAL)) AS MslAltitude FROM GpsReading WHERE LaunchKey = "  + launchKey + " AND MslAltitude <> ''"));
    return data;
  }

  async getMaxAltitudeFromAltitudeReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT  MAX(AltitudeInFeet) AS AltitudeInFeet FROM AltitudeReading WHERE LaunchKey = "  + launchKey + " AND AltitudeInFeet IS NOT NULL"));
    return data;
  }

  async getMinExternalTemperatureReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT MIN(TemperatureInFahrenheit) AS TemperatureInFahrenheit FROM ExternalTemperatureReading WHERE LaunchKey = "  + launchKey + " AND TemperatureInFahrenheit IS NOT NULL"));
    return data;
  }

  async getLatestGyroReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM GyroReading WHERE LaunchKey = "  + launchKey + " ORDER BY GyroReadingKey DESC LIMIT 1"));
    return data;
  }

  async getLatestExternalTemperatureReadingAsync(launchKey){
    var data = this.first(await this.db.allAsync("SELECT * FROM ExternalTemperatureReading WHERE LaunchKey = "  + launchKey + " ORDER BY ExternalTemperatureReadingKey DESC LIMIT 1"));
    return data;
  }
}

module.exports = Dal;