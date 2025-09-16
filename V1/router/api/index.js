const router = require("express").Router();

router.use("/auth", require("./auth.router"));
router.use("/lead", require("./lead.router"));
module.exports = router;
