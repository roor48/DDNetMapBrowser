import { useEffect, useMemo, useRef, useState } from 'react';
import {type Filter as FilterState, type Sorter as SorterState, type MapData, type TeeData, SORT_BY} from './types.js'

import upCircleIcon from './assets/icon-up-circle.svg'
import Topbar from './components/Topbar'
import Filter from './components/Filter'
import getFilteredMaps from './filterMaps.js'
import MapCards from './components/MapCards.js';
import fetchMapData from './fetchMapData';
import Sorter from './components/Sorter.js';
import getSortedMaps from './sorterMaps.js';

const initialFilter: FilterState = {
  name: '',
  mapper: '',
  isFinished: false,
  isUnfinished: false,
  types: [],
  difficultyMin: 0,
  difficultyMax: 5,
  tiles: []
};

const initialTeeData: TeeData = {
  player: '',
  points: 0,
  finishData: {}
};

const initialSorter: SorterState = {
  sortBy: SORT_BY.Release,
  isDESC: false
};

const MAPS_PER_PAGE: number = 20;

function App() {
  const [allMaps, setAllMaps] = useState<MapData[]>([]);
  const [allTiles, setAllTiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    key: '',
    visibleCount: MAPS_PER_PAGE,
  });
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [teeData, setTeeData] = useState<TeeData>(initialTeeData);
  const [sorter, setSorter] = useState<SorterState>(initialSorter);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMapData = async () => {
      setIsLoading(true);

      const mapDatas = await fetchMapData();
      if (cancelled) {
        return;
      }

      if (!mapDatas) {
        alert('error: cannot fetch map datas');
        setIsLoading(false);
        return;
      }

      const [mapDataList, tiles] = mapDatas;
      setAllMaps(mapDataList);
      setAllTiles(tiles);
      setIsLoading(false);
    };

    void loadMapData();

    return () => {
      cancelled = true;
    };
  }, []);
  
  const filteredMaps = useMemo(
    () => getFilteredMaps(allMaps, filter, teeData),
    [allMaps, filter, teeData]
  );
  const isFilterSearchActive = filter.name.trim() !== '' || filter.mapper.trim() !== '';
  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);
  const resultKey = `${allMaps.length}:${teeData.player}:${filterKey}`;
  const visibleCount = pagination.key === resultKey ? pagination.visibleCount : MAPS_PER_PAGE;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (isLoading || !entries[0]?.isIntersecting) {
          return;
        }

        setPagination(prev => {
          const baseVisibleCount = prev.key === resultKey ? prev.visibleCount : MAPS_PER_PAGE;
          if (baseVisibleCount >= filteredMaps.length) {
            if (prev.key === resultKey) {
              return prev;
            }
            return { key: resultKey, visibleCount: baseVisibleCount };
          }

          return {
            key: resultKey,
            visibleCount: Math.min(baseVisibleCount + MAPS_PER_PAGE, filteredMaps.length),
          };
        });
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [filteredMaps.length, resultKey, visibleCount, isLoading]);


  const displayMaps = useMemo(
    () => (isFilterSearchActive ? filteredMaps : getSortedMaps(filteredMaps, sorter)),
    [filteredMaps, sorter, isFilterSearchActive]
  );

	return (
  <>
    <Topbar mapCount={displayMaps.length} teeData={teeData} setTeeData={setTeeData} />
    <Filter hasTeeData={Boolean(teeData.player)} allTiles={allTiles} filter={filter} setFilter={setFilter}/>

    <div className="map_cards">
      <div className="map_sort">
        <Sorter sorter={sorter} setSorter={setSorter} disabled={isFilterSearchActive} />
      </div>

      <div className="map_cards__parent">
        <MapCards mapDatas={displayMaps} loadAmount={visibleCount}/>
      </div>

      {(isLoading || visibleCount < displayMaps.length) && (
        <div className="loading-dot" ref={loadMoreRef}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>

    <div className="up-button">
      <img
        className="invert-color"
        src={upCircleIcon}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  </>
	)
}

export default App
