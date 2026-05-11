import { type Filter, type MapType, TYPES, initialFilter } from "../types"

import FilterIcon from "../assets/icon-filter.svg"
import XMark from "../assets/icon-xmark.svg"

type FilterProps = {
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>
}

function isDefaultFilter(filter: Filter): boolean {
  return (
    filter.name === initialFilter.name &&
    filter.mapper === initialFilter.mapper &&
    filter.isFinished === initialFilter.isFinished &&
    filter.isUnfinished === initialFilter.isUnfinished &&
    filter.types.length === initialFilter.types.length &&
    Math.min(filter.difficultyRange[0], filter.difficultyRange[1]) === initialFilter.difficultyRange[0] &&
    Math.max(filter.difficultyRange[0], filter.difficultyRange[1]) === initialFilter.difficultyRange[1] &&
    filter.tiles.length === initialFilter.tiles.length
  )
}

function SearchMapFilter({ filter, setFilter }: FilterProps) {
  return (
  <div className="filter_bar__div search_map">
    <div className="search-wrapper">
      <input
        id="filter__map-search"
        type="text"
        className="filter__map-search"
        placeholder="Map search"
        value={filter.name}
        onChange={e => {
          const name = e.currentTarget.value
          setFilter(prev => ({
            ...prev,
            name: name
          }))
        }}
      />
    </div>
    <div className="search-wrapper">
      <input
        id="filter__mapper-search"
        type="text"
        className="filter__mapper-search"
        placeholder="Mapper search"
        value={filter.mapper}
        onChange={e => {
          const mapper = e.currentTarget.value
          setFilter(prev => ({
            ...prev,
            mapper: mapper
          }))
        }}
      />
    </div>
  </div>
  )
}

type FinishStatusProps = Pick<FilterProps, "filter" | "setFilter"> & { hasTeeData: boolean }
function FinishStatusFilter({ hasTeeData, filter, setFilter }: FinishStatusProps) {
  return (
  <div className="filter_bar__div user_filter">
    <details className="filter__details" open>
      <summary className="filter_summary">Finished</summary>

      <div className="filter-checkbox finished-wrapper">
        <label htmlFor="user-finished">
          <input
            id="user-finished"
            className="form-check-input"
            type="checkbox"
            disabled={!hasTeeData}
            checked={filter.isFinished}
            onChange={e => {
              const checked = e.currentTarget.checked
              setFilter(prev => ({
                ...prev,
                isFinished: checked,
                isUnfinished: false
              }))
            }}
          />
          Finished
        </label>
      </div>
      <div className="filter-checkbox unfinished-wrapper">
        <label htmlFor="user-unfinished">
          <input
            id="user-unfinished"
            className="form-check-input"
            type="checkbox"
            value=""
            disabled={!hasTeeData}
            checked={filter.isUnfinished}
            onChange={e => {
              const checked = e.currentTarget.checked
              setFilter(prev => ({
                ...prev,
                isFinished: false,
                isUnfinished: checked
              }))
            }}
          />
          Unfinished
        </label>
      </div>
    </details>
  </div>
  )
}

const NORMAL_TYPES = [
  TYPES.Novice, TYPES.Moderate, TYPES.Brutal, TYPES.Insane,
  TYPES.Dummy, TYPES.Oldschool, TYPES.Solo, TYPES.Race, TYPES.Fun, TYPES.Event,
]

const DDMAX_TYPES = [
  TYPES.DDmaX_Easy, TYPES.DDmaX_Next, TYPES.DDmaX_Pro, TYPES.DDmaX_Nut,
]

type TypeCheckboxProps = Pick<FilterProps, "filter" | "setFilter"> & { type: MapType }
function TypeCheckbox({ type, filter, setFilter }: TypeCheckboxProps) {
  const id = `filter_${type.toLowerCase().replace('.', '_')}`
  return (
    <div className="filter-checkbox unfinished-wrapper">
      <label htmlFor={id}>
        <input
          id={id}
          className="form-check-input"
          type="checkbox"
          checked={filter.types.includes(type)}
          onChange={e => {

            const checked = e.currentTarget.checked;
            setFilter(prev => ({
              ...prev,
              types: checked
                ? [...prev.types, type]
                : prev.types.filter(t => t !== type)
              }))
            }
          }
        />
        {type}
      </label>
    </div>
  )
}

