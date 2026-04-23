import { Router } from "express";
import { shortenerUrl, redirectUrl } from "../controllers/url.controller";

// Router là một "mini Express app" — nhóm các route liên quan lại
const router = Router();

// POST /api/shorten → gọi hàm shortenUrl trong controller
router.post("/shorten", shortenerUrl);


export default router;
