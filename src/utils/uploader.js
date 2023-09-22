import { __dirname } from "./utils.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderName;
    if (file.fieldname === "photo") {
      folderName = "profile";
    } else if (file.fieldname === "product") {
      folderName = "products";
    } else if (file.fieldname === "documents") {
      folderName = "documents"; // --> Validación de los input
      // 'uploader/id/documents'
    }
    //fs.mkdirsync(nombreCarpeta, {recursive: true})
    cb(null, `${__dirname}/../public/img`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
