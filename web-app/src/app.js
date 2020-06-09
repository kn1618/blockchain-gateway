'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const ejs = require('ejs');
const path = require('path');
const viewspath = 'src/views'
let mail = require('./sub/mail.js');
let network = require('./fabric/network.js');

const app = express();

app.engine('ejs', ejs.renderFile);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static('public'));

// トップページ
app.get("/", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'top.ejs'),
        {title: 'Top Page',
         link1:{href:'/request', text: 'Go to request page!'},
         link2:{href:'/receipt', text: 'Go to receipt page!'}
        });
    });

// リクエストページ
app.get("/request", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'request.ejs'),
        {title: 'Request Page',
         content: 'Please input necessary information'
        });
    });

// リクエスト完了ページ　*ブロックへの書き込み
app.post("/request", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'request_completed.ejs'),
        {title: 'Request Page',
         content: 'Your Request has been sent',
         link:{href:'/', text: 'Back to top page!'}
        });
    network.requestInfo(req.body.companyFrom, req.body.companyTo, req.body.dataAttribute, req.body.objectUsr, req.body.purpose, req.body.requestCount)
    .then((response) => {
        res.send(response);});
    mail.requestMailSend(req.body.companyFrom, req.body.companyTo, req.body.dataAttribute, req.body.objectUsr, req.body.purpose, req.body.requestCount)
    });

// 承認ページ
app.get("/approval", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval.ejs'),
        {title: 'Approval Page'});
    });

// 承認完了ページ　*ブロックへの書き込み
app.post("/approval", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval_completed.ejs'),
        {content: 'Completed!'});
    network.approval(req.body.name).then((response) => {
        res.send(response);});
    
    // 提供依頼受領

    
    });

// 受領通知ページ
app.get("/receipt", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt.ejs'),
        {title: 'Receipt Page',
         content: 'If you have any message'
        });
    });

// 受領通知完了ページ *ブロックへの書き込み
app.post("/receipt", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt_completed.ejs'),
        {title: 'Receipt Page',
         content: 'Completed!',
         link:{href:'/', text: 'Back to top page!'}
        });
    network.receiptNotice(req.body.message).then((response) => {
        res.send(response);});
    mail.receiptMailSend(req.body.message)
    }); 


app.listen(3000, () => {
    console.log('WebAPI Runnning');
});


