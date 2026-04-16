/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */

import { 
    setFilterMapName,
    addFilterType, removeFilterType,
    setFilterDifficulty,
    addFilterTile, removeFilterTile
} from './state.js';
import { TYPES } from './types.js';
// @ts-ignore
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.mjs'

/**
 * 필터를 적용한 맵 데이터를 반환합니다.  
 * 이름 검색이 적용 된 경우 유사도 기준으로 정렬된 맵 데이터를 반환합니다.
 * @param {MapData[]} mapDataList
 * @param {Filter} filter
 * 
 * @returns {MapData[]} 필터링 된 맵 데이터
 */
export function getFilteredMaps(mapDataList, filter) {
    /** @type {MapData[]} */
    let results = mapDataList;

    if (filter.mapName) {
        const fuse = new Fuse(mapDataList, {
            keys: ["name"],
            threshold: 0.4,
            includeScore: true
        });
        // @ts-ignore
        results = fuse.search(filter.mapName).map(result => result.item);
    }

    return results.filter(mapData => {
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
    createTypeFilter();
    initDifficultyFilter();
    createTileFilter(tiles);
}

function initSearchFilter() {
    /** @type {HTMLInputElement} */
    const map_search = document.querySelector(".filter__map-search");
    
    /** @type {number} */
    let timer;
    map_search.addEventListener("input", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);
        clearTimeout(timer);
        
        const value = target.value;
        timer = setTimeout(() => {
            setFilterMapName(value);
        }, 200);
    });

    map_search.addEventListener("keydown", (e) => {
        const target = /** @type {HTMLInputElement} */ (e.currentTarget);

        if (e.key === "Enter") {
            target.blur();
        }
    });
}

function createTypeFilter() {
    const typeParent = document.querySelector(".filter_bar .filter__type_parent");
    typeParent.replaceChildren();

    // DDmaX 필터
    const ddmax_div = document.createElement("div");
    ddmax_div.setAttribute("class", "map_type__ddmax");
    const ddmax_p = document.createElement("p");
    ddmax_p.setAttribute("class", "map_type__ddmax__p");
    ddmax_p.textContent = TYPES.DDmaX;
    ddmax_div.appendChild(ddmax_p);

    Object.values(TYPES).forEach(type => {
        // <div class="form-check">
        //   <input id="novice" class="map_type__checkbox form-check-input" type="checkbox" value="">
        //   <label class="form-check-label" for="novice">Novice</label>
        // </div>
        if (type === TYPES.DDmaX) {
            return;
        }

        const div = document.createElement("div");
        div.setAttribute("class", "form-check");

        const input = document.createElement("input");
        input.setAttribute("id", type.toLowerCase());
        input.setAttribute("class", "map_type__checkbox form-check-input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", "");
        input.addEventListener("change", (e) => {
            const target = /** @type {HTMLInputElement} */ (e.currentTarget);
            
            if (target.checked) {
                addFilterType(type);
            } else {
                removeFilterType(type);
            }
        });

        const label = document.createElement("label");
        label.setAttribute("class", "form-check-label");
        label.setAttribute("for", type.toLowerCase());
        label.textContent = type;

        // div 빈 공간 클릭시 input.click() 호출
        div.addEventListener("click", (e) => {
            // label || input 직접 클릭한 경우
            if (!(e.target instanceof HTMLDivElement)) {
                return;
            }
            input.click();
        });

        div.appendChild(input);
        div.appendChild(label);

        if (type.includes(TYPES.DDmaX)) {
            ddmax_div.appendChild(div);
        } else {
            typeParent.appendChild(div);
        }
    });

    typeParent.appendChild(ddmax_div);
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
