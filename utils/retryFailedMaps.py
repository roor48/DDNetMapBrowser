from changeDirToHere import ChangeDir
from helper import *
from datetime import datetime
import os
import time
import glob
import json

ChangeDir()

def get_latest_log() -> dict | None:
    """가장 최근 로그 파일 읽기"""
    log_files = glob.glob("./logs/refresh/refresh_*.json")
    
    if not log_files:
        print("❌ 로그 파일이 없습니다.")
        return None
    
    # 파일명 기준
    latest_log = max(log_files)
    
    with open(latest_log, 'r', encoding='utf-8') as f:
        log_data = json.load(f)
    
    print(f"📄 로그 파일: {os.path.basename(latest_log)}")
    time_str = log_data.get('start_time')
    print(f"   시간: {time_str}")
    print(f"   실패 맵: {log_data['failed_count']}개\n")
    
    return log_data

def main():
    start_datetime = datetime.now()
    
    log_data = get_latest_log()
    
    if not log_data:
        return
    
    failed_maps = log_data.get("failed_maps")
    
    if not failed_maps:
        print("✅ 실패한 맵이 없습니다.")
        return
    
    print("=" * 60)
    print(f"🔄 실패한 맵 재시도: {len(failed_maps)}개")
    print("=" * 60)
    
    map_dict = {m["name"]: m for m in mapFileToDict()}
    release_dict = {m["name"]: m for m in getReleaseData()}
    
    added_count = 0
    still_failed = []
    total = len(failed_maps)
    progress_step = total // 20 if total >= 20 else 1
    
    for idx, map_name in enumerate(failed_maps, 1):
        is_print = idx % progress_step == 0 or idx == total
        
        if total < 100:
            print(f"[{idx}/{total}] {map_name} 시도 중...", end=" ")
        elif is_print:
            print(f"> 진행: {idx}/{total} ({idx/total*100:.1f}%)")

        map_data = get_single_map_data(map_name)
        
        if map_data:
            # release 정보 추가
            if map_name in release_dict:
                map_data["release"] = release_dict[map_name].get("release", "")
            
            map_dict[map_name] = map_data

            added_count += 1
            if total < 100:
                print("✅ 업데이트")
        else:
            still_failed.append(map_name)
            if total < 100:
                print("❌ 실패")

        time.sleep(1)
    
    if added_count:
        mapDatas = list(map_dict.values())
        saveMapFile(mapDatas)
        print("\n" + "=" * 60)
        print(f"✅ {added_count}개 맵 저장 완료")
    
    # 로그 저장
    retry_log = {
        "start_time": start_datetime.isoformat(),
        "end_time": datetime.now().isoformat(),
        "original_failed": total,
        "recovered": added_count,
        "still_failed_count": len(still_failed),
        "still_failed_maps": still_failed
    }
    
    save_log(retry_log, "retry")
    
    if still_failed:
        print(f"⚠️  {len(still_failed)}개 맵 여전히 실패:")
        print(f"   {', '.join(still_failed[:5])}" + 
              (f" 외 {len(still_failed)-5}개" if len(still_failed) > 5 else ""))
    else:
        print("🎉 모든 맵 복구 완료!")


if __name__ == "__main__":
    main()
