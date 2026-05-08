import type { MapData } from "./types";

/**
 * 맵 데이터와 타일 목록을 가져옵니다.
 * @returns [맵 데이터 배열, 정렬된 타일 목록]
 */
export default async function fetchMapData(): Promise<[MapData[], string[]] | null> {
    try {
        const isDev = 
            window.location.hostname === 'localhost' 
            || window.location.hostname === '127.0.0.1'
            || window.location.protocol === 'file:';

        const mapPath = '/maps.json';
        const releaseUrl = 'https://ddnet.org/releases/maps.json';
        
        const fileRes = await fetch(mapPath, { cache: "no-store"});
        const mapData: MapData[] = await fileRes.json();
        const mapDict: Record<string, MapData> = Object.fromEntries(
            mapData.map(map => [map.name, map])
        );

        const releaseData: MapData[] = isDev
            ? mapData.slice()
            : await (await fetch(releaseUrl, { cache: "no-store" })).json();

        const fixedMapData: MapData[] = releaseData.map(map => {
            return mapDict[map.name] ?? map;
        });
        
        const tiles: Set<string> = new Set();
        mapData.forEach(map => {
            // add tiles
            map.tiles.forEach(tile => {
                tiles.add(tile);
            })
        });
        const sorted_tiles = Array.from(tiles).sort();

        console.log(fixedMapData.length);
        return [fixedMapData, sorted_tiles];
    } catch (error) {
        console.error('Failed to fetch maps:', error);
        return null;
    }
}
