/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').Sorter} Sorter
 */

import { createMapCard } from './createMapCard.js';
import { getFilteredMaps } from './filter.js';
import getSortedMaps from './sorter.js';
import { SORT_BY } from './types.js';

// 전역 상태
const state = {
    /** @type {MapData[]} */
    allMaps: [],
    
    /** @type {Filter} */
    filter: {
        types: [],
        difficulties: [],
        tiles: []
    },

    /** @type {Sorter} */
    sortBy: {
        sortBy: SORT_BY.Release,
        isDESC: false
    }
};
Object.freeze(state.allMaps);

/**
 * 초기 데이터 설정
 * @param {MapData[]} maps 
 */
export function setMaps(maps) {
    state.allMaps = maps;
    render();
}

// 타입 필터
/** @param {string} type */
export function addFilterType(type) {
    if (state.filter.types.includes(type)) {
        return;
    }
    state.filter.types.push(type);

    render();
}
/** @param {string} type */
export function removeFilterType(type) {
    state.filter.types = state.filter.types.filter(t => t!==type);

    render();
}

// 난이도 필터
/** @param {number} difficulty */
export function addFilterDifficulty(difficulty) {
    if (state.filter.difficulties.includes(difficulty)) {
        return;
    }
    state.filter.difficulties.push(difficulty);

    render();
}
/** @param {number} difficulty */
export function removeFilterDifficulty(difficulty) {
    state.filter.difficulties = state.filter.difficulties.filter(d => d!==difficulty);

    render();
}

// 타일 필터
/** @param {string} tile */
export function addFilterTile(tile) {
    if (state.filter.tiles.includes(tile)) {
        return;
    }
    state.filter.tiles.push(tile);

    render();
}
/** @param {string} tile */
export function removeFilterTile(tile) {
    state.filter.tiles = state.filter.tiles.filter(t => t!==tile);

    render();
}


// 재렌더링
function render() {
    const filteredMap = getFilteredMaps(state.allMaps, state.filter);
    const sortedMap = getSortedMaps(filteredMap, state.sortBy);
    createMapCard(sortedMap);
}
