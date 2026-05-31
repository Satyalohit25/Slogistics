import { Router, type IRouter } from "express";
import healthRouter from "./health";
import logisticsRouter from "./logistics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(logisticsRouter);

export default router;
