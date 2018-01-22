import BaseService from "./BaseService";
import i2c = require('i2c-bus');
import MPU6050 = require('i2c-mpu6050');

class GyroService extends BaseService {
    
    private mpu: any;
    public CurrentReading: IMpuReading;
    
    constructor(){
        super(50);

        var address = 0x68;
        var i2c1 = i2c.openSync(1);
         
        this.mpu = new MPU6050(i2c1, address);
        console.log(this.mpu);
    }

    protected run = () =>{

        console.log(`Reading Gryo sensors`);
        var data = this.mpu.readSync();
        this.CurrentReading = data;
    }        

    public kill = () => {
    }

}
let svc = new GyroService();
export = svc;

