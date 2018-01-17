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
  connectData: null,
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
  appData.connectData = connectData;
});
// The client will emit an RTM.RTM_CONNECTION_OPENED the connection is ready for
// sending and recieving messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  appData.timecard.getMemberList((members) => {
    rtm.subscribePresence(members);
    console.log(`Ready`);
  });
});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // For structure of `message`, see https://api.slack.com/events/message

  // Log the message
  // console.log('New message: ', message);

  // handle it
  appData.handler.handle(rtm, message);
});
rtm.on(RTM_EVENTS.MANUAL_PRESENCE_CHANGE, (data) => {
  if (!data["user"]) {
    data["user"] = appData.connectData.self.id;
  }
  console.log('MANUAL_PRESENCE_CHANGE: ', JSON.stringify(data));
  appData.timecard.punch(data);
});
rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (data) => {
  if (!data["user"]) {
    data["user"] = appData.connectData.self.id;
  }
  console.log('PRESENCE_CHANGE: ', JSON.stringify(data));
  appData.timecard.punch(data);
});

// Start the connecting process
rtm.start();

