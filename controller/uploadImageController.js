const s3 = require("../config/s3.config");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

exports.upload_single_file = async (req, res, next) => {
  try {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    if (!req.file) {
      return res.status(400).json({ error: true, Message: "No file uploaded" });
    }
    const uniqueFilename = `${uuidv4()}_${req.file.originalname}`;
    params.Key = uniqueFilename;
    params.ContentType = req.file.mimetype;
    params.Body = req.file.buffer;

    s3Client.upload(params, function (err, data) {
      if (err) {
        res.json({ error: true, Message: err });
      } else {
        req.body.imageUrl = data.Location;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
exports.upload_multiple_file = async (req, res, next) => {
  try {
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    var ResponseData = [];
    req.files.map((item) => {
      const uniqueFilename = `${uuidv4()}_${item.originalname}`;
      params.Key = uniqueFilename;
      params.ContentType = item.mimetype;
      params.Body = item.buffer;

      s3Client.upload(params, function (err, data) {
        if (err) {
          res.json({ error: true, Message: err });
        } else {
          ResponseData.push(data.Location);
          if (ResponseData.length == req.files.length) {
            req.body.imageUrl = ResponseData;
            next();
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.delete_file = async (req, res) => {
  try {
    var params = {
      Bucket: process.env.BUCKET,
      Key: req.params.key,
    };
    s3.s3Client.deleteObject(params, function (err, data) {
      if (data) {
        res
          .status(204)
          .json({ success: false, message: "Remove image from bucket." });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Something is went wrong!" });
      }
    });
    res.status(200).json({ success: true, msg: "File deleted successfully." });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
