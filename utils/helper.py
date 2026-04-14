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

def mapFileToDict() -> List[MapData]:
    """/assets/maps.json에서 맵 데이터 로드"""
    import json
    
    with open("../assets/maps.json", 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def saveMapFile(maps: List[MapData]) -> None:
    """/assets/maps.json에 맵 데이터 저장"""
    import json
    
    print("maps.json 저장 중")

    with open("../assets/maps.json", 'w', encoding='utf-8') as f:
        json.dump(maps, f, indent=4, ensure_ascii=False)

    print("  ✅ 완료")

def get_single_map_data(map_name: str) -> Optional[MapData]:
    """개별 맵 데이터 조회"""
    try:
        url = f'https://ddnet.org/maps/?json={map_name}'
        response = requests.get(url, timeout=10)
    
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
