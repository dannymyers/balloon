import time
from dal import *
import random

def addReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	message = random.randrange(0, 5465465)
	isSendViaLora = random.randrange(1, 10) % 2 == 0
	isSendViaSms = random.randrange(1, 10) % 2 == 0

	a1 = OutgoingMessage(launchKey, str(message), isSendViaLora, isSendViaSms)
	a1.IsHandledByLora = isSendViaLora and random.randrange(1, 10) % 2 == 0
	a1.IsHandledBySms = isSendViaSms and random.randrange(1, 10) % 2 == 0
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.OutgoingMessageKey))

while true:
	addReading()
	time.sleep(.1)
