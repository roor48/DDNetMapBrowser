import { useRef, useState } from 'react';
import arrowCircleRightIcon from '../assets/icon-arrow-circle-right.svg';
import mapIcon from '../assets/icon-map.svg';
import type { TeeData } from '../types';

interface TopbarProps {
  mapCount: number;
  teeData: TeeData;
  setTeeData: React.Dispatch<React.SetStateAction<TeeData>>;
}

export default function Topbar({ mapCount, teeData, setTeeData }: TopbarProps) {
  const [teeNameInput, setTeeNameInput] = useState('');
  const activeControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef(0);

  const resetTeeData = () => {
    setTeeData({
      player: '',
      points: 0,
      finishData: {},
    });
  };

  const fetchTeeData = async (rawName: string) => {
    const teeName = rawName.trim();
    setTeeNameInput(teeName);

    if (!teeName) {
      resetTeeData();
      return;
    }

    const requestId = ++latestRequestIdRef.current;
    activeControllerRef.current?.abort();
    activeControllerRef.current = new AbortController();

    try {
      const queryString = new URLSearchParams({ json2: teeName }).toString();
      const response = await fetch(`https://ddnet.org/players/?${queryString}`, {
        signal: activeControllerRef.current.signal,
      });
      const data = await response.json();

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        resetTeeData();
        return;
      }

      const teePoints = Number(data?.points?.points ?? 0) || 0;
      const teeMaps: Record<string, boolean> = {};

      const types = data?.types ?? {};
      for (const typeName in types) {
        const maps = types[typeName]?.maps ?? {};
        for (const mapName in maps) {
          teeMaps[mapName] = (maps[mapName]?.finishes ?? 0) > 0;
        }
      }

      const lastFinishes = Array.isArray(data?.last_finishes) ? data.last_finishes : [];
      lastFinishes.forEach((item: { map?: string }) => {
        if (item?.map) {
          teeMaps[item.map] = true;
        }
      });

      setTeeData({
        player: teeName,
        points: teePoints,
        finishData: teeMaps,
      })
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') {
        return;
      }

      resetTeeData();
      console.error('Failed to fetch tee data:', error);
    }
  };

  const handleSubmit = () => {
    void fetchTeeData(teeNameInput);
  };

  return (
  <div className="topbar bg-black">
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="./">DDNetMapBrowser</a>
      </div>
    </nav>

    {teeData.player && (
      <>
        <div className="topbar__tee-data">
          <span className="points">{teeData.points}pts</span>
        </div>
        <div className="topbar__tee-data">
          <span className="name">{teeData.player}</span>
        </div>
      </>
    )}
    <div className="topbar__tee-search">
      <input id="teename-input" type="text" className="name-input" placeholder="Tee name"
        value={teeNameInput}
        onChange={e => setTeeNameInput(e.currentTarget.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
            handleSubmit();
          }
        }}
      />
      <button
        className="search-icon-wrapper"
        onClick={e => {
            e.currentTarget.blur();
            handleSubmit();
          }
        }
      >
      <img src={arrowCircleRightIcon} className="search-icon invert-color" />
      </button>
    </div>

    <div className="topbar__map-counter">
      <img className="invert-color map-counter__img" src={mapIcon} />
      <span className="map-counter__text">{mapCount} maps</span>
    </div>
  </div>
  )
}
