from helper import *
import time
from datetime import datetime
import os
import json

def main():
    print("=" * 60)
    print("🔄 전체 맵 갱신 시작")
    print("=" * 60)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    start_time = time.time()

    release_maps = getReleaseData()
    total = len(release_maps)

    failed = []

    refreshedData: list[MapData] = []
    
    for idx, release_map in enumerate(release_maps, 1):
        map_name = release_map["name"]
        map_data = get_single_map_data(map_name)

        if map_data:
            map_data["release"] = release_map.get("release", "")
            refreshedData.append(map_data)
        else:
            failed.append(map_name)


        if idx%100 == 0 or idx == total:
            print(f"> 진행: {idx}/{total} ({idx/total*100:.1f}%)")

        time.sleep(1)
 

    print("="*60)
    if failed:
        print(f"❌ 실패: {len(failed)}개")
        print(f"   실패 맵: {', '.join(failed[:5])}" + 
              (f" 외 {len(failed)-5}개" if len(failed) > 5 else ""))

        # 실패한 맵은 기존 정보 사용
        existing_maps = mapFileToDict()
        existing_dict = {m["name"]: m for m in existing_maps} # 빠른 검색
        
        for map_name in failed:
            if map_name in existing_dict:
                refreshedData.append(existing_dict[map_name])

    saveMapFile(refreshedData)

    elapsed = (time.time() - start_time) / 60
    successful_count = total - len(failed)
    
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "total_maps": total,
        "successful": successful_count,
        "failed_count": len(failed),
        "failed_maps": failed,
        "execution_time": f"{elapsed:.1f} minutes"
    }

    os.makedirs("logs", exist_ok=True)
    with open(f"logs/refresh_{timestamp}.json", "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=4)
    
if __name__ == "__main__":
    main()
