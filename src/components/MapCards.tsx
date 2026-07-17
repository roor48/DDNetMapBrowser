import type { MapData } from "@/types";
import iconFullscreen from "@/assets/icon-fullscreen.svg";
import iconArrowRight from "@/assets/icon-arrowright.svg";
import { useState } from "react";
import { cn } from "@/lib/utils";

type MapCardsProps = {
  mapDatas: MapData[];
  loadAmount: number;
}

type MapCardElementProps = React.HTMLAttributes<HTMLDivElement> & {
  mapData: MapData;
  selected: boolean;
}

function MapCardsElement({mapData, selected, ...props}: MapCardElementProps) {
  return (
  <div className={cn(
      "w-full m-0 rounded-lg overflow-hidden transition-[border-color] duration-300 border border-border hover:border-[rgb(101,154,175)] bg-surface text-gray-100 group",
      selected && "border-[rgb(101,154,175)]"
    )} {...props}>
    <div className="w-full aspect-16/10 relative overflow-hidden">
      <img src={mapData.thumbnail} className={cn(
        "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
        selected && "scale-105"
      )} alt={mapData.name} loading="lazy"/>
      <div className="absolute bottom-[0.7rem] right-[0.7rem] flex gap-2 w-full items-center justify-end">
        <a className={cn(
          "rounded-[10px] p-1.5 bg-action-button hidden group-hover:flex items-center justify-center w-[10%] aspect-square hover:bg-action-button-hover",
          selected && "flex"
        )} href={mapData.web_preview} target="_blank">
          <img src={iconFullscreen} className="invert dark:invert-0 w-full h-full"/>
        </a>
        <a className={cn(
          "rounded-[10px] p-1.5 bg-action-button hidden group-hover:flex items-center justify-center w-[10%] aspect-square hover:bg-action-button-hover",
          selected && "flex"
        )} href={mapData.website} target="_blank">
          <img src={iconArrowRight} className="invert dark:invert-0 w-full h-full"/>
        </a>
      </div>
    </div>
    <div className="flex flex-col gap-1.5 p-4">
      <div className="map-type-badge" data-type={mapData.type}>
        {mapData.type}
      </div>
      <h5 className="text-[1.1rem] font-semibold mb-0 overflow-hidden whitespace-nowrap text-ellipsis text-text">
        {mapData.name}
      </h5>
      <p className="text-[0.85rem] text-text-muted overflow-hidden whitespace-nowrap text-ellipsis m-0">
        By {mapData.mapper}
      </p>
      <div className="flex gap-2.5 items-center text-[0.9rem] mt-1">
        <span className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis gap-1 text-text-secondary">
          ⭐ {mapData.points}pts
        </span>
        <span className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis gap-1 text-amber-500 text-base tracking-[0.125rem]">
          {"★".repeat(mapData.difficulty) + "☆".repeat(5 - mapData.difficulty)}
        </span>
      </div>
      <p className="text-xs text-text-muted mt-auto pt-2 border-t border-border mb-0">
        Released on {mapData.release}
      </p>
    </div>
  </div>
  )
}

export default function MapCards({mapDatas, loadAmount}: MapCardsProps) {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  return (
  <>
    {mapDatas.slice(0, loadAmount).map(mapData => (
      <MapCardsElement
        key={mapData.name}
        onClick={() => setSelectedMap(selectedMap === mapData.name ? null : mapData.name)}
        onMouseLeave={() => setSelectedMap(null)}
        mapData={mapData}
        selected={selectedMap === mapData.name}
      />
    ))}
  </>
  )
}
