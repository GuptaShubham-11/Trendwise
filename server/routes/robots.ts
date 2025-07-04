import { Router } from "express";

const router = Router();

router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
    `User-agent: *
     Allow: /
     Sitemap: https://yourdomain.com/sitemap.xml`
  );
});

export default router;
