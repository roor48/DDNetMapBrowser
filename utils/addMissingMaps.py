from typing import List
from changeDirToHere import ChangeDir
from updateHelper import *
ChangeDir()

def main() -> None:
    mapDatas: List[MapData] = mapFileToDict()
    
    # 기존 맵 이름 Set
    existing_map_names = {map_data["name"] for map_data in mapDatas}
    
    release_maps = getReleaseData()

    added_maps = 0
    
    for map in release_maps:
        map_name = map["name"]
        
        # 기존에 없는 맵이면 추가
        if map_name not in existing_map_names:
            print(f"🆕 새 맵 발견: {map_name}")
            
            map_data = get_single_map_data(map_name)
            
            if map_data:
                map_data["release"] = map.get("release", "")
                
                added_maps += 1
                mapDatas.append(map_data)
                existing_map_names.add(map_name)
                print(f"  ✅ 추가 완료")
            else:
                print(f"  ❌ 조회 실패")
    
    # 추가된 맵이 있으면 저장
    if added_maps:
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
        
        print(f"\n✅ {added_maps}개 맵 추가 완료!")
    else:
        print("\n✅ 새로운 맵이 없습니다.")


if __name__=="__main__":
    main()
