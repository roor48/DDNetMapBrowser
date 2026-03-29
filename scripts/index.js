/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */
import createTileFilter from "./createTileFilter.js";
import fetchMapData from "./fetchMapData.js"

const [mapDataList, tiles] = await fetchMapData();

createTileFilter(tiles);
