#!/bin/bash

#start server

if [ -z "$DQ_HOME" ]; then
  echo "DQ_HOME not found"
  echo "Please export DQ_HOME to your environment variable"
  exit
fi

cd $DQ_HOME
Lib_dir=`ls | grep lib`
if [ -z "$Lib_dir" ]; then
  echo "Invalid DQ_HOME"
  exit
fi

Server=`ps -ef | grep java | grep dq.DQServerApplication | grep -v grep | awk '{print $2}'`
if [[ $Server -gt 0 ]]; then
  echo "[DQ Server] is already started"
  exit
fi

cd $DQ_HOME
TODAY=`date "+%Y-%m-%d"`
LOG_PATH=$DQ_HOME/logs/sys/dq.$TODAY.log
nohup java -Dfile.encoding=UTF-8 -cp $JAVA_HOME/lib/*:lib/* dq.DQServerApplication > $LOG_PATH  2>&1 &

echo "=========================================="
echo "Starting..., press \`CRTL + C\` to exit log"
echo "=========================================="

sleep 3s
tail -f $LOG_PATH