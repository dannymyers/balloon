# Weather Balloon Project

## To Get Up And Running...

npm install  
npm run dev  
go to http://[raspberry pi address]:8080/sensor

## Project Notes:

Single Program

- Current Time
- Get Lat/Lng/Alt
- Get Get Pressure/Temperature
- Get External Temperature
- Get Gyro
- Log Latest Variables
- Take Picture
- Send Data Over Lora
- Send Data Over HTTP
- Send Data Over SMS
- Receive Data Over SMS?

#### Lat|Lng|Alt|Pressure|InternalTemp|ExternalTemp|GyroX|GyroY|GyroZ|CellStatus

### GPS/GSM Module (FONA 808)

- Might want to just do things over serial connection using node?
- THIS WILL SHOW HOW TO SET IT UP INITIALLY (AND DO PPP IF WANTED)
- https://learn.adafruit.com/fona-tethering-to-raspberry-pi-or-beaglebone-black?view=all
- THIS IS how to access GPS over
- https://github.com/initialstate/fona-pi-zero/wiki/Part-4.-GPS-Usage
- MIGHT BE ABLE TO USE THIS TO SEND OVER SERIAL
- http://www.instructables.com/id/How-to-make-a-Mobile-Cellular-Location-Logger-with/

### SSD1306 Module ( LCD Display )

- https://www.npmjs.com/package/oled-ssd1306-i2c

### MPU6050 (GYRO)

- https://www.npmjs.com/package/mpu6050
- https://www.npmjs.com/package/i2c-mpu6050
- https://www.npmjs.com/package/mpu6050-dmp

### LORA Radio (SX1276 OR RFM96W)

- https://www.npmjs.com/package/sx127x
- https://www.npmjs.com/package/node-sx1276

### Camera

- https://www.npmjs.com/package/raspicam

### Altimeter (BMP280)

- https://www.npmjs.com/package/bmp280-sensor
- https://www.npmjs.com/package/node-bmp280