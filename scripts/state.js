/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').Sorter} Sorter
 * @typedef {import('./types.js').TeeData} TeeData
 * @typedef {import('./types.js').map} map
 */

import createMapCard from './createMapCard.js';
import { getFilteredMaps } from './filter.js';
import getSortedMaps, { setSortUIActive } from './sorter.js';
import { SORT_BY } from './types.js';

// 전역 상태
const state = {
    /** @type {MapData[]} */
    allMaps: [],
    
    /** @type {TeeData} */
    teeData: {
        player: '',
        points: 0,
        finishData: []
    },

    /** @type {Filter} */
    filter: {
        name: '',
        mapper: '',
        types: [],
        difficultyMin: 0,
        difficultyMax: 5,
        tiles: []
    },

    /** @type {Sorter} */
    sorter: {
        sortBy: SORT_BY.Release,
        isDESC: false
    }
};
Object.freeze(state.allMaps);

const mapCounter = document.querySelector(".map-counter__text");

/**
 * 초기 데이터 설정
 * @param {MapData[]} maps 
 */
export function setMaps(maps) {
    state.allMaps = maps;
    render();
}

// 티 이름
/**
 * @param {string} teeName
 * @param {number} points
 * @param {Object[]} maps
 */
export function setTeeData(teeName, points, maps) {
    state.teeData.player = teeName?.trim() ?? '';
    state.teeData.points = points ?? 0;
    state.teeData.finishData = maps.slice();

    render();
}

// 맵 이름 필터
/** @param {string} name */
export function setFilterMapName(name) {
    state.filter.name = name?.trim() ?? '';

    render();
}
// 매퍼 필터
/** @param {string} mapper */
export function setFilterMapperName(mapper) {
    state.filter.mapper = mapper?.trim() ?? '';

    render();
}

// 타입 필터
/** @param {string} type */
export function addFilterType(type) {
    if (!type || state.filter.types.includes(type)) {
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

/** @param {number} num @param {number} min @param {number} max */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
// 난이도 필터
/** @param {number} difficultyMin  @param {number} difficultyMax */
export function setFilterDifficulty(difficultyMin, difficultyMax) {
    state.filter.difficultyMin = clamp(difficultyMin ?? 0, 0, 5);
    state.filter.difficultyMax = clamp(difficultyMax ?? 5, 0, 5);

    render();
}

// 타일 필터
/** @param {string} tile */
export function addFilterTile(tile) {
    if (!tile || state.filter.tiles.includes(tile)) {
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

// 정렬
// 오름차순/내림차순
/** @returns {boolean} */
export function toggleSorterIsDESC() {
    state.sorter.isDESC = !state.sorter.isDESC;

    render();
    return state.sorter.isDESC;
}
// 정렬 기준
/** @param {string} sortBy */
export function setSorterSortBy(sortBy) {
    // @ts-ignore
    if (!Object.values(SORT_BY).includes(sortBy)) {
        return;
    }
    
    state.sorter.sortBy = sortBy;

    render();
}

// 재렌더링
function render() {

    let maps = state.allMaps;
    maps = getFilteredMaps(maps, state.filter);

    if (!state.filter.name && !state.filter.mapper) {
        maps = getSortedMaps(maps, state.sorter);
    } else {
        setSortUIActive(false);
    }

    createMapCard(maps);
    
    // 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "instant"});

    mapCounter.textContent = maps.length + " maps";
}
