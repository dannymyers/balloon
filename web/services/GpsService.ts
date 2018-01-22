import BaseService from "./BaseService";
import { Serial } from 'raspi-serial';

class GpsService extends BaseService {
    
    public Latitude: number = 0;
    public Longitude: number = 0;
    public serial: any;
    public LatestMessage: any;
    public buffer: string = "";    
    
    sleep = (ms: any, fx: any) => {
        setTimeout(fx,ms);
    }

    constructor(){
        super(1000);
        this.serial = new Serial({
            port: "/dev/serial0",
            portId: "/dev/serial0",
            baudRate: 115200
        });
        this.serial.open(() => {
            this.serial.on('data', (data: any) => {
                //console.log("Response: " + data);
                this.buffer += data;
            });
            //this.serial.write("AT\n");
            //this.serial.write("AT+CGNSPWR?\n");
            //this.serial.write("AT+CGNSPWR=1\n");
        });
    }

    protected run = () =>{
        this.buffer = "";
        this.serial.write("AT+CGNSINF\n");
        this.sleep(500, ()=>{
            try {
                let message = this.buffer.split(":")[1].split("OK")[0].trim();
                let arr = message.split(",");
                let obj = {
                    gnssRunStatus: arr[0],
                    fixStatus: arr[1],
                    dateAndTimeUtc: arr[2],
                    latitude: arr[3],
                    longitude: arr[4],
                    mslAltitude: arr[5],
                    speedOverGround: arr[6],
                    courseOverGround: arr[7],
                    fixMode: arr[8],
                    reserved1: arr[9],
                    hdop: arr[10],
                    pdop: arr[11],
                    vdop: arr[12],
                    reserved2: arr[13],
                    gnssSatellitesInView: arr[14],
                    gnssSatellitesUsed: arr[15],
                    glonassSatellitesUsed: arr[16],
                    reserved3: arr[17],
                    cNoMax: arr[18],
                    hpa: arr[19],
                    vpa: arr[20],
                }
                this.LatestMessage = obj;
                console.log(obj);
            }
            catch(e) {
                console.log(e);
            }
        });
    }        
}

let svc = new GpsService();
export = svc;