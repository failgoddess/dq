@echo off

for %%x in ("%JAVA_HOME%") do set JAVA_HOME=%%~sx
for %%x in ("%DQ_HOME%") do set DQ_HOME=%%~sx

if "%1" == "start" (
    echo start DQ Server
    start "DQ Server" java -Dfile.encoding=UTF-8 -cp .;%JAVA_HOME%\lib\*;%DQ_HOME%\lib\*; dq.DQServerApplication --spring.config.additional-location=file:%DQ_HOME%\config\application.yml
) else if "%1" == "stop" (
    echo stop DQ Server
    taskkill /fi "WINDOWTITLE DQ Server"
) else (
    echo please use "run.bat start" or "run.bat stop"
)

pause