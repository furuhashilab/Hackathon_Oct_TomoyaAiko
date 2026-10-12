// 北海道神宮 3D探訪 — CesiumJS × PLATEAU 3D Tiles × 地理院標高タイル
// Cesium ion のトークンを使わず、すべてオープンなタイルだけで構成している。

// PLATEAU 札幌市 2020 建築物モデル（中央区・LOD2・テクスチャ付き）
const TILESET_URL =
  "https://assets.cms.plateau.reearth.io/assets/16/06e56d-a2d4-4fe4-ac91-b2762b96e033/01100_sapporo-shi_city_2020_citygml_7_op_bldg_3dtiles_01101_chuo-ku_lod2/tileset.json";

// PLATEAU の高さは楕円体高、地理院の標高は標高（ジオイド基準）。
// 北海道神宮付近のジオイド高（国土地理院 ジオイド計算サービスで算出）を足して揃える。
const GEOID_HEIGHT = 32.49;

// 座標は OpenStreetMap を参照。標高は表示時に地理院 標高タイルから求める。
// heading はカメラが向く方角（北=0, 東=90）、range はカメラまでの距離[m]
// wiki は写真と概要を取る日本語版 Wikipedia の記事名、url は公式サイト（Wikidata の公式ウェブサイトから確認）
const SPOT_GROUPS = [
  { title: "神宮と円山", spots: [
    { name: "北海道神宮", note: "本殿・境内（背後に円山）", lon: 141.30923, lat: 43.05458, heading: 150, pitch: -25, range: 700, wiki: "北海道神宮", url: "http://www.hokkaidojingu.or.jp/" },
    { name: "開拓神社", note: "境内に祀られた開拓者たち", lon: 141.31158, lat: 43.05473, heading: 210, pitch: -35, range: 320, url: "http://www.hokkaidojingu.or.jp/" },
    { name: "円山公園", note: "桜と原生林の公園", lon: 141.30791, lat: 43.05148, heading: 200, pitch: -30, range: 900, wiki: "円山公園 (札幌市)", url: "https://maruyamapark.jp/" },
    { name: "円山（山頂）", note: "標高226m・円山原始林", lon: 141.31655, lat: 43.04728, heading: 60, pitch: -18, range: 1500, wiki: "円山 (札幌市)" },
    { name: "円山動物園", note: "円山の西麓", lon: 141.30629, lat: 43.04885, heading: 160, pitch: -30, range: 800, wiki: "札幌市円山動物園", url: "https://www.city.sapporo.jp/zoo/" },
    { name: "大倉山ジャンプ競技場", note: "札幌五輪の舞台・宮の森", lon: 141.28886, lat: 43.05139, heading: 255, pitch: -20, range: 1500, wiki: "大倉山ジャンプ競技場", url: "https://okurayama-jump.jp/" },
  ] },
  { title: "都心の名所", spots: [
    { name: "北海道神宮頓宮", note: "都心にある神宮の御旅所", lon: 141.36143, lat: 43.05998, heading: 0, pitch: -40, range: 320, wiki: "北海道神宮頓宮", url: "http://www.hokkaidojingu.or.jp/" },
    { name: "北海道立近代美術館", note: "北1条西17丁目", lon: 141.33042, lat: 43.06007, heading: 20, pitch: -35, range: 450, wiki: "北海道立近代美術館", url: "https://artmuseum.pref.hokkaido.lg.jp/knb" },
    { name: "札幌市資料館", note: "大通公園の西のはし", lon: 141.33747, lat: 43.05853, heading: 90, pitch: -30, range: 450, wiki: "札幌市資料館", url: "https://www.s-shiryokan.jp/" },
    { name: "大通公園", note: "東西1.5kmの緑の帯", lon: 141.34751, lat: 43.0599, heading: 80, pitch: -22, range: 1300, wiki: "大通公園", url: "https://odori-park.jp/" },
    { name: "さっぽろテレビ塔", note: "大通公園の東のはし", lon: 141.35645, lat: 43.06111, heading: 260, pitch: -18, range: 650, wiki: "さっぽろテレビ塔", url: "https://www.tv-tower.co.jp/" },
    { name: "札幌市時計台", note: "1878年の旧札幌農学校演武場", lon: 141.35364, lat: 43.06255, heading: 30, pitch: -50, range: 420, wiki: "札幌市時計台", url: "https://sapporoshi-tokeidai.jp/" },
    { name: "北海道庁旧本庁舎", note: "赤れんが庁舎", lon: 141.34802, lat: 43.06397, heading: 350, pitch: -35, range: 420, wiki: "北海道庁旧本庁舎" },
    { name: "北大植物園", note: "都心に残る原始の森", lon: 141.34233, lat: 43.06377, heading: 0, pitch: -40, range: 800, wiki: "北海道大学植物園", url: "https://www.hokudai.ac.jp/fsc/bg/" },
    { name: "すすきの", note: "南4条西4丁目の交差点", lon: 141.3530, lat: 43.0555, heading: 0, pitch: -32, range: 550, wiki: "すすきの" },
    { name: "中島公園", note: "菖蒲池と豊平館", lon: 141.3542, lat: 43.04393, heading: 0, pitch: -35, range: 1100, wiki: "中島公園", url: "https://www.sapporo-park.or.jp/nakajima/" },
  ] },
  { title: "街をながめる", spots: [
    { name: "旭山記念公園", note: "夜景で知られる展望広場", lon: 141.31366, lat: 43.0389, heading: 45, pitch: -12, range: 1300, wiki: "旭山記念公園", url: "https://www.sapporo-park.or.jp/asahiyama/" },
    { name: "藻岩山（山頂）", note: "標高531m・市街を一望", lon: 141.32234, lat: 43.02239, heading: 15, pitch: -14, range: 2200, wiki: "藻岩山 (札幌市)", url: "https://mt-moiwa.jp/" },
    { name: "円山から都心へ", note: "大通・すすきの方面", lon: 141.3350, lat: 43.0580, heading: 90, pitch: -15, range: 4000, wiki: "札幌市", url: "https://www.sapporo.travel/" },
  ] },
];
const SPOTS = SPOT_GROUPS.flatMap((g) => g.spots);
SPOTS.forEach((s, i) => (s.no = i + 1));

