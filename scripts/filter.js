/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */

/**
 * 필터를 적용한 맵 데이터를 반환합니다.
 * @param {MapData[]} mapDataList
 * @param {Filter} filter
 * 
 * @returns {MapData[]} 필터링 된 맵 데이터
 */
export default function filterMap(mapDataList, filter) {
    return mapDataList.filter(mapData => {
        // 타입 필터
        if (filter.types.length > 0 && !filter.types.includes(mapData.type))
            return false;

        // 난이도 필터
        if (filter.difficulties.length > 0 && !filter.difficulties.includes(mapData.difficulty))
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