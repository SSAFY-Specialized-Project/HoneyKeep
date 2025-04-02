const apiURL = (url: string):string => {

  const makeURL = `http://localhost:8080/api/v1${url}`

  return makeURL;
}

export default apiURL;