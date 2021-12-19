## Installation 
``
pip3 install -r requirements.txt
``

##  Running the script
``
python3 main.py
``

##  Collecting data from multiple steam IDs

We can add a file with steam ids as script argument. The script will collect informations from each ids. We have a default value when no argument is provided or if the file is not found. 

## Data storage
All data is stored in a Firebase realtime database.

Database URL: 'https://steam-players-data-default-rtdb.firebaseio.com/'

##  Errors and bugs
All errors' logs are in ``errors.log`` file (the file will be created once an error occurs).

## Script Scheduling 

Type "crontab -e" in VM to manage scheduling.
	 "crontab -l" in VM to list schedules.
	 "systemctl restart cron" to restart scheduling service.
	 
```
In our case : * * * * * python3 ~/dataviz/mainWithoutWhile.py ~/dataviz/steamIds.txt
```
Run our script every minutes.
