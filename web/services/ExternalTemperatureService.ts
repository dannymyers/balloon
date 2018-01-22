import BaseService from "./BaseService";
import RandomUtilities from "../utils/RandomUtilities";

class ExternalTemperatureService extends BaseService {

    public MaxTemperature: number = -10000;
    public CurrentTemperature: number = 0;
    public MinTemperature: number = 10000;
    
    constructor(){
        super(20000);
    }

    protected run = () =>{
        this.CurrentTemperature = RandomUtilities.RandomIntFromInterval(-60, 100);
        if(this.CurrentTemperature > this.MaxTemperature)this.MaxTemperature = this.CurrentTemperature;
        if(this.CurrentTemperature < this.MinTemperature)this.MinTemperature = this.CurrentTemperature;
        console.log("Current: " + this.CurrentTemperature + " Max: " + this.MaxTemperature + " Min: " + this.MinTemperature)
    }        
}

let svc = new ExternalTemperatureService();
export = svc;