const WeightModel=require('../Models/user.model').weightTracker
const UserModel=require('../Models/user.model').User



const getAllWeights=(req,res)=>{
    WeightModel.find({},(err,authors)=>{
        if(err) return res.status(244).json(err)
        if(authors) return res.status(200).json(authors)
    })
}

const addCurrentWeight=(req,res)=>{
    const{weight,date}=req.body

    WeightModel.create({weight, date}, (err, currWeight) => {
        if (err) return res.send(err);
        return res.send(currWeight);
    })

}
//
// const removeAuthor=(req,res)=>{
//     const {authorsId}=req.params
//     bookModel.find({}).populate('author').exec((err,books)=>{
//         const allbooksAuthors=books.filter(book=>{
//             return book.author.find(a=>{
//                 return a._id.toString()===authorsId
//             })
//         })
//         allbooksAuthors.map(book=>{
//             book.author=book.author.filter(b=>{
//                 return b._id.toString()!==authorsId
//             })
//             book.save()
//         })
//     })
//
//     authorModel.findByIdAndDelete(authorsId,(err,data)=>{
//         if(err) return res.status(244).send(err)
//         if(data) return res.status(200).json({'deleted':data})
//     })
// }

module.exports = {
    getAllWeights,
    addCurrentWeight,
}