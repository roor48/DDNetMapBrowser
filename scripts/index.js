/**
 * @typedef {import('./types.js').MapData} MapData
 * @typedef {import('./types.js').Filter} Filter
 */
import { setIsInited, setMaps } from "./state.js";
import fetchMapData from "./fetchMapData.js"
import { createFilter } from "./filter.js";
import { createSorter } from "./sorter.js";
import { loadMoreMapCard } from "./createMapCard.js";
import { initTeeNameSearch } from "./teeName.js";

document.addEventListener("DOMContentLoaded", async () => {
    const mapDatas = await fetchMapData();
    if (mapDatas === null) {
        // 에러 메시지 띄우기
        return;
    }

    const [mapDataList, tiles] = mapDatas;
    initTeeNameSearch();
    createFilter(tiles);
    createSorter();
    setMaps(mapDataList);
    
    // 로딩 기준으로 무한 스크롤
    const loadingDot = document.querySelector(".loading-dot");
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreMapCard();
        }
    }, {
        rootMargin: "100px"  // 100px 전에 미리 로드
    });
    
    if (loadingDot) {
        observer.observe(loadingDot);
    }

    setIsInited(true);
});