const panel = document.getElementById("panel");
const isMobile = () => window.matchMedia("(max-width: 600px)").matches;

// ---------------- 地形：地理院 標高タイル（PNG）を CustomHeightmapTerrainProvider に流し込む ----------------
const GRID = 33; // 1タイルあたりの標高サンプル数（縦横）
const DEM_SOURCES = [
  { url: "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png", zoom: 15 }, // 5mメッシュ（航空レーザ）
  { url: "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png", zoom: 14 },   // 10mメッシュ
];
const MIN_TERRAIN_LEVEL = 10; // これより粗いレベルは海面の高さの平面で十分
const demCache = new Map();

function loadDem(src, z, x, y) {
  const key = `${src.zoom}/${z}/${x}/${y}`;
  if (!demCache.has(key)) {
    const url = src.url.replace("{z}", z).replace("{x}", x).replace("{y}", y);
    demCache.set(key, fetch(url)
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => (b ? createImageBitmap(b) : null))
      .then((img) => {
        if (!img) return null;
        const c = new OffscreenCanvas(256, 256);
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const px = ctx.getImageData(0, 0, 256, 256).data;
        const h = new Float32Array(256 * 256);
        for (let i = 0; i < h.length; i++) {
          // 標高PNG: x = R*2^16 + G*2^8 + B, 2^23 は欠測
          const v = px[i * 4] * 65536 + px[i * 4 + 1] * 256 + px[i * 4 + 2];
          h[i] = v === 8388608 ? NaN : (v < 8388608 ? v : v - 16777216) * 0.01;
        }
        return h;
      })
      .catch(() => null));
  }
  return demCache.get(key);
}

// level のタイル (x, y) を覆う標高タイルと、その中での位置・縮尺を返す
function demWindow(src, x, y, level) {
  const z = Math.min(level, src.zoom);
  const dz = level - z;
  const ax = x >> dz, ay = y >> dz;
  const scale = 1 / (1 << dz);
  return { dem: loadDem(src, z, ax, ay), ox: (x - (ax << dz)) * scale, oy: (y - (ay << dz)) * scale, scale };
}

