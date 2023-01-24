const {google} = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    883440079960-c9624aksv1kluqotgf0ubbghrhav2nnn.apps.googleusercontent.com,
    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,
    'http://localhost:8000/callback'
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

