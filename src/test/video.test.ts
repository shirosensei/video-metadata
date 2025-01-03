import request from "supertest";
import app from "../app"; // Assume app.ts is your Express app
import { AppDataSource } from "../database/dataSource"; // Your TypeORM DataSource
import { Video } from "../entities/Video";
import { User } from "../entities/User"; // Assuming you have a user entity for JWT authentication

let token: string;  // JWT token for authentication

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
});

// Clean up after tests
afterAll(async () => {
  await AppDataSource.getRepository(Video).clear();
  await AppDataSource.getRepository(User).clear();
  await AppDataSource.destroy();
});

// Test the new user endpoint
describe("POST /register", () => {
  it("register a new user", async () => {
    const userData = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/register")
      .send(userData)
      .expect(201);

    console.log("body", response.body);

    var token = response.body.token;
    expect(token).toBeDefined();
    expect(response.body.username).toBe(userData.username);
    expect(response.body.email).toBe(userData.email);
  });
});

// Test the login endpoint
describe("POST /login", () => {
  it("should login user and return a JWT token", async () => {
    const userData = {
      email: "testuser@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/login")
      .send(userData)
      .expect(200);

    token = response.body.token;
    expect(token).toBeDefined();
  });
});

// Test the video endpoints with authentication token
describe("vide endpoints", () => {
  // Create a new video
  it("should create a new video", async () => {
    const videoData = {
      title: "Test Video",
      description: "This is a test video",
      genre: "Action",
      tags: ["test", "video"],
      duration: 120,
    };

    const response = await request(app)
      .post("/videos")
      .set("Authorization", `Bearer ${token}`)
      .send(videoData)
      .expect(201);

    expect(response.body.title).toBe(videoData.title);
    expect(response.body.description).toBe(videoData.description);
    expect(response.body.genre).toBe(videoData.genre);
    expect(response.body.tags).toEqual(videoData.tags);
    expect(response.body.duration).toBe(videoData.duration);
  });

  // Get all videos
  it("should get all videos", async () => {
    const response = await request(app)
      .get("/videos")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Get a single video
  it("should get a single video", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Video",
        description: "Fetch Test",
        genre: "Action",
      });
    const videoId = createResponse.body.id;

    const response = await request(app)
      .get(`/videos/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty("title");
    expect(response.body.id).toBe(videoId);
  });

  // Update a video
  it("should update a video n", async () => {
    const videoData = {
      title: "Updated Test Video",
      description: "An updated description of the test video.",
      genre: "Comedy",
      tags: ["updated", "video"],
      duration: 150,
    };

    // Create a video first
    const createResponse = await request(app)
      .post("/videos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Initial Test Video",
        description: "A test video.",
        genre: "Action",
        tags: ["test"],
        duration: 120,
      });

    const videoId = createResponse.body.id;

    // Update the video
    const updateResponse = await request(app)
      .put(`/videos/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(videoData)
      .expect(200);

    expect(updateResponse.body.title).toBe(videoData.title);
    expect(updateResponse.body.description).toBe(videoData.description);
    expect(updateResponse.body.genre).toBe(videoData.genre);
    expect(updateResponse.body.duration).toBe(videoData.duration);
    expect(updateResponse.body.tags).toEqual(
      expect.arrayContaining(videoData.tags)
    );
  });

  // Test deleting a video
  it("should delete a video with a valid JWT token", async () => {
    // Create a video first
    const createResponse = await request(app)
      .post("/videos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Video to be deleted",
        description: "A test video to be deleted.",
        genre: "Action",
        tags: ["delete"],
        duration: 120,
      });

    const videoId = createResponse.body.id;

    // Delete the video
    const deleteResponse = await request(app)
      .delete(`/videos/${videoId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(deleteResponse.body.message).toBe("Video deleted successfully");
  });
});
