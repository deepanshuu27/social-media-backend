#  Social Media Backend

A Node.js backend API for a social media platform with user authentication, content creation, scheduled posts, and social features like likes, comments, and follow/unfollow.

---

##  Setup Instructions

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Create a `.env` file** in the root directory:

    ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=social_media_db
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```

3. **Set up PostgreSQL and initialize tables**:

    ```bash
    npm run setup:db
    ```

---

##  How to Run the Server

### ▶ Development mode with auto-reload:

```bash
npm run dev
```

###  Production mode:

```bash
npm start
```

---

##  Scheduled Posts (BONUS FEATURE)

- You can schedule a post using the `scheduled_at` field.
- A cron job (`node-cron`) runs every minute to **auto-publish posts** whose scheduled time has arrived.
- Posts are stored with `is_published = false` and get updated automatically.

Example request:
```json
{
  "content": "This will go live at 10:55 AM!",
  "media_url": "https://example.com/image.jpg",
  "scheduled_at": "2025-06-30T05:25:00.000Z",
  "comments_enabled": true
}
```

---

##  API Documentation

- Postman Collection: [docs/api-collection.json](docs/api-collection.json)
- Import it in Postman and replace `{{base_url}}` with `http://localhost:3000`.

---

##  Available npm Scripts

| Command                 | Description                             |
|------------------------|-----------------------------------------|
| `npm start`            | Run server in production mode           |
| `npm run dev`          | Run server with nodemon (dev mode)      |
| `npm run start:verbose`| Run with verbose logs                   |
| `npm run start:critical`| Only show critical logs                |
| `npm run setup:db`     | Create and initialize all DB tables     |

---

##  Deployment

**Live API Base URL**: [Paste your deployed link here]

---

## 🗃️ Tech Stack

- **Node.js** with **Express.js**
- **PostgreSQL** with `pg`
- **JWT** for authentication
- **Nodemon** for dev auto-reload
- **node-cron** for scheduling
- **Helmet + CORS** for security
- **Joi** for input validation

---
