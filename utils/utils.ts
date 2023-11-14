export const typeNumber = (value: string | string[]): number => {
  const id: number = Array.isArray(value) ? parseInt(value[0], 10) : parseInt(value, 10);
 
  return id;
};
