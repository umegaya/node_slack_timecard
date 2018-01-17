### node_slack_timecard
- 日本語のREADMEは[こちら](link)
- measure team member's online time on slack. useful for calculating salary for part-time contract member

### feature
- measure team member's online time by capturing their presence_change events on slack.
- can show online time on slack as chat bot. keyword is `workaholic ranking` or `社畜ランキング`
  - [img]
- aim high, go forward to the company #1 workaholic!!!

### setup
#### prerecuisites
- node v9.4.0+ 
- yarn v1.3.2+
- supervisord or something similar system for restarting (we provide supervisord config example)
- mysql database instance

#### steps
1. clone this repository
2. ```yarn install```
3. cp sample_run.sh to run.sh and edit 
4. run from console like ```bash run.sh``` and wait until 'Ready' is logged to console
  - then your target database has table timecard and names
5. insert members record who need to be tracked to online time, into names table, as following
  ```
  insert into names values('U0123ABCD', 'member1'),('U0456EFGH', 'member2');
  ```
6. restart run.sh with restarting system. I put example with supervisord on tools/supervisord. (assume put them under /etc)
7. then timecard table should store tracking member's online time slice. record format is like following: 
  ```
  user_id CHAR(32) not null => slack user_id like 'U0123ABCD'
  date CHAR(10) not null => recorded date string 'YYYY-MM-DD', useful to aggregate slices with month or day.
  start DATETIME not null => online start time
  end DATETIME not null => online end time, so add up (start - end) with each user_id should be total online time of the member.
  INDEX(user_id, start) 
  ```