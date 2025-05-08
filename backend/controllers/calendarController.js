const { google } = require('googleapis');
const supabase = require('../supabase/supabaseClient');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Add this new function to your existing controller
exports.removeFromCalendar = async (req, res) => {
  try {
    const { contestId, googleEventId } = req.body;
    const userId = req.user.id;

    // First delete from Google Calendar
    if (googleEventId) {
      const { tokens } = await supabase
        .from('google_calendar')
        .select('google_tokens')
        .eq('user_id', userId)
        .single();

      if (tokens) {
        oauth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        try {
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: googleEventId
          });
        } catch (googleError) {
          console.error('Google Calendar deletion error:', googleError);
          // Continue with DB deletion even if Google deletion fails
        }
      }
    }

    // Then delete from our database
    const { error } = await supabase
      .from('google_calendar')
      .delete()
      .eq('user_id', userId)
      .eq('contest_id', contestId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from calendar:', error);
    res.status(500).json({ error: 'Failed to remove from calendar' });
  }
};

exports.checkContestAdded = async (req, res) => {
  try {
    const { contestId } = req.query;
    const userId = req.user.id;

    if (!contestId) {
      return res.status(400).json({ error: 'contestId is required' });
    }

    const { data, error } = await supabase
      .from('google_calendar')
      .select('id, google_event_id')
      .eq('user_id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ 
      isAdded: data !== null,
      googleEventId: data?.google_event_id || null
    });
  } catch (error) {
    console.error('Error checking contest:', error);
    res.status(500).json({ error: 'Failed to check contest status' });
  }
};

exports.addToCalendar = async (req, res) => {
  try {
    const { contest } = req.body;
    const userId = req.user.id;

    // First verify the contest doesn't already exist
    const { data: existing, error: checkError } = await supabase
      .from('google_calendar')
      .select('id, google_event_id')
      .eq('user_id', userId)
      .eq('contest_id', contest.contestId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return res.json({ 
        success: true, 
        alreadyAdded: true,
        googleEventId: existing.google_event_id
      });
    }

    // Generate auth URL for new additions
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
      state: JSON.stringify({
        ...contest,
        userId
      }),
      prompt: 'consent'
    });

    res.json({ authUrl });
  } catch (error) {
    console.error('Error adding to calendar:', error);
    res.status(500).json({ error: 'Failed to initiate calendar add' });
  }
};

exports.initiateGoogleAuth = (req, res) => {
  try {
    const contestData = req.query.contest;
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
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
    const contest = JSON.parse(state);
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: contest.title,
        description: `Platform: ${contest.platform}\nDuration: ${contest.duration} minutes\nURL: ${contest.url}`,
        start: { 
          dateTime: contest.startTime,
          timeZone: 'UTC' 
        },
        end: { 
          dateTime: contest.endTime,
          timeZone: 'UTC' 
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'email', minutes: 30 }]
        }
      }
    });

    // Store the event in Supabase
    const { error } = await supabase
      .from('google_calendar')
      .insert({
        user_id: contest.userId,
        contest_id: contest.contestId,
        google_event_id: event.data.id,
        contest_title: contest.title,
        contest_start_time: contest.startTime,
        contest_end_time: contest.endTime,
        contest_platform: contest.platform,
        contest_url: contest.url
      });

    if (error) throw error;

    res.send(`
      <script>
        window.opener.postMessage({ 
          type: 'CALENDAR_SUCCESS',
          contestId: '${contest.contestId}'
        }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.send(`
      <script>
        window.opener.postMessage({
          type: 'CALENDAR_ERROR',
          contestId: '${contest?.contestId}',
          error: ${JSON.stringify(error.message)}
        }, '*');
        window.close();
      </script>
    `);
  }
};