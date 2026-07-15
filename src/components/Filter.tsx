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
  <div className="p-4 relative text-[#f8f8e9] w-full after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-[#333] grid grid-rows-[auto_auto] grid-cols-1 gap-[0.7rem]">
    <div className="w-full h-10">
      <input
        id="filter__map-search"
        type="text"
        className="text-base px-3 text-gray-100 font-bold opacity-90 w-full h-full rounded-[9px] bg-gray-900 border border-[#333] outline-none focus:border-white"
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
    <div className="w-full h-10">
      <input
        id="filter__mapper-search"
        type="text"
        className="text-base px-3 text-gray-100 font-bold opacity-90 w-full h-full rounded-[9px] bg-gray-900 border border-[#333] outline-none focus:border-white"
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
  <div className="p-4 relative text-[#f8f8e9] w-full after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-[#333]">
    <details open>
      <summary className="list-none pb-2.5 text-[1.1rem] font-semibold text-gray-100">Finished</summary>

      <div className="cursor-pointer has-[:disabled]:cursor-not-allowed">
        <label htmlFor="user-finished" className="flex items-center w-full m-0 cursor-inherit">
          <input
            id="user-finished"
            className="mr-2 cursor-pointer"
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
      <div className="cursor-pointer has-[:disabled]:cursor-not-allowed">
        <label htmlFor="user-unfinished" className="flex items-center w-full m-0 cursor-inherit">
          <input
            id="user-unfinished"
            className="mr-2 cursor-pointer"
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
    <div className="cursor-pointer">
      <label htmlFor={id} className="flex items-center w-full m-0 cursor-inherit">
        <input
          id={id}
          className="mr-2 cursor-pointer"
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
  <div className="p-4 relative text-[#f8f8e9] w-full after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-[#333]">
    <details open>
      <summary className="list-none pb-2.5 text-[1.1rem] font-semibold text-gray-100">Map Type</summary>

      <div>
        {NORMAL_TYPES.map(type => (
          <TypeCheckbox key={type} type={type} filter={filter} setFilter={setFilter} />
        ))}

        <div className="mt-4">
          <p className="text-[1.1rem] font-semibold mb-0">DDmaX</p>
          <div className="ml-5">
            {DDMAX_TYPES.map(type => (
              <TypeCheckbox key={type} type={type} filter={filter} setFilter={setFilter} />
            ))}
          </div>
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
    <div className="p-4 relative text-[#f8f8e9] w-full after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-[#333]">
      <details open>
        <summary className="list-none pb-2.5 text-[1.1rem] font-semibold text-gray-100">Difficulty</summary>

        <div className="p-2">
          <div className="flex justify-between mb-2.5 text-gray-100 text-[0.9rem]">
            <span className="text-[#aaa]">Min: <span className="text-[#ffd700] font-semibold">{displayMin}</span></span>
            <span className="text-[#aaa]">Max: <span className="text-[#ffd700] font-semibold">{displayMax}</span></span>
          </div>
          <div className="relative h-1.5 w-full rounded-full bg-white">
            <div
              className="absolute w-full h-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] rounded-full pointer-events-none"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            ></div>
            <input
              type="range"
              className="absolute w-full h-full bg-transparent pointer-events-none appearance-none [&::-webkit-slider-track]:w-full [&::-webkit-slider-track]:h-1.5 [&::-webkit-slider-track]:bg-[#333] [&::-webkit-slider-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[1.125rem] [&::-webkit-slider-thumb]:h-[1.125rem] [&::-webkit-slider-thumb]:bg-[#ffd700] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1a1a1a] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[2] [&::-webkit-slider-thumb]:hover:bg-[#ffed4e] [&::-moz-range-track]:w-full [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-[#333] [&::-moz-range-track]:rounded-full [&::-moz-range-thumb]:w-[1.125rem] [&::-moz-range-thumb]:h-[1.125rem] [&::-moz-range-thumb]:bg-[#ffd700] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1a1a1a] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:hover:bg-[#ffed4e] z-[1]"
              min="0" max="5" step="1"
              value={values[0]}
              onChange={e => handleChange(0, parseInt(e.currentTarget.value))}
            />
            <input
              type="range"
              className="absolute w-full h-full bg-transparent pointer-events-none appearance-none [&::-webkit-slider-track]:w-full [&::-webkit-slider-track]:h-1.5 [&::-webkit-slider-track]:bg-[#333] [&::-webkit-slider-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[1.125rem] [&::-webkit-slider-thumb]:h-[1.125rem] [&::-webkit-slider-thumb]:bg-[#ffd700] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1a1a1a] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[2] [&::-webkit-slider-thumb]:hover:bg-[#ffed4e] [&::-moz-range-track]:w-full [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-[#333] [&::-moz-range-track]:rounded-full [&::-moz-range-thumb]:w-[1.125rem] [&::-moz-range-thumb]:h-[1.125rem] [&::-moz-range-thumb]:bg-[#ffd700] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1a1a1a] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:hover:bg-[#ffed4e] z-[2]"
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
    <div className="flex items-center justify-center aspect-square border-[0.15rem] border-gray-800 rounded-[7px] has-[:checked]:border-[#2f00ff]" title={tile}>
      <input
        id={id}
        className="hidden"
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
      <label className="cursor-pointer flex w-full aspect-square items-center justify-center p-1.5" htmlFor={id}>
        <img
          className="block h-full aspect-square items-center justify-center bg-[#555555]"
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
  <div className="p-4 relative text-[#f8f8e9] w-full">
    <details open>
      <summary className="list-none pb-2.5 text-[1.1rem] font-semibold text-gray-100">Tiles</summary>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.8rem,1fr))] gap-[0.3rem]">
        {allTiles.map(tile => (
          <TileCheckBox key={tile} tile={tile} filter={filter} setFilter={setFilter}></TileCheckBox>
        ))}
      </div>
    </details>
  </div>
  )
}

