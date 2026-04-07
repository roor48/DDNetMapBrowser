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
        const url = isDev 
            ? './assets/maps.json'
            : 'https://ddnet.org/releases/maps.json';
        const res = await fetch(url, {
            cache: "no-store"
        });
        /** @type {MapData[]} */
        const mapData = await res.json();

        const mapCorrectionsRes = await fetch("./wrong_map_list.json", {
            cache: "no-store"
        });
        const mapCorrections = await mapCorrectionsRes.json();

        const tiles = new Set();
        /** @type {MapData[]} */
        const fixedMapData = []

        mapData.forEach(map => {
            // add maps
            // 잘못된 맵이면 정정
            if (mapCorrections[map.name]) {
                const correction = mapCorrections[map.name];
                const correctedMap = {
                    ...map,
                    type: correction.type,
                    points: correction.points,
                    difficulty: getMapDifficulty(correction.type, correction.points) ?? map.difficulty
                };
                fixedMapData.push(correctedMap);
            } else {
                fixedMapData.push(map);
            }

            // add tiles
            map.tiles.forEach(tile => {
                tiles.add(tile);
            })
        });
        const sorted_tiles = Array.from(tiles).sort();

        return [fixedMapData, sorted_tiles];
    } catch (error) {
        console.error('Failed to fetch maps:', error);
        return null;
    }
}
