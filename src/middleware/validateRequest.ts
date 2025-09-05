import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { destination, hotels } = req.query;
  
  // Check if parameters are missing, empty strings, or only whitespace
  const hasValidDestination = destination && String(destination).trim() !== '';
  const hasValidHotels = hotels && String(hotels).trim() !== '';
  
  if (!hasValidDestination && !hasValidHotels) {
    return res.status(400).json({
      error: 'Either destination or hotels parameter is required',
    });
  }
  
  next();
};
