var express=require('express');
var router= express.Router();
var mongoose= require('mongoose');
var Goods=require('../models/goods');

//connect mongodb db
mongoose.connect('mongodb://127.0.0.1:27017/shoppingmall');
//success
mongoose.connection.on('connected',function () {
  console.log('MongoDB connection success');
});
//error
mongoose.connection.on('error',function () {
  console.log('MongoDB connection fail');
});
//disconnected
mongoose.connection.on('disconnected',function () {
  console.log('MongoDB connection disconnected');
});

router.get('/',function (req,res,next) {
  Goods.find({},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }

  });
});

module.exports=router;