async function heightmapFor(x, y, level) {
  const out = new Float32Array(GRID * GRID).fill(GEOID_HEIGHT);
  if (level < MIN_TERRAIN_LEVEL) return out;
  // 5m と 10m を並行して取りに行き、5m の欠測を 10m で埋める
  const wins = DEM_SOURCES.map((src) => demWindow(src, x, y, level));
  const dems = await Promise.all(wins.map((w) => w.dem));
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      for (let k = 0; k < wins.length; k++) {
        if (!dems[k]) continue;
        const w = wins[k];
        const v = bilinear(dems[k], (w.ox + (i / (GRID - 1)) * w.scale) * 256 - 0.5, (w.oy + (j / (GRID - 1)) * w.scale) * 256 - 0.5);
        if (!Number.isNaN(v)) { out[j * GRID + i] = v + GEOID_HEIGHT; break; }
      }
    }
  }
  return out;
}

function bilinear(h, fx, fy) {
  fx = Math.min(Math.max(fx, 0), 255);
  fy = Math.min(Math.max(fy, 0), 255);
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const x1 = Math.min(x0 + 1, 255), y1 = Math.min(y0 + 1, 255);
  const tx = fx - x0, ty = fy - y0;
  const a = h[y0 * 256 + x0], b = h[y0 * 256 + x1], c = h[y1 * 256 + x0], d = h[y1 * 256 + x1];
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

function tileXY(lon, lat, z) {
  const n = 2 ** z;
  const fx = ((lon + 180) / 360) * n;
  const fy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n;
  return { x: Math.floor(fx), y: Math.floor(fy), px: (fx % 1) * 256 - 0.5, py: (fy % 1) * 256 - 0.5 };
}

// ある地点の楕円体高（地表）
async function groundHeight(lon, lat) {
  for (const src of DEM_SOURCES) {
    const t = tileXY(lon, lat, src.zoom);
    const dem = await loadDem(src, src.zoom, t.x, t.y);
    const v = dem && bilinear(dem, t.px, t.py);
    if (v !== null && !Number.isNaN(v)) return v + GEOID_HEIGHT;
  }
  return GEOID_HEIGHT;
}

// 最初に映す場所の標高タイルを先にまとめて取っておく（地形の段階読み込みを短縮）
function prefetchDem(lon, lat) {
  for (const src of DEM_SOURCES) {
    for (let z = MIN_TERRAIN_LEVEL; z <= src.zoom; z++) {
      const t = tileXY(lon, lat, z);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) loadDem(src, z, t.x + dx, t.y + dy);
    }
  }
}
prefetchDem(SPOTS[0].lon, SPOTS[0].lat);

const terrainProvider = new Cesium.CustomHeightmapTerrainProvider({
  width: GRID,
  height: GRID,
  tilingScheme: new Cesium.WebMercatorTilingScheme(),
  callback: heightmapFor,
  credit: "地理院タイル（標高タイル）",
});

// ---------------- 背景地図 ----------------
// 地理院の写真は粗いズームレベルの提供がなく、404 が続くと地表が描かれないため、
// 粗いレベルは単色の画像で代用する
const PLAIN_TILE = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const g = c.getContext("2d");
  g.fillStyle = "#3b4a3c";
  g.fillRect(0, 0, 1, 1);
  return c;
})();
function gsiTiles(url, credit, fromLevel) {
  const p = new Cesium.UrlTemplateImageryProvider({ url, maximumLevel: 18, credit });
  const request = p.requestImage.bind(p);
  p.requestImage = (x, y, level, req) => (level < fromLevel ? Promise.resolve(PLAIN_TILE) : request(x, y, level, req));
  return p;
}
const BASES = {
  photo: () => gsiTiles("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", "地理院タイル（全国最新写真）", 5),
  pale: () => gsiTiles("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", "地理院タイル（淡色地図）", 0),
};

