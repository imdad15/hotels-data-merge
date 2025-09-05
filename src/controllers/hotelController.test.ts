import { Request, Response } from 'express';
import { getHotels } from './hotelController';
import { Hotel } from '../types/hotel';
import { cache } from '../infrastructure/cache';

jest.mock('../infrastructure/cache');

const mockRequest = (query: any = {}) => ({
  query,
});

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Hotel Controller', () => {
  let req: any;
  let res: any;
  const mockHotels: Hotel[] = [
    {
      id: '1',
      destinationId: 123,
      name: 'Test Hotel 1',
      location: { address: '123 Test St', country: 'Testland' },
      description: 'A test hotel',
      amenities: { general: ['Pool', 'Wifi'] },
      images: { rooms: [], site: [], amenities: [] },
      bookingConditions: [],
    },
    {
      id: '2',
      destinationId: 123,
      name: 'Test Hotel 2',
      location: { address: '456 Test Ave', country: 'Testland' },
      description: 'Another test hotel',
      amenities: { general: ['Gym', 'Spa'] },
      images: { rooms: [], site: [], amenities: [] },
      bookingConditions: [],
    },
    {
      id: '3',
      destinationId: 456,
      name: 'Different Destination Hotel',
      location: { address: '789 Other St', country: 'Otherland' },
      description: 'Hotel in different destination',
      amenities: { general: ['Restaurant'] },
      images: { rooms: [], site: [], amenities: [] },
      bookingConditions: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  describe('getHotels', () => {
    it('should return 400 if no parameters are provided', async () => {
      await getHotels(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Either destination or hotel parameter is required',
      });
    });

    it('should return 503 if cache is empty', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(null);
      req.query.destination = '123';
      
      await getHotels(req, res);
      
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Hotels data not available. Please try again later.',
      });
    });

    it('should filter hotels by destination', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(mockHotels);
      req.query.destination = '123';
      
      await getHotels(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' }),
      ]);
    });

    it('should filter hotels by multiple hotel IDs', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(mockHotels);
      req.query.hotels = '1,3';
      
      await getHotels(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '3' }),
      ]);
    });

    it('should filter by both destination and hotel IDs when both are provided', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(mockHotels);
      req.query.destination = '123';
      req.query.hotels = '1,2,3';
      
      await getHotels(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' }),
      ]);
    });

    it('should return 404 when no hotels match the criteria', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(mockHotels);
      req.query.destination = '999';
      
      await getHotels(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No hotels found matching the criteria',
      });
    });

    it('should handle errors and return 500', async () => {
      const error = new Error('Test error');
      (cache.get as jest.Mock).mockRejectedValueOnce(error);
      req.query.destination = '123';
      
      await getHotels(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while processing your request',
        details: 'Test error',
      });
    });

    it('should trim whitespace from hotel IDs', async () => {
      (cache.get as jest.Mock).mockResolvedValueOnce(mockHotels);
      req.query.hotels = ' 1 , 2 ';
      
      await getHotels(req, res);
      
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' }),
      ]);
    });
  });
});
