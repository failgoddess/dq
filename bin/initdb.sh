#!/bin/bash
mysql -P 4401 -h localhost -u root -p123456 dq < ./dq.sql
