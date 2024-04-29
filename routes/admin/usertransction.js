const mongoose = require('mongoose');
const Users = mongoose.model('users');
const express = require('express');
const router = express.Router();
const config = require('../../config');
const commonHelper = require('../../helper/commonHelper');
const mainCtrl = require('../../controller/adminController');
const logger = require('../../logger');
// const Userdeposit = mongoose.model('userdeposit');
// const Userpayout = mongoose.model('userpayout');
const UserWalletTracks = mongoose.model('walletTrackTransaction');
const PaymentOut = mongoose.model('paymentout');
const PaymentIn = mongoose.model('paymentin');


/**
* @api {post} /admin/DepositList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/DepositList', async (req, res) => {
    try {
        //console.info('requet => ', req);
        const DepositeList = await Userdeposit.find({ approve: 0, reject: 0 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, depositamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, paymentmode: 1, status: 1, approve: 1, reject: 1, dateOfdeposit: 1
        })

        logger.info('DepositeList => ', DepositeList);

        res.json({ DepositeList });
    } catch (error) {
        logger.error('admin/DepositeList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

/**
* @api {post} /admin/AcceptList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/AcceptList', async (req, res) => {
    try {
        //console.info('requet => ', req);
        const AcceptList = await Userdeposit.find({ approve: 1, reject: 0 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, depositamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, paymentmode: 1, status: 1, approve: 1, reject: 1, dateOfdeposit: 1
        })

        logger.info('AcceptList=> ', AcceptList);

        res.json({ AcceptList });
    } catch (error) {
        logger.error('admin/AcceptList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/RejectList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/RejectList', async (req, res) => {
    try {
        //console.info('requet => ', req);

        const RejectList = await Userdeposit.find({ approve: 0, reject: 1 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, depositamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, paymentmode: 1, status: 1, approve: 1, reject: 1, dateOfdeposit: 1
        })

        logger.info('RejectList => ', RejectList);

        res.json({ RejectList });
    } catch (error) {
        logger.error('admin/RejectList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/DepositData
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/DepositData', async (req, res) => {
    try {
        //console.info('requet => ', req);

        const DepositeData = await Userdeposit.find({ _id: new mongoose.Types.ObjectId(req.query.id) }, { screenshort: 1, status: 1, approve: 1, reject: 1 })

        logger.info('DepositeData => ', DepositeData);

        res.json({ DepositeData });
    } catch (error) {
        logger.error('admin/DepositeData error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/DepositeInsert
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.post('/DepositeInsert', async (req, res) => {
    try {
        console.log("req ", req.body)
        //currently send rendom number and generate 
        let response = {
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email,
            mobileno: req.body.mobileno,
            screenshort: req.body.screenshort,
            depositamount: req.body.depositamount,
            bankAc: req.body.bankAc,
            IFSCcode: req.body.IFSCcode,
            acname: req.body.acname,
            upi_id: req.body.upi_id,
            dateOfdeposit: new Date(),
            paymentmode: req.body.paymentmode,
            status: req.body.status,
            approve: req.body.approve,
            reject: req.body.reject
        }

        let RecentUser = await Userdeposit.create(response)

        logger.info('DepositeInsert => ', RecentUser);
        if (RecentUser != undefined) {
            res.json({ status: "ok" });
        } else {
            res.status(config.INTERNAL_SERVER_ERROR).json(error);
        }
    } catch (error) {
        logger.error('admin/DepositeInsert error => ', error);
        //res.send("error");

        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/AddUser
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/

var multer = require('multer')
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/deposite')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
});
var upload = multer({ storage: storage1 })

router.post('/UploadScreenShort', upload.single('image'), async (req, res) => {
    try {
        console.log("(req.file ", req.file)
        if (req.file.path != 'undefined' && req.file.path != '' && req.file.path != null) {

            res.json({ flag: true, path: req.file.path.substr(7) });
        } else {
            res.json({ flag: false, path: "" });
        }

        logger.info('admin/dahboard.js post dahboard  inf o::: => ');

    } catch (error) {
        logger.error('admin/dahboard.js post bet-list error => ', error);
        //res.send("error");

        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/DepositeUpdate
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.put('/DepositeUpdate', async (req, res) => {
    try {

        if (req.body.trnsId == undefined) {
            res.json({ status: false });
            return false;
        }

        //currently send rendom number and generate 
        let response = {
            $set: {}
        }
        if (req.body.status != undefined) {
            response["$set"]["status"] = req.body.status
        }
        if (req.body.approve != undefined) {
            response["$set"]["approve"] = req.body.approve

        }
        if (req.body.reject != undefined) {
            response["$set"]["reject"] = req.body.reject

        }

        const userInfo = await Userdeposit.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.trnsId) }, response, { new: true });

        logger.info('userInfo => ', userInfo);


        res.json({ status: "ok" });
    } catch (error) {
        logger.error('admin/userInfoerror => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

//============================== Payout ===================================================

/**
* @api {post} /admin/PayoutList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayoutList', async (req, res) => {
    try {
        logger.info('PayoutList requet => ', req);

        const PayoutList = await Userpayout.find({ status: -1 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, payoutamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, dateOfpayout: 1, paymentmode: 1, status: 1, approve: 1, reject: 1
        })

        logger.info('PayoutList =>', PayoutList);

        res.json({ PayoutList });
    } catch (error) {
        logger.error('admin/PayoutList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

/**
* @api {post} /admin/AcceptList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayoutAcceptList', async (req, res) => {
    try {
        console.log('PayoutAcceptList requet => ');

        const AcceptList = await Userpayout.find({ status: 1 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, payoutamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, paymentmode: 1, status: 1, approve: 1, reject: 1, dateOfpayout: 1
        })

        console.log('AcceptList requet => ', AcceptList);


        logger.info('admin/dahboard.js PayoutAcceptList post dahboard  error => ', AcceptList);

        res.json({ AcceptList });
    } catch (error) {
        logger.error('admin/dahboard.js post bet-list error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/RejectList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayoutRejectList', async (req, res) => {
    try {
        logger.info('PayoutRejectList requet => ', req);

        const RejectList = await Userpayout.find({ status: 0 }, {
            name: 1, userId: 1, email: 1, "mobileno": 1, screenshort: 1, payoutamount: 1, bankAc: 1, IFSCcode: 1,
            acname: 1, upi_id: 1, paymentmode: 1, status: 1, approve: 1, reject: 1, dateOfpayout: 1
        })

        logger.info('PayoutRejectList => ', RejectList);

        res.json({ RejectList });
    } catch (error) {
        logger.error('admin/PayoutRejectList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/DepositeInsert
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.post('/PayoutInsert', async (req, res) => {
    try {
        //currently send rendom number and generate 
        let response = {
            name: req.body.name,
            userId: req.body.userId,
            email: req.body.email,
            mobileno: req.body.mobileno,
            depositamount: req.body.depositamount,
            bankAc: req.body.bankAc,
            IFSCcode: req.body.IFSCcode,
            acname: req.body.acname,
            upi_id: req.body.upi_id,
            dateOfpayout: new Date(),
            paymentmode: req.body.paymentmode,
            status: req.body.status,
            approve: req.body.approve,
            reject: req.body.reject
        }

        let RecentUser = await Userpayout.create(response)

        logger.info('RecentUser => ', RecentUser);
        if (RecentUser != undefined) {
            res.json({ status: "ok" });
        } else {
            res.status(config.INTERNAL_SERVER_ERROR).json(error);
        }
    } catch (error) {
        logger.error('admin/PayoutInsert error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/PayoutData
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayoutData', async (req, res) => {
    try {

        const PayouteData = await Userpayout.find({ _id: new mongoose.Types.ObjectId(req.query.id) }, { screenshort: 1, status: 1, approve: 1, reject: 1 })
        logger.info('PayoutData => ', PayouteData);

        res.json({ PayouteData });
    } catch (error) {
        logger.error('admin/PayoutData error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/AddUser
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/

var multer = require('multer')
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/payout')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
});
var upload = multer({ storage: storage1 })

router.post('/UploadScreenShortPayOut', upload.single('image'), async (req, res) => {
    try {
        console.log("(req.file ", req.file)
        if (req.file.path != 'undefined' && req.file.path != '' && req.file.path != null) {

            res.json({ flag: true, path: req.file.path.substr(7) });
        } else {
            res.json({ flag: false, path: "" });
        }

        logger.info('admin/dahboard.js post dahboard  inf o::: => ');

    } catch (error) {
        logger.error('admin/dahboard.js post bet-list error => ', error);
        //res.send("error");

        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/DepositeUpdate
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.put('/PayoutUpdate', async (req, res) => {
    try {

        if (req.body.trnsId == undefined) {
            res.json({ status: false });
            return false;
        }
        logger.info("PayoutUpdate req ", req.body)
        //currently send rendom number and generate 
        let response = {
            $set: {}
        }
        if (req.body.status != undefined) {
            response["$set"]["status"] = parseInt(req.body.status)
        }

        if (req.body.reject != undefined) {
            response["$set"]["reject"] = req.body.reject
        }

        if (req.body.approve != undefined) {
            response["$set"]["approve"] = req.body.approve
        }

        if (req.body.screenshort != undefined) {
            response["$set"]["screenshort"] = req.body.screenshort

        }


        const userInfo = await Userpayout.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.trnsId) }, response, { new: true });
        logger.info('User INFO  => ', userInfo);

        if (userInfo)
            res.json({ status: "ok" });
        else
            res.json({ status: "" });

    } catch (error) {
        logger.error('admin/PayoutUpdate error => ', error);
        //res.send("error");

        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

//==================================== Trancation  ======================================================
//Transaction
/**
* @api {post} /admin/Transaction
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/transactionData', async (req, res) => {
    try {
        //console.info('requet => ', req);

        const transactionData = await UserWalletTracks.find({}, {
            uniqueId: 1,username:1, userId: 1, transType: 1, transTypeText: 1, transAmount: 1, chips: 1, winningChips: 1, bonusChips: 1, lockbonusChips: 1,
            totalBucket: 1, gameId: 1, createdAt: 1
        }).sort({createdAt:-1})

        logger.info('transactionData => ', transactionData);

        res.json({ transactionData });
    } catch (error) {
        logger.error('admin/transactionData error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

//==========================================================================================

/**
* @api {post} /admin/PayoutList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayoutListData', async (req, res) => {
    try {
        console.log('PayoutListData requet => ', req.query);
        let wh = {}
        if (req.query.status == "PendingApproval" || req.query.status == "RequestProcessing") {
            wh = { paymentStatus: "Pending" }
        } if (req.query.status == "ProcessedRequest") {
            wh = { paymentStatus: "Approved" }
        }

        const PayoutList = await PaymentOut.find(wh, {
            OrderID: 1,
            transactionId: 1, paymentStatus: 1, orderInfo: 1,accountNo:1,ifscCode:1,
            userId: 1, name: 1, email: 1, phone: 1, amount: 1, createdAt: 1, transferMode: 1
        }).sort({createdAt:-1})

        logger.info('PayoutList => ', PayoutList);

        res.json({ PayoutList });
    } catch (error) {
        logger.error('admin/PayoutListData error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});


/**
* @api {post} /admin/PayoutList
* @apiName  add-bet-list
* @apiGroup  Admin
* @apiHeader {String}  x-access-token Admin's unique access-key
* @apiSuccess (Success 200) {Array} badges Array of badges document
* @apiError (Error 4xx) {String} message Validation or error message.
*/
router.get('/PayInDataList', async (req, res) => {
    try {
        console.log('PayInDataList requet => ', req.query);
        let wh = {}
        if (req.query.status == "Pending") {
            wh = { paymentStatus: "Pending" }
        } if (req.query.status == "Approved") {
            wh = { paymentStatus: "Approved" }
        }

        const PayoutList = await PaymentIn.find({}, {
            OrderID: 1,
            transactionId: 1, paymentStatus: 1, orderInfo: 1, "accountNo": 1, ifscCode: 1, beneficiaryName: 1, transferMode: 1, rrn: 1,
            userId: 1, name: 1, email: 1, phone: 1, amount: 1, createdAt: 1,paymentGateway:1
        }).sort({createdAt:-1})

        logger.info('PayInDataList => ', PayoutList);

        res.json({ PayoutList });
    } catch (error) {
        logger.error('admin/PayInDataList error => ', error);
        res.status(config.INTERNAL_SERVER_ERROR).json(error);
    }
});

module.exports = router;