// ---------------- ビューア ----------------
Cesium.Ion.defaultAccessToken = undefined;
const viewer = new Cesium.Viewer("viewer", {
  terrainProvider,
  baseLayer: new Cesium.ImageryLayer(BASES.photo()),
  baseLayerPicker: false,
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  animation: false,
  timeline: false,
  fullscreenButton: false,
  infoBox: false,
  selectionIndicator: false,
});
viewer.targetFrameRate = 30; // 描画を30fpsに抑えてPCへの負荷を軽くする
const scene = viewer.scene;
scene.globe.depthTestAgainstTerrain = true;
scene.globe.baseColor = Cesium.Color.fromCssColorString("#3b4a3c"); // 読み込み中の地表色
scene.globe.maximumScreenSpaceError = 2.5;
scene.globe.preloadSiblings = true;
scene.fog.enabled = true;
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2026-10-12T02:00:00Z"); // 札幌の昼前の光
viewer.clock.shouldAnimate = true; // 雪のパーティクルは時計の進みで放出される

async function flyToSpot(s, duration = 2.5) {
  const h = s.ground ?? (s.ground = await groundHeight(s.lon, s.lat));
  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(s.lon, s.lat, h), 0), {
    offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(s.heading), Cesium.Math.toRadians(s.pitch), s.range),
    duration,
  });
}

// ---------------- スポット（ピンとリスト） ----------------
function pinImage(no, color) {
  const r = 13, c = document.createElement("canvas");
  c.width = c.height = r * 2 + 4;
  const g = c.getContext("2d");
  g.beginPath(); g.arc(r + 2, r + 2, r, 0, Math.PI * 2);
  g.fillStyle = color; g.fill();
  g.lineWidth = 2.5; g.strokeStyle = "#f5f3ec"; g.stroke();
  g.fillStyle = "#f5f3ec"; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(String(no), r + 2, r + 2.5);
  return c.toDataURL();
}

const pins = SPOTS.map((s) => viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(s.lon, s.lat),
  billboard: {
    image: pinImage(s.no, "#2e5b3c"),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 8000, 0.6),
  },
  label: {
    text: s.name, font: "bold 13px 'Zen Kaku Gothic New', sans-serif",
    fillColor: Cesium.Color.fromCssColorString("#1e2a22"),
    showBackground: true, backgroundColor: Cesium.Color.fromCssColorString("#f5f3ec").withAlpha(0.92),
    backgroundPadding: new Cesium.Cartesian2(6, 3),
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT, pixelOffset: new Cesium.Cartesian2(17, 0),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3500),
  },
}));

const spotNav = document.getElementById("spots");
for (const g of SPOT_GROUPS) {
  const h = document.createElement("h2");
  h.textContent = g.title;
  const ol = document.createElement("ol");
  for (const s of g.spots) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.dataset.no = s.no;
    btn.innerHTML = `<span class="no">${s.no}</span><span class="name">${s.name}</span><span class="note">${s.note}</span>`;
    btn.addEventListener("click", () => selectSpot(s));
    if (s.no === 1) btn.classList.add("on");
    li.appendChild(btn);
    ol.appendChild(li);
  }
  spotNav.append(h, ol);
}

flyToSpot(SPOTS[0], 0);

// ---------------- スポットカード（Wikipedia の写真・概要と公式サイト） ----------------
const card = document.getElementById("spotCard");
const wikiCache = new Map();
function wikiSummary(title) {
  if (!wikiCache.has(title)) {
    const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    wikiCache.set(title, fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  }
  return wikiCache.get(title);
}

async function showCard(s) {
  card.hidden = false;
  card.dataset.no = s.no;
  card.querySelector(".no").textContent = s.no;
  card.querySelector("h3").textContent = s.name;
  const photo = card.querySelector(".photo");
  const text = card.querySelector(".extract");
  const links = card.querySelector(".links");
  const credit = card.querySelector(".credit");
  photo.innerHTML = "";
  photo.hidden = true;
  credit.innerHTML = "";
  text.textContent = s.note;
  links.innerHTML = (s.url ? `<a href="${s.url}" target="_blank" rel="noopener">公式サイト</a>` : "");
  if (!s.wiki) return;
  const d = await wikiSummary(s.wiki);
  if (!d || card.dataset.no !== String(s.no)) return; // 待っている間に別のスポットが選ばれた
  if (d.extract) text.textContent = d.extract.length > 140 ? d.extract.slice(0, 140) + "…" : d.extract;
  const page = d.content_urls?.desktop?.page;
  if (page) links.insertAdjacentHTML("beforeend", `<a href="${page}" target="_blank" rel="noopener">Wikipedia</a>`);
  if (d.thumbnail?.source) {
    const img = new Image();
    img.alt = s.name;
    img.src = d.thumbnail.source.replace(/\/\d+px-/, "/500px-"); // Wikimedia の標準幅
    img.onerror = () => (img.src = d.thumbnail.source); // 500px 版がない画像は元のサムネイルで
    photo.appendChild(img);
    photo.hidden = false;
    const file = decodeURIComponent(d.thumbnail.source.split("/").slice(-2, -1)[0] || "");
    credit.innerHTML = `写真：<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}" target="_blank" rel="noopener">Wikimedia Commons</a>（作者・ライセンスはリンク先）／文：Wikipedia（CC BY-SA 4.0）`;
  } else {
    credit.textContent = "文：Wikipedia（CC BY-SA 4.0）";
  }
}
card.querySelector(".close").addEventListener("click", () => (card.hidden = true));

function selectSpot(s) {
  spotNav.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.no === String(s.no)));
  flyToSpot(s);
  showCard(s);
  if (isMobile()) setCollapsed(true);
}

