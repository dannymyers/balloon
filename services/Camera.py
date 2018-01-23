import time
from datetime import datetime
from dal import *
import random
import picamera
from systemd import journal

journal.send("Camera Start")

#http://picamera.readthedocs.io/en/release-1.13/api_camera.html#picamera add with statement to close camera?
def takePicture():
	
	journal.send("Initialize Camera")
	camera = picamera.PiCamera()
	time.sleep(2) # Let camera initialize
	fileName = datetime.datetime.now().strftime("%y-%m-%d %H%M%S")
	journal.send("File Name:" + fileName)
	#camera.hflip = True
	#camera.vflip = True
	camera.resolution = (3280, 2464)
	journal.send("Capturing")
	camera.capture("/share/images/" + fileName + ".jpg")
	journal.send("Closing")
	camera.close()

	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)
	journal.send("Launch Key: " + str(launchKey))

	a1 = CameraReading(launchKey, fileName)
	session.add(a1)
	SaveSession(session)

	print('Added Camera ' + fileName + " " + str(a1.CameraReadingKey))
	journal.send("Added Camera Reading: " + str(a1.CameraReadingKey))

while true:
	takePicture()
	time.sleep(60)