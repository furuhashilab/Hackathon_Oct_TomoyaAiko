# 北海道神宮 3D探訪 — Hackathon_Oct_TomoyaAiko

FuruhashiLab の10月ハッカソン（[FOSS4G Hiroshima / SotM Asia OSAKA 振り返りハッカソン](https://github.com/furuhashilab/README/issues/42#issuecomment-6008763721)）の作品です。

**デモ:** https://furuhashilab.github.io/Hackathon_Oct_TomoyaAiko/

地元である札幌市中央区の北海道神宮・円山周辺を、**CesiumJS** と **PLATEAU の 3D Tiles** を使って3Dで見て回れる Web ページです。

## 選んだ技術：CesiumJS + 3D Tiles

FOSS4G 2026 Hiroshima の「3D Tiles 2.0 and Cesium」や「Geological Borehole Viewer with CesiumJS」などの発表で紹介されていた、3D地球儀ライブラリ CesiumJS と、大規模3Dデータを配信するための形式 3D Tiles を初めて使いました。

## できること

- 「神宮と円山」「都心の名所」「街をながめる」の3グループ、19か所のスポットへ移動する
- スポット（リストまたは地図上のピン）を選ぶと、Wikipedia の写真と解説、公式サイトへのリンクをカードで表示する
- **夏／冬**を切り替える。冬は、写真を白く加工し、建物の屋根に雪を積もらせ（CustomShader）、雪を降らせて（ParticleSystem）雪の札幌を表現する
- PLATEAU の LOD2 建物を、**高さ**・**建築年**（1981年の新耐震基準で区切る）で色分けする
- 建物をクリックして、用途・高さ・階数・建築年・構造・土砂災害リスクなどの属性を見る
- 背景を航空写真と淡色地図で切り替える

## 工夫した点

- **Cesium ion のトークンなしで動かした。** CesiumJS は地形の表示に通常 Cesium ion（要アカウント）を使います。今回は `CustomHeightmapTerrainProvider` に**地理院の標高タイル（PNG）**をブラウザ側でデコードして渡し、地形をオープンなデータだけで作りました（5mメッシュが無い場所では10mメッシュを使用）。
- **高さの基準をそろえた。** PLATEAU 3D Tiles の高さは楕円体高、地理院の標高はジオイドを基準にした標高です。そのままだと建物が約32m宙に浮いてしまうため、北海道神宮付近のジオイド高（32.49m、国土地理院ジオイド計算サービスで算出）を標高に足しています。
- **冬の景色は演出です。** 地理院タイルには札幌の積雪期のオルソ写真がないため、夏の写真を加工して雪景色に見せています。屋根の雪は、面の向き（法線）が上を向いているところだけを白くするシェーダで描いています。
- **読み込みを軽くする工夫。** 最初に映す場所の標高タイルを先読みし、建物の詳細度（maximumScreenSpaceError）と描画のフレームレートを抑えています。
- ビルドツールを使わない静的な HTML・JS だけで構成しているので、GitHub Pages にそのまま置けます。

## ファイル構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | ページ本体 |
| `main.js` | Cesium の初期化、地形プロバイダ、建物スタイル、クリック処理 |
| `style.css` | パネルの見た目（スマホ対応） |

ローカルで確認するとき：

```bash
python3 -m http.server 8000
```

## 使用データ・出典

- 3D都市モデル（Project PLATEAU）札幌市（2020年度）建築物モデル 中央区 LOD2（国土交通省）— [G空間情報センター](https://www.geospatial.jp/ckan/dataset/plateau-01100-sapporo-shi-2020)
- 地理院タイル（全国最新写真・淡色地図・標高タイル dem5a / dem）— 国土地理院
- [CesiumJS](https://cesium.com/platform/cesiumjs/) 1.146（Apache License 2.0）
- スポットの写真・解説：Wikipedia 日本語版（CC BY-SA 4.0）／Wikimedia Commons（写真ごとの作者・ライセンスはカード内のリンク先を参照）。表示時に Wikipedia REST API から取得しています。公式サイトの URL は Wikidata の「公式ウェブサイト」を参照し、リンクが生きていることを確認したもの。

スポットの座標は OpenStreetMap（© OpenStreetMap contributors）を参照し、カメラ位置は手作業で調整しました。

## ライセンス

このリポジトリのコードとコンテンツは [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja) で公開します（[LICENSE](LICENSE)）。
外部のデータとライブラリには、それぞれの提供元の利用条件が適用されます。

© 2026 Tomoya Aiko / FuruhashiLab
