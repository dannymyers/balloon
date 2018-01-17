import time
from dal import *
import random

def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)
	temp = random.randrange(-60, 105) + random.random()
	a1 = ExternalTemperatureReading(launchKey, temp)
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.ExternalTemperatureReadingKey))


while true:
	addReading()
	time.sleep(.1)
