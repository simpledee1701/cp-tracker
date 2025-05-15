# CPier - Unified Coding Profile Dashboard 🚀


CPier is your one-stop dashboard that aggregates competitive programming profiles from LeetCode, CodeChef, and CodeForces. Get a 360° view of your coding journey with unified statistics, combined heatmaps, and integrated contest calendars.

## ✨ Features

### 📊 Unified Analytics
- Single-view dashboard for all platforms
- Combined problem-solving statistics
- Performance comparison across platforms
- Rating progress visualization

### 🔥 Activity Heatmap
- Unified coding activity visualization
- Platform-specific activity breakdown
- Custom date range selection

### 🗓 Contest Management
- Aggregated contest calendar
- Google Calendar integration
- Contest reminders and notifications
- Platform filter options

### ⚙️ User Experience
- Customizable dashboard
- Responsive design
- Exportable statistics

## 📸 Screenshots

![start](https://github.com/user-attachments/assets/9070e0e3-4ee6-46a1-ac84-4d8cdd10bfca)
![dashboard](https://github.com/user-attachments/assets/61b5b851-64ed-477a-895e-432c1deb4a87)
![codechef](https://github.com/user-attachments/assets/f3161a2f-dcdd-4493-9446-5bf1cec801ac)
![codeforce](https://github.com/user-attachments/assets/6b2c9843-5f25-4c1e-b07a-b7bb4aa591bf)
![contest](https://github.com/user-attachments/assets/3db50c95-df31-4031-9d12-93ea7c1c2abe)

## 🛠 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- Cheerio (Web scraping)

**Database:**
- Supabase (PostgreSQL)

## � Quick Start

### Prerequisites
- Node.js
- npm
- Supabase account

### Supabase Database Setup

### 📊 Table Creation (SQL for Supabase Editor)

```sql
-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    name TEXT,
    codeforces_username TEXT,
    codechef_username TEXT,
    leetcode_username TEXT,
    updated_at TIMESTAMPTZ,
    gender TEXT,
    location TEXT,
    education TEXT,
    github TEXT,
    linkedin TEXT
);

-- Total questions solved
CREATE TABLE total_questions (
    id UUID PRIMARY KEY REFERENCES profiles(id),
    leetcode_easy INT,
    leetcode_medium INT,
    leetcode_hard INT,
    leetcode_total INT,
    codechef_total INT,
    codeforces_total INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contest ranking information
CREATE TABLE contest_ranking_info (
    id UUID PRIMARY KEY REFERENCES profiles(id),
    leetcode_recent_contest_rating NUMERIC,
    leetcode_max_contest_rating NUMERIC,
    codechef_stars NUMERIC,
    codechef_recent_contest_rating NUMERIC,
    codechef_max_contest_rating NUMERIC,
    codeforces_recent_contest_rating NUMERIC,
    codeforces_max_contest_rating NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE total_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_ranking_info ENABLE ROW LEVEL SECURITY;
```

### 🔐 Google Auth Setup for Supabase

### ☁️ Step 1: Configure Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com).
2. Select or create a project.
3. Navigate to:
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**.
5. Configure the consent screen:
    - **User Type**: External
    - Fill in necessary information (App name, support email, etc.)
    - Add your domain (if any) and developer contact info
6. Under **Authorized redirect URIs**, add :
      ```bash
          [https://<your-supabase-project-id>/auth/v1/callback.]
      ```
8. Replace `<your-supabase-project-id>` with your actual Supabase project ref.
9. Click **Create**, then copy:
    - **Client ID**
    - **Client Secret**

### 🔧 Step 2: Enable Google Auth in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/).
2. Select your project.
3. Navigate to:
4. Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
5. Toggle Google to **Enable**.
6. Click **Save**.

### 📌 Sample Redirect URI
https://abcd1234.supabase.co/auth/v1/callback


## Installation
```bash
# Clone repository
git clone https://github.com/suveerprasad/cp-tracker.git
cd cp-tracker

# Install dependencies
cd frontend
npm install
cd backend
npm install

#Run the Project
cd frontend
npm run dev
cd backend
npm run dev
```

## 🌐 Live Demo
Experience CPier at [https://cp-tracker-mauve.vercel.app/](https://cp-tracker-mauve.vercel.app/)

## 👥 Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/simpledee1701">
        <img src="https://avatars.githubusercontent.com/u/174812664?v=4" width="100px;" alt="John Doe" style="border-radius:50%;"/><br />
        <sub><b>Deepak V</b></sub>
      </a><br />
      <a href="https://www.linkedin.com/in/deepak-v-4254301b2/" title="LinkedIn">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" />
      </a>
      <br />
      <sub></sub>
    </td>
    <td align="center">
      <a href="https://github.com/suveerprasad">
        <img src="https://avatars.githubusercontent.com/u/150579516?v=4" width="100px;" alt="Sarah Williams" style="border-radius:50%;"/><br />
        <sub><b>Sai Suveer</b></sub>
      </a><br />
      <a href="https://www.linkedin.com/in/sai-suveer-96a65a1b8/" title="LinkedIn">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" />
      </a>
      <br />
      <sub></sub>
    </td>
  </tr>
</table>

