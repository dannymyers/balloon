import time
from dal import *
import random

def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	module = random.randrange(0, 5465465)
	errorMessage = random.randrange(0, 5465465)
	a1 = ErrorMessage(launchKey, str(module), str(errorMessage))
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.ErrorMessageKey))


while true:
	addReading()
	time.sleep(.1)
