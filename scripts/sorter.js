/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Sorter} Sorter
 */

import { SORT_BY } from './types.js';


/** @param {MapData} a @param {MapData} b */
function sortByRelease(a, b) {
    if (!a.release || !b.release) {
        return 1;
    }
    
    return new Date(b.release).getTime() - new Date(a.release).getTime();
}

/** @param {MapData} a @param {MapData} b */
function sortByPoints(a, b) {
    return a.points - b.points;
}

/** @param {MapData} a @param {MapData} b */
function sortByDifficulty(a, b) {
    return a.difficulty - b.difficulty;
}

/** @param {MapData} a @param {MapData} b */
function sortByName(a, b) {
    if (a.name > b.name)
        return 1;
    return -1;
}

/**
 * 필터를 적용한 맵 데이터를 반환합니다.
 * @param {MapData[]} mapDataList
 * @param {Sorter} sorter
 * 
 * @returns {MapData[]} 정렬 된 맵 데이터
 */
export default function getSortedMaps(mapDataList, sorter) {

    const sortedMaps = mapDataList.slice();
    // sortedMaps.sort(() => Math.random() - 0.5);

    switch (sorter.sortBy) {
        case SORT_BY.Release:
            sortedMaps.sort(sortByRelease);
            break;

        case SORT_BY.Points:
            sortedMaps.sort(sortByPoints);
            break;

        case SORT_BY.Difficulty:
            sortedMaps.sort(sortByDifficulty);
            break;

        case SORT_BY.Name:
            sortedMaps.sort(sortByName);
            break;
        
        default:
            console.error("Unexpected sortBy: " + sorter.sortBy);
            return mapDataList;
    }

    if (sorter.isDESC) {
        sortedMaps.reverse();
    }

    return sortedMaps;
}
