import time
from dal import *
import random


def addGpsReading():
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	a1 = GpsReading(launchKey, "")
	a1.FixMode = random.randrange(1, 10) % 2 == 0
	a1.CourseOverGround = random.randrange(1, 10)
	a1.FixStatus = random.randrange(1, 10) % 2 == 0
	a1.GlonassSatellitesUsed = random.randrange(1, 10)
	a1.GnssRunStatus = random.randrange(1, 10) % 2 == 0
	a1.GnssSatellitesUsed = random.randrange(1, 10)
	a1.GnssSatellitesInView = a1.GnssSatellitesUsed + 10
	a1.Latitude = random.randrange(-90, 90) + random.random()
	a1.Longitude = random.randrange(-180, 180) + random.random()
	a1.MslAltitude = random.randrange(0, 100000) + random.random()
	a1.SpeedOverGround = random.randrange(1, 10)
	session.add(a1)
	SaveSession(session)

	print('Added ' + str(a1.GpsReadingKey))


while true:
	addGpsReading()
	time.sleep(.1)
