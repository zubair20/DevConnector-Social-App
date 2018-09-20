const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const passport = require('passport');

//Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


//Load Validation
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Test post route
// @access Public
router.get('/test', (req, res)=>res.json({msg: "Posts Works"}));

// @route  GET api/posts
// @desc   Get posts
// @access Public
router.get('/', (req, res)=>{

  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound: 'No posts Found'}));
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public
router.get('/:id', (req, res)=>{

  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound: 'No post Found With that ID'}));
});

// @route  POST api/posts
// @desc   Test post route
// @access Private
router.post('/', passport.authenticate('jwt', {session:false}) ,(req, res)=>{

  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid){

    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post=> res.json(post));
});

// @route  DELETE api/posts/:id
// @desc   Delete Post
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session:false}) , (req, res)=>{

  Profile.findOne({user: req.user.id}).then(profile =>{

    Post.findById(req.params.id).then(post =>{

      //Check for post owner
      if(post.user.toString() !== req.user.id){

        return res.status(401).json({notauthorized: 'User not Authorized'});
      }

      //Delete
      post.remove().then(()=> res.json({success: true}));

    }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
  });  
});

// @route  POST api/posts/like/:id
// @desc   Like Post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {session:false}) , (req, res)=>{

  Profile.findOne({user: req.user.id}).then(profile =>{

    Post.findById(req.params.id).then(post =>{

      if(post.likes.filter(like => like.user.toString() === req.user.id).length >0){
        return res.status(400).json({alreadyliked: 'User already liked this post'});
      }

      //add user id to likes array
      post.likes.unshift({user: req.user.id});

      //save
      post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
  });  
});

// @route  POST api/posts/unlike/:id
// @desc   UnLike Post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}) , (req, res)=>{

  Profile.findOne({user: req.user.id}).then(profile =>{

    Post.findById(req.params.id).then(post =>{

      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({notliked: 'You have not liked this post yet'});
      }

      //Get remove index
      const removeIndex = post.likes
        .map(item => item.id.toString())
        .indexOf(req.user.id);
      
      // splice out of array
      post.likes.splice(removeIndex, 1);

      //save
      post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
  });  
});

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}) , (req, res)=>{

  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid){

    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post =>{

      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      //Add comment to array
      post.comments.unshift(newComment);

      //save
      post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
});


// @route  DELETE api/posts/comment/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}) , (req, res)=>{

  Post.findById(req.params.id)
    .then(post =>{

      // Check to see if comment exists
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){

        return status(404).json({commentnotexists: 'Comment does not exists'});
      }

      //get remove index
      const removeIndex = post.comments
        .map(item => item.id.toString())
        .indexOf(req.params.comment_id);
      
      // Splice comment out of array
      post.comments.splice(removeIndex, 1);

      //save
      post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
});

module.exports =router;