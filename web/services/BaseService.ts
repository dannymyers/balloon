interface IService{    
    start() : void;
    stop() : void;
}

export default class BaseService implements IService {

    private intervalHandle: NodeJS.Timer;
    private interval: number;
    constructor(interval: number){
        this.interval = interval;
    }

    start = () => {
        this.intervalHandle = setInterval(this.run, this.interval);
    }

    stop = () => {
        clearInterval(this.intervalHandle);
    }

    protected run = () =>{
        console.log("You must implement run!");
    }

    public kill = ()=>{}

}