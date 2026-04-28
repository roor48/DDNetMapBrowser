import { resetTeeData, setIsFetching, setTeeData } from "./state.js";

export function initTeeNameSearch() {
    /** @type {HTMLInputElement} */
    const nameInput = document.querySelector(".topbar__tee-search .name-input");
    /** @type {HTMLButtonElement} */
    const searchButton = document.querySelector(".topbar__tee-search .search-icon-wrapper");

    searchButton.addEventListener("click", (e) => {
        /** @type {HTMLButtonElement} */(e.currentTarget).blur();

        nameInput.value = nameInput.value.trim();
        const teeName = nameInput.value;

        if (teeName) {
            fetchTeeData(teeName);
        } else {
            resetTeeData();
        }
    });
    
    nameInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            const target = /** @type {HTMLInputElement} */ (e.currentTarget);

            target.blur();
            target.value = target.value.trim();
            const teeName = target.value;

            if (teeName) {
                fetchTeeData(teeName);
            } else {
                resetTeeData();
            }
        }
    });
}

/** @type {AbortController} */
let activeController = null;
let latestRequestId = 0;
/**
 * @param {string} teeName 
 */
async function fetchTeeData(teeName) {
    const requestId = ++latestRequestId;

    activeController?.abort();
    activeController = new AbortController();
    
    try {
        setIsFetching(true);

        const queryString = new URLSearchParams("?json2="+teeName);
        const res = await fetch("https://ddnet.org/players/?"+queryString, {
            signal: activeController.signal
        });
        const data = await res.json();

        if (requestId !== latestRequestId)
            return;


        if (Object.keys(data).length === 0) {
            resetTeeData();
            console.log("cannot found user: " + teeName);
            return;
        }

        const teePoints = data.points.points;
        /** @type {Record<string, boolean>} */
        const teeMaps = {};

        const types = data.types;
        for (const type in types) {
            const maps = types[type].maps;

            for (const mapName in maps) {
                teeMaps[mapName] = maps[mapName].finishes > 0;
            }
        }

        data.last_finishes.forEach((/** @type {{ map: string; }} */ map) => {
            console.log(map.map);
            teeMaps[map.map] = true;
        });
        
        setTeeData(teeName, teePoints, teeMaps);
    } catch (error) {
        if (/** @type {Error} */(error)?.name === "AbortError")
            return;
        
        resetTeeData();
        console.error('Failed to fetch tee data:', error);
    } finally {
        if (requestId === latestRequestId) {
            setIsFetching(false);
        }
    }
}
