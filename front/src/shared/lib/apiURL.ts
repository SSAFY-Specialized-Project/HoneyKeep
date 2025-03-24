const apiURL = (url: string):string => {

  const makeURL = `${import.meta.env.BASE_URL}${url}`

  return makeURL;
}

export default apiURL;