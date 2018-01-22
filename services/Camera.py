import time
from datetime import datetime
from dal import *
import random
import picamera

#http://picamera.readthedocs.io/en/release-1.13/api_camera.html#picamera add with statement to close camera?
def takePicture():

	camera = picamera.PiCamera()
	time.sleep(2) # Let camera initialize
	fileName = datetime.datetime.now().strftime("%y-%m-%d %H%M%S")
	#camera.hflip = True
	#camera.vflip = True
	camera.resolution = (3280, 2464)
	camera.capture("/share/images/" + fileName + ".jpg")
	camera.close()
	
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)

	a1 = CameraReading(launchKey, fileName)
	session.add(a1)
	SaveSession(session)

	print('Added Camera ' + fileName + " " + str(a1.CameraReadingKey))

while true:
	takePicture()
	time.sleep(60)