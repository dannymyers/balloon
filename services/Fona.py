from os import system
import serial
from dal import *
from time import sleep
from systemd import journal

journal.send("Fona Start")

ser=serial.Serial('/dev/serial0', 115200, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=1)

def waitForOkOrError(message):
	journal.send("Issuing: " + message)
	ser.write(message + "\r")
	count = 0
	data = ""
	response = ser.readline().rstrip()
	while response != "OK":
		sleep(.1)
		journal.send("Response: " + response)
		if response == "ERROR":
			journal.send("ERROR RETURNED")
			return None
		if response != "" and "AT+" not in response:#Empty Lines OR Echos Ignored
			data += response
		response = ser.readline().rstrip()
	return (response, data)

def enableGps():
	(status, data) = waitForOkOrError("AT+CGNSPWR=1")
	(status, data) = waitForOkOrError("AT+CGNSPWR?")
	if "+CGNSPWR: 1" in data:
		return True
	return False

def getGpsSentence():
	(status, data) = waitForOkOrError("AT+CGNSINF")
	gpsSentence = data.replace("+CGNSINF: ", "")
	return gpsSentence

def addGpsSentence():
	gpsSentence = getGpsSentence()

	journal.send("GPS Sentence: " + gpsSentence)
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)
	journal.send("Launch Key: " + str(launchKey))
	a1 = GpsReading(launchKey, gpsSentence)
	session.add(a1)
	SaveSession(session)
	journal.send("Added GPS Reading: " + str(a1.GpsReadingKey))

def getCellData():
	#AT+COPS? Check that you're connected to the network, in this case T-Mobile

	connected = False
	sigStrength = ""
	batt = ""
	volt = ""
	(status, data) = waitForOkOrError("AT+COPS?")
	if "+COPS: 1" in data:
		connected = True
	#AT+CSQ - Check the 'signal strength' - the first # is dB strength, it should be higher than around 5. Higher is better. Of course it depends on your antenna and location!
	(status, data) = waitForOkOrError("AT+CSQ")
	if "+CSQ:" in data:
		sigStrength = data.replace("+CSQ: ", "").split(",")[0]
	#AT+CBC - will return the lipo battery state. The second number is the % full (in this case its 92%) and the third number is the actual voltage in mV (in this case, 3.877 V)
	(status, data) = waitForOkOrError("AT+CBC")
	if "+CBC:" in data:
		result = data.replace("+CBC: ", "").split(",")
		batt = result[1]
		volt = result[2]

	#connected = random.randrange(1, 10) % 2 == 0
	#sigStrength = random.randrange(0, 50) + random.random()
	#batt = random.randrange(0, 100) + random.random()
	#volt = random.randrange(0, 5000) + random.random() + random.random()
	return (connected, sigStrength, batt, volt)

def addCellReading():

	(connected, sigStrength, batt, volt) = getCellData()
	journal.send("Connected: " + str(sigStrength))
	journal.send("Signal Strength: " + str(connected))
	journal.send("Battery: " + str(batt))
	journal.send("Voltage: " + str(volt))
	session = GetSession()
	launchKey = GetCurrentLaunchKey(session)
	journal.send("Launch Key: " + str(launchKey))
	a1 = CellNetworkReading(launchKey, connected, sigStrength, batt, volt)
	session.add(a1)
	SaveSession(session)
	journal.send("Added Cell Reading: " + str(a1.CellNetworkReadingKey))

print("Has Power: " + str(enableGps()))
while true:
	addGpsSentence()
	addCellReading()
	sleep(30)

ser.close()