# OmniChat Backend

## Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with your `DATABASE_URL` and `JWT_SECRET`.
4. `npx prisma migrate dev`
5. `npm run dev`

## API Documentation
The API is documented using Swagger. Once the server is running, visit:
`http://localhost:4000/api-docs`

## Features Implemented
- **Multi-tenancy**: All data is scoped by `tenantId`.
- **Auth**: Register tenant, login, and JWT middleware.
- **Users**: Manage agents and status.
- **Teams**: Create and manage support teams.
- **Contacts**: CRM functionality.
- **Conversations**: List, detail, assign, and resolve.
- **Messages**: History and real-time (REST-based for now).
- **Canned Responses**: Template management.
- **Tags**: Labeling conversations.
- **Analytics**: Key performance metrics.
- **Routing Rules**: Automated distribution logic.
