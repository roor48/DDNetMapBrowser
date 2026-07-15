import { useEffect, useMemo, useRef, useState } from 'react';
import {type Filter as FilterState, type MapData, type TeeData, initialFilter} from './types.js'

import upCircleIcon from './assets/icon-up-circle.svg'
import Topbar from './components/Topbar'
import Filter from './components/Filter'
import getFilteredMaps from './filterMaps.js'
import MapCards from './components/MapCards.js';
import fetchMapData from './fetchMapData';



const initialTeeData: TeeData = {
  player: '',
  points: 0,
  finishData: {}
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


  const displayMaps = filteredMaps;

	return (
  <>
    <Topbar mapCount={displayMaps.length} teeData={teeData} setTeeData={setTeeData} />
    <Filter hasTeeData={Boolean(teeData.player)} allTiles={allTiles} filter={filter} setFilter={setFilter}/>

    <div className="col-start-2 row-start-2 m-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(17.5rem,1fr))] gap-5">
        <MapCards mapDatas={displayMaps} loadAmount={visibleCount}/>
      </div>

      {(isLoading || visibleCount < displayMaps.length) && (
        <div className="py-12 flex justify-center items-center" ref={loadMoreRef}>
          <span className="inline-block w-3 h-3 bg-white rounded-full [animation:loading_1s_linear_infinite]" style={{ animationDelay: '0s' }}></span>
          <span className="inline-block w-3 h-3 bg-white rounded-full [animation:loading_1s_linear_infinite] mx-2" style={{ animationDelay: '0.2s' }}></span>
          <span className="inline-block w-3 h-3 bg-white rounded-full [animation:loading_1s_linear_infinite]" style={{ animationDelay: '0.4s' }}></span>
        </div>
      )}
    </div>

    <div className="fixed bottom-6 right-6 w-14 h-14 cursor-pointer z-50 opacity-70 hover:opacity-100 transition-opacity duration-300">
      <img
        className="invert"
        src={upCircleIcon}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  </>
	)
}

export default App
