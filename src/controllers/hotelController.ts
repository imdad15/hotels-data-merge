import { Request, Response } from 'express';
import { cache } from '../infrastructure/cache';
import { Hotel } from '../types/hotel';

export const getHotels = async (req: Request, res: Response) => {
  try {
    const { destination: destinationId, hotels: hotelIds } = req.query;

    // Validate at least one parameter is provided
    if (!destinationId && !hotelIds) {
      return res.status(400).json({
        error: 'Either destination or hotel parameter is required',
      });
    }

    const cached = await cache.get<Hotel[]>("mergedHotels");
    if (!cached) {
      return res.status(503).json({ error: 'Hotels data not available. Please try again later.' });
    }

    let hotelsData = cached;
    if (destinationId) {
      hotelsData = hotelsData.filter((h: Hotel) => h.destinationId === Number(destinationId));
    }

    if (hotelIds) {
      const ids = hotelIds.toString().split(",").map((id: string) => id.trim());
      hotelsData = hotelsData.filter((h: Hotel) => ids.includes(h.id));
    }

    // If no results found
    if (hotelsData.length === 0) {
      return res.status(404).json({
        message: 'No hotels found matching the criteria',
      });
    }

    return res.json(hotelsData);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};