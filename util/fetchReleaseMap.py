import json
import requests
from changeDirToHere import ChangeDir
ChangeDir()


response = requests.get("https://ddnet.org/releases/maps.json")
mapData = response.json()

with open("../assets/maps.json", "w", encoding="utf-8") as f:
    json.dump(mapData, f, indent=4, ensure_ascii=False)