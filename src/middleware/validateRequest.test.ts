import { Request, Response, NextFunction } from "express";
import { validateRequest } from "./validateRequest";

describe("validateRequest Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let jsonResponse: any;

  beforeEach(() => {
    // Reset mocks before each test
    jsonResponse = {};
    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        jsonResponse = result;
        return mockResponse as Response;
      }),
    };
    mockNext = jest.fn();
  });

  it("should call next() when destination parameter is provided", () => {
    mockRequest.query = { destination: "123" };

    validateRequest(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should call next() when hotels parameter is provided", () => {
    mockRequest.query = { hotels: "hotel1,hotel2" };

    validateRequest(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should call next() when both destination and hotels parameters are provided", () => {
    mockRequest.query = { destination: "123", hotels: "hotel1" };

    validateRequest(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 error when no parameters are provided", () => {
    validateRequest(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toEqual({
      error: "Either destination or hotels parameter is required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should handle empty string parameters", () => {
    mockRequest.query = { destination: "", hotels: "   " };

    validateRequest(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonResponse).toEqual({
      error: "Either destination or hotels parameter is required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
