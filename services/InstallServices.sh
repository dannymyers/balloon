#sudo sh InstallServices.sh
#Altimeter
cp Altimeter.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Altimeter.service
chmod +x /share/balloon/services/Altimeter.py
sudo systemctl daemon-reload
sudo systemctl enable Altimeter.service
sudo systemctl start Altimeter.service

sudo systemctl status Altimeter.service

#Altimeter
cp Altimeter.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Altimeter.service
chmod +x /share/balloon/services/Altimeter.py
sudo systemctl daemon-reload
sudo systemctl enable Altimeter.service
sudo systemctl start Altimeter.service

sudo systemctl status Altimeter.service

#Camera
cp Camera.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Camera.service
chmod +x /share/balloon/services/Camera.py
sudo systemctl daemon-reload
sudo systemctl enable Camera.service
sudo systemctl start Camera.service

sudo systemctl status Camera.service

#Fona
cp Fona.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Fona.service
chmod +x /share/balloon/services/Fona.py
sudo systemctl daemon-reload
sudo systemctl enable Fona.service
sudo systemctl start Fona.service

sudo systemctl status Fona.service

#Gyro
cp Gyro.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Gyro.service
chmod +x /share/balloon/services/Gyro.py
sudo systemctl daemon-reload
sudo systemctl enable Gyro.service
sudo systemctl start Gyro.service

sudo systemctl status Gyro.service

#Lcd
cp Lcd.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Lcd.service
chmod +x /share/balloon/services/Lcd.py
sudo systemctl daemon-reload
sudo systemctl enable Lcd.service
sudo systemctl start Lcd.service

sudo systemctl status Lcd.service

# Check status
#sudo systemctl status Altimeter.service
 
# Start service
#sudo systemctl start Altimeter.service
 
# Stop service
#sudo systemctl stop Altimeter.service
 
# Check service's log
#sudo journalctl -f -u Altimeter.service