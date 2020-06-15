'use strict';

//// モジュールインポート
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
let mail = require('./sub/mail.js');
let network = require('./fabric/network.js');
let viewspath = 'src/views'

//// expressフレームワークAPI設定
const app = express();
app.engine('ejs', ejs.renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//// トップページ
app.get("/", (req, res) => {
    // レンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'top.ejs'),
        {title: 'Top Page',
        link1:{href:'/request', text: 'Go to request page!'},
        link2:{href:'/receipt', text: 'Go to receipt page!'},
        });
});

//// リクエストページ
app.get("/request", (req, res) => {
    //　レンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'request.ejs'),
        {title: 'Request Page',
         content: 'Please input necessary information'
        });
    });

//// リクエスト完了ページ
app.post("/request", (req, res) => {
    // リクエストフォームからデータ取得
    var companyFrom = req.body.companyFrom;
    var companyTo = req.body.companyTo
    var dataId = req.body.dataId
    var objectUsr = req.body.objectUsr
    var purpose = req.body.purpose

    // レコード全件取得 *ブロック書き込み有り
    network.queryAllRecords().then((response) => {
        let record = JSON.parse(response)
        let newKey = record.length;  
        // リクエスト情報の登録　*ブロック書き込み有り
        network.requestInfo(newKey, companyFrom, companyTo, dataId, objectUsr, purpose);    
    });

    // 承認依頼メール送信（提供先 ⇨ 対象ユーザ）
    mail.requestMailSend(companyFrom, companyTo, dataId, objectUsr, purpose);

    // レンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'request_completed.ejs'),
        {title: 'Request Page',
         content: 'Your Request has been sent',
         link:{href:'/', text: 'Back to top page!'}
    });
});

//// 承認ページ
app.get("/approval", (req, res) => {
    // レンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval.ejs'),
        {title: 'Approval Page'});
});

//// 承認完了ページ
app.post("/approval", (req, res) => {
    // リクエストフォームからデータ取得(トリム有)
    var sign = (req.body.name).replace(/\s+/g, "");
    network.approval(sign)

    // 対象のデータ検索 *ブロック書き込み有り
    network.querySingleRecord(sign).then((response) => {
        objectUser = response.objectUser
        dataAttribute = response.dataAttribute
        companyTo = response.companyTo
        
        // 提供依頼メール送信（gateway ⇨ 提供元）
        mail.offerMailSend(objectUser, dataAttribute, companyTo);

        // 提供依頼情報のブロック書き込み *ブロック書き込み有り
        newwork.offerinfo(objectUser, dataAttribute, companyTo);
    }) 

    //レンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'approval_completed.ejs'),
    {content: 'Completed!'});
});

//// 受領通知ページ
app.get("/receipt", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt.ejs'),
        {title: 'Receipt Page',
         content: 'If you have any message'
        });
    });

//// 受領通知完了ページ
app.post("/receipt", (req, res) => {
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt_completed.ejs'),
        {title: 'Receipt Page',
         content: 'Completed!',
         link:{href:'/', text: 'Back to top page!'}
        });

    network.receiptNotice(req.body.message);
    mail.receiptMailSend(req.body.message);
}); 

//// サーバ起動
app.listen(3000, () => {
    console.log('WebAPI Runnning');
});

