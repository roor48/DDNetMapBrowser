/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */
import { setMaps } from "./state.js";
import fetchMapData from "./fetchMapData.js"
import { createFilter } from "./filter.js";

const [mapDataList, tiles] = await fetchMapData();
createFilter(tiles);


setMaps(mapDataList);
