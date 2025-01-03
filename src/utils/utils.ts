export const successResponse = (data: any, message: string, metadata?: any) => {
  return {
    success: true,
    data,
    message,
    metadata,
  };
};
