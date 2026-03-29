/**
 * 타일 필터를 불러옵니다.
 * @param {string[]} tiles
 */
export default function createTileFilter(tiles) {
    const tileParent = document.querySelector(".tiles__tile_parent");
    tiles.forEach(tile => {
        const div = document.createElement("div");
        div.setAttribute("class", "tile_filter");
        
        const input = document.createElement("input");
        input.setAttribute("id", tile);
        input.setAttribute("class", "btn-check");
        input.setAttribute("type", "checkbox");
        input.setAttribute("autocomplete", "off");
        div.appendChild(input);
        
        const label = document.createElement("label");
        label.setAttribute("class", "btn btn-outline-primary");
        label.setAttribute("for", tile);
        
        const img = document.createElement("img");
        img.setAttribute("src", `https://ddnet.org/tiles/${tile}.png`);
        img.setAttribute("alt", tile);
        img.setAttribute("class", "tile_image");
        
        label.textContent = tile;
        label.appendChild(img);
        div.appendChild(label);

        tileParent.appendChild(div);
    });
}
