declare module 'i2c-bus';
declare module 'i2c-mpu6050';


interface IMpuReading{

    gyro: IPosition;
    accel: IPosition;
    rotation: IPosition;
    temp: number;
}

interface IPosition{
    x:number;
    y:number;
    z:number;
}