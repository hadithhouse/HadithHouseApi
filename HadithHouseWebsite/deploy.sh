echo "Deleting /var/www/HadithHouseWebsite/"
rm -rf /var/www/HadithHouseWebsite/*

echo "Copy server_settings.py from /home/jenkins/server_settings.py to /var/www/HadithHouseWebsite/"
cp /home/jenkins/server_settings.py HadithHouseWebsite/

echo "Running manage.py collectstatic to collect static files."
python manage.py collectstatic --noinput

echo "Copying /tmp/hadithhouse/HadithHouseWebsite to /var/www/HadithHouseWebsite"
cp -r ./* /var/www/HadithHouseWebsite/

echo "Restarting Apache2 server"
sudo /usr/bin/service apache2 restart

