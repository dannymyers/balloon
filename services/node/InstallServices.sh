#sudo sh InstallServices.sh
#Web
cp Web.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Web.service
sudo systemctl daemon-reload
sudo systemctl enable Web.service
sudo systemctl start Web.service

#sudo systemctl status Web.service

#Sender
cp Sender.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Sender.service
sudo systemctl daemon-reload
sudo systemctl enable Sender.service
sudo systemctl start Sender.service

sudo systemctl status Sender.service

# Check status
#sudo systemctl status Sender.service
 
# Start service
#sudo systemctl start Sender.service
 
# Stop service
#sudo systemctl stop Sender.service
 
# Check service's log
#sudo journalctl -f -u Sender.service