## Installation 
``
pip3 install -r requirements.txt
``

##  Running the script
``
python3 main.py
``

##  Collecting data from multiple steam IDs
This functionality will be modified later, but for testing purpose, change steamids value in the following line:

```
dictionary = {
    "key": "F6F2A22B759FEE0F79940A8783603562",
    "steamids": "steamid1",
    "format": "json"
}
```

TO :
```
dictionary = {
    "key": "F6F2A22B759FEE0F79940A8783603562",
    "steamids": "steamid1, steamid2, steamid3...",
    "format": "json"
}
```

## Data storage
All data is stored in a Firebase realtime database.

Database URL: 'https://steam-players-data-default-rtdb.firebaseio.com/'

##  Errors and bugs
All errors' logs are in ``errors.log`` file (the file will be created once an error occurs).
