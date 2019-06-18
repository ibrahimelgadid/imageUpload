/* ========================================= */
/* =/=/=/=/=/=>    Import consts  <=/=/=/=/= */
/* ========================================= */

const express = require('express');
const router = express.Router();
const Post= require('../model/post');
const mkdirp= require('mkdirp');
const resizeImg= require('resize-img');
const fs= require('fs-extra');

/* ========================================= */
/* =/=/=/=/=/=>    get  posts   <=/=/=/=/= */
/* ========================================= */
router.get('/',(req,res)=>{
    var count;
    Post.count((err,c)=>{
        count = c;
    });

    Post.find((err, posts)=>{
        res.render('posts',{
            posts:posts,
            count:count
        });
    })
});


/* ========================================= */
/* =/=/=/=/=/=>    get add posts   <=/=/=/=/= */
/* ========================================= */

router.get('/addPost',(req,res)=>{
    res.render('addPost');
})


/* ========================================= */
/* =/=/=/=/=/=>    add posts   <=/=/=/=/= */
/* ========================================= */

router.post('/add', (req,res,next)=>{
    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name:"";
    const newPost = new Post({
        title:req.body.title,
        image:imageFile
    });


    newPost.save((err)=>{
        if(err)console.log(err)
        mkdirp('public/product_img/'+ newPost._id, (err)=>{
            if(err)console.log(err)
        })

        mkdirp('public/product_img/'+ newPost._id+ '/gallary/', (err)=>{
            if(err)console.log(err)
        })

        mkdirp('public/product_img/'+ newPost._id+ '/gallary/thumbs', (err)=>{
            if(err)console.log(err)
        })

        if(imageFile !=""){
            var postImage =req.files.image;
            var path = 'public/product_img/' + newPost._id + '/' + imageFile;

            postImage.mv(path, (err)=>{
                if(err)console.log(err)
            })
        }
        res.redirect('/posts')
    })
})


/* ========================================= */
/* =/=/=/=/=/=>    get edit post   <=/=/=/=/= */
/* ========================================= */

router.get('/edit/:id',(req,res)=>{
    Post.findById({_id:req.params.id},(err,post)=>{
        if(err){
            console.log(err)
        }else{
            let galleryDir = 'public/product_img/' + post._id + '/gallary';
            let galleryImages = null;
            
            fs.readdir(galleryDir, (err, files)=>{
                if(err) {
                    console.log(err);
                }else{
                    galleryImages = files;
                    res.render('editPost', {
                        post:post,
                        galleryImages:galleryImages
                    })
                }
            })
        }
    })
})


router.post('/edit/:id', (req,res)=>{
    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name:"";
    const newPost = {
        title:req.body.title,
        image:imageFile,
        pimage:req.body.pimage
    };
    Post.findById(req.params.id, (err, post)=>{
        if(err){
            console.log(err);
        }
        if(post){
            post.title = newPost.title;
            if(imageFile != ""){
                post.image= newPost.image
            }

            post.save((err)=>{
                if(err){
                    console.log(err)
                }
                if(imageFile != ""){
                    if(newPost.pimage != ""){
                        fs.remove('public/product_img/' + post._id + '/' + newPost.pimage, (err)=>{
                            if(err){console.log(err);}
                        })

                        var postImage =req.files.image;
                        var path = 'public/product_img/' + post._id + '/' + imageFile;
            
                        postImage.mv(path, (err)=>{
                            if(err)console.log(err)
                        })
                        res.redirect('/posts')
                    }
                }
            })
        }
    })
})



// upload gallary images
router.post('/post-gallary/:id', (req,res)=>{
    let productImage = req.files.file;
    let path = 'public/product_img/'+req.params.id+'/gallary/'+req.files.file.name;
    let thumbsPath = 'public/product_img/'+req.params.id+'/gallary/thumbs/'+req.files.file.name;

    productImage.mv(path, (err)=>{
        if(err){console.log(err)}
        
        resizeImg(fs.readFileSync(path), {width:100, height:100}).then(
            buf=>fs.writeFileSync(thumbsPath, buf)
        )
        
    })
    res.sendStatus(200)
})


module.exports = router;