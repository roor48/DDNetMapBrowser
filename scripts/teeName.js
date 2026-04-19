import { resetTeeData, setIsFetching, setTeeData } from "./state.js";

export function initTeeNameSearch() {
    /** @type {HTMLInputElement} */
    const nameInput = document.querySelector(".topbar__teename .name-input");
    /** @type {HTMLButtonElement} */
    const searchButton = document.querySelector(".topbar__teename .search-icon-wrapper");

    searchButton.addEventListener("click", (e) => {
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

/**
 * @param {string} teeName 
 */
async function fetchTeeData(teeName) {
    try {
        setIsFetching(true);

        const queryString = new URLSearchParams("?json2="+teeName);
        const res = await fetch("https://ddnet.org/players/?"+queryString);
        const data = await res.json();

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

        setTeeData(teeName, teePoints, teeMaps);
    } catch (error) {
        resetTeeData();
        console.error('Failed to fetch tee data:', error);
    } finally {
        setIsFetching(false);
    }
}
