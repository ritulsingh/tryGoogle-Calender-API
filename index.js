const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const dayjs = require('dayjs')
const fs = require('fs');
const { v4: uuid } = require('uuid');

const app = express();
require('dotenv').config()

// const TOKEN_PATH = path.join(process.cwd(), 'token.json');

const PORT = process.env.PORT || 8000;

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const calendar = google.calendar({
  version: 'v3',
  auth: process.env.API_KEY
});

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

app.get('/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  })
  res.redirect(url);
})

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(code);
  const token  = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials({
    access_token: token.tokens.access_token,
    refresh_token: token.tokens.refresh_token
  });
  res.send({
    msg: "You have successfully logged in!"
  });
});

// Adding Event in Google Calendar
app.get('/schedule_event', async (req, res) => {
  await calendar.events.insert({
    calendarId: 'primary',
    auth: oAuth2Client,
    requestBody: {
      summary: "This is Test event",
      description: "Description of the event",
      start: {
        dateTime: dayjs(new Date()).add(1, 'day'),
        timezone: 'Asia/Kolkata',
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'day').add(1, 'day'),
        timezone: 'Asia/Kolkata',
      }
    }
  });
  res.send({
    msg: "Done"
  });
});

// Adding Google Meet Event in Google Calendar
app.get('/meet_event', async (req, res) => {
  await calendar.events.insert({
    calendarId: 'primary',
    auth: oAuth2Client,
    conferenceDataVersion: 1,
    requestBody: {
      summary: "This is a Google meet for Something",
      description: "Description of the Google meet",
      start: {
        dateTime: dayjs(new Date()).add(1, 'day'),
        timezone: 'Asia/Kolkata',
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'day').add(1, 'day'),
        timezone: 'Asia/Kolkata',
      },
      conferenceData:{
        createRequest:{
          requestId: uuid(),
        }
      },
      attendees: [{
        email: 'ritul.mtalkz@gmail.com'
      }]
    }
  });
  res.send({
    msg: "Done"
  });
});

app.get('/get_events', async (req, res) => {
  const result = await calendar.events.list({
    calendarId: 'primary',
    auth: oAuth2Client,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = result.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  res.send({msg:events});
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
})

app.listen(PORT, () => {
  console.log('listening on port ', PORT);
})
