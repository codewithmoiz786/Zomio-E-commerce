const Imagekit = require('imagekit')

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.URL_END_POINT
})

async function UploadProduct(product) {
    let result = await imagekit.upload({
        file: product.buffer,
        fileName: product.originalname,
        folder: "E-commerceProducts/"
    })
    return result
}



module.exports = UploadProduct