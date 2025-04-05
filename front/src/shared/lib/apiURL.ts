const apiURL = (url: string):string => {

  // const makeURL = `${import.meta.env.VITE_BASE_URL}${url}`
  const makeURL = `http://localhost:8080/api/v1${url}`

  return makeURL;
}

export default apiURL;