'use strict'
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
  //get params of request
  let page=parseInt(req.param('page'));
  let pageSize=parseInt(req.param('pageSize'));
  let sort=req.param('sort');
  //paging function
  let skip=(page-1)*pageSize;
  let params={};
  //find return a model and skip and get limited item
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  //after sort then exec the query
  goodsModel.exec(function (err,doc) {
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
