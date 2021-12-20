from datetime import datetime
from steam.webapi import webapi_request
import pyrebase
import requests
import logging
import pandas as pd
import os
import sys
import json
import time

# Steam API config
player_info_api = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
key = "F6F2A22B759FEE0F79940A8783603562"
dictionary = {"key": "F6F2A22B759FEE0F79940A8783603562", "steamids": "76561198119517741", "format": "json"}

# Firebase configuration
apiKey = "AIzaSyA2zHs_ZFcq9psawAyDi1ry8XNDJXWHYXE",
authDomain = "steam-players-data.firebaseapp.com",
projectId = "steam-players-data",
storageBucket = "steam-players-data.appspot.com",
messagingSenderId = "935348057673",
appId = "1:935348057673:web:f8b6e0e3de80ed9c2e3198"
databaseURL = 'https://steam-players-data-default-rtdb.firebaseio.com/'

# Logging config
LOG_FORMAT = "%(levelname)s  %(asctime)s - %(message)s"


class FirebaseStorage:
    def __init__(self, apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, databaseURL):
        self.firebase_config = {
            'apiKey': apiKey,
            'authDomain': authDomain,
            'projectId': projectId,
            'storageBucket': storageBucket,
            'messagingSenderId': messagingSenderId,
            'appId': appId,
            'databaseURL': databaseURL
        }
        self.firebase = pyrebase.initialize_app(self.firebase_config)
        self.database = self.firebase.database()

    def store_data(self, data, collection='players'):
        self.database.child(collection).push(data)

    def get_players(self, collection='players'):
        return self.database.child(collection).get()


class UserData:
    def __init__(self, steam_id, comm_vis_state, profile_state, persona_name, profile_url, avatar, avatar_medium
                 , avatar_full, clan_id, time_created, game_name, game_id, country):
        self.steam_id = steam_id
        self.comm_vis_state = comm_vis_state
        self.profiles_tate = profile_state
        self.persona_name = persona_name
        self.profile_url = profile_url
        self.avatar = avatar
        self.avatar_medium = avatar_medium
        self.avatar_full = avatar_full
        # self.persona_state = persona_state
        self.clan_id = clan_id
        self.time_created = time_created
        # self.persona_state_flags = persona_state_flags
        self.game_name = game_name
        self.game_id = game_id
        self.country = country
        self.game_duration = None
        self.game_end = None

    def set_game_duration(self, game_duration):
        self.game_duration = game_duration

    def set_game_end(self, game_end):
        self.game_end = game_end

    def send_to_db(self):
        pass


def create_user_instance(player):
    """
    Storing player's data in an object.

    :param player: Steam API player response
    :return: UserData instance containing all player's information
    """
    steam_id = player['steamid']
    comm_vis_state = player['communityvisibilitystate']
    profile_state = player['profilestate']
    persona_name = player['personaname']
    profile_url = player['profileurl']
    avatar = player['avatar']
    avatar_medium = player['avatarmedium']
    avatar_full = player['avatarfull']
    # persona_state = player['personastate']
    clan_id = player['primaryclanid']
    time_created = player['timecreated']
    # persona_state_flags = player['personastateflags']
    game_name = player['gameextrainfo']
    game_id = player['gameid']
    country = player['loccountrycode']
    user_data = UserData(steam_id, comm_vis_state, profile_state, persona_name, profile_url, avatar, avatar_medium
                         , avatar_full, clan_id, time_created, game_name, game_id,
                         country)
    return user_data


def str_to_date(str_value, type):
    if type == "time":
        date_format = '%H:%M:%S'  # The format
    else:
        date_format = '%Y-%m-%d %H:%M:%S'

    return datetime.strptime(str_value, date_format)


def request_data(url):
    """
    Sending API request.

    :param url: API url
    :return: Api response
    """
    resp = webapi_request(url, params=dictionary)
    return resp


def init_status_dict(response):
    """
    Create a dict containing the result of api request for each player, this dict will be used to store the status of
    each player, and compare it with the content of the new API response to check whether the players have
    started/stopped playing a game (save old status->compare new status with saved status->update dict if any changes).

    :param response: Steam api response
    :return: dict containing response for each player
    """
    players_dict = {}
    for player in response['players']:
        # Delete personastate and personastateflags
        del player['personastate']
        del player['personastateflags']
        players_dict[player['steamid']] = player
    return players_dict


def error_logger(error_message):
    logging.basicConfig(filename=os.path.join(os.path.curdir, 'errors.log'),
                        level=logging.WARNING,
                        format=LOG_FORMAT)
    logger = logging.getLogger()
    logger.critical(error_message)


