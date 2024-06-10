const express=require("express")

const router=express.Router()

const jobController=require("../controllers/job")
const {verifyAuth}=require("../middlewares/verifyauth")

router.post("/create",verifyAuth,jobController.createJob)

router.get("/alljobs",jobController.getAllJobs)

router.patch("/update/:jobId",verifyAuth,jobController.updateJob)

router.get("/:jobId",jobController.getJob)

module.exports=router