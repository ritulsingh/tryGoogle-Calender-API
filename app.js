const {google} = require('googleapis');
require('dotenv').config()
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

oAuth2Client.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN
});

const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

const event = {
    summary: 'Test Event',
    location: 'Test Location',
    start: {
        dateTime: '2022-02-01T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
    },
    end: {
        dateTime: '2022-02-01T17:00:00-07:00',
        timeZone: 'America/Los_Angeles',
    },
};

calendar.events.insert({
    calendarId: 'primary',
    resource: event,
}, (err, event) => {
    if (err) return console.log(`There was an error: ${err}`);
    console.log(`Event created: ${event.data.htmlLink}`);
});

