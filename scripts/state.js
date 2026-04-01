/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */

import { createMapCard } from './createMapCard.js';
import { getFilteredMaps } from './filter.js';
import { FILTER_TYPE } from './types.js';

// 전역 상태
const state = {
    /** @type {MapData[]} */
    allMaps: [],
    
    /** @type {Filter} */
    filter: {
        types: [],
        difficulties: [],
        tiles: []
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

// 필터 추가/제거
/**
 * 필터 추가
 * @param {Symbol} filterType 
 * @param {string | number} name Difficulty 일시 number
 */
export function addFilter(filterType, name) {
    switch (filterType) {
        case FILTER_TYPE.Type:
            addFilterType(name);
            break;
        case FILTER_TYPE.Difficulty:
            addFilterDifficulty(name);
            break;
        case FILTER_TYPE.Tile:
            addFilterTile(name);
            break;
    }
    render();
}
/**
 * 필터 제거
 * @param {Symbol} filterType 
 * @param {string | number} name Difficulty 일시 number
 */
export function removeFilter(filterType, name) {
    switch (filterType) {
        case FILTER_TYPE.Type:
            removeFilterType(name);
            break;
        case FILTER_TYPE.Difficulty:
            removeFilterDifficulty(name);
            break;
        case FILTER_TYPE.Tile:
            removeFilterTile(name);
            break;
    }
    render();
}
// 타입 필터
function addFilterType(type) {
    if (state.filter.types.includes(type)) {
        return;
    }
    state.filter.types.push(type);
}
function removeFilterType(type) {
    state.filter.types = state.filter.types.filter(t => t!==type);
}
// 난이도 필터
function addFilterDifficulty(difficulty) {
    if (state.filter.difficulties.includes(difficulty)) {
        return;
    }
    state.filter.difficulties.push(difficulty);
}
function removeFilterDifficulty(difficulty) {
    state.filter.difficulties = state.filter.difficulties.filter(d => d!==difficulty);
}
// 타일 필터
function addFilterTile(tile) {
    if (state.filter.tiles.includes(tile)) {
        return;
    }
    state.filter.tiles.push(tile);
}
function removeFilterTile(tile) {
    state.filter.tiles = state.filter.tiles.filter(t => t!==tile);
}


// 재렌더링
function render() {
    createMapCard(getFilteredMaps(state.allMaps, state.filter));
}
