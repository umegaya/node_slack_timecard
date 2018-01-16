// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_RTM_TOKEN;

// modules
const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
const { Main } = require('./src/handler/main');
const { Timecard } = require('./src/db/timecard');

// data
const appData = {
	timecard: new Timecard(),
	handler: new Main([
	  require('./src/handler/syatiku')
	]),
};

// restore timecard state
appData.timecard.restore();

// Initialize the RTM client with the recommended settings. Using the defaults for these
// settings is deprecated.
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true,
});

// The client will emit an RTM.AUTHENTICATED event on when the connection data is avaiable
// (before the connection is open)
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
  // Cache the data necessary for this app in memory
  console.log(`Logged in as ${connectData.self.id} of team ${connectData.team.id}`);
});
// The client will emit an RTM.RTM_CONNECTION_OPENED the connection is ready for
// sending and recieving messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  rtm.subscribePresence(['U02B9JHTM', 'U02H3F9QQ']);
  console.log(`Ready`);
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // For structure of `message`, see https://api.slack.com/events/message

  // Log the message
  // console.log('New message: ', message);

  // handle it
  appData.handler.handle(rtm, message);
});
rtm.on(RTM_EVENTS.MANUAL_PRESENCE_CHANGE, (data) => {
  console.log('MANUAL_PRESENCE_CHANGE: ', JSON.stringify(data));
  appData.timecard.punch(data);
});
rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (data) => {
  console.log('PRESENCE_CHANGE: ', JSON.stringify(data));
  appData.timecard.punch(data);
});

// Start the connecting process
rtm.start();

