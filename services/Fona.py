from os import system
import serial
from time import sleep

# Check for a GPS fix
def checkForFix():
	print "checking for fix"
	# Start the serial connection
	ser=serial.Serial('/dev/serial0', 115200, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=1)
	# Turn on the GPS
	ser.write("AT+CGNSPWR=1\r")
	ser.write("AT+CGNSPWR?\r")
	while True:
		response = ser.readline()
		if " 1" in response:
			break
	# Ask for the navigation info parsed from NMEA sentences
	ser.write("AT+CGNSINF\r")
	while True:
			response = ser.readline()
			# Check if a fix was found
			if "+CGNSINF: 1,1," in response:
				print "fix found"
				print response
				return True
			# If a fix wasn't found, wait and try again
			if "+CGNSINF: 1,0," in response:
				sleep(5)
				ser.write("AT+CGNSINF\r")
				print "still looking for fix"
			else:
				ser.write("AT+CGNSINF\r")

# Read the GPS data for Latitude and Longitude
def getCoord():
	# Start the serial connection
	ser=serial.Serial('/dev/serial0', 115200, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, timeout=1)
	ser.write("AT+CGNSINF\r")
	while True:
		response = ser.readline()
		if "+CGNSINF: 1," in response:
			# Split the reading by commas and return the parts referencing lat and long
			array = response.split(",")
			lat = array[3]
			print lat
			lon = array[4]
			print lon
			return (lat,lon)




print(checkForFix())
print(getCoord())