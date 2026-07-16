import { useRef, useState } from 'react';
import arrowCircleRightIcon from '../assets/icon-arrow-circle-right.svg';
import mapIcon from '../assets/icon-map.svg';
import type { TeeData } from '../types';

interface TopbarProps {
  mapCount: number;
  teeData: TeeData;
  setTeeData: React.Dispatch<React.SetStateAction<TeeData>>;
  onFilterToggle: () => void;
}

export default function Topbar({ mapCount, teeData, setTeeData, onFilterToggle }: TopbarProps) {
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
  <div className="flex sticky top-0 z-80 col-start-1 md:col-start-2 row-start-1 h-14 bg-topbar border-b border-border items-center max-h-14">
    <button 
      className="md:hidden flex items-center justify-center w-12 h-12 ml-2 bg-transparent border-none cursor-pointer"
      onClick={onFilterToggle}
      aria-label="Toggle filter menu"
    >
      <svg className="w-6 h-6 fill-white dark:fill-black" viewBox="0 0 24 24">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>
    <h1 className="flex-1 h-[70%] hidden md:flex items-center m-0 pl-4 text-2xl font-bold">
      <a className="text-text no-underline" href="/">DDNetMapBrowser</a>
    </h1>

    {teeData.player && (
      <>
        <div className="flex items-center bg-surface-hover rounded-lg w-fit px-2.5 mr-2.5 text-text-secondary font-medium h-[70%]">
          <span>{teeData.points}pts</span>
        </div>
        <div className="flex items-center bg-surface-hover rounded-lg w-fit px-2.5 mr-2.5 text-text-secondary font-medium h-[70%]">
          <span>{teeData.player}</span>
        </div>
      </>
    )}
    <div className="flex items-center mr-2.5 w-45 bg-surface-hover rounded-full focus-within:ring-1 focus-within:ring-white h-[70%]">
      <input id="teename-input" type="text" className="text-[0.9rem] whitespace-nowrap text-text-secondary font-bold opacity-90 pl-4 pr-2 w-full h-full bg-surface-hover rounded-l-full border-none focus:outline-none tracking-wide" placeholder="Tee name"
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
        className="h-full aspect-square rounded-full border-none bg-transparent p-0 cursor-pointer active:brightness-75 active:scale-95"
        onClick={e => {
            e.currentTarget.blur();
            handleSubmit();
          }
        }
      >
      <img src={arrowCircleRightIcon} className="rounded-full dark:invert" />
      </button>
    </div>

    <div className="flex items-center gap-2 py-1.5 px-3 mr-5 bg-surface-hover rounded-lg text-[0.9rem] whitespace-nowrap h-[70%]">
      <img className="dark:invert w-4.5 h-4.5 opacity-80" src={mapIcon} />
      <span className="text-text-secondary font-medium">{mapCount} maps</span>
    </div>
  </div>
  )
}
