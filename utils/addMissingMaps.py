from typing import List
from changeDirToHere import ChangeDir
from helper import *
ChangeDir()

def main() -> None:
    mapDatas: List[MapData] = mapFileToDict()
    
    # 기존 맵 이름
    existing_map_names = {map_data["name"] for map_data in mapDatas}
    
    release_maps = getReleaseData()
    release_dict = {m["name"]: m for m in release_maps} # 빠른 검색

    missing_maps = []
    
    for map in release_maps:
        # 기존에 없는 맵이면 추가
        if map["name"] not in existing_map_names:
            missing_maps.append(map["name"])
            print(f"🆕 새 맵 발견: {map["name"]}")

    if len(missing_maps) >= 30:
        print(f"❌ 누락된 맵이 너무 많음: {len(missing_maps)}")
        return

    added_count = 0
    failed_count = 0
    
    for map_name in missing_maps:
        map_data = get_single_map_data(map_name)
            
        if map_data:
            # release_dict에서 올바른 release 가져오기
            if map_name in release_dict:
                map_data["release"] = release_dict[map_name].get("release", "")
            
            mapDatas.append(map_data)
            existing_map_names.add(map_name)
            added_count += 1
            print(f"  ✅ {map_name} 추가 완료")
        else:
            failed_count += 1
            print(f"  ❌ {map_name} 조회 실패")

    
    # 추가된 맵이 있으면 저장
    if added_count > 0:
        saveMapFile(mapDatas)
        
        print(f"\n✅ {added_count}개 맵 추가 완료")
        if failed_count > 0:
            print(f"⚠️  {failed_count}개 맵 조회 실패")
    else:
        print("\n✅ 새로운 맵이 없습니다.")


if __name__=="__main__":
    main()
