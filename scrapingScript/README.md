## Installation 
``
pip3 install -r requirements.txt
``

##  Running the script
```
python3 mainScript.py steamIds.txt 

or 

python3 main.py steamIds.txt 
```
main.py and mainScript.py are the same scripts, excepted that mainScript.py saves the current state of each variable in files and not main.py . In our VM, we run mainScript.py.

## VM access : 

address : 192.168.74.201 .
password : steam

##  Collecting data from multiple steam IDs

We can add a file with steam ids as script argument. The script will collect informations from each ids. We have a default value when no argument is provided or if the file is not found. 

## Data storage
All data is stored in a Firebase realtime database.

Database URL: 'https://steam-players-data-default-rtdb.firebaseio.com/'

##  Errors and bugs
All errors' logs are in ``errors.log`` file (the file will be created once an error occurs).
