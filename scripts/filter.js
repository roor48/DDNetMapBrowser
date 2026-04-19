/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').TeeData} TeeData
 */

import { 
    setFilterMapName, setFilterMapperName,
    setFilterFinish,
    addFilterType, removeFilterType,
    setFilterDifficulty,
    addFilterTile, removeFilterTile,
} from './state.js';
import { TYPES } from './types.js';
// @ts-ignore
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.mjs'

/**
 * 필터를 적용한 맵 데이터를 반환합니다.  
 * 이름 검색이 적용 된 경우 유사도 기준으로 정렬된 맵 데이터를 반환합니다.
 * @param {MapData[]} mapDataList
 * @param {Filter} filter
 * @param {TeeData} teeData
 * 
 * @returns {MapData[]} 필터링 된 맵 데이터
 */
export function getFilteredMaps(mapDataList, filter, teeData) {
    /** @type {MapData[]} */
    let results = mapDataList;

    const searchKeys = [
        filter.name && "name",
        filter.mapper && "mapper"
    ].filter(Boolean);

    if (searchKeys.length > 0) {
        const fuse = new Fuse(mapDataList, {
            keys: searchKeys,
            threshold: 0.4
        });

        const conditions = [
            filter.name && { name: filter.name },
            filter.mapper && { mapper: filter.mapper }
        ].filter(Boolean);

        // @ts-ignore
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

/**
 * 필터 버튼을 생성합니다.
 * @param {string[]} tiles
 */
export function createFilter(tiles) {
    initSearchFilter();
    initUserDataFilter();
    initTypeFilter();
    initDifficultyFilter();
    createTileFilter(tiles);
}

function initSearchFilter() {
    // map
    /** @type {HTMLInputElement} */
    const map_search = document.querySelector(".filter__map-search");
    
    /** @type {number} */
    let map_timer;
    map_search.addEventListener("input", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);
        clearTimeout(map_timer);
        
        map_timer = setTimeout(() => {
            setFilterMapName(target.value);
        }, 200);
    });

    map_search.addEventListener("keydown", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);

        if (e.key === "Enter") {
            target.blur();
            clearTimeout(map_timer);
            setFilterMapName(target.value);
        }
    });

    // mapper
    /** @type {HTMLInputElement} */
    const mapper_search = document.querySelector(".filter__mapper-search");
    
    /** @type {number} */
    let mapper_timer;
    mapper_search.addEventListener("input", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);
        clearTimeout(mapper_timer);
        
        mapper_timer = setTimeout(() => {
            setFilterMapperName(target.value);
        }, 200);
    });

    mapper_search.addEventListener("keydown", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);

        if (e.key === "Enter") {
            target.blur();
            clearTimeout(mapper_timer);
            setFilterMapperName(target.value)
        }
    });
}

function initUserDataFilter() {
    const finishedDiv = document.querySelector(".user_filter .finished-wrapper");
    const finishedInput = finishedDiv.querySelector("input");

    const unfinishedDiv = document.querySelector(".user_filter .unfinished-wrapper");
    const unfinishedInput = unfinishedDiv.querySelector("input");
    
    finishedInput.addEventListener("change", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);
        
        setFilterFinish(target.checked, false);
    });
    
    unfinishedInput.addEventListener("change", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);
        
        setFilterFinish(false, target.checked);
    });
}

function initTypeFilter() {
    Object.values(TYPES).forEach(type => {
        if (type === TYPES.DDmaX) {
            return;
        }

        const input = document.querySelector(`#filter_${type.toLowerCase().replace('.', '_')}`);

        input.addEventListener("click", (e) => {
            const target = /** @type {HTMLInputElement} */ (e.currentTarget);
            
            if (target.checked) {
                addFilterType(type);
            } else {
                removeFilterType(type);
            }
        });
    });
}

function initDifficultyFilter() {
    
    /** @type {NodeListOf<HTMLInputElement>} */
    const sliders = document.querySelectorAll(".difficulty__slider");
    /** @type {HTMLDivElement} */
    const fill = document.querySelector(".difficulty__range-fill");

    const minText = document.querySelector(".difficulty-min-value");
    const maxText = document.querySelector(".difficulty-max-value");

    function updateFill() {
        const [slider1, slider2] = sliders;
        
        const slider1Value = parseInt(slider1.value);
        const slider2Value = parseInt(slider2.value);
        
        const min = Math.min(slider1Value, slider2Value);
        const max = Math.max(slider1Value, slider2Value);

        // 0-5 범위를 0-100% 비율로 변환
        const minPercent = (min / 5) * 100;
        const maxPercent = (max / 5) * 100;
        
        // fill의 위치 너비 조정
        fill.style.left = minPercent + '%';
        fill.style.width = (maxPercent - minPercent) + '%';

        minText.textContent = min.toString();
        maxText.textContent = max.toString();
        setFilterDifficulty(min, max);
    }

    sliders.forEach(slider => {
        slider.addEventListener("input", updateFill);
    });
}

/**
 * @param {string[]} tiles
 */
function createTileFilter(tiles) {
    const tileParent = document.querySelector(".filter__tile_parent");
    tiles.forEach(tile => {
        // <div class="tile_filter" title="BONUS">
        //   <input id="BONUS" class="btn-check" type="checkbox" autocomplete="off">
        //   <label class="btn btn-outline-primary" for="BONUS">
        //     BONUS
        //     <img src="https://ddnet.org/tiles/BONUS.png" alt="BONUS" class="tile_image">
        //   </label>
        // </div>
        const div = document.createElement("div");
        div.setAttribute("class", "tile_filter");
        div.setAttribute("title", tile);
        
        const input = document.createElement("input");
        input.setAttribute("id", tile);
        input.setAttribute("class", "btn-check");
        input.setAttribute("type", "checkbox");
        input.setAttribute("autocomplete", "off");
        
        input.addEventListener("change", (e) => {
            const target = /** @type {HTMLInputElement} */ (e.currentTarget);
            
            if (target.checked) {
                addFilterTile(tile);
            } else {
                removeFilterTile(tile);
            }
        });
        
        div.appendChild(input);
        
        const label = document.createElement("label");
        label.setAttribute("class", "btn btn-outline-primary");
        label.setAttribute("for", tile);
        
        const img = document.createElement("img");
        img.setAttribute("class", "tile_image");
        img.setAttribute("src", `https://ddnet.org/tiles/${tile}.png`);
        img.setAttribute("alt", tile);
        
        label.appendChild(img);
        div.appendChild(label);

        tileParent.appendChild(div);
    });
}
