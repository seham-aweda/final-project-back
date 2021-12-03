const bmiModel=require('../Models/user.model').BMI

const getAllBMI=(req,res)=>{
    bmiModel.find({},(err,data)=>{
        if(err) return res.status(244).json(err)
        if(data) return res.status(200).json(data)
    })
}

const addBMI=(req,res)=>{
    const{weight,height}=req.body

    bmiModel.create({weight, height}, (err, data) => {
        if (err) return res.send(err);
        if(data){
            data.result=(weight/(Math.pow((height/100),2))).toFixed(3)
            data.save()
        return res.send(data);
        }
    })
}

const UpdateBMI=(req,res)=>{
    const currentBMIId=req.user.bmi
    bmiModel.findByIdAndUpdate(currentBMIId,req.body,{new:true,runValidators:true},(err,data)=>{
        if(err) res.status(240).send(err)
        if(data){
            data.result=(req.body.weight/(Math.pow(((req.body.height)/100),2))).toFixed(3)
            data.save()
        }
        return res.status(200).json({"updating": data})
    })
}

module.exports = {
    addBMI,
    getAllBMI,UpdateBMI
}