import type { MapData } from "../types";
import iconFullscreen from "../assets/icon-fullscreen.svg";
import iconArrowRight from "../assets/icon-arrowright.svg";

type MapCardsProps = {
  mapDatas: MapData[];
  loadAmount: number;
}

type MapCardElementProps = {
  mapData: MapData;
} 

function MapCardsElement({mapData}: MapCardElementProps) {
  return (
  <div className="w-full m-0 border border-transparent rounded-lg overflow-hidden transition-[border-color] duration-300 hover:border-[rgb(101,154,175)] bg-[#212529] text-gray-100 group">
    <div className="w-full aspect-[16/10] relative overflow-hidden">
      <img src={mapData.thumbnail} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={mapData.name} loading="lazy"/>
      <div className="absolute bottom-[0.7rem] right-[0.7rem] flex gap-2 w-full items-center justify-end">
        <a className="rounded-[10px] p-1.5 bg-[#000000a0] hidden group-hover:flex items-center justify-center w-[10%] aspect-square hover:bg-[#000000c0]" href={mapData.web_preview} target="_blank">
          <img src={iconFullscreen} className="w-full h-full"/>
        </a>
        <a className="rounded-[10px] p-1.5 bg-[#000000a0] hidden group-hover:flex items-center justify-center w-[10%] aspect-square hover:bg-[#000000c0]" href={mapData.website} target="_blank">
          <img src={iconArrowRight} className="w-full h-full"/>
        </a>
      </div>
    </div>
    <div className="flex flex-col gap-1.5 p-4">
      <div className="map-type-badge" data-type={mapData.type}>
        {mapData.type}
      </div>
      <h5 className="text-[1.1rem] font-semibold mb-0 overflow-hidden whitespace-nowrap text-ellipsis">
        {mapData.name}
      </h5>
      <p className="text-[0.85rem] text-[#aaa] overflow-hidden whitespace-nowrap text-ellipsis m-0">
        By {mapData.mapper}
      </p>
      <div className="flex gap-2.5 items-center text-[0.9rem] mt-1">
        <span className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis gap-1 text-[#ddd]">
          ⭐ {mapData.points}pts
        </span>
        <span className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis gap-1 text-[#ffd700] text-base tracking-[0.125rem]">
          {"★".repeat(mapData.difficulty) + "☆".repeat(5 - mapData.difficulty)}
        </span>
      </div>
      <p className="text-xs text-[#888] mt-auto pt-2 border-t border-[#333] mb-0">
        Released on {mapData.release}
      </p>
    </div>
  </div>
  )
}

export default function MapCards({mapDatas, loadAmount}: MapCardsProps) {
  return (
  <>
    {mapDatas.slice(0, loadAmount).map(mapData => (
      <MapCardsElement key={mapData.name} mapData={mapData}/>
    ))}
  </>
  )
}
