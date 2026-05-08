import type { MapData, Filter, TeeData } from './types';
import Fuse from 'fuse.js'

/**
 * 필터를 적용한 맵 데이터를 반환합니다.  
 * 이름 검색이 적용 된 경우 유사도 기준으로 정렬된 맵 데이터를 반환합니다.
 * 
 * @returns 필터링 된 맵 데이터
 */
export default function getFilteredMaps(mapDataList: MapData[], filter: Filter, teeData: TeeData): MapData[] {
    let results = mapDataList;

    const searchKeys: Array<'name' | 'mapper'> = [];
    if (filter.name.trim()) {
        searchKeys.push('name');
    }
    if (filter.mapper.trim()) {
        searchKeys.push('mapper');
    }

    if (searchKeys.length > 0) {
        const fuse = new Fuse(mapDataList, {
            keys: searchKeys,
            threshold: 0.4
        });

        const conditions: Array<{ name: string } | { mapper: string }> = [];
        if (filter.name.trim()) {
            conditions.push({ name: filter.name.trim() });
        }
        if (filter.mapper.trim()) {
            conditions.push({ mapper: filter.mapper.trim() });
        }

        results = fuse.search({ $and: conditions }).map(r => r.item);
    }
    
    return results.filter(mapData => {
        // 유저 데이터 필터
        if (teeData.player) {
            if (filter.isFinished && !teeData.finishData[mapData.name])
                return false;
            if (filter.isUnfinished && teeData.finishData[mapData.name])
                return false;
        }
        
        // 타입 필터
        if (filter.types.length > 0 && !filter.types.includes(mapData.type))
            return false;

        // 난이도 필터
        if (filter.difficultyMin > mapData.difficulty || filter.difficultyMax < mapData.difficulty)
            return false;

        // 타일 필터
        if (filter.tiles.length > 0) {
            // AND
            const hasTile = filter.tiles.every(tile => mapData.tiles.includes(tile));
            // OR
            // const hasTile = filter.tiles.some(tile => mapData.tiles.includes(tile));
            if (!hasTile)
                return false;
        }

        return true;
    });
}
