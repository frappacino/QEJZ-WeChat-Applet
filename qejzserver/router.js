// 路由模块

const express = require('express');
const router = express.Router();
const service = require('./service.js');

// 路由处理
// 获取tag
router.post('/api/addCounts',service.addCounts);

router.get('/api/getDetail',service.getDetail);
router.get('/api/getSelectedDetail/:id',service.getSelectedDetail);
router.post('/api/editDetail',service.editDetail);
router.get('/api/deleteDetail/:id',service.deleteDetail);

router.get('/api/getTag',service.getTag);
router.get('/api/deleteTag/:id',service.deleteTag);
router.post('/api/addTag',service.addTag);

router.get('/api/getLoan',service.getLoan);
router.get('/api/deleteLoan/:id',service.deleteLoan);
router.post('/api/addLoan',service.addLoan);

router.get('/api/getLoanBack/:id',service.getLoanBack);
router.get('/api/deleteLoanBack/:id',service.deleteLoanBack);
router.post('/api/addLoanBack',service.addLoanBack);

router.post('/api/getOpenid',service.getOpenid);
router.get('/api/getKeepDay',service.getKeepDay);

router.get('/api/exportDetailExcel/:mail',service.exportDetailExcel);

module.exports = router;