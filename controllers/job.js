const Job = require("../models/job");
exports.createJob = async (req, res, next) => {
  const {
    title,
    companyName,
    location,
    salary,
    description,
    locationType,
    jobType,
    skills,
    aboutCompany,
    companyLogo,
    information,
  } = req.body;

  if (
    !title ||
    !companyName ||
    !location ||
    !salary ||
    !description ||
    !locationType ||
    !jobType ||
    !skills ||
    !aboutCompany ||
    !companyLogo ||
    !information
  ) {
    return res.status(422).json({ message: "Please fill all fields" });
  }

  const skillArray = skills?.split(",").map((skill) => skill.trim());

  const newJob = new Job({
    title,
    companyName,
    location,
    salary,
    description,
    locationType,
    jobType,
    aboutCompany,
    companyLogo,
    information,
    skills: skillArray,
    refUserId: req.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createdJob = await newJob.save();
  console.log(createdJob);
  res
    .status(201)
    .json({ message: "job created successfully", job: createdJob });
};

exports.getJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "No such Job found" });
    }
    res.status(200).json({ message: "job fetch successfully", data: job });
  } catch (err) {
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    // const jobId = req.params.jobId;

    const allJobs = await Job.find().select([
      "title",
      "skills",
      "salary",
      "location",
      "jobType",
      "locationType",
      "companyLogo",
      "refUserId"
    ]).sort({updatedAt:-1});

   

    if (allJobs.length === 0) {
      return res.status(404).json({ message: "No jobs found",data:alljobs});
    }
    res
      .status(200)
      .json({ message: "All jobs fetch successfully", data: allJobs });
  } catch (err) {
    next(err);
  }
};

exports.getAllMyJobs = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const allMyJobs = await Job.find({refUserId:userId}).select([
      "title",
      "skills",
      "salary",
      "location",
      "jobType",
      "locationType",
      "companyLogo",
      "refUserId"
    ]).sort({updatedAt:-1});

   

    if (allMyJobs.length === 0) {
      return res.status(200).json({ message: "No jobs found",data:allMyJobs });
    }
    res
      .status(200)
      .json({ message: "All your jobs fetch successfully", data: allMyJobs });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  try {
    const {
      title,
      companyName,
      location,
      salary,
      description,
      locationType,
      jobType,
      skills,
      companyLogo,
      aboutCompany,
      information,
    } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "this job does not exist in db" });
    }
    console.log('types',typeof req.userId,req.userId,typeof job.refUserId,job.refUserId)
    if(req.userId.toString()!==job.refUserId.toString()){
      return res.status(403).json({ message: "Unauthorized to update this job" });
    }
    const skillArray = skills
      ?.split(",")
      .map((skill) => skill?.trim().toLowerCase());
    console.log("skillArr", skillArray);
    job.title = title || job.title;
    job.companyName = companyName;
    job.location = location || job.companyName;
    job.salary = salary || job.salary;
    job.description = description || job.description;
    job.locationType = locationType || job.locationType;
    job.jobType = jobType || job.jobType;
    job.skills = skillArray || job.skills;
    job.companyLogo = companyLogo || job.companyLogo;
    job.aboutCompany = aboutCompany || job.aboutCompany;
    job.information = information || job.information;
    job.updatedAt = new Date();
    const jb = await job.save();
    res.status(200).json({ message: "job updated successfully", data: jb });
  } catch (err) {
    next(err);
  }
};



exports.deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findByIdAndDelete(jobId);
    console.log('jjjoooobbbb',job)

    if (!job) {
      return res.status(404).json({ message: "No such Job found" });
    }
    res.status(200).json({ message: "Job Delete successfully", data: job });
  } catch (err) {
    next(err);
  }
};
