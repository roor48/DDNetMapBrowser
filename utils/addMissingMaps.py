from typing import List
from changeDirToHere import ChangeDir
from helper import *
ChangeDir()

def main() -> None:
    mapDatas: List[MapData] = mapFileToDict()
    
    # 기존 맵 이름 Set
    existing_map_names = {map_data["name"] for map_data in mapDatas}
    
    release_maps = getReleaseData()

    missing_maps = []
    
    for map in release_maps:
        # 기존에 없는 맵이면 추가
        if map["name"] not in existing_map_names:
            missing_maps.append(map["name"])
            print(f"🆕 새 맵 발견: {map["name"]}")

    if len(missing_maps) >= 30:
        print(f"❌ 누락된 맵이 너무 많음: {len(missing_maps)}")
        return

    for map_name in missing_maps:
        map_data = get_single_map_data(map_name)
            
        if map_data:
            map_data["release"] = map.get("release", "")
            
            mapDatas.append(map_data)
            existing_map_names.add(map_name)
            print(f"  ✅ 추가 완료")
        else:
            print(f"  ❌ 조회 실패")

    
    # 추가된 맵이 있으면 저장
    if missing_maps:
        # 출시 데이터가 있는 맵과 없는 맵 분리
        maps_with_date = []
        maps_without_date = []
        
        for map_data in mapDatas:
            if map_data.get("release"):
                maps_with_date.append(map_data)
            else:
                maps_without_date.append(map_data)
        
        # 출시 순 정렬
        maps_with_date.sort(key=lambda x: x.get("release", ''), reverse=True)
        
        mapDatas = maps_with_date + maps_without_date

        saveMapFile(mapDatas)
        
        print(f"\n✅ {len(missing_maps)}개 맵 추가 완료!")
    else:
        print("\n✅ 새로운 맵이 없습니다.")


if __name__=="__main__":
    main()
