import requests
import json
from changeDirToHere import ChangeDir
ChangeDir()

def main():
    response = requests.get("https://ddnet.org/releases/maps.json")
    data = response.json()

    with open("../assets/releases-map.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

if __name__=="__main__":
    main()
