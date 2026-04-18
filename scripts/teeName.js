import { setTeeData } from "./state.js";

export function initTeeNameSearch() {
    /** @type {HTMLInputElement} */
    const nameInput = document.querySelector(".topbar__teename .name-input");
    /** @type {HTMLButtonElement} */
    const searchButton = document.querySelector(".topbar__teename .search-icon-wrapper");

    searchButton.addEventListener("click", (e) => {
        const teeName = nameInput.value;
        fetchTeeData(teeName);
    });
    
    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            /** @type {HTMLInputElement} */(e.currentTarget).blur();
            const teeName = /** @type {HTMLInputElement} */ (e.currentTarget).value;
            fetchTeeData(teeName);
        }
    });
}

/**
 * @param {string} teeName 
 */
async function fetchTeeData(teeName) {
    try {
        const queryString = new URLSearchParams("?json2="+teeName);
        const res = await fetch("https://ddnet.org/players/?"+queryString);
        const data = await res.json();

        const teePoints = data.points.points;
        /** @type {Object[]} */
        const teeMaps = [];

        const types = data.types;
        for (const type in types) {
            const maps = types[type].maps;

            for (const mapName in maps) {
                const map = {[mapName]: {"finishes": maps[mapName].finishes}};

                teeMaps.push(map);
            }
        }

        setTeeData(teeName, teePoints, teeMaps);
    } catch (error) {
        console.error('Failed to fetch tee data:', error);
    }
}
