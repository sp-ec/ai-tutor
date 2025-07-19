import express from "express";
import { getAIResponse, getExplanationResponse } from "../controllers/openai.controller";


const router = express.Router();

router.post("/openai", getAIResponse);
router.post("/openai/explain", getExplanationResponse);

export default router;
