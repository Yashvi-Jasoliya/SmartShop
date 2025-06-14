// src/routes/geminiAssistantRoutes.ts
import express from 'express';
import { geminiShoppingAssistant, testEndpoint } from '../controllers/aiAssistant.js';

const router = express.Router();

// Test endpoint to verify route works
router.get('/test', testEndpoint);

// Main AI assistant endpoint
router.post('/', geminiShoppingAssistant);

export default router;