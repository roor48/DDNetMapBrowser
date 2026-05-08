import { SORT_BY, type Sorter } from "../types"
import iconSort from "../assets/icon-sort.svg";

type SorterProps = {
  sorter: Sorter,
  setSorter: React.Dispatch<React.SetStateAction<Sorter>>,
  disabled?: boolean
}

export default function Sorter({ sorter, setSorter, disabled = false }: SorterProps) {
  return (
  <>
    <img
      className="asc_icon invert-color"
      title={disabled ? "Sorting disabled while filtering by search" : sorter.isDESC ? "Descending" : "Ascending"}
      src={iconSort}
      style={{
        transform: sorter.isDESC ? "scaleY(-1)" : "scaleY(1)",
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (disabled) {
          return;
        }
        setSorter(prev => ({ ...prev, isDESC: !prev.isDESC }));
      }}
    />
    <div
      className="sortByDropdown"
      style={{
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      <button className="btn btn-secondary dropdown-toggle" type="button" id="sortByDropdownButton" data-bs-toggle={disabled ? undefined : "dropdown"} aria-expanded="false" disabled={disabled}>
        {sorter.sortBy}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="sortByDropdownButton">
        {Object.values(SORT_BY).map(sortBy => (
          <li key={sortBy}>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => {
                if (disabled) {
                  return;
                }
                setSorter(prev => ({ ...prev, sortBy: sortBy }));
              }}
              disabled={disabled}
            >
              {sortBy}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </>
  )
}