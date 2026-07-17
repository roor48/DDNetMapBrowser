import { SORT_BY, type MapData, type Sorter } from "@/types";

function sortByRelease(a: MapData, b: MapData) {
    if (!a.release || !b.release) {
        return 1;
    }
    
    return new Date(b.release).getTime() - new Date(a.release).getTime();
}

function sortByPoints(a: MapData, b: MapData) {
    return a.points - b.points;
}

function sortByDifficulty(a: MapData, b: MapData) {
    return a.difficulty - b.difficulty;
}

function sortByName(a: MapData, b: MapData) {
    if (a.name > b.name)
        return 1;
    return -1;
}

/**
 * 주어진 맵 데이터를 주어진 정렬 기준에 맞게 정렬합니다.
 * @returns 정렬 된 맵 데이터
 */
export default function getSortedMaps(mapDataList: MapData[], sorter: Sorter): MapData[] {
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
