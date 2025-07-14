import express from "express";
import { getAIResponse } from "../controllers/openai.controller";

const router = express.Router();

router.post("/openai", getAIResponse);

export default router;
