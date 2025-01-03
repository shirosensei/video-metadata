import express from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { getVideos, addVideo, updateVideo, deleteVideo } from "../controllers/videoController";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post('/videos', authenticateJWT, asyncHandler(addVideo));
router.put('/videos/:id', authenticateJWT, asyncHandler(updateVideo));
router.get('/videos', authenticateJWT, asyncHandler(getVideos));
router.delete('/videos/:id', authenticateJWT, asyncHandler(deleteVideo));

export default router;