import json
import requests
TYPES = [
    "Novice",
    "Moderate",
    "Brutal",
    "Insane",
    "Dummy",
    "DDmaX.Easy",
    "DDmaX.Next",
    "DDmaX.Pro",
    "DDmaX.Nut",
    "Oldschool",
    "Solo",
    "Race",
    "Fun",
    "Event"
]

def countMaps(dict):
    return len(dict)    

response = requests.get("https://ddnet.org/releases/maps.json")
allMapDataJson = response.json()

allMapData = {}
myMapData = {}

# allMapData["mapName"] = {"points": 0, "type": "Novice"}
for mapData in allMapDataJson:
    allMapData[mapData["name"]] = {
        "points": mapData["points"],
        "type": mapData["type"]
    }

response = requests.get("https://ddnet.org/players/?json2=roor48")
myMapDataJson = response.json()

# myMapData["mapName"] = {"points": 0, "type": "Novice"}
for type, value in myMapDataJson.get("types").items():
    for mapName, mapData in value["maps"].items():
        myMapData[mapName] = {
            "points": mapData["points"],
            "type": type
        }


print(countMaps(allMapData))
print(countMaps(myMapData))

wrongMapDict = {}
for mapName, mapData1 in myMapData.items():
    if mapName not in allMapData:
        wrongMapDict[mapName] = {
            "points": mapData1["points"],
            "type": mapData1["type"],
            "reason": "cannot found map in map.json"
        }
        continue
    
    mapData2 = allMapData[mapName]
    if mapData1["points"] != mapData2["points"] or mapData1["type"] != mapData2["type"]:
        wrongMapDict[mapName] = {
            "points": mapData1["points"],
            "type": mapData1["type"],
            "reason": "infomation not same"
        }

with open("wrong_map_list.json", "w", encoding="utf-8") as f:
    json.dump(wrongMapDict, f, indent=4, ensure_ascii=False)

print("saved")
