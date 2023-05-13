import aws from "aws-sdk";
import crypto from "crypto";
import fs from "fs/promises";
import multer from "multer";
import sharp from "sharp";
import s3Storage from "multer-sharp-s3";
import { helper } from ".";

helper.loadEnvFile();
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const processImages = async (files: any[]) => {
  let uploadedFiles = [];
  for await (let f of files) {
    let hash = await new Promise((res, rej) => {
      crypto.pseudoRandomBytes(16, (err, buf) => {
        if (err) rej(err);
        res(buf.toString("hex") as string);
      });
    });

    const imgProcess = async (key: string, ins: sharp.Sharp, width?: number, height?: number, quality: number = 50) => {
      let resizeInfo: any = { fit: "fill" };

      if (height && width) {
        resizeInfo.height = height;
        resizeInfo.width = width;
      }

      let file = await ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();

      return (
        await s3
          .upload(
            {
              Bucket: process.env.AWS_BUCKET_NAME as string,
              Key: `${hash}-${key}.webp`,
              Body: file,
            },
            function (err, data) {
              if (err) throw err;
              console.log(`File uploaded successfully. ${data.Location}`);
            }
          )
          .promise()
      ).Location;
    };

    let xlg = await imgProcess("xlg", sharp(f.path), 1200, 1200);
    let lg = await imgProcess("lg", sharp(f.path), 800, 800);
    let md = await imgProcess("md", sharp(f.path), 500, 500);
    let sm = await imgProcess("sm", sharp(f.path), 300, 300);
    let xs = await imgProcess("xs", sharp(f.path), 100, 100);
    let original = await imgProcess("original", sharp(f.path));

    uploadedFiles.push({ ...f, variant: { xlg, lg, md, sm, xs, original } });
    await fs.unlink(f.path);
  }
  return uploadedFiles;
};

// upload files to amazon s3
const uploadFile = (mimeTypes: string[] = []) => {
  try {
    return multer({
      limits: {
        fileSize: 1024 * 1042 * 1,
      },
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, helper.buildPath("public", "uploads")),
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: _fileFilter(mimeTypes),
    });
  } catch (error) {
    throw error;
  }
};

const deleteFile = async (filePath: string) => await fs.unlink(filePath);

// check file types
const _fileFilter = (mimeTypes: string[]) => (_: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log("mimetype", file?.mimetype);
  // if (mimeTypes.length && !mimeTypes.includes(file.mimetype)) {
  //   cb(helper.buildError(`please uplaod valid files like ${mimeTypes.join(",")}`, 400), false);
  //   return;
  // }
  cb(null, true);
};

// upload files to amazon s3
const uploadProductFilesToS3 = (folderName: string | null = null, mimeTypes: string[] = []) => {
  try {
    return multer({
      limits: {
        fileSize: 1024 * 1024 * 1,
      },
      storage: s3Storage({
        Key: function (req: any, file: any, cb: any) {
          crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(err, err ? undefined : raw.toString("hex") + ".webp");
          });
        },
        s3,
        Bucket: process.env.AWS_BUCKET_NAME,
        multiple: true,
        toFormat: { type: "webp", options: { progressive: true, quality: 50 } },
        resize: [
          { suffix: "xlg", width: 1200, height: 1200, options: { fit: "fill" } },
          { suffix: "lg", width: 800, height: 800, options: { fit: "fill" } },
          { suffix: "md", width: 500, height: 500, options: { fit: "fill" } },
          { suffix: "sm", width: 300, height: 300, options: { fit: "fill" } },
          { suffix: "xs", width: 100, height: 100, options: { fit: "fill" } },
          { suffix: "original" },
        ],
      }),

      fileFilter: _fileFilter(mimeTypes),
    });
  } catch (error) {
    throw error;
  }
};

// upload files to amazon s3
const uploadLongSliderFilesToS3 = async (files: any[]) => {
  try {
    let uploadedFiles = [];
    for await (let f of files) {
      let hash = await new Promise((res, rej) => {
        crypto.pseudoRandomBytes(16, (err, buf) => {
          if (err) rej(err);
          res(buf.toString("hex") as string);
        });
      });

      const imgProcess = async (
        key: string,
        ins: sharp.Sharp,
        width?: number,
        height?: number,
        quality: number = 50
      ) => {
        let resizeInfo: any = { fit: "fill" };

        if (height && width) {
          resizeInfo.height = height;
          resizeInfo.width = width;
        }

        let file = await ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();

        return (
          await s3
            .upload(
              {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: `${hash}-${key}.webp`,
                Body: file,
              },
              function (err, data) {
                if (err) throw err;
                console.log(`File uploaded successfully. ${data.Location}`);
              }
            )
            .promise()
        ).Location;
      };

      let xlg = await imgProcess("xlg", sharp(f.path), 2000, 600);
      let lg = await imgProcess("lg", sharp(f.path), 1600, 500);
      let md = await imgProcess("md", sharp(f.path), 1200, 400);
      let sm = await imgProcess("sm", sharp(f.path), 1000, 300);
      let xs = await imgProcess("xs", sharp(f.path), 800, 200);

      let original = await imgProcess("original", sharp(f.path));

      uploadedFiles.push({ ...f, variant: { xlg, lg, md, sm, xs, original } });
      await fs.unlink(f.path);
    }
    return uploadedFiles;
  } catch (error) {
    throw error;
  }
};

