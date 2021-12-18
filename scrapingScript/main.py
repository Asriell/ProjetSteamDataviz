from datetime import datetime
from steam.webapi import webapi_request
import pyrebase
import requests
import logging
import os
import sys
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
    curr_api_response = request_data(player_info_api)['response']
    players_status_dict = init_status_dict(curr_api_response)
    start_time = {}
    game_data = {}
    end_time = {}
    game_duration = {}
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
                        game_data[player_id] = player_response
                    else:
                        end_time[player_id] = datetime.now()
                        game_duration[player_id] = end_time[player_id] - start_time[player_id]

                        # Converting dates to str (to remove ms)
                        game_duration[player_id] = str(game_duration[player_id]).split('.')[0]
                        end_time[player_id] = str(end_time[player_id]).split('.')[0]

                        # Creating UserData instance
                        user_data = create_user_instance(game_data[player_id])
                        user_data.set_game_duration(game_duration[player_id])
                        user_data.set_game_end(end_time[player_id])

                        # Storing data
                        firebase_storage.store_data(user_data.__dict__)
                    players_status_dict[player_id] = player_response
            time.sleep(2)
        except requests.exceptions.ReadTimeout or requests.exceptions.Timeout:
            error_logger("Could not retrieve data from API")

        except Exception as e:
            error_logger("Unknown error has occurred")

    
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
