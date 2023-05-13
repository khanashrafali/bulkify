"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
router.get("/product-utils", controllers_1.utilCtrl.getProductUtils);
router.get("/filter-dropdown", controllers_1.utilCtrl.getFetchFilterDropdown);
router.get("/admin-modules", controllers_1.utilCtrl.getAdminModules);
exports.default = router;
