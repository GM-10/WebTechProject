# Backend Setup

This backend uses MongoDB through Mongoose.

## Shared data across computers
Use the same persistent MongoDB URI everywhere. A cloud database such as MongoDB Atlas works best for this.

## Local development
If you want data only on your own machine, use a local MongoDB instance.

## Setup
1. Copy `.env.example` to `.env`
2. Set `MONGO_URI` to your MongoDB connection string
3. Set `JWT_SECRET` to a strong secret
4. Run the backend:

```bash
npm start
```

## Notes
- If `MONGO_URI` is missing, the server now fails fast instead of creating a throwaway in-memory database.
- Seed data is loaded automatically when the database is empty.
