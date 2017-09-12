var express = require('express');
var router = express.Router();

var User=require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',function (req,res,next) {
    var param={
      userName:req.body.userName,
      userPwd:req.body.userPwd
    }
    User.findOne(param,function (error,doc) {
      if(error){
        res.json({
          status:'1',
          msg:error.message
        });
      }else {
        if(doc){
          res.cookie('userId',doc.userId,{
            path:'/',
            maxAge:1000*60*60
          });
          res.cookie('userName',doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          // req.session.user=doc;
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          });
        }
      }
    });
});

router.post('/logout',function (req,res,next) {
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  });
  res.json({
      status:'0',
      msg:'',
      result:''
  });
});

router.get('/checkLogin',function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName||''
    });
  }else{
    res.json({
      status:'1',
      msg:'have not login',
      result:''
    });
  }
});

//check info of cart
router.get('/cartList',function (req,res,next) {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else {
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  })
});

//delete item
router.post('/cart/del',function (req,res,next) {
  var userId=req.cookies.userId, productId=req.body.productId;
  //use pull to remove item
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }

  });
});
//edit
router.post('/cartEdit',function (req,res,next) {
  var userId=req.cookies.userId,productId=req.body.productId,productNum=req.body.productNum;
  User.update({userId:userId,'cartList.productId':productId},{'cartList.$.productNum':productNum},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });

})

module.exports = router;
