/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */

import { 
    addFilterType, removeFilterType,
    addFilterDifficulty, removeFilterDifficulty,
    addFilterTile, removeFilterTile
} from './state.js';
import { TYPES } from './types.js';

/**
 * 필터를 적용한 맵 데이터를 반환합니다.
 * @param {MapData[]} mapDataList
 * @param {Filter} filter
 * 
 * @returns {MapData[]} 필터링 된 맵 데이터
 */
export function getFilteredMaps(mapDataList, filter) {
    return mapDataList.filter(mapData => {
        // 타입 필터
        if (filter.types.length > 0 && !filter.types.includes(mapData.type))
            return false;

        // 난이도 필터
        if (filter.difficulties.length > 0 && !filter.difficulties.includes(mapData.difficulty))
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
    createTypeFilter();
    createDifficultyFilter();
    createTileFilter(tiles);
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
        input.addEventListener("change", () => {
            if (input.checked) {
                addFilterType(type);
            } else {
                removeFilterType(type);
            }
        });

        const label = document.createElement("label");
        label.setAttribute("class", "form-check-label");
        label.setAttribute("for", type.toLowerCase());
        label.textContent = type;

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

function createDifficultyFilter() {
    
    const difficultyParent = document.querySelector(".filter_bar .filter__difficulty_parent");
    difficultyParent.replaceChildren();
    
    [0, 1, 2, 3, 4, 5].forEach((dif) => {
        // <input type="checkbox" class="btn-check" id="difficulty__0" autocomplete="off">
        // <label class="btn btn-secondary" for="difficulty__0">0</label>
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "btn-check");
        input.setAttribute("id", "difficulty__" + dif);
        input.setAttribute("autocomplete", "off");
        input.addEventListener("change", () => {
            if (input.checked) {
                addFilterDifficulty(dif);
            } else {
                removeFilterDifficulty(dif);
            }
        });

        const label = document.createElement("label");
        label.setAttribute("class", "btn btn-secondary");
        label.setAttribute("for", "difficulty__" + dif);
        label.textContent = dif.toString();

        difficultyParent.appendChild(input);
        difficultyParent.appendChild(label);
    })
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
        
        input.addEventListener("change", () => {
            if (input.checked) {
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
