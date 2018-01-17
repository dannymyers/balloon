import time
from dal import *
import random

def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	fileName = random.randrange(10000000, 90000000)
	a1 = CameraReading(launchKey, str(fileName) + ".jpg")
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.CameraReadingKey))


while true:
	addReading()
	time.sleep(.1)
