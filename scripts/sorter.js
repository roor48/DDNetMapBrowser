/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Sorter} Sorter
 */

import { toggleSorterIsDESC, setSorterSortBy } from './state.js';
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


/** @param {string} sortBy @param {boolean} isDisabled */
function createDropdownItem(sortBy, isDisabled) {
    const dropDownButton = document.querySelector(".sortByDropdown .btn");
    
    const li = document.createElement("li");
    
    const button = document.createElement("button");
    button.setAttribute("class", `${"dropdown-item" + (isDisabled ? " disabled" : "")}`);
    button.textContent = sortBy;
    button.addEventListener("click", () => {
        setSorterSortBy(sortBy);
        dropDownButton.textContent = sortBy;
    });
    
    li.appendChild(button);

    if (isDisabled) {
        const disabledLine = document.createElement("li");

        const hr = document.createElement("hr");
        hr.setAttribute("class", "dropdown-divider");
        
        disabledLine.appendChild(hr);
        li.appendChild(disabledLine);
    }

    return li;
}

export function createSorter() {
    // <img class="asc_icon" title="Ascending" src="./assets/icon-sort-ascending32.png">
    // <div class="sortByDropdown">
    //   <button class="btn btn-secondary dropdown-toggle" type="button" id="sortByDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
    //     Release
    //   </button>
    //   <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="sortByDropdownButton">
    //     <li><button class="dropdown-item disabled">Release</button></li>
    //     <li><hr class="dropdown-divider"></li>
    //     <li><button class="dropdown-item">Points</button></li>
    //     <li><button class="dropdown-item">Difficulty</button></li>
    //     <li><button class="dropdown-item">Name</button></li>
    //   </ul>
    // </div>
    const map_sort = document.querySelector(".map_sort");
    map_sort.replaceChildren();
    
    const asc_icon = document.createElement("img");
    asc_icon.setAttribute("class", "asc_icon");
    asc_icon.setAttribute("title", "Ascending");
    asc_icon.setAttribute("src", "./assets/icon-sort-ascending32.png");
    asc_icon.addEventListener("click", () => {
        const isDESC = toggleSorterIsDESC();
        asc_icon.setAttribute("style", `transform: scaleY(${isDESC ? -1 : 1});`);
        asc_icon.setAttribute("title", `${isDESC ? "Descending" : "Ascending"}`);
    });

    const dropDown = document.createElement("div");
    dropDown.setAttribute("class", "sortByDropdown");
    
    const dropDownButton = document.createElement("button");
    dropDownButton.setAttribute("class", "btn btn-secondary dropdown-toggle");
    dropDownButton.setAttribute("type", "button");
    dropDownButton.setAttribute("id", "sortByDropdownButton");
    dropDownButton.setAttribute("data-bs-toggle", "dropdown");
    dropDownButton.setAttribute("aria-expanded", "false");
    dropDownButton.textContent = SORT_BY.Release;
    
    const ul = document.createElement("ul");
    ul.setAttribute("class", "dropdown-menu dropdown-menu-dark");
    ul.setAttribute("aria-labelledby", "sortByDropdownButton");
    
    dropDown.appendChild(dropDownButton);
    dropDown.appendChild(ul);
    
    map_sort.appendChild(asc_icon);
    map_sort.appendChild(dropDown);
    
    dropDown.addEventListener("click", () => {
        ul.replaceChildren();
        ul.appendChild(createDropdownItem(dropDownButton.textContent, true));

        Object.values(SORT_BY).forEach(sortBy => {
            if (dropDownButton.textContent !== sortBy) {
                ul.appendChild(createDropdownItem(sortBy, false));
            }
        });
    });
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
