const express=require("express")

const app=express()

app.get('/',(req,res,next)=>{
    res.send('home route')
})


app.listen(8080,()=>console.log("server is running at port 8080"))