/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */
import fetchMapData from "./fetchMapData.js"

const [mapDataList, tiles] = await fetchMapData();
console.log(mapDataList);
console.log(tiles);
