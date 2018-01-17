import time
from dal import *
import random


def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	temp = random.randrange(-60, 105) + random.random()
	pres = random.randrange(0, 10000) + random.random()
	alt = random.randrange(600, 100000) + random.random()

	a1 = AltitudeReading(launchKey, temp, pres, alt)
	session.add(a1)
	SaveSession(session)
	print('Added ' + str(a1.AltitudeReadingKey))

while true:
	addReading()
	time.sleep(.1)