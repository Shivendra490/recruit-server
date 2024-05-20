const express=require("express")

const router=express.Router()

const jobController=require("../controllers/job")
const {verifyAuth}=require("../middlewares/verifyauth")

router.post("/create",verifyAuth,jobController.createJob)

module.exports=router