/**
 * @typedef {import('./types.js').MapData} MapData
 */

/**
 * 기존 맵 카드를 전부 제거 후 list 요소 순서대로 재생성합니다.
 * @param {MapData[]} mapDataList
 */
export default function createMapCard(mapDataList) {
    const cardParent = document.querySelector(".map_cards");
    cardParent.replaceChildren();

    mapDataList.forEach(mapData => {
        const card = createCard(mapData);
        cardParent.appendChild(card);
    });
}

/**
 * @param {MapData} mapData 
 */
function createCard(mapData) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    const web_preview = document.createElement("a");
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