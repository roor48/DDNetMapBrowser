from typing import List
from changeDirToHere import ChangeDir
from helper import *
from datetime import datetime
import time
import json
import os
ChangeDir()

def main() -> None:
    start_datetime = datetime.now()
    
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
    failed_maps = []
    
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
            failed_maps.append(map_name)
            print(f"  ❌ {map_name} 조회 실패")
        
        time.sleep(1)

    if not added_count and not failed_maps:
        print("\n✅ 새로운 맵이 없습니다.")
    
    # 추가된 맵이 있으면 저장
    if added_count:
        saveMapFile(mapDatas)
        print(f"\n✅ {added_count}개 맵 추가 완료")
    
    # 실패한 맵이 있으면 로그 저장
    if failed_maps:
        print(f"⚠️  {len(failed_maps)}개 맵 조회 실패")
        log_data = {
            "start_time": start_datetime.isoformat(),
            "end_time": datetime.now().isoformat(),
            "found_new_maps": len(missing_maps),
            "added": added_count,
            "failed_count": len(failed_maps),
            "failed_maps": failed_maps
        }
        
        os.makedirs("./logs", exist_ok=True)
        with open("./logs/lastMissedMap.json", "w", encoding="utf-8") as f:
            json.dump(log_data, f, indent=4, ensure_ascii=False)


if __name__=="__main__":
    main()