const uploadShortSliderFilesToS3 = async (files: any[]) => {
  try {
    let uploadedFiles = [];
    for await (let f of files) {
      let hash = await new Promise((res, rej) => {
        crypto.pseudoRandomBytes(16, (err, buf) => {
          if (err) rej(err);
          res(buf.toString("hex") as string);
        });
      });

      const imgProcess = async (
        key: string,
        ins: sharp.Sharp,
        width?: number,
        height?: number,
        quality: number = 50
      ) => {
        let resizeInfo: any = { fit: "fill" };

        if (height && width) {
          resizeInfo.height = height;
          resizeInfo.width = width;
        }

        let file = await ins.resize(resizeInfo).toFormat("webp", { compression: "webp", quality: 50 }).toBuffer();

        return (
          await s3
            .upload(
              {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: `${hash}-${key}.webp`,
                Body: file,
              },
              function (err, data) {
                if (err) throw err;
                console.log(`File uploaded successfully. ${data.Location}`);
              }
            )
            .promise()
        ).Location;
      };

      let xlg = await imgProcess("xlg", sharp(f.path), 1000, 830);
      let lg = await imgProcess("lg", sharp(f.path), 600, 430);
      let md = await imgProcess("md", sharp(f.path), 500, 330);
      let sm = await imgProcess("sm", sharp(f.path), 400, 230);
      let xs = await imgProcess("xs", sharp(f.path), 200, 80);

      let original = await imgProcess("original", sharp(f.path));

      uploadedFiles.push({ ...f, variant: { xlg, lg, md, sm, xs, original } });
      await fs.unlink(f.path);
    }
    return uploadedFiles;
  } catch (error) {
    throw error;
  }
};

const uploadAdsFilesToS3 = (folderName: string | null = null, mimeTypes: string[] = []) => {
  try {
    return multer({
      limits: {
        fileSize: 1024 * 1024 * 1,
      },
      storage: s3Storage({
        Key: function (req: any, file: any, cb: any) {
          crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(err, err ? undefined : raw.toString("hex") + ".webp");
          });
        },
        s3,
        Bucket: process.env.AWS_BUCKET_NAME,
        multiple: true,
        toFormat: "webp",
        resize: [
          { suffix: "xlg", height: 600, width: 2000 },
          { suffix: "lg", height: 500, width: 1600 },
          { suffix: "md", height: 400, width: 1200 },
          { suffix: "sm", height: 300, width: 1000 },
          { suffix: "xs", height: 200, width: 800 },
          { suffix: "original" },
        ],
      }),
      fileFilter: _fileFilter(mimeTypes),
    });
  } catch (error) {
    throw error;
  }
};

const uploadBrandAndCategoryFilesToS3 = (folderName: string | null = null, mimeTypes: string[] = []) => {
  try {
    return multer({
      limits: {
        fileSize: 1024 * 1024 * 1,
      },
      storage: s3Storage({
        Key: function (req: any, file: any, cb: any) {
          crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(err, err ? undefined : raw.toString("hex") + ".webp");
          });
        },
        s3,
        Bucket: process.env.AWS_BUCKET_NAME,
        multiple: true,
        resize: [
          { suffix: "xlg", width: 1200, height: 1000 },
          { suffix: "lg", width: 800, height: 700 },
          { suffix: "md", width: 500, height: 400 },
          { suffix: "sm", width: 300, height: 200 },
          { suffix: "xs", width: 100, height: 100 },
          { suffix: "original" },
        ],
        toFormat: "webp",
      }),

      fileFilter: _fileFilter(mimeTypes),
    });
  } catch (error) {
    throw error;
  }
};

// delete files from amazon s3
const deleteFromS3 = (fileLocation: string) => {
  const fileKey = fileLocation?.replace(`${process.env.AWS_BUCKET_KEY as string}/`, "");

  return new Promise((res, rej) => {
    if (!fileKey) res(false);

    var params = { Bucket: process.env.AWS_BUCKET_NAME as string, Key: fileKey };

    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        rej(err);
      } else {
        res(true);
        console.log("file deleted"); // deleted
      }
    });
  });
};

export default {
  uploadBrandAndCategoryFilesToS3,
  uploadProductFilesToS3,
  uploadShortSliderFilesToS3,
  uploadLongSliderFilesToS3,
  uploadAdsFilesToS3,
  deleteFromS3,
  uploadFile,
  deleteFile,
  processImages,
};
