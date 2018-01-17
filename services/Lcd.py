# Copyright (c) 2017 Adafruit Industries
# Author: Tony DiCola & James DeVito
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
import time
import datetime
import socket

import Adafruit_GPIO.SPI as SPI
import Adafruit_SSD1306

from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from uptime import uptime
import subprocess
try:
    import httplib
except:
    import http.client as httplib

summaryCount = 0

def getHostName():
    hostName = socket.gethostbyname(socket.gethostname())
    return hostName

def hasInternet():
    return False
    #conn = httplib.HTTPConnection("www.google.com", timeout=5)
    #try:
    #    conn.request("HEAD", "/")
    #    conn.close()
    #    return True
    #except:
    #    conn.close()
    #    return False

def Summary(font, x, top, draw):

    global summaryCount
    summary = ""
    numItems = 19
    if summaryCount % numItems == 0:
        summary += datetime.datetime.now().strftime("%m/%d %H%M")
        summary += "\n" + getHostName()
    if summaryCount % numItems == 1:
        summary += "Net: " + ("Yes" if hasInternet() else "No")
        summary += "\nUptime: " + str(uptime()) + "s"
    if summaryCount % numItems == 2:
        summary += "Signal: 10db"
        summary += "\nGPS Batt: 69%"
    if summaryCount % numItems == 3:
        summary += "GPS Fix: Yes!!!!!!!"
        summary += "\nNum Err: 1,000"
    if summaryCount % numItems == 4:
        summary += "GPS: Yes"
        summary += "\nCell: Yes"
    if summaryCount % numItems == 5:
        summary += "Cam: Yes"
        summary += "\nAlt: Yes"
    if summaryCount % numItems == 6:
        summary += "Gyro: Yes"
        summary += "\nExtTemp: Yes"
    if summaryCount % numItems == 7:
        summary += "Cell Con: Yes"
        summary += "Init: 12/31/20"
    if summaryCount % numItems == 8:
    	summary += "Launch: 12/32/2016"
        summary += "TFT: 4 hrs"
    if summaryCount % numItems == 9:
        summary += "Temp Sea Lvl: 39F"
        summary += "Pres Sea Lvl: 10,000 Kpa"
    if summaryCount % numItems == 10:
        summary += "Lat: 123.29292"
        summary += "Lng: 123.29292"
    if summaryCount % numItems == 11:
        summary += "Gps Alt: 123.29292 Ft"
        summary += "Sats: 10 /12"
    if summaryCount % numItems == 12:
        summary += "Ex Temp: 12.5 F"
        summary += "Alt Temp: 12.5 F"
    if summaryCount % numItems == 13:
        summary += "Gyro Temp: 12.5 F"
        summary += "Pressure: 10,000 Kpa"
    if summaryCount % numItems == 14:
        summary += "Altitude: 10,000 Ft"
        summary += "Img: 12341241241212.jpg"
    if summaryCount % numItems == 15:
        summary += "Gyro [X,Y,Z]: 123.1424,214.3,1241.3"
        summary += "Accel [X,Y,Z]: 123.1424,214.3,1241.3"
    if summaryCount % numItems == 16:
        summary += "Inc Msg: Send Coord"
    if summaryCount % numItems == 17:
        summary += "Ext Msg: Gps: 12.412,214.124"
    if summaryCount % numItems == 18:
        summary += "Err Mod: GPS"
        summary += "Err Msg: Unhandled blah blah blah"

    draw.text((x, top), summary, font=font, fill=255)
    summaryCount = summaryCount + 1
    #draw.text((x, top + 10), summary2, font=font, fill=255)

# Raspberry Pi pin configuration:
RST = None     # on the PiOLED this pin isnt used
# Note the following are only used with SPI:
DC = 23
SPI_PORT = 0
SPI_DEVICE = 0

# Beaglebone Black pin configuration:
# RST = 'P9_12'
# Note the following are only used with SPI:
# DC = 'P9_15'
# SPI_PORT = 1
# SPI_DEVICE = 0

# 128x32 display with hardware I2C:
disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST)

# 128x64 display with hardware I2C:
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST)

# Note you can change the I2C address by passing an i2c_address parameter like:
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, i2c_address=0x3C)

# Alternatively you can specify an explicit I2C bus number, for example
# with the 128x32 display you would use:
# disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST, i2c_bus=2)

# 128x32 display with hardware SPI:
# disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST, dc=DC, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE, max_speed_hz=8000000))

# 128x64 display with hardware SPI:
# disp = Adafruit_SSD1306.SSD1306_128_64(rst=RST, dc=DC, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE, max_speed_hz=8000000))

# Alternatively you can specify a software SPI implementation by providing
# digital GPIO pin numbers for all the required display pins.  For example
# on a Raspberry Pi with the 128x32 display you might use:
# disp = Adafruit_SSD1306.SSD1306_128_32(rst=RST, dc=DC, sclk=18, din=25, cs=22)

# Initialize library.
disp.begin()

# Clear display.
disp.clear()
disp.display()

# Create blank image for drawing.
# Make sure to create image with mode '1' for 1-bit color.
width = disp.width
height = disp.height
image = Image.new('1', (width, height))

# Get drawing object to draw on image.
draw = ImageDraw.Draw(image)

# Draw a black filled box to clear the image.
draw.rectangle((0,0,width,height), outline=0, fill=0)

# Draw some shapes.
# First define some constants to allow easy resizing of shapes.
padding = 0
top = padding
bottom = height-padding
# Move left to right keeping track of the current x position for drawing shapes.
x = 0


# Load default font.
#font = ImageFont.load_default()

# Alternatively load a TTF font.  Make sure the .ttf font file is in the same directory as the python script!
# Some other nice fonts to try: http://www.dafont.com/bitmap.php
font = ImageFont.truetype('/share/balloon/assets/VCR_OSD_MONO_1.001.ttf', 16)

i = 0
while True:

    # Draw a black filled box to clear the image.
    draw.rectangle((0,0,width,height), outline=0, fill=0)

    Summary(font, x, top, draw)

    # Display image.
    disp.image(image)
    disp.display()
    time.sleep(.5)
    i = i + 1