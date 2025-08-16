# Social Network Demo (Movify) - Remote Server

**Authors:** Junyao HAN, Qiuzi WU, Runyuan FENG, Jiaming PEI

## Description

This is the backend remote server of the Social Network Demo (Movify) project. The server handles user authentication, review data management, and social interactions such as following users, liking movies and voting, storing data to a MongoDB database.

## Key Features
- User authentication and authorization
- Review data management
- Social interactions (follow/unfollow users, like/dislike movies, vote on reviews)
- Get movie related information from TMDB API
- User profile management (view/edit profiles, manage preferences)

## Project Structure

```
Social-Network-Demo-Remote-Server/
├── index.js
├── package.json
├── LICENSE
├── README.md
├── Database/              # JSON example database files
└── MovieNetwork/          # Main application modules
    ├── Details/           # Movie details functionality
    ├── FollowedReviews/   # Followed users' reviews
    ├── Follows/           # User following system
    ├── Liked/             # Movie liking system
    ├── MovieVote/         # Movie voting system
    ├── Reviews/           # Movie reviews system
    ├── ReviewVote/        # Review voting system
    ├── TMDB/              # The Movie Database API integration
    └── Users/             # User management system
```

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Remote-Server.git
cd Social-Network-Demo-Remote-Server
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Edit `.env` file in the root directory and modify the variables for delvelopment:

```
NODE_ENV=development
NETLIFY_URL=http://localhost:5173 (your frontend URL)
NODE_SERVER_DOMAIN=http://localhost:4000
SESSION_SECRET=super secret session phrase (your session secret)
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/movie-network (your MongoDB connection string)
TMDB_V4_TOKEN=(your TMDB v4 token)
```

### 4. Load Example Data (Optional)

You can load example data into your MongoDB database.

Create a new database called `movie-network` and import the example data files located in the `Database/` directory into collections with the same name of the json file.

This will populate your database with sample users, movies, and reviews for testing purposes.

### 5. Start the Server

We use nodemon by default for development. To start the server, run:

```bash
npm start
```

You can also run the server by node.js:

```bash
node index.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Visit our front-end repository
Check out the front-end part of this project at [Social-Network-Demo-Project](https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Project).