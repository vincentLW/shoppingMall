'use strict'
var express=require('express');
var router= express.Router();
var mongoose= require('mongoose');
var Goods=require('../models/goods');
var User=require('../models/user');

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
  let params={};
  //filter function
  let priceLevel=req.param('priceLevel');
  //define the scope
  var priceGt='',priceLte='';
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,$lte:priceLte
      }
    }
  }
  //paging function
  let skip=(page-1)*pageSize;
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
//add to cart
router.post('/addCart',function (req,res,next) {
  var userId='100000077',productId=req.body.productId;
  User.findOne({userId:userId},function (err,docUser) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(docUser){
        let goodsItem='';
        docUser.cartList.forEach(function (item) {
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++
          }
        });
        //to see if there is already got this item
        if(goodsItem){
          docUser.save(function (err2,doc) {
            if(err2){
              res.json({
                status: '1',
                msg: err2.message,
                result: ''
              });
            }else{
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              });
            }

          });
        }else{
          Goods.findOne({productId:productId},function (err,doc) {
            if(err) {
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              });
            }else{
              if(doc){
                doc._doc.productNum=1;
                doc._doc.checked=1;
                console.log(doc.productName);
                console.log('document');
                console.log(doc);
                docUser.cartList.push(doc);
                docUser.save(function (err2,doc) {
                  if(err2){
                    res.json({
                      status: '1',
                      msg: err2.message,
                      result: ''
                    });
                  }else{
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    });
                  }

                });
              }
            }
          });
        }

      }
    }

  });
})

module.exports=router;
