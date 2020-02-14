@echo off

for %%x in ("%MYSQL_HOME%") do set MYSQL_HOME=%%~sx
for %%x in ("%DQ_HOME%") do set DQ_HOME=%%~sx

%MYSQL_HOME%\bin\mysql.exe -h localhost -uroot -proot dq < %DQ_HOME%\bin\dq.sql