import { Router } from "express";
import { queriesController } from "../../controllers";

const router = Router();

router.post("", queriesController.saveQueiry);
router.get("/:id", queriesController.getQuery);
router.get("", queriesController.getQueries);

export default router;
