const apiURL = (url: string): string => {
  const makeURL = `${import.meta.env.VITE_BASE_URL}${url}`;

  return makeURL;
};

export default apiURL;
