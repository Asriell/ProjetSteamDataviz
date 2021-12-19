#!/bin/bash
ps -ef | grep "python3 /home/ubuntu/dataviz/main.py"
var1=$(ps -ef | grep -c "python3 /home/ubuntu/dataviz/main.py")
var2=2
# if not found - equals to 1, start it
if [ $var1 -lt $var2 ]
then
python3 /home/ubuntu/dataviz/main.py /home/ubuntu/dataviz/steamIds.txt
else
echo "eq 0 - script running - do nothing"
fi