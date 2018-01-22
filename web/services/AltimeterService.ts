import BaseService from "./BaseService";
import BMP280 = require("bmp280-sensor");
import roundTo = require('round-to');

class AltimeterService extends BaseService {
    
    private bmp280: any;
    public MaxTemperature: number = -10000;
    public MinTemperature: number = 10000;
    public CurrentTemperature: number = 0;
    public MaxPressure: number = -10000;
    public MinPressure: number = 10000;
    public CurrentPressure: number = 0;
    
    constructor(){
        super(20000);

        this.bmp280 = new BMP280({
            i2cBusNumber  : 1,    // defaults to 1
            i2cAddress    : 0x76  // defaults to 0x76
        });
        this.bmp280.config({
            powerMode: 3,                // 0 - sleep, 1|2 - one measurement, 3 - continuous
            pressureOversampling: 3,     // 0 - Skipped, 1 - ×1, 2 - ×2, 3 - ×4, 4 - ×8, 5 - ×16
            temperatureOversampling: 1,  // 0 - Skipped, 1 - ×1, 2 - ×2, 3 - ×4, 4 - ×8, 5 - ×16
            iirFilter: 2,                // Coefficient: 0 - off, 1 - 2, 2 - 4, 3 - 8, 4 - 16
            standby: 4                   // 0 - 0.5ms, 1 - 62.5ms, 2 - 125ms, 3 - 250ms, 4 - 500ms, 5 - 1000ms, 6 - 2000ms, 7 - 4000ms
          });
      
    }

    protected run = () =>{

        console.log(`Reading sensors`);
        this.bmp280.readSensors()
          .then((data: any) => {
            //console.log(`Temperture:\t${data.Temperature}`);
            //console.log(`Pressure:\t${data.Pressure}`);
            console.log(data);
            this.CurrentPressure = roundTo(data.Pressure, 3);
            if(this.CurrentPressure > this.MaxPressure)this.MaxPressure = this.CurrentPressure;
            if(this.CurrentPressure < this.MinPressure)this.MinPressure = this.CurrentPressure;

            this.CurrentTemperature = roundTo(data.Temperature * 1.8 + 32, 3);
            if(this.CurrentTemperature > this.MaxTemperature)this.MaxTemperature = this.CurrentTemperature;
            if(this.CurrentTemperature < this.MinTemperature)this.MinTemperature = this.CurrentTemperature;
      })
          .then(() => {
            this.bmp280.close();
          })
          .catch((err: any) => {
            console.log(err);
            this.bmp280.close();
          });    
    }        

    public kill = () => {
        this.bmp280.close();
    }

}
let svc = new AltimeterService();
export = svc;

