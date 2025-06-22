import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });



// Uncomment the following code if you want to use disk storage instead of memory storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/temp')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.originalname)
//   }
// })

// export const upload = multer({ 
//     storage,
// })