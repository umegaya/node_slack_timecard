## node_slack_timecard
- 日本語のREADMEは[こちら](https://github.com/umegaya/node_slack_timecard#%E6%A9%9F%E8%83%BD)
- measure team member's online time on slack. useful for calculating salary for part-time contract member

## feature
- measure team member's online time by capturing their presence_change events on slack.
- can show online time on slack as chat bot. keyword is `workaholic ranking` or `社畜ランキング`
  ![bot](https://user-images.githubusercontent.com/39032/35023680-122fadac-fb7f-11e7-9beb-944b9d20a972.png)]
- aim high, go forward to the company #1 workaholic!!!

## setup
#### prerecuisites
- node v9.4.0+ 
- yarn v1.3.2+
- supervisord or something similar system for restarting. we include supervisord config example (tools/supervisord)
- mysql database instance

#### steps
1. clone this repository
2. ```yarn install```
3. cp sample_run.sh to run.sh and edit environment variables
4. run from console like ```bash run.sh``` and wait until 'Ready' is logged to console
  - then your target database has table timecard and names
5. insert members record who need to be tracked to online time, into names table, as following
  ```
  insert into names values('U0123ABCD', 'member1'),('U0456EFGH', 'member2');
  ```
6. restart run.sh with restarting system.
7. then timecard table should store tracking member's online time slice. record format is like following: 
  ```
  user_id CHAR(32) not null => slack user_id like 'U0123ABCD'
  date CHAR(10) not null => recorded date string 'YYYY-MM-DD', useful to aggregate slices with month or day.
  start DATETIME not null => online start time
  end DATETIME not null => online end time
  ```


## 機能
- チームメンバーがslackでオンラインだった時間（秒単位）をメンバーのオンライン、オフラインの状態変化のイベントを使って計測します
- チャットボットとして、メンバーのオンライン時間をslack上に表示します。キーワードは`workaholic ranking` もしくは `社畜ランキング` です。
  ![bot](https://user-images.githubusercontent.com/39032/35023680-122fadac-fb7f-11e7-9beb-944b9d20a972.png)
- 意識を高く持って、会社でいちばんの社畜を目指そう！！！

## 設定
#### 前提
- node v9.4.0+ 
- yarn v1.3.2+
- supervisordみたいな再起動のためのシステム。このレポジトリにはsupervisordの設定の例が含まれています(tools/supervisord)
- mysqlのデータベースサーバー

#### 手順
1. このレポジトリをクローンします
2. ```yarn install```
3. cp sample_run.sh to run.sh として、DBADDRやSLACK_RTM_TOKENを編集します
4. ```bash run.sh```のようにしてコンソールから動かし、'Ready'というログが出るまで待ちます
  - そうすると、timecardとnamesというテーブルがデータベースにできているはずです
5. オンライン時間を追跡する必要があるメンバーのレコードを以下のようにしてnamesデータベースに登録します
  ```
  insert into names values('U0123ABCD', 'member1'),('U0456EFGH', 'member2');
  ```
6. run.shを再起動のためのシステムを使って実行します。
7. timecardテーブルにオンライン時間を追跡されているユーザーのオンラインだった時間が記録されるはずです。データの構造は以下の通りです。
  ```
  user_id CHAR(32) not null => 'U0123ABCD'のようなスラックのユーザーID
  date CHAR(10) not null => このレコードが記録された日付。'YYYY-MM-DD'というフォーマット。月や日で時間を集計する際に役に立つかも
  start DATETIME not null => オンラインになった時間
  end DATETIME not null => オンラインが終わった時間
  ```
