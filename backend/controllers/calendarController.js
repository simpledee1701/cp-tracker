const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.initiateGoogleAuth = (req, res) => {
  try {
    const contestData = req.query.contest;
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      state: contestData,
      prompt: 'consent'
    });
    res.redirect(authUrl);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
};

exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const contest = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: contest.title,
        description: `Platform: ${contest.platform}\nDuration: ${contest.duration} minutes\nURL: ${contest.url}`,
        start: { dateTime: contest.start, timeZone: 'UTC' },
        end: { dateTime: contest.end, timeZone: 'UTC' },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'email', minutes: 30 }]
        }
      }
    });

    res.send(`
      <script>
        window.opener.postMessage({ type: 'CALENDAR_SUCCESS' }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    res.send(`
      <script>
        window.opener.postMessage({
          type: 'CALENDAR_ERROR',
          error: 'Failed to create calendar event'
        }, '*');
        window.close();
      </script>
    `);
  }
};