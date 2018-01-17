import time
from dal import *
import random


def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	connected = random.randrange(1, 10) % 2 == 0
	sigStrength = random.randrange(0, 50) + random.random()
	batt = random.randrange(0, 100) + random.random()
	volt = random.randrange(0, 5000) + random.random() + random.random()
	a1 = CellNetworkReading(launchKey, connected, sigStrength, batt, volt)
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.CellNetworkReadingKey))


while true:
	addReading()
	time.sleep(.1)
