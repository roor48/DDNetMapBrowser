import requests
from typing import Optional
from typing import TypedDict, List

class MapData(TypedDict):
    """DDNet 맵 데이터 타입"""
    name: str
    website: str
    thumbnail: str
    web_preview: str
    type: str
    points: int
    difficulty: int
    mapper: str
    release: str
    width: int
    height: int
    tiles: List[str]

def getReleaseData() -> List[MapData]:
    response = requests.get("https://ddnet.org/releases/maps.json")
    return response.json()

def sortMaps(maps: List[MapData]) -> List[MapData]:
    """날짜 정렬 (최신순)"""
    maps_with_date = [m for m in maps if m.get("release")]
    maps_without_date = [m for m in maps if not m.get("release")]
    
    maps_with_date.sort(key=lambda x: x.get("release", ""), reverse=True)
    
    return maps_with_date + maps_without_date

def mapFileToDict() -> List[MapData]:
    """/assets/maps.json에서 맵 데이터 로드"""
    import json
    
    with open("../assets/maps.json", 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def saveMapFile(maps: List[MapData]) -> None:
    """maps를 정렬 후 /assets/maps.json에 맵 데이터 저장"""
    import json

    print("maps.json 저장 중")
    maps = sortMaps(maps)

    with open("../assets/maps.json", 'w', encoding='utf-8') as f:
        json.dump(maps, f, indent=4, ensure_ascii=False)

    print("  ✅ 완료")

def get_single_map_data(map_name: str) -> Optional[MapData]:
    """개별 맵 데이터 조회"""
    try:
        response = requests.get(
            'https://ddnet.org/maps/',
            params={'json': map_name},
            timeout=10
        )
    
        if response.status_code != 200:
            return None
    
        data = response.json()

        # MapData에 정의된 필드만
        allowed_fields = MapData.__annotations__.keys()
        data = {k: v for k, v in data.items() if k in allowed_fields}

        return data
    
    except Exception as e:
        print(f"  ❌ {map_name}: {e}")
        return None

def save_log(log_data: dict, log_type: str = "temp") -> None:
    """로그 파일 저장
    
    Args:
        log_data: 저장할 로그 데이터
        log_type: 로그 타입 (refresh, retry 등)
    """
    import json
    import os
    from datetime import datetime
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    os.makedirs(f"./logs/{log_type}", exist_ok=True)
    
    with open(f"./logs/{log_type}/{log_type}_{timestamp}.json", "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=4, ensure_ascii=False)
