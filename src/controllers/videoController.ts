import { Request, Response } from "express";
import { AppDataSource } from "../database/dataSource";
import { Video } from "../entities/Video";
import { query, body, validationResult } from "express-validator";

const videoRepository = AppDataSource.getRepository(Video);

// Get video by id
export const addVideo = async (req: Request, res: Response) => {
  // Validate and sanitize inputs
  await body("title").isString().trim().escape().notEmpty().run(req);
  await body("description").isString().trim().escape().optional().run(req);
  await body("genre").isString().trim().escape().optional().run(req);
  await body("tags").isArray().optional().run(req);
  await body("duration").isInt({ min: 0 }).run(req); // Example: ensuring duration is a positive number

  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the data from the request body
    const {
      title,
      description,
      duration,
      genre,
      tags,
      views,
      likes,
      createdAt,
      updatedAt,
    } = req.body;

    // Create a new video object
    const newVideo = videoRepository.create({
      title,
      description,
      duration,
      genre,
      tags,
      views,
      likes,
      createdAt,
      updatedAt,
    });
    const result = await videoRepository.save(newVideo);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to save video" });
  }
};

// Update video by id
export const updateVideo = async (req: Request, res: Response) => {
  // Validate and sanitize inputs
  await body("title").isString().trim().escape().optional().run(req); // Optional, because you might not update title
  await body("description").isString().trim().escape().optional().run(req);
  await body("genre").isString().trim().escape().optional().run(req);
  await body("tags").isArray().optional().run(req);
  await body("duration").isInt({ min: 0 }).optional().run(req); // Optional, if you don't update duration

  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the video id from the request parameter
    const videoId = req.params.id;

    //   find the video using the id
    const video = await videoRepository.findOneBy({ id: parseInt(videoId) });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const { title, description, genre, tags, duration } = req.body;
    video.title = title ?? video.title;
    video.description = description ?? video.description;
    video.genre = genre ?? video.genre;
    video.tags = tags ?? video.tags;
    video.duration = duration ?? video.duration;

    const updateVideo = await videoRepository.save(video);
    res.json(updateVideo);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update video" });
  }
};

// Get all videos
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  // Validate and sanitize inputs using express-validator
  await query("genre").optional().isString().trim().escape().run(req);
  await query("tags").optional().isString().trim().escape().run(req);
  await query("title").optional().isString().trim().escape().run(req);
  await query("page").optional().isInt({ min: 1 }).toInt().run(req);
  await query("limit").optional().isInt({ min: 1 }).toInt().run(req);
  await query("search").optional().isString().trim().escape().run(req);

  // Check if validation errors occurred
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
  }

  // Get query parameters with destructuring
  const { genre, tags, title, page = 1, limit = 10, search } = req.query;

  // Pagination parameters
  const take = parseInt(limit as string) || 10;
  const skip = (parseInt(page as string) - 1) * take;

  // Filter videos by query parameters
  const where: any = {};

  if (genre) {
    where.genre = genre;
  }

  if (tags && typeof tags === "string") {
    where.tags = { $contains: tags.split(",") };
  }

  if (title) {
    where.title = { $like: `%${title}%` };
  }

  if (search) {
    try {
      // Use full-text search to search videos by title and description
      const qb = videoRepository.createQueryBuilder("video");
      qb.where(
        "to_tsvector('english', video.title || ' ' || video.description) @@ plainto_tsquery(:search)",
        { search }
      );
      const videos = await qb.getMany();
       res.json({
        data: videos,
        total: videos.length,
        page: 1,
        limit: videos.length,
        totalPages: 1,
      });
    } catch (error) {
      console.log(error);
       res.status(500).json({ error: "Failed to perform query" });
    }
  }

  try {
    const [videosWithCount, total] = await videoRepository.findAndCount({
      where,
      take,
      skip,
      order: { id: "ASC" },
    });

     res.json({
      data: videosWithCount,
      total,
      page: parseInt(page as string),
      limit: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({ error: "failed to retrieve videos" });
  }
};

// Delete video by id
export const deleteVideo = async (req: Request, res: Response) => {
  const id = req.params.id;

  const video = await videoRepository.delete(id);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  res.status(204).send();
};