def get_players_data(firebase_storage):
    """
    curr_api_response = request_data(player_info_api)['response']
    players_status_dict = init_status_dict(curr_api_response)
    start_time = {}
    game_data = {}
    end_time = {}
    game_duration = {}
    """

    try :
        with open('meta/players_status_dict.json','r') as f :
            players_status_dict = json.load(f)
    except FileNotFoundError:
        with open('meta/players_status_dict.json','w') as f:
            curr_api_response = request_data(player_info_api)['response']
            players_status_dict = init_status_dict(curr_api_response)
            json.dump(players_status_dict,f)

    try :
        with open('meta/start_time.json','r') as f :
            start_time = json.load(f)
            for key in start_time:
                try :
                    start_time[key] = datetime.strptime(start_time[key],'%Y-%m-%d %H:%M:%S.%f')
                except ValueError : 
                    start_time[key] = datetime.strptime(start_time[key],'%Y-%m-%d %H:%M:%S')

    except FileNotFoundError:
        with open('meta/players_status_dict.json','w') as f:
            start_time = {}
            json.dump(start_time,f)


    try :
        with open('meta/game_data.json','r') as f :
            game_data = json.load(f)
    except FileNotFoundError:
        with open('meta/game_data.json','w') as f:
            game_data = {}
            json.dump(game_data,f)

    try :
        with open('meta/end_time.json','r') as f :
            end_time = json.load(f)
            for key in end_time:
                try : 
                    end_time[key] = datetime.strptime(end_time[key],'%Y-%m-%d %H:%M:%S.%f')
                except ValueError : 
                    end_time[key] = datetime.strptime(end_time[key],'%Y-%m-%d %H:%M:%S')
    except FileNotFoundError:
        with open('meta/end_time.json','w') as f:
            end_time = {}
            json.dump(end_time,f)


    try :
        with open('meta/game_duration.json','r') as f :
            game_duration = json.load(f)
    except FileNotFoundError:
        with open('meta/game_duration.json','w') as f:
            game_duration = {}
            json.dump(game_duration,f)

    # Reading database content (just for testing)
    # all_players = firebase_storage.get_players()
    # if all_players.val():
    #     for player in all_players.each():
    #         print(player.val())
    # else:
    #     print("Database is empty")

    # Realtime data gathering
    print(players_status_dict)
    while True:
        try:
            new_api_response = request_data(player_info_api)['response']
            # For each player, check if the status has changed
            for player_response in new_api_response['players']:

                # Delete personastate because we don't care if the user is logged or not
                del player_response['personastate']
                del player_response['personastateflags']

                # Get player id and check for any status change
                player_id = player_response['steamid']
                if player_response != players_status_dict[player_id]:
                    if 'gameid' in player_response.keys():
                        start_time[player_id] = datetime.now()
                        open('meta/start_time.json','w').close()
                        with open('meta/start_time.json','w') as f:
                            json.dump(start_time,f,default=str)

                        game_data[player_id] = player_response
                        open('meta/game_data.json','w').close()
                        with open('meta/game_data.json','w') as f:
                            json.dump(game_data,f)
                    else:
                        end_time[player_id] = datetime.now()
                        open('meta/end_time.json','w').close()
                        with open('meta/end_time.json','w') as f:
                            json.dump(end_time,f,default=str)

                        game_duration[player_id] = end_time[player_id] - start_time[player_id]
                        open('meta/game_duration.json','w').close()
                        with open('meta/game_duration.json','w') as f:
                            json.dump(game_duration,f,default=str)

                        # Converting dates to str (to remove ms)
                        game_duration[player_id] = str(game_duration[player_id]).split('.')[0]
                        end_time[player_id] = str(end_time[player_id]).split('.')[0]

                        # Creating UserData instance
                        user_data = create_user_instance(game_data[player_id])
                        user_data.set_game_duration(game_duration[player_id])
                        user_data.set_game_end(end_time[player_id])

                        # Storing data
                        firebase_storage.store_data(user_data.__dict__)
                        print(user_data.__dict__)
                        
                        # Storing data locally
                        df = pd.DataFrame(user_data.__dict__,index = [0])
                        try : 
                            path = "./data/"+player_id+"/"+end_time[player_id].split(" ")[0]+"/"+end_time[player_id].split(" ")[1]
                            file = "/"+"gamestats-"+player_id+"_"+end_time[player_id].split(" ")[0]+"_"+end_time[player_id].split(" ")[1]+".csv"
                            os.makedirs(path,exist_ok=True)
                            df.to_csv(path+file)
                        except Exception as e :
                            print(e)
                    players_status_dict[player_id] = player_response
                    open('meta/players_status_dict.json','w').close()
                    with open('meta/players_status_dict.json','w') as f:
                        json.dump(players_status_dict,f)
            time.sleep(2)
        except requests.exceptions.ReadTimeout or requests.exceptions.Timeout:
            error_logger("Could not retrieve data from API")

        except Exception as e:
            exception_type, exception_object, exception_traceback = sys.exc_info()
            error_logger("Unknown error has occurred - "+repr(e)+"  ligne " + str(exception_traceback.tb_lineno))

    
def read_ids(filename):
    with open(filename,'r') as f :
        ids = f.read().splitlines()
    return ids

def steamIdsList(filename):
    try :
        ids  = read_ids(filename)
        dictionary["steamids"] = ""
        for i in range(0,len(ids) -1):
            dictionary["steamids"] += ids[i] + ","
        dictionary["steamids"] += ids[len(ids)-1]
    except FileNotFoundError: 
        print("File not found")
        pass
    

def main():

    if len(sys.argv) > 1 : steamIdsList(sys.argv[1])
    # Creating connection to database
    firebase_storage = FirebaseStorage(apiKey, authDomain, projectId,
                                       storageBucket, messagingSenderId, appId, databaseURL)
    get_players_data(firebase_storage) 

if __name__ == '__main__':
    main()