function MapTypeFilter({ filter, setFilter }: FilterProps) {
  return (
  <div className="filter_bar__div">
    <details className="filter__details" open>
      <summary className="filter_summary">Map Type</summary>

      <div className="filter__type_parent">
        {NORMAL_TYPES.map(type => (
          <TypeCheckbox key={type} type={type} filter={filter} setFilter={setFilter} />
        ))}

        <div className="map_type__ddmax">
          <p className="map_type__ddmax__p">DDmaX</p>
          {DDMAX_TYPES.map(type => (
            <TypeCheckbox key={type} type={type} filter={filter} setFilter={setFilter} />
          ))}
        </div>
      </div>
    </details>
  </div>
  )
}

type DifficultyFilterProps = Pick<FilterProps, "setFilter"> & {
  values: [number, number],
}
function DifficultyFilter({ setFilter, values }: DifficultyFilterProps) {
  const handleChange = (index: number, raw: number) => {
    const next = [...values] as [number, number]
    next[index] = raw

    setFilter(prev => ({
      ...prev,
      difficultyRange: next,
    }))
  }

  const displayMin = Math.min(values[0], values[1])
  const displayMax = Math.max(values[0], values[1])
  const minPercent = (displayMin / 5) * 100
  const maxPercent = (displayMax / 5) * 100

  return (
    <div className="filter_bar__div">
      <details className="filter__details" open>
        <summary className="filter_summary">Difficulty</summary>

        <div className="difficulty__range-container">
          <div className="difficulty__labels">
            <span className="difficulty__label">Min: <span className="difficulty-min-value">{displayMin}</span></span>
            <span className="difficulty__label">Max: <span className="difficulty-max-value">{displayMax}</span></span>
          </div>
          <div className="difficulty__sliders">
            <div
              className="difficulty__range-fill"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            ></div>
            <input
              type="range"
              className="difficulty__slider"
              min="0" max="5" step="1"
              value={values[0]}
              onChange={e => handleChange(0, parseInt(e.currentTarget.value))}
            />
            <input
              type="range"
              className="difficulty__slider"
              min="0" max="5" step="1"
              value={values[1]}
              onChange={e => handleChange(1, parseInt(e.currentTarget.value))}
            />
          </div>
        </div>
      </details>
    </div>
  )
}

type TileCheckBoxProps = Pick<FilterProps, "filter" | "setFilter"> & { tile: string }
function TileCheckBox({ tile, filter, setFilter }: TileCheckBoxProps) {
  const id = `filter_${tile.toLowerCase()}`
  return (
    <div className="tile_filter" title={tile}>
      <input
        id={id}
        className="btn-check"
        type="checkbox"
        autoComplete="off"
        checked={filter.tiles.includes(tile)}
        onChange={e => {
          const checked = e.currentTarget.checked
          setFilter(prev => ({
            ...prev,
            tiles: checked
            ? [...prev.tiles, tile]
              : prev.tiles.filter(t => t !== tile)
            }))
        }}
      />
      <label className="tile_button" htmlFor={id}>
        <img
          className="tile_image"
          src={`https://ddnet.org/tiles/${tile}.png`}
          alt={tile}
        />
      </label>
    </div>
  )
}

type TileFilterProps = Pick<FilterProps, "filter" | "setFilter"> & { allTiles: string[] }
function TileFilter({ allTiles, filter, setFilter }: TileFilterProps) {
  return (
  <div className="filter_bar__div">
    <details className="filter__details" open>
      <summary className="filter_summary">Tiles</summary>
      <div className="filter__tile_parent">
        {allTiles.map(tile => (
          <TileCheckBox key={tile} tile={tile} filter={filter} setFilter={setFilter}></TileCheckBox>
        ))}
      </div>
    </details>
  </div>
  )
}

type FilterContainerProps = FilterProps & { hasTeeData: boolean, allTiles: string[] }
export default function Filter({ hasTeeData, allTiles, filter, setFilter }: FilterContainerProps) {
  return (
    <div className="filter_bar">
      <div className="filter_title">
        <div className="text">
          <img className="invert-color" src={FilterIcon}/>
          <span>Filters</span>
        </div>

        {!isDefaultFilter(filter) && (
          <button className="clear_button"
            onClick={() => setFilter(initialFilter)}
          >
            <img className="invert-color" src={XMark}/>
            <span>Clear</span>
          </button>
        )}
      </div>
      <div className="filter_content">
          <SearchMapFilter filter={filter} setFilter={setFilter}/>
          <FinishStatusFilter hasTeeData={hasTeeData} filter={filter} setFilter={setFilter}/>
          <MapTypeFilter filter={filter} setFilter={setFilter}/>
          <DifficultyFilter setFilter={setFilter} values={filter.difficultyRange}/>
          <TileFilter allTiles={allTiles} filter={filter} setFilter={setFilter}/>
      </div>
    </div>
  )
}
