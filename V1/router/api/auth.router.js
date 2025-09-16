const express =require('express')
const router = require('express').Router();
const authController =require('../../controller/auth.controller');
const { validateUser,validateUserUpdate, handleValidation } = require("../../utils/userValidation");

const verifyToken=require("../../middleware/verifyToken");
router.post('/',  authController.login);
router.post('/register', validateUser, handleValidation, authController.register);
router.post('/logout',verifyToken,authController.logoutUser)
router.put('/:id',verifyToken,validateUserUpdate,handleValidation,authController.updateProfile);
router.delete("/:id",verifyToken,authController.deleteProfile);
router.get('/',verifyToken,authController.listUsers);
module.exports = router;
