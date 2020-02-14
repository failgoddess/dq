#!/bin/bash

Server=`ps -ef | grep java | grep dq.DQServerApplication | grep -v grep | awk '{print $2}'`
if [[ $Server -gt 0 ]]; then
  kill -9 $Server
else
  echo "[DQ Server] System did not run."
fi
