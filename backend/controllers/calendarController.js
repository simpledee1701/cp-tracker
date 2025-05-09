const { google } = require('googleapis');
const supabase = require('../supabase/supabaseClient');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Helper function to get user tokens
const getUserTokens = async (userId) => {
  const { data, error } = await supabase
    .from('google_calendar')
    .select('google_tokens')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.google_tokens;
};

// Add to calendar - initial step
exports.addToCalendar = async (req, res) => {
  try {
    const { contest } = req.body;
    const userId = req.user.id;

    // Check if contest already exists
    const { data: existing, error: checkError } = await supabase
      .from('google_calendar')
      .select('id, google_event_id, google_tokens')
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

    // Check if user has existing tokens
    const tokens = await getUserTokens(userId);

    if (tokens) {
      // User has tokens, try to add directly
      try {
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

        // Store in database
        const { error } = await supabase
          .from('google_calendar')
          .insert({
            user_id: userId,
            contest_id: contest.contestId,
            google_event_id: event.data.id,
            contest_title: contest.title,
            contest_start_time: contest.startTime,
            contest_end_time: contest.endTime,
            contest_platform: contest.platform,
            contest_url: contest.url,
            google_tokens: tokens
          });

        if (error) throw error;

        return res.json({ 
          success: true, 
          eventId: event.data.id 
        });
      } catch (googleError) {
        console.log('Google API error, will re-authenticate:', googleError.message);
        // Continue to generate auth URL if token is expired
      }
    }

    // Generate auth URL for new additions or re-authentication
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

// Handle Google OAuth callback
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const contest = JSON.parse(state);
    const userId = contest.userId;
    
    // Get tokens from Google
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Create calendar event
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

    // Check if entry exists (upsert)
    const { data: existing, error: checkError } = await supabase
      .from('google_calendar')
      .select('id')
      .eq('user_id', userId)
      .eq('contest_id', contest.contestId)
      .maybeSingle();

    if (checkError) throw checkError;

    const dbData = {
      user_id: userId,
      contest_id: contest.contestId,
      google_event_id: event.data.id,
      contest_title: contest.title,
      contest_start_time: contest.startTime,
      contest_end_time: contest.endTime,
      contest_platform: contest.platform,
      contest_url: contest.url,
      google_tokens: tokens
    };

    let dbError;
    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('google_calendar')
        .update(dbData)
        .eq('id', existing.id);
      dbError = error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('google_calendar')
        .insert(dbData);
      dbError = error;
    }

    if (dbError) throw dbError;

    res.send(`
      <script>
        window.opener.postMessage({ 
          type: 'CALENDAR_SUCCESS',
          contestId: '${contest.contestId}',
          googleEventId: '${event.data.id}'
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

// Remove from calendar
exports.removeFromCalendar = async (req, res) => {
  try {
    const { contestId, googleEventId } = req.body;
    const userId = req.user.id;

    if (!contestId) {
      return res.status(400).json({ error: 'contestId is required' });
    }

    // First delete from Google Calendar if we have an event ID
    if (googleEventId) {
      try {
        const tokens = await getUserTokens(userId);
        
        if (tokens) {
          oauth2Client.setCredentials(tokens);
          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
          
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: googleEventId
          });
        }
      } catch (googleError) {
        console.error('Google Calendar deletion error:', googleError);
        // Continue with DB deletion even if Google deletion fails
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

// Check if contest is added
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

// Cleanup past contests (to be run periodically)
exports.cleanupPastContests = async () => {
  try {
    const now = new Date().toISOString();
    
    // Find all past contests
    const { data: pastContests, error: findError } = await supabase
      .from('google_calendar')
      .select('id, user_id, google_event_id, contest_end_time')
      .lt('contest_end_time', now);

    if (findError) throw findError;

    if (!pastContests || pastContests.length === 0) {
      console.log('No past contests to clean up');
      return { success: true, deletedCount: 0 };
    }

    let deletedCount = 0;
    const errors = [];

    // Process each past contest
    for (const contest of pastContests) {
      try {
        // Try to delete from Google Calendar if we have the event ID
        if (contest.google_event_id) {
          const tokens = await getUserTokens(contest.user_id);
          
          if (tokens) {
            oauth2Client.setCredentials(tokens);
            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
            
            await calendar.events.delete({
              calendarId: 'primary',
              eventId: contest.google_event_id
            });
          }
        }

        // Delete from our database
        const { error: deleteError } = await supabase
          .from('google_calendar')
          .delete()
          .eq('id', contest.id);

        if (!deleteError) {
          deletedCount++;
        }
      } catch (error) {
        errors.push({
          contestId: contest.id,
          error: error.message
        });
        console.error(`Error cleaning up contest ${contest.id}:`, error);
      }
    }

    console.log(`Successfully cleaned up ${deletedCount} past contests`);
    if (errors.length > 0) {
      console.log(`Errors occurred with ${errors.length} contests`);
    }

    return { 
      success: true, 
      deletedCount,
      errorCount: errors.length,
      errors
    };
  } catch (error) {
    console.error('Error in cleanupPastContests:', error);
    return { success: false, error: error.message };
  }
};

// Refresh Google tokens if needed
exports.refreshTokens = async (userId) => {
  try {
    const tokens = await getUserTokens(userId);
    if (!tokens) return null;

    oauth2Client.setCredentials(tokens);
    const newTokens = await oauth2Client.refreshToken(tokens.refresh_token);
    
    if (newTokens.tokens) {
      // Update tokens in database
      const { error } = await supabase
        .from('google_calendar')
        .update({ google_tokens: newTokens.tokens })
        .eq('user_id', userId);

      if (error) throw error;
      
      return newTokens.tokens;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return null;
  }
};