import { Router } from "express";
import { utilCtrl } from "../../controllers";

const router = Router();

router.get("/product-utils", utilCtrl.getProductUtils);
router.get("/filter-dropdown", utilCtrl.getFetchFilterDropdown);
router.get("/admin-modules", utilCtrl.getAdminModules);

export default router;
