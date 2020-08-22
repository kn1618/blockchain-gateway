// -------------------
// Author： 中西 康介
// Since ： 2020/9/30
// -------------------

'use strict';

// 標準API
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
// モジュール、パス
let mail = require('./sub/mail.js');
let network = require('./fabric/network.js');
let viewspath = 'src/views'

// express、ejs設定
const app = express();
app.engine('ejs', ejs.renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//// トップページ -----------------------------------------------
app.get("/", (req, res) => {
    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'top.ejs'),
        {title: 'トップページ',
        link1:{href:'/request', text: '情報提供依頼ページへ'},
        link2:{href:'/receipt', text: '情報受領通知ページへ'},
        link3:{href:'/deletion', text: '情報削除依頼ページへ'}
        });
});

//// 情報提供依頼ページ -----------------------------------------------
app.get("/request", (req, res) => {
    //ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'request.ejs'),
        {title: '情報提供依頼ページ',
         content: '必要情報をご入力ください。'
        });
    });

//// 情報提供依頼完了ページ -----------------------------------------------
app.post("/request", (req, res) => {

    // リクエストフォームデータ
    var companyFrom = req.body.companyFrom
    var companyTo = req.body.companyTo
    var dataAttribute = req.body.dataAttribute
    var objectUser = req.body.objectUser
    var purpose = req.body.purpose

    // トランザクション書き込み
    network.requestInfo(companyFrom, companyTo, dataAttribute, objectUser, purpose);
    // 情報提供依頼メール（to_user）
    mail.requestMailSend(companyFrom, companyTo, dataAttribute, objectUser, purpose);

    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'request_completed.ejs'),
        {title: '情報提供依頼完了ページ',
         content: 'リクエストが正常に送信されました。',
         link:{href:'/', text: 'トップページに戻る'}
        });
});

//// 承認ページ -----------------------------------------------
app.get("/approval", (req, res) => {
    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval.ejs'),
        {title: '承認ページ'});
});

//// 承認完了ページ -----------------------------------------------
app.post("/approval", (req, res) => {
    // リクエストフォームからデータ取得
    var apploval = req.body.apploval
    var nonapploval = req.body.nonapploval
    var signature = req.body.sign  

    if(apploval == 1 && nonapploval != 0) {
        // トランザクション書き込み        
        network.approval(signature, apploval);   
        // 提供依頼メール送信（to_com）
        mail.offerMailSend(signature, apploval);
        // トランザクション書き込み
        network.offerinfo(signature, apploval);
    } else {
         // 否認情報のブロック書き込み
        network.nonapproval(signature, nonapploval);
    }
    //　ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval_completed.ejs'),
    {content: '処理が正常に完了しました。'});
});

//// 受領通知ページ -----------------------------------------------
app.get("/receipt", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt.ejs'),
        {title: '受領通知ページ'});
    });

//// 受領通知完了ページ -----------------------------------------------
app.post("/receipt", (req, res) => {
    // リクエストフォームからデータ取得
    var receiptDay = req.body.receiptday
    var comment = req.body.comment

    // 受領通知メール送信（to_user）
    mail.receiptMailSend(receiptDay, comment);
    // トランザクション書き込み
    network.receiptNotice(receiptDay, comment);

    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt_completed.ejs'),
        {title: '受領通知完了ページ',
         content: '受領通知が正常に送信されました。',
         link:{href:'/', text: 'トップページに戻る'}
        });
});

//// 情報削除依頼ページ -----------------------------------------------
app.get("/deletion", (req, res) => {
    //ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'deletion.ejs'),
        {title: '情報削除依頼ページ',
         content: '削除情報をご入力ください。'
        });
    });

//// 情報削除依頼完了ページ -----------------------------------------------
app.post("/deletion", (req, res) => {

    // リクエストフォームからデータ取得
    var userName = req.body.userName
    var deletionCom = req.body.deletionCom
    var deletionInfo = req.body.deletionInfo

    // 削除依頼メール送信（to_com）
    mail.deletionMailSend(userName, deletionCom, deletionInfo);
    // トランザクション書き込み
    network.deleteinfo(userName, deletionCom, deletionInfo);

    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'deletion_completed.ejs'),
        {title: '情報削除依頼完了ページ',
         content: 'リクエストが正常に送信されました。',
         link:{href:'/', text: 'トップページに戻る'}
    });
});

//// サーバ起動 -----------------------------------------------
app.listen(3000, () => {
    console.log('WebAPI Runnning');
});

