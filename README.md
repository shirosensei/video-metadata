# Video Metadat API

A RESTful API service for managing video content.

## Features

- CRUD operations for video resources
- Authentication and authorization
- Pagination support
- Search functionality

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm 

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with required environment variables:
```
PORT=3000
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get a specific video
- `POST /api/videos` - Create a new video
- `PUT /api/videos/:id` - Update a video
- `DELETE /api/videos/:id` - Delete a video


## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)