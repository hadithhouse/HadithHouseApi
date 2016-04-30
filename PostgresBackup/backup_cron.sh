today=`date +%Y-%m-%d`
logfile="backup_${today}.log"
./pg_backup_rotated.sh > $logfile 2>&1
if [ $? -ne 0 ];
then
  mail -a "From: Postgres Admin <noreply@hadithhouse.net>" -s "Postgres Database Backup on $today - Failed" "admin@hadithhouse.net" < $logfile
  exit 1
else
  mail -a "From: Postgres Admin <noreply@hadithhouse.net>" -s "Postgres Database Backup on $today - Succeeded" "admin@hadithhouse.net" < $logfile
  exit 0
fi
