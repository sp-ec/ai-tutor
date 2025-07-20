import express from "express";
import { getQuizResponse, getExplanationResponse } from "../controllers/openai.controller";


const router = express.Router();

router.post("/openai/explain", getExplanationResponse);
router.post("/openai/quiz", getQuizResponse);

export default router;
