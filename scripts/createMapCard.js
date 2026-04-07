/**
 * @typedef {import('./types.js').MapData} MapData
 */

const MAPS_PER_PAGE = 20;

/** @type {MapData[]} */
let mapDatas = [];
/** @type {HTMLButtonElement} */
let loadButton = null;
/**
 * 기존 맵 카드를 전부 제거 후 list 요소 순서대로 재생성합니다.
 * @param {MapData[]} mapDataList
 */
export function createMapCard(mapDataList) {
    return;
    mapDatas = mapDataList.slice();
    const cardParent = document.querySelector(".map_cards .map_cards__parent");
    cardParent.replaceChildren();
    
    loadMoreMapCard();
    createLoadButton();
}

export function loadMoreMapCard() {
    if (mapDatas.length === 0) {
        return;
    }

    const cardParent = document.querySelector(".map_cards .map_cards__parent");

    mapDatas.slice(0, MAPS_PER_PAGE).forEach(mapData => {
        const card = createCard(mapData);
        cardParent.appendChild(card);
    });
    mapDatas = mapDatas.slice(MAPS_PER_PAGE);

    if (mapDatas.length === 0) {
        loadButton.remove();
        loadButton = null;
    }
}

/**
 * @param {MapData} mapData 
 */
function createCard(mapData) {
    const card = document.createElement("div");
    card.setAttribute("class", "card bg-dark text-light");

    const web_preview = document.createElement("a");
    web_preview.setAttribute("class", "card__wrapper");
    web_preview.setAttribute("href", mapData.web_preview);
    web_preview.setAttribute("target", "_blank");

    const thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", mapData.thumbnail);
    thumbnail.setAttribute("class", "card-img-top");
    thumbnail.setAttribute("alt", mapData.name);
    thumbnail.setAttribute("loading", "lazy");

    const card_body = document.createElement("div");
    card_body.setAttribute("class", "card-body");
    
    const card_title = document.createElement("h5");
    card_title.setAttribute("class", "card-title");
    card_title.textContent = mapData.name;

    const card_text = document.createElement("p");
    card_text.setAttribute("class", "card-text");
    card_text.textContent = mapData.mapper;

    const map_url = document.createElement("a");
    map_url.setAttribute("href", mapData.website);
    map_url.setAttribute("target", "_blank");
    map_url.setAttribute("class", "btn btn-primary");
    map_url.textContent = "Go";

    web_preview.appendChild(thumbnail);

    card_body.appendChild(card_title);
    card_body.appendChild(card_text);
    card_body.appendChild(map_url);

    card.appendChild(web_preview);
    card.appendChild(card_body);

    return card;
}

function createLoadButton() {
    if (loadButton !== null || mapDatas.length === 0) {
        return;
    }

    const button = document.createElement("button");
    button.setAttribute("class", "map_card__load_button");
    button.textContent = "Load More";
    button.addEventListener("click", loadMoreMapCard);

    document.querySelector(".map_cards").appendChild(button);

    loadButton = button;
}