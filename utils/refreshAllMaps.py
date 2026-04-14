from helper import *
import time

def main():
    release_maps = getReleaseData()
    release_maps = [map["name"] for map in release_maps]

    refreshedData: dict[str, MapData] = {}
    for map_name in release_maps:
        print(f"{map_name} 정보 받는 중")

        map_data = get_single_map_data(map_name)
        refreshedData[map_name] = map_data

        print(f"  ✅ 완료")
        time.sleep(1)
 
    saveMapFile(refreshedData)


if __name__ == "__main__":
    main()
