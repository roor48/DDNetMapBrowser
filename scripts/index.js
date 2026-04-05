/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */
import { setMaps } from "./state.js";
import fetchMapData from "./fetchMapData.js"
import { createFilter } from "./filter.js";
import { createSorter } from "./sorter.js";


async function main() {
    const mapDatas = await fetchMapData();
    if (mapDatas === null) {
        // 에러 메시지 띄우기
        return;
    } else {
        const [mapDataList, tiles] = mapDatas;
        createFilter(tiles);
        createSorter();
        setMaps(mapDataList);
    }
}

main();
