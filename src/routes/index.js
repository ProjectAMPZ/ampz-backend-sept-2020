import { Router } from "express";
import authRouter from "./auth.route";
import bioRouter from "./bio.route";
import featureRouter from "./feature.route";
import experienceRouter from "./experience.route";
import achievementRouter from "./achievement.route";
import associationRouter from "./association.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", bioRouter);
router.use("/profile", featureRouter);
router.use("/profile", experienceRouter);
router.use("/profile", associationRouter);
router.use("/profile", achievementRouter);

export default router;
