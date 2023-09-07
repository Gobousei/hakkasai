#白華祭自動応答システム
##目的
・白華祭の模擬店で、画期的なシステムを。

##機能
システムの持つ機能です。
・QRコードの読み取り/コードチェック
・事前注文（当日は不使用）
・有人受付
・注文数表示
・集計

##実際のページ
[ページ](https://gobousei.github.io/hakkasai)
パスワード入力を求められます。パスワードは、*「risuka」*です。

##使用したサードパーティ製品
このシステムの作成に際して、[Firebase Realtime Database](https://firebase.google.com/?hl=ja)、[Github (Github pages)](https://github.com)を使用しました。

###Firebase Realtime Database
Firebase Realtime Database は、Googleが提供するNoSQLデータベースで、JSON形式でデータを保存でき、使用が簡単であること、データ変更時に端末側の任意のプログラムを実行させることができることから、使用しました。

###Github (Github pages)
Githubは、Microsoftが提供するオープンソース開発プラットフォームで、コードを保存できる他、Github pagesという機能で、静的ページを公開することができることから、使用しました。
Github pages では、静的ページしか公開できないことから、このシステムで使用したプログラミング言語はJavaScriptのみです。

##工夫点
・Firebase Realtime Database のデータ変更時にプログラムを実行できることから、これをトリガーとしてJavaScriptの関数を実行させ、サーバーレスでの開発を行った。
