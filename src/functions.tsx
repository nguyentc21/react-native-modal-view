export const generateId = () => {
  return `${Date.now().valueOf()}_${Math.random()}`;
};