// ---------------- PLATEAU 建物 ----------------
// 属性が無い建物もあるので、比較する前に必ず数値にそろえる（undefined との比較は描画エラーになる）
const H = "${feature['bldg:measuredHeight']}";
const Y = "${feature['bldg:yearOfConstruction']}";
const DEFINES = {
  h: `(${H} === undefined || ${H} === null) ? -1.0 : Number(${H})`,
  y: `(${Y} === undefined || ${Y} === null) ? -1.0 : Number(${Y})`,
};
const STYLES = {
  texture: null,
  height: {
    color: { conditions: [
      ["${h} < 0", "color('#cfcfc7')"],
      ["${h} >= 60", "color('#7a2e1f')"],
      ["${h} >= 31", "color('#c0603a')"],
      ["${h} >= 20", "color('#e3a957')"],
      ["${h} >= 10", "color('#b9c98f')"],
      ["true", "color('#eef0e4')"],
    ] },
    legend: { colors: ["#eef0e4", "#b9c98f", "#e3a957", "#c0603a", "#7a2e1f"], ticks: ["0m", "10", "20", "31", "60m〜"] },
  },
  year: {
    color: { conditions: [
      ["${y} <= 1", "color('#cfcfc7')"],
      ["${y} >= 2000", "color('#2e5b3c')"],
      ["${y} >= 1981", "color('#7d9a63')"],
      ["${y} >= 1971", "color('#e3a957')"],
      ["true", "color('#a8452c')"],
    ] },
    legend: { colors: ["#a8452c", "#e3a957", "#7d9a63", "#2e5b3c", "#cfcfc7"], ticks: ["〜1970", "1971", "1981 新耐震", "2000〜", "不明"] },
  },
};

