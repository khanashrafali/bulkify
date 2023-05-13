"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
router.post("", controllers_1.queriesController.saveQueiry);
router.get("/:id", controllers_1.queriesController.getQuery);
router.get("", controllers_1.queriesController.getQueries);
exports.default = router;
