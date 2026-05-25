/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Send success response
 * @param message - Response message
 * @param data - Response data
 * @param statusCode - HTTP status code
 * @returns ApiResponse
 */
export const successResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = 200
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  statusCode,
});

/**
 * Send error response
 * @param message - Error message
 * @param error - Error details
 * @param statusCode - HTTP status code
 * @returns ApiResponse
 */
export const errorResponse = (
  message: string,
  error?: string,
  statusCode: number = 400
): ApiResponse => ({
  success: false,
  message,
  error: error || message,
  statusCode,
});
