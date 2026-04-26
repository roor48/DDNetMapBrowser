/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').Sorter} Sorter
 * @typedef {import('./types.js').TeeData} TeeData
 * @typedef {import('./types.js').map} map
 */

import createMapCard, { resetMapCard, setLoadingDotActive } from './createMapCard.js';
import { getFilteredMaps } from './filter.js';
import getSortedMaps, { setSortUIActive } from './sorter.js';
import { SORT_BY } from './types.js';

// 전역 상태
const state = {
    isInited: false,

    /** @type {MapData[]} */
    allMaps: [],

    /** @type {boolean} */
    isFetching: false,
    
    /** @type {TeeData} */
    teeData: {
        player: '',
        points: 0,
        finishData: {}
    },

    /** @type {Filter} */
    filter: {
        name: '',
        mapper: '',
        isFinished: false,
        isUnfinished: false,
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

const tee_points = document.querySelector(".topbar__tee-data .points");
const tee_name = document.querySelector(".topbar__tee-data .name");
/** @type {HTMLInputElement} */
const finishedCheckbox = document.querySelector("#user-finished");
/** @type {HTMLInputElement} */
const unfinishedCheckbox = document.querySelector("#user-unfinished");

/**
 * 초기화 완료되면 호출
 * @param {boolean} isInited 
 */
export function setIsInited(isInited) {
    state.isInited = isInited ?? false;
    render();
}

/**
 * 초기 데이터 설정
 * @param {MapData[]} maps 
 */
export function setMaps(maps) {
    state.allMaps = maps;
    render();
}

/** @param {boolean} isFetching */
export function setIsFetching(isFetching) {
    state.isFetching = isFetching ?? false;

    render();
}

// 티 이름
/**
 * @param {string} teeName
 * @param {number} points
 * @param {Record<string, boolean>} maps
 */
export function setTeeData(teeName, points, maps) {
    state.teeData.player = teeName?.trim() ?? '';
    state.teeData.points = points ?? 0;
    state.teeData.finishData = maps ?? {};

    render();
}

export function resetTeeData() {
    state.teeData.player = '';
    state.teeData.points = 0;
    state.teeData.finishData = {};
    state.filter.isFinished = false;
    state.filter.isUnfinished = false;

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

// 유저데이터 필터
/** @param {boolean} isFinished @param {boolean} isUnfinished */
export function setFilterFinish(isFinished, isUnfinished) {
    state.filter.isFinished = isFinished ?? false;
    state.filter.isUnfinished = isUnfinished ?? false;

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
    if (!state.isInited) {
        return;
    }

    // 데이터 가져오는 중엔 렌더링 비활성화
    if (state.isFetching) {
        setLoadingDotActive(true);
        resetMapCard();
        return;
    }
    
    renderTeeUI();
    
    let maps = state.allMaps;
    maps = getFilteredMaps(maps, state.filter, state.teeData);

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

function renderTeeUI() {
    finishedCheckbox.checked = state.filter.isFinished;
    unfinishedCheckbox.checked = state.filter.isUnfinished;

    // tee Data
    if (state.teeData.player) {
        finishedCheckbox.disabled = false;
        unfinishedCheckbox.disabled = false;
    
        tee_points.parentElement.style.display = "";
        tee_name.parentElement.style.display = "";
        
        tee_points.textContent = `${state.teeData.points}pts`;
        tee_name.textContent = state.teeData.player;
    } else {
        tee_points.parentElement.style.display = "none";
        tee_name.parentElement.style.display = "none";
        
        finishedCheckbox.disabled = true;
        unfinishedCheckbox.disabled = true;
    }
}
