const checkImageExists = (imgUrl: string) => {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function(){
      resolve({
        status: true
      })
    }

    img.onerror = function(){
      resolve({
        status: false
      })
    }

    img.src = imgUrl;

    img.crossOrigin = "Anonymous"
  })

}

export default checkImageExists;