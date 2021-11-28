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
            data.result=(weight/(Math.pow(height,2))).toFixed(3)
            data.save()
        return res.send(data);
        }
    })
}

module.exports = {
    addBMI,
    getAllBMI
}