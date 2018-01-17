import time
from dal import *
import random

def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	source = random.randrange(0, 5465465)
	message = random.randrange(0, 5465465)

	a1 = IncomingMessage(launchKey, str(source), str(message))
	a1.IsHandled = random.randrange(1, 10) % 2 == 0
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.IncomingMessageKey))


while true:
	addReading()
	time.sleep(.1)
