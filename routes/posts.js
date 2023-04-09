
const router=require("express").Router()
const Post=require("../model/post")

router.post("/",async(req,res)=>{
    const newPost=new Post(req.body)
    try{
        const savePost=await newPost.save()
        res.status(200).json(savePost)
        
    }catch(err){
        res.status(500).json(err)
    }
})

router.put("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(post.username===req.body.username){
            try{
                const updatePost=await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set:req.body
                    },
                    {
                        new:true
                    }

                )
                res.status(200).json(updatePost)

            }catch(err){
                res.status(200).json(err)

            }
        }
        else{
            res.status(401).json('You can update only your post')
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})


router.delete('/:id',async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(post.username===req.body.username){
            try{
                await post.deleteOne()
                res.status(200).json('Post has been deleted')

            }catch(err){
                res.status(500).json(err)

            }
        }else{
            res.status(401).json('You can only delete your post')
        }

    }catch(err){
        res.status(500).json(err)

    }

})
  

router.get('/:id',async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(404).json(err)

    }
})


router.get('/',async(req,res)=>{
    const username=req.query.user
    const catName=req.query.cat
    try{
        let posts
        if(username){
            posts=await Post.find({username:username})
        }else if(catName){
            posts=await Post.find({
                categories:{
                    $in:[catName],
                },
            })
        }
        else{
            posts=await Post.find()
        }
        res.status(404).json(posts)

    }catch(error){
        res.status(404).json(error)

    }
})


module.exports=router