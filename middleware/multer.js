const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/"); //Destination of the files
    //has to exist already
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname); //name of the uploaded files in the server storage
  }
});
const fileFilter = (req, file, cb) => {
  //accpet jpeg and png files
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error("Wrong filetype. Only jpeg and png filetypes are accepted."),
      false
    );
  }
};
module.exports = {
  fileFilter,
  storage
};
