import fs = require("fs");
import ExternalTemperatureService = require("./services/ExternalTemperatureService");
import CameraService = require("./services/CameraService");
import AltimeterService = require("./services/AltimeterService");
import GyroService = require("./services/GyroService");
import GpsService = require("./services/GpsService");
import serveIndex = require('serve-index');
import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";

class Main {

    public static readonly PORT:number = 8080;
    public app: any;
    private server: any;
    private io: any;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || Main.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        this.app.use('/camera', serveIndex(__dirname + '/camera'));
        this.app.use('/camera', express.static('camera'));
                
        this.app.use(express.static('public'));
        
        this.app.get('/sensor', (req: any, res: any) => {
            var x = {
                gyroData: GyroService.CurrentReading,
                currentPressure: AltimeterService.CurrentPressure,
                minPressure: AltimeterService.MinPressure,
                maxPressure: AltimeterService.MaxPressure,
                currentInternalTemperature: AltimeterService.CurrentTemperature,
                minInternalTemperature: AltimeterService.MinTemperature,
                maxInternalTemperature: AltimeterService.MaxTemperature,
                currentExternalTemperature: ExternalTemperatureService.CurrentTemperature,
                minExternalTemperature: ExternalTemperatureService.MinTemperature,
                maxExternalTemperature: ExternalTemperatureService.MaxTemperature,
                gpsMessage: GpsService.LatestMessage,
                time: new Date()
            };
            console.log(x);
            res.send(x);
        });


    }

    public start = () =>{

        ExternalTemperatureService.start();
        GyroService.start();
        GpsService.start();
        //CameraService.start();
        AltimeterService.start();

        setInterval(()=>{
            this.io.emit("update-telemetry", {
                gyroData: GyroService.CurrentReading,
                currentPressure: AltimeterService.CurrentPressure,
                minPressure: AltimeterService.MinPressure,
                maxPressure: AltimeterService.MaxPressure,
                currentInternalTemperature: AltimeterService.CurrentTemperature,
                minInternalTemperature: AltimeterService.MinTemperature,
                maxInternalTemperature: AltimeterService.MaxTemperature,
                currentExternalTemperature: ExternalTemperatureService.CurrentTemperature,
                minExternalTemperature: ExternalTemperatureService.MinTemperature,
                maxExternalTemperature: ExternalTemperatureService.MaxTemperature,                
                gpsMessage: GpsService.LatestMessage,
                time: new Date()
            });
        }, 100);                        
    }

    public stop = () => {
        ExternalTemperatureService.stop();
        AltimeterService.stop();
        process.exit();
    }
}
let main = new Main();
main.start();
process.on('SIGINT', () => {
    main.stop();
});