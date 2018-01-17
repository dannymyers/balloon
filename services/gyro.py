import time
from dal import *
import random

def addGyroReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	temp = random.randrange(-60, 105) + random.random()
	ax = random.randrange(-180, 180) + random.random()
	ay = random.randrange(-180, 180) + random.random()
	az = random.randrange(-180, 180) + random.random()
	gx = random.randrange(-180, 180) + random.random()
	gy = random.randrange(-180, 180) + random.random()
	gz = random.randrange(-180, 180) + random.random()
	mx = random.randrange(-180, 180) + random.random()
	my = random.randrange(-180, 180) + random.random()
	mz = random.randrange(-180, 180) + random.random()

	a1 = GyroReading(launchKey, temp, gx, gy, gz, ax, ay, az, mx, my, mz)
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.GyroReadingKey))


while true:
	addGyroReading()
	time.sleep(.1)
