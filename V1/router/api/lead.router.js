const express = require("express");
const router = express.Router();
const leadController = require("../../controller/lead.controller");
const {
  handleValidation,
  validateLead
} = require("../../utils/leadValidation")


router.get("/", leadController.getLeads);
router.get("/:id", leadController.getLeadById);


router.post("/",
  validateLead,
  handleValidation,
  leadController.createLead
);

router.put("/:id",
  validateLead,
  handleValidation,
  leadController.updateLead
);

router.delete( "/:id",leadController.deleteLead);

module.exports = router;
