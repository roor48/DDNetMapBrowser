/**
 * @typedef {import('./types.js').MapData} MapData
 */

import { TYPES, LEVEL_OFFSET } from './types.js'

/** 
 * @param {string} type 
 * @param {number} points 
 * @returns {number | null}
 */
function getMapDifficulty(type, points) {
    if (type.includes(TYPES.DDmaX)) {
        type = TYPES.DDmaX;
    }

    const config = LEVEL_OFFSET[type];
    if (!config) {
        return null;
    }
    
    const difficulty = (points - config.Offset) / config.Multiplier;
    return difficulty;
}

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

        const mapPath = './assets/maps.json';
        const releaseUrl = isDev ? './assets/releases-map.json' : 'https://ddnet.org/releases/maps.json';
        
        const fileRes = await fetch(mapPath, { cache: "no-store"});
        /** @type {MapData[]} */
        const mapData = await fileRes.json();
        /** @type {Record<string, MapData>} */
        const mapDict = Object.fromEntries(
            mapData.map(map => [map.name, map])
        );

        const releaseRes = await fetch(releaseUrl, { cache: "no-store" });
        /** @type {MapData[]} */
        const releaseData = await releaseRes.json();

        /** @type {MapData[]} */
        const fixedMapData = releaseData.map(map => {
            return mapDict[map.name] ?? map;
        });
        
        const tiles = new Set();
        mapData.forEach(map => {
            // add tiles
            map.tiles.forEach(tile => {
                tiles.add(tile);
            })
        });
        const sorted_tiles = Array.from(tiles).sort();

        console.log(fixedMapData.length);
        return [fixedMapData, sorted_tiles];
    } catch (error) {
        console.error('Failed to fetch maps:', error);
        return null;
    }
}
