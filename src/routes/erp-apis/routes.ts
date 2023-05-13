import { Router } from "express";
import { cspApiController } from "../../controllers";

const router = Router();

router.post("/login", cspApiController.cspLogin);
router.post("/item-list", cspApiController.cspItemList);
router.post("/post-online-order", cspApiController.postOnlineOrder);
router.post("/monitor-online-order", cspApiController.monitorOnlineOrder);
router.post("/merge-data", cspApiController.saveErpDataIntoMarketPlace);

export default router;