type FilterContainerProps = FilterProps & { hasTeeData: boolean, allTiles: string[], isOpen: boolean, onClose: () => void }
export default function Filter({ hasTeeData, allTiles, filter, setFilter, isOpen, onClose }: FilterContainerProps) {
  return (
    <>
      {/* 모바일 배경 오버레이 */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[90]"
          onClick={onClose}
        />
      )}
      
      {/* 필터 사이드바 */}
      <div className={`
        bg-[#080808] border-r border-gray-800
        md:col-start-1 md:row-start-1 md:row-end-[-1] md:sticky md:top-0 md:h-screen md:block
        ${isOpen ? 'block fixed inset-y-0 left-0 z-[95] w-72' : 'hidden md:block'}
      `}>
      <div className="flex h-16 border-b border-gray-800 items-center justify-between">
        <div
          className="ml-4 flex items-center gap-0.5 cursor-pointer md:cursor-default" 
          onClick={onClose}
        >
          <img className="invert w-6 aspect-square" src={FilterIcon}/>
          <span className="text-[1.3rem] font-semibold text-gray-100">Filters</span>
        </div>

        {!isDefaultFilter(filter) && (
          <button className="flex items-center justify-center h-8 mr-4 rounded-[7px] border-none bg-transparent opacity-50 font-medium cursor-pointer hover:bg-[#2e2e2e] hover:font-[550] hover:opacity-100"
            onClick={() => setFilter(initialFilter)}
          >
            <img className="invert w-6 aspect-square" src={XMark}/>
            <span className="mr-1 text-gray-100">Clear</span>
          </button>
        )}
      </div>
      <div className="overflow-y-auto overscroll-contain select-none h-[calc(100vh-4rem)]">
          <SearchMapFilter filter={filter} setFilter={setFilter}/>
          <FinishStatusFilter hasTeeData={hasTeeData} filter={filter} setFilter={setFilter}/>
          <MapTypeFilter filter={filter} setFilter={setFilter}/>
          <DifficultyFilter setFilter={setFilter} values={filter.difficultyRange}/>
          <TileFilter allTiles={allTiles} filter={filter} setFilter={setFilter}/>
      </div>
    </div>
    </>
  )
}
