import BaseService from "./BaseService";
import RandomUtilities from "../utils/RandomUtilities";
import PiCamera = require("pi-camera");
import * as moment from "moment";

class CameraService extends BaseService {

    public Error: any;
    public TimeStamp: string;
    public FileName: string;    

    constructor(){
        super(10000);
    }

    protected run = () => {
        let timestamp = moment().format("YYYYMMDDHHmmss");
        console.log("Taking Picture...");  
        let camera = new PiCamera({
            mode: 'photo',
            output: "./camera/" + timestamp + ".jpg",
            width: 3280,
            height: 2464,
            nopreview: true,
        });
        camera.snap().then((result: any) => {
            console.log("Success");
        })
        .catch((error: any) => {
            console.log("Error");
            console.log(error);
            this.Error = error;
        });
    }

    /*public start = () => {
        console.log("Camera Start");
        this.camera.on("read", (err: any, timestamp: string, filename: string) => { 
            console.log("Camera Read");
            console.log(err);
            console.log(timestamp);
            console.log(filename);
            this.Error = err;
            this.TimeStamp = timestamp;
            this.FileName = filename;
            this.camera.start( );
        });
    }

    protected run = () => {
        console.log("run");
    }

    public stop = () =>{
        console.log("Camera Stop");
        this.camera.stop( );
    }*/       
}

let svc = new CameraService();
export = svc;