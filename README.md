# 白華祭自動応答システム
## 目的
・白華祭の模擬店で、画期的なシステムを。


## 機能
システムの持つ機能です。

・QRコードの読み取り/コードチェック

・事前注文（当日は不使用）

・有人受付

・注文数表示

・集計

## 実際のページ
[ページ](https://gobousei.github.io/hakkasai)

パスワード入力を求められます。パスワードは、 *「risuka」* 。

[QRコード](https://docs.google.com/spreadsheets/d/1OjZY7_m_vCvVcmYsZZW48bt87MewUzx_GRSmZX0bk8s/edit?usp=drivesdk)

## 使い方
この[フォルダ](https://github.com/Gobousei/hakkasai/tree/main/how-to-use)にまとめてある。

## ディレクトリ構成

このシステムのディレクトリ構成を抜粋して説明する。カメラを常時起動しておくと、読み取りミスが多発するため、当日はカメラ起動ボタンを設置したものを使用した。
実際に表示したファイルは各フォルダのindex.htmlで、test.htmlは試作としてアップロードしたもの。

.

├── img            ・・・indexページの画像

├── master         ・・・手動受付（カメラ常時起動）

├── order          ・・・注文数表示

├── receptor       ・・・自動注文機（カメラ常時起動）

├── register       ・・・有人受付（カメラ常時起動）＊子フォルダ省略

├── result         ・・・売上表示

├── sale           ・・・券売

├── test

│　 　├── receptor   ・・・事前注文機（カメラ起動ボタンあり）

│　 　└── register   ・・・有人受付（カメラ起動ボタンあり）

│　　　　 　├── host   ・・・有人受付（店員側）

│　　　　 　└── client ・・・有人受付（お客さん側） 

├── tester         ・・・QRコードのテスト

├── index.html     ・・・インデックスページ

└── login.html     ・・・ログインページ


## 使用したサードパーティ製品
このシステムの作成に際して、[Firebase Realtime Database](https://firebase.google.com/?hl=ja)、[Github (Github pages)](https://github.com)、[JSQR](https://github.com/cozmo/jsQR)を使用した。

### Firebase Realtime Database
Firebase Realtime Database は、Googleが提供するNoSQLデータベースで、JSON形式でデータを保存でき、使用が簡単であること、データ変更時に端末側の任意のプログラムを実行させることができることから使用した。

### Github (Github pages)
Githubは、Microsoftが提供するオープンソース開発プラットフォームで、コードを保存できる他、Github pagesという機能で静的ページを公開することができることから使用した。
Github pages では静的ページしか公開できないことから、このシステムで使用したプログラミング言語はJavaScriptのみ。

### JSQR
JSQRは、JavaScriptで2次元コードを読み込むためのライブラリ。

## QRコードの作成
QRコードの作成には、Google Spreadsheets、[Google Chart API](https://developers.google.com/chart?hl=ja)を用いた。スプレッドシートで一斉に暗号コードを作成し、またAPIを使ってQRコードを画像出力させた。

# 工夫点
## Firebase Realtime Databaseの使用
Firebase Realtime Database　はデータ変更時にプログラムを実行できることから、これをトリガーとしてJavaScriptの関数を実行させ、サーバーレスでの開発を行った。

## コードの暗号化
QRコードに直接番号を記載すると、偽造が容易になる他、コードの信頼性が低下するため、QRコードには暗号化を施した。販売は終了したので、暗号ルールを公開する。

例： *2905SHEMD2* ▶番号：2
#### 上二桁
上二桁には、五桁目以降の記載された基数ランダムに決め、二桁、10進数で記載する。（10~32進数。11進数からにしたほうが良かった気もする。）

上の例だと、29となっているので、SHEMD2は29進数で記載されている。

#### 三、四桁目
次の二桁には、勘合となるコードの桁数を10進数で二桁を使って記載されている。

上の例だと、05となっているので、勘合となるコードはSHEMDとなる。

#### 勘合コード
一、二桁目で記載された基数、三、四桁目で示された桁数で記載されており、これを10進数に直すと、20230906（白華祭前日の日付）となる。前日になったのは、ただの勘違い。

上の例だと、SHEMDを29進数から10進数に直すと、20230906となる。

#### 通し番号
勘合コードより下の桁には、一、二桁目で記載された基数で通し番号が記載されている。この番号を、Realtime Databaseの受渡しリストと照合し、重複の無いことを確認する。

上の例だと、2。

## エラーレポート
当日報告されたエラーは2件で、機能停止に陥る可能性のある重大な事案が1件、軽微な事案が1件発生していた。

### エラーⅠ（重大）
#### 概要
注文数に-1と表示された

#### 原因
新しい注文を取るプログラムにて、updateと表記するところをsetと誤表記していたことにより、注文数の誤表示が生じた。

#### 対応
注文数表示機の使用を中止した。

### エラーⅡ（軽微）
#### 概要
お客さん側には注文済み、店員側には未注文と表示された状態で膠着した。

#### 原因（推測）
瞬間的にインターネット接続が切断され、その瞬間に注文操作を行ったため。

#### 対応
データベース上の一時記録を削除し、端末側の情報をリセットした。

## 改善点
### 注文数表示
注文数を表示する際、データベースにそれぞれの個数を記載していたが、注文リストを数えたほうがエラーはなかった。

### QRコードの誤り訂正レベル
QRコードには誤りを自動で認識し訂正する機能があり、今回は15%汚れていても正常に読み取ることができるレベルMで印刷したが、30%隠れても読み取れるレベルHにするべきだったかもしれない。

### JavaScript難読化
今回、改修の容易さからJavaScriptに対して難読化を行わなかったが、QRコードの暗号チェックのみでも難読化を施すべきだった。
