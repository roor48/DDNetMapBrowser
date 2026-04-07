/**
 * @typedef {Object} MapData
 * @property {string} name - 맵 이름
 * @property {string} website - 맵 URL
 * @property {string} thumbnail - 썸네일 URL
 * @property {string} web_preview - 맵뷰어 URL
 * @property {string} type - 맵 타입 (novice, moderate, brutal 등)
 * @property {number} points - 포인트
 * @property {number} difficulty - 난이도 (0-5)
 * @property {string} mapper - 제작자
 * @property {string} release - 출시일
 * @property {number} width - 맵 너비
 * @property {number} height - 맵 높이
 * @property {string[]} tiles - 타일 목록
 */

/**
 * @typedef {Object} Filter
 * @property {string[]} types - 타입
 * @property {number} difficultyMin - 난이도
 * @property {number} difficultyMax - 난이도
 * @property {string[]} tiles - 타일
 */

/**
 * @typedef {Object} Sorter
 * @property {string} sortBy - 정렬기준
 * @property {boolean} isDESC - 오름차순이면 0 내림차순이면 1
 */

export const TYPES = Object.freeze({
    Novice: "Novice",
    Moderate: "Moderate",
    Brutal: "Brutal",
    Insane: "Insane",
    Dummy: "Dummy",
    DDmaX: "DDmaX",
    DDmaX_Easy: "DDmaX.Easy",
    DDmaX_Next: "DDmaX.Next",
    DDmaX_Pro: "DDmaX.Pro",
    DDmaX_Nut: "DDmaX.Nut",
    Oldschool: "Oldschool",
    Solo: "Solo",
    Race: "Race",
    Fun: "Fun",
    Event: "Event",
});

export const SORT_BY = Object.freeze({
    Release: "Release",
    Points: "Points",
    Difficulty: "Difficulty",
    Name: "Name",
});

export default {};
