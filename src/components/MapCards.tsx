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
  <div className="card bg-dark text-light">
    <div className="card__img_wrapper">
      <img src={mapData.thumbnail} className="card-img-top" alt={mapData.name} loading="lazy"/>
      <div className="card__inner_buttons">
        <a className="card__inner_button" href={mapData.web_preview} target="_blank">
          <img src={iconFullscreen}/>
        </a>
        <a className="card__inner_button" href={mapData.website} target="_blank">
          <img src={iconArrowRight}/>
        </a>
      </div>
    </div>
    <div className="card-body">
      <div className="card__map-type" data-type={mapData.type}>
        {mapData.type}
      </div>
      <h5 className="card-title">
        {mapData.name}
      </h5>
      <p className="card__mapper">
        By {mapData.mapper}
      </p>
      <div className="card__info">
        <span className="card__info-item">
          ⭐ {mapData.points}pts
        </span>
        <span className="card__info-item card__difficulty">
          {"★".repeat(mapData.difficulty) + "☆".repeat(5 - mapData.difficulty)}
        </span>
      </div>
      <p className="card__footer">
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
