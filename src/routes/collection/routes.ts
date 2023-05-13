import { Router } from "express";
import { collectionCtrl } from "../../controllers";
import authController from "../../controllers/auth.controller";
import { fileHandler } from "../../utils";
import { isAdmin } from "../middlewares/isAdminAuth";
import validator from "./validator";

const router = Router();

router.post(
  "/uploads",
  isAdmin,
  fileHandler.uploadBrandAndCategoryFilesToS3("collections").single("file"),
  authController.postUploadFiles
);
router.patch(
  "/featured/:collectionId",
  isAdmin,
  validator.patchUpdateCollectionFeaturedStatus,
  collectionCtrl.patchUpdateCollectionFeaturedStatus
);
router.post("/", isAdmin, validator.postAddCollection, collectionCtrl.postAddCollection);
router.get("/by-admin", isAdmin, validator.getCollections, collectionCtrl.getCollectionsByAdmin);
router.patch(
  "/:collectionId",
  isAdmin,
  validator.patchUpdateCollectionStatus,
  collectionCtrl.patchUpdateCollectionStatus
);

// router.put("/attach/:categoryId", isAuth, validator.putAttachCollections, collectionCtrl.putAttachCollections);
// router.put("/deattach/:categoryId", isAuth, validator.putDeattachCollection, collectionCtrl.putDeattachCollection);

router.put("/:collectionId", isAdmin, validator.putUpdateCollection, collectionCtrl.putUpdateCollection);
router.delete("/:collectionId", isAdmin, validator.deleteCollection, collectionCtrl.deleteCollection);
router.get("/:collectionId", validator.getCollection, collectionCtrl.getCollection);
router.get("", validator.getCollections, collectionCtrl.getCollections);

export default router;
