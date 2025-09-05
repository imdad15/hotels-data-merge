import express from 'express';
import { getHotels } from '../controllers/hotelController';
import { query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get hotels by destination or specific hotel IDs
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Filter hotels by destination ID
 *       - in: query
 *         name: hotels
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         description: Filter by specific hotel IDs
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: No hotels found
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  [
    query('destination').optional().isString().trim().notEmpty(),
    query('hotels').optional().isString().trim(),
    validateRequest
  ],
  getHotels
);

export default router;
