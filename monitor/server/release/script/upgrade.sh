#!/bin/sh

#
# Upgrade current monitor server to a new version(maybe same version)
#
# Usage: upgrade.sh version build
#
#  Steps:
#   1. download correpsonding version(such as 0.1.9-SNAPSHOT) from CI to monitor/server folder( default: /opt/monitor/downloads)
#   2. extract download zip to /opt/monitor/server/0.1.9-SNAPSHOT(if exists add suffix: .1/.2)
#   3. mkdir /op/monitor/server/upgrading
#   4. link  /opt/monitor/server/upgrading to /opt/monitor/server/0.1.9-SNAPSHOT
#   5. stop current server instance (in /opt/monitor/server/latest)
#   6. rename /opt/monitor/server/upgrading to /opt/monitor/server/latest
#   7. migrate db
#   8. start new server again

CI=ci.itsnow.com
work_dir=$(cd `dirname $0` && cd ../../ && pwd )
upgrading="upgrading"
current="latest"
cp="/bin/cp -f"

function last_of(){
  last=$(ls . | grep $1 | awk -F@ '{print $2}' | sort -n | tail -1)
  if [ "$last" == "" ]; then
    last="1"
  else
    let last=$last+1
  fi
  echo $last
}

version=$1
if [ ! $2 ]; then
  build=".lastSuccessful"
else
  build="$2:id"
fi

cd $work_dir
old_version=$(cat $current/bin/start.sh | grep APP_TARGET | head -1 | awk -Frelease\- '{print $2}')


folder="$version"
if [ -d "$folder" ]; then
  last=$(last_of $folder)
  folder="$folder@$last"
fi
if [ -d "$folder" ]; then
  echo "The upgrading $work_dir/$folder exist"
  exit 3
fi

file=monitor-server-$version.zip

if [[ "$version" =~ SNAPSHOT$ ]]; then
  target="http://$CI/guestAuth/repository/download/Monitor_Daily_Build/$build/$file"
else
  target="http://$CI/guestAuth/repository/download/Monitor_Sprint_Build/$build/$file"
fi

# wget will override previous same version
echo "Step 1 downloading $target"
wget $target -O downloads/$file

if [ $? -gt 0 ]; then
  echo "Failed to download $target, check you version or CI site status/configuration please!"
  exit 4
fi

echo "Step 2 extract to $folder"
unzip downloads/$file -d $folder
mkdir -p $folder/logs $folder/tmp

echo "Step 3,4 Creating server"
/bin/rm -rf $upgrading
ln -s $work_dir/$folder $work_dir/$upgrading

cd $work_dir
chmod +x $upgrading/bin/*.sh $upgrading/bin/monitorserver $upgrading/db/bin/migrate  $upgrading/script/*.sh
sed -i 's/\/opt\/releases\/itsnow\/monitor-server-.*/\/opt\/monitor\/server\/latest/' $upgrading/config/wrapper.conf

echo "Step 5 stop current system"
cd $current
bin/monitorserver stop

echo "Step 6 backup previous version"
cd $work_dir
last=$(last_of old)
rm -f $current 

mv $upgrading $current
echo "Monitor server upgraded from $old_version to $version, link to $folder"

echo "Step 7 migrate db"
cd $current/db
mysql_pwd=`cat /root/.mysql_pwd`
MYSQL_PWD=$mysql_pwd mysql -uroot <<SQL
  drop database monitor ;
  create database monitor default character set utf8;
SQL

bin/migrate up
if [ $? -gt 0 ]; then
  echo "Failed to migrate new version, but try to start also"
fi

echo "Step 8 start new server"
cd $work_dir/$current
bin/monitorserver start
bin/check.sh logs/wrapper.log MonitorServer

cd $work_dir

if [ $? -eq 0 ]; then
  echo "And new monitor server started"
else
  echo "But new monitor server failed to start"
  exit 128
fi

