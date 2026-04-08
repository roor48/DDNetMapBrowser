/**
 * @typedef {import('./types.js').MapData} MapData
 */

const MAPS_PER_PAGE = 20;

/** @type {MapData[]} */
let mapDatas = [];

/** @type {HTMLButtonElement} */
const loadButton = document.querySelector(".map_card__load_button");
if (loadButton) {
    loadButton.addEventListener("click", loadMoreMapCard);
}

/**
 * 기존 맵 카드를 전부 제거 후 list 요소 순서대로 재생성합니다.
 * @param {MapData[]} mapDataList
 */
export default function createMapCard(mapDataList) {
    mapDatas = mapDataList.slice();
    const cardParent = document.querySelector(".map_cards .map_cards__parent");
    cardParent.replaceChildren();
    
    loadMoreMapCard();
    updateLoadButton();
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
    
    updateLoadButton();
}

/**
 * @param {MapData} mapData 
 */
function createCard(mapData) {
    const card = document.createElement("div");
    card.setAttribute("class", "card bg-dark text-light");

    // 이미지 래퍼
    const imgWrapper = document.createElement("div");
    imgWrapper.setAttribute("class", "card__img_wrapper");

    const thumbnail = document.createElement("img");
    thumbnail.src = mapData.thumbnail;
    thumbnail.setAttribute("class", "card-img-top");
    thumbnail.alt = mapData.name;
    thumbnail.loading = "lazy";

    // 내부 버튼들
    const innerButtons = document.createElement("div");
    innerButtons.setAttribute("class", "card__inner_buttons");

    const previewBtn = document.createElement("a");
    previewBtn.setAttribute("class", "card__inner_button");
    previewBtn.href = mapData.web_preview;
    previewBtn.target = "_blank";
    const previewIcon = document.createElement("img");
    previewIcon.src = "./assets/icon-fullscreen.svg";
    previewBtn.appendChild(previewIcon);

    const websiteBtn = document.createElement("a");
    websiteBtn.setAttribute("class", "card__inner_button");
    websiteBtn.href = mapData.website;
    websiteBtn.target = "_blank";
    const websiteIcon = document.createElement("img");
    websiteIcon.src = "./assets/icon-arrowright.svg";
    websiteBtn.appendChild(websiteIcon);

    innerButtons.appendChild(previewBtn);
    innerButtons.appendChild(websiteBtn);

    imgWrapper.appendChild(thumbnail);
    imgWrapper.appendChild(innerButtons);

    // 카드 본문
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    // 맵 타입
    const mapType = document.createElement("div");
    mapType.setAttribute("class", "card__map-type");
    mapType.dataset.type = mapData.type;
    mapType.textContent = mapData.type;

    // 맵 제목
    const cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.textContent = mapData.name;

    // 제작자
    const mapper = document.createElement("p");
    mapper.setAttribute("class", "card__mapper");
    mapper.textContent = `By ${mapData.mapper}`;

    // 정보 (포인트 & 난이도)
    const cardInfo = document.createElement("div");
    cardInfo.setAttribute("class", "card__info");

    const pointsItem = document.createElement("span");
    pointsItem.setAttribute("class", "card__info-item");
    pointsItem.textContent = `⭐ ${mapData.points}pts`;

    const difficultyItem = document.createElement("span");
    difficultyItem.setAttribute("class", "card__info-item card__difficulty");
    difficultyItem.textContent = "★".repeat(mapData.difficulty) + "☆".repeat(5 - mapData.difficulty);

    cardInfo.appendChild(pointsItem);
    cardInfo.appendChild(difficultyItem);

    // 출시일
    const footer = document.createElement("p");
    footer.setAttribute("class", "card__footer");
    footer.textContent = `Released on ${mapData.release}`;

    cardBody.appendChild(mapType);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(mapper);
    cardBody.appendChild(cardInfo);
    cardBody.appendChild(footer);

    card.appendChild(imgWrapper);
    card.appendChild(cardBody);

    return card;
}

function updateLoadButton() {
    if (loadButton) {
        loadButton.style.display = mapDatas.length > 0 ? "block" : "none";
    }
}


