import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumeUploadRouter from "./resumeUpload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumeUploadRouter);

export default router;
