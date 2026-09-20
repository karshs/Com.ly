// Helper to extract clean error messages from any backend error format
export const getErrorMessage = (err, fallback = 'An error occurred. Please try again.') => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data.error?.message) return data.error.message;
    if (typeof data.error === 'string') return data.error;
    if (data.message) return data.message;
  }
  
  if (err.message) return err.message;
  return fallback;
};
