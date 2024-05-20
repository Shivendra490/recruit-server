const Job=require("../models/job")
exports.createJob = async (req, res, next) => {
  const {
    title,
    companyName,
    location,
    salary,
    description,
    locationType,
    jobType,
    skills
  } = req.body;

  if(
    !title ||
    !companyName ||
    !location ||
    !salary ||
    !description ||
    !locationType ||
    !jobType ||
    !skills
  ){
    return res.status(422).json({message:"Please fill all fields"})
  }

  const skillArray=skills.split(",").map(skill=>skill.trim())

  const newJob=new Job({
    title,
    companyName,
    location,
    salary,
    description,
    locationType,
    jobType,
    skills:skillArray,
    refUserId:req.userId,
    createdAt:new Date(),
    updatedAt:new Date()
  })

  const createdJob=await newJob.save()
  console.log(createdJob)
  res.status(201).json({message:"job created successfully",job:createdJob})

 
};
