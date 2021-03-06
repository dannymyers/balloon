import time
from dal import *
import random
from mpu6050 import mpu6050
from systemd import journal

journal.send("Gyro Start")

def addGyroReading():
	sensor = mpu6050(0x68)
	accel = sensor.get_accel_data()
	gyro = sensor.get_gyro_data()
	temp = (sensor.get_temp() * 9/5) + 32
	ax = accel["x"]
	ay = accel["y"]
	az = accel["z"]
	gx = gyro["x"]
	gy = gyro["y"]
	gz = gyro["z"]
	mx = 0
	my = 0
	mz = 0


	journal.send("Accel[x,y,z]: " + str(ax) + "," + str(ay) + "," + str(az))
	journal.send("Gyro[x,y,z]: " + str(gx) + "," + str(gy) + "," + str(gz))
	#journal.send("Mag[x,y,z]: " + str(mx) + "," + str(my) + "," + str(mz))
	journal.send("Temp: " + str(temp) + "F")

	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)
	journal.send("Launch Key: " + str(launchKey))

	#temp = random.randrange(-60, 105) + random.random()
	#ax = random.randrange(-180, 180) + random.random()
	#ay = random.randrange(-180, 180) + random.random()
	#az = random.randrange(-180, 180) + random.random()
	#gx = random.randrange(-180, 180) + random.random()
	#gy = random.randrange(-180, 180) + random.random()
	#gz = random.randrange(-180, 180) + random.random()
	#mx = random.randrange(-180, 180) + random.random()
	#my = random.randrange(-180, 180) + random.random()
	#mz = random.randrange(-180, 180) + random.random()

	a1 = GyroReading(launchKey, temp, gx, gy, gz, ax, ay, az, mx, my, mz)
	session.add(a1)
	SaveSession(session)
	journal.send("Added Gyro Reading: " + str(a1.GyroReadingKey))

while true:
	addGyroReading()
	time.sleep(30)