// 冬：上向きの面（屋根）に雪を積もらせ、全体を少し青白くする
const SNOW_SHADER = new Cesium.CustomShader({
  fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      vec3 posEC = fsInput.attributes.positionEC;
      vec3 nEC = normalize(cross(dFdx(posEC), dFdy(posEC)));
      vec3 posWC = (czm_inverseView * vec4(posEC, 1.0)).xyz;
      vec3 upEC = normalize((czm_view * vec4(normalize(posWC), 0.0)).xyz);
      float snow = smoothstep(0.55, 0.85, abs(dot(nEC, upEC)));
      material.diffuse = mix(material.diffuse, vec3(0.95, 0.97, 1.0), snow);
    }`,
});

let tileset;
let styleMode = "texture";
let season = "summer";
(async () => {
  try {
    tileset = await Cesium.Cesium3DTileset.fromUrl(TILESET_URL, {
      maximumScreenSpaceError: 16,
      cullRequestsWhileMoving: true,
      foveatedScreenSpaceError: true,
    });
    scene.primitives.add(tileset);
    applyStyle();
    applySeason();
  } catch (e) {
    console.error(e);
    alert("PLATEAU の建物データを読み込めませんでした。時間をおいて再読み込みしてください。");
  }
})();

const legend = document.getElementById("legend");
function applyStyle() {
  clearSelection();
  const s = STYLES[styleMode];
  legend.innerHTML = s
    ? `<div class="bar">${s.legend.colors.map((c) => `<i style="background:${c}"></i>`).join("")}</div>` +
      `<div class="ticks">${s.legend.ticks.map((t) => `<span>${t}</span>`).join("")}</div>`
    : "";
  if (!tileset) return;
  if (s) {
    tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.MIX;
    tileset.colorBlendAmount = 0.85;
    tileset.style = new Cesium.Cesium3DTileStyle({ defines: DEFINES, color: s.color });
  } else {
    tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT;
    tileset.style = undefined;
  }
  }

// ---------------- 季節 ----------------
let snowSystem = null;
function snowflakeImage() {
  const c = document.createElement("canvas");
  c.width = c.height = 16;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.7)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 16);
  return c.toDataURL();
}
const SNOW_RADIUS = 350;
const down = new Cesium.Cartesian3();
function makeSnow() {
  return scene.primitives.add(new Cesium.ParticleSystem({
    modelMatrix: Cesium.Matrix4.fromTranslation(scene.camera.positionWC),
    emitter: new Cesium.SphereEmitter(SNOW_RADIUS),
    image: snowflakeImage(),
    emissionRate: 3000,
    lifetime: 8,
    minimumSpeed: 0, maximumSpeed: 0,
    sizeInMeters: true, // 近くの雪は大きく、遠くの雪は小さく見える
    minimumImageSize: new Cesium.Cartesian2(0.6, 0.6),
    maximumImageSize: new Cesium.Cartesian2(1.6, 1.6),
    startColor: Cesium.Color.WHITE.withAlpha(0.6),
    endColor: Cesium.Color.WHITE.withAlpha(0.9),
    updateCallback: (p) => {
      Cesium.Cartesian3.normalize(p.position, down);
      Cesium.Cartesian3.multiplyByScalar(down, -6, p.velocity); // ゆっくり落ちる
      const d = Cesium.Cartesian3.distance(scene.camera.positionWC, p.position);
      p.endColor.alpha = d > SNOW_RADIUS ? 0 : Math.min(1, 1.4 * (1 - d / SNOW_RADIUS));
    },
  }));
}
scene.preUpdate.addEventListener(() => {
  if (snowSystem) Cesium.Matrix4.fromTranslation(scene.camera.positionWC, snowSystem.modelMatrix);
});

// 冬に写真の上へ重ねる、うっすら青白い「雪のベール」
let snowVeil = null;
const VEIL_URL = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 4;
  const g = c.getContext("2d");
  g.fillStyle = "#f2f6fa";
  g.fillRect(0, 0, 4, 4);
  return c.toDataURL();
})();
async function setVeil(on) {
  if (snowVeil) { viewer.imageryLayers.remove(snowVeil); snowVeil = null; }
  if (!on) return;
  const layer = new Cesium.ImageryLayer(await Cesium.SingleTileImageryProvider.fromUrl(VEIL_URL, { tileWidth: 4, tileHeight: 4 }), { alpha: 0.42 });
  if (season !== "winter") return; // 待っている間に夏へ戻された
  if (snowVeil) viewer.imageryLayers.remove(snowVeil);
  snowVeil = layer;
  viewer.imageryLayers.add(snowVeil);
}

function applySeason() {
  const winter = season === "winter";
  document.body.classList.toggle("winter", winter);
  document.body.classList.toggle("summer", !winter);
  tuneLayer(viewer.imageryLayers.get(0));
  setVeil(winter);
  scene.skyAtmosphere.saturationShift = winter ? -0.55 : 0;
  scene.skyAtmosphere.brightnessShift = winter ? 0.15 : 0;
  scene.globe.atmosphereSaturationShift = winter ? -0.5 : 0;
  scene.fog.density = winter ? 6e-4 : 2e-4;
  if (tileset) tileset.customShader = winter ? SNOW_SHADER : undefined;
  if (winter && !snowSystem) snowSystem = makeSnow();
  if (!winter && snowSystem) { scene.primitives.remove(snowSystem); snowSystem = null; }
  const pinColor = winter ? "#3f6f8c" : "#2e5b3c";
  pins.forEach((e, i) => (e.billboard.image = pinImage(SPOTS[i].no, pinColor)));
  }

// 冬は写真を白っぽく・青白く加工して雪景色に見せる
function tuneLayer(layer) {
  const winter = season === "winter";
  layer.brightness = winter ? 1.3 : 1.0;
  layer.contrast = winter ? 0.85 : 1.0;
  layer.saturation = winter ? 0.2 : 1.0;
  layer.gamma = winter ? 1.15 : 1.0;
  layer.hue = 0;
}

document.querySelector(".season").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-season]");
  if (!btn) return;
  document.querySelectorAll(".season button").forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
  season = btn.dataset.season;
  applySeason();
});

document.getElementById("styleMode").addEventListener("change", (e) => {
  styleMode = e.target.value;
  applyStyle();
});

document.getElementById("baseMode").addEventListener("change", (e) => {
  const base = viewer.imageryLayers.get(0);
  const next = new Cesium.ImageryLayer(BASES[e.target.value]());
  viewer.imageryLayers.add(next, 0);
  viewer.imageryLayers.remove(base);
  tuneLayer(next);
});

// ---------------- 建物クリックで属性表示 ----------------
const FIELDS = [
  ["gml:name", "名称"],
  ["bldg:usage", "用途"],
  ["bldg:class", "分類"],
  ["bldg:measuredHeight", "高さ", (v) => `${v} m`],
  ["bldg:storeysAboveGround", "地上階数", (v) => `${v} 階`],
  ["bldg:storeysBelowGround", "地下階数", (v) => `${v} 階`],
  ["bldg:yearOfConstruction", "建築年", (v) => (v > 1 ? `${v} 年` : null)],
  ["uro:BuildingDetailAttribute_uro:buildingStructureType", "構造"],
  ["uro:BuildingDetailAttribute_uro:totalFloorArea", "延床面積", (v) => `${v} ㎡`],
  ["uro:BuildingDetailAttribute_uro:districtsAndZonesType", "用途地域"],
  ["土砂災害リスク_土石流_区域区分", "土石流"],
  ["土砂災害リスク_急傾斜地の崩落_区域区分", "急傾斜地の崩落"],
  ["gml_id", "ID"],
];
const info = document.getElementById("info");
const infoList = document.getElementById("infoList");
let selected = null;

function clearSelection() {
  if (selected) {
    try { selected.feature.color = selected.color; } catch (_) { /* タイルが破棄済み */ }
  }
  selected = null;
  info.hidden = true;
}

viewer.screenSpaceEventHandler.setInputAction((click) => {
  clearSelection();
  const f = scene.pick(click.position);
    if (!(f instanceof Cesium.Cesium3DTileFeature)) return;
  selected = { feature: f, color: Cesium.Color.clone(f.color) };
  f.color = Cesium.Color.fromCssColorString("#ffd400");
  const rows = [];
  for (const [key, label, fmt] of FIELDS) {
    const v = f.getProperty(key);
    if (v === undefined || v === null || v === "") continue;
    const text = fmt ? fmt(v) : v;
    if (text !== null) rows.push(`<dt>${label}</dt><dd>${escapeHtml(String(text))}</dd>`);
  }
  infoList.innerHTML = rows.join("") || "<dt>—</dt><dd>属性なし</dd>";
  info.hidden = false;
  if (isMobile()) setCollapsed(false);
  info.scrollIntoView({ block: "nearest", behavior: "smooth" });
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ---------------- スマホではパネルを畳んだ状態で始める ----------------
const toggleBtn = document.getElementById("togglePanel");
function setCollapsed(v) {
  panel.classList.toggle("collapsed", v);
  toggleBtn.setAttribute("aria-expanded", String(!v));
}
if (isMobile()) setCollapsed(true);
toggleBtn.addEventListener("click", () => setCollapsed(!panel.classList.contains("collapsed")));

// ---------------- 初回の地形の読み込みが終わったら（遅くとも15秒で）「読み込み中」を消す ----------------
const loading = document.getElementById("loading");
const hideLoading = () => {
  loading.classList.add("done");
  removeProgress();
};
// 地形タイルの読み込み待ち数が 0 になったら完了
const removeProgress = scene.globe.tileLoadProgressEvent.addEventListener((queued) => {
  if (queued === 0 && performance.now() > 1500) hideLoading();
});
setTimeout(hideLoading, 15000);
