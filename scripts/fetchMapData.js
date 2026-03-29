/**
 * @typedef {import('./types.js').MapData} MapData
 */

/**
 * 맵 데이터와 타일 목록을 가져옵니다.
 * @returns {Promise<[MapData[], string[]]>} [맵 데이터 배열, 정렬된 타일 목록]
 */
export default async function fetchMapData() {
    try {
        const isDev = 
            window.location.hostname === 'localhost' 
            || window.location.hostname === '127.0.0.1'
            || window.location.protocol === 'file:';
        const url = isDev 
            ? './public/maps.json'
            : 'https://ddnet.org/releases/maps.json';
        const res = await fetch(url);
        /** @type {MapData[]} */
        const mapData = await res.json();

        const tiles = new Set();
        mapData.forEach(map => {
            map.tiles.forEach(tile => {
                tiles.add(tile);
            })
        });
        const sorted_tiles = Array.from(tiles).sort();

        return [mapData, sorted_tiles];
    } catch (error) {
        console.error('Failed to fetch maps:', error);
    }
}
