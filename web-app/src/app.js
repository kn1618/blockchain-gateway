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
//// ejsテンプレートエンジンを使用
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
        link2:{href:'/receipt', text: '受領通知ページへ'},
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

    // リクエストフォームからデータ取得
    var companyFrom = req.body.companyFrom;
    var companyTo = req.body.companyTo
    var dataAttribute = req.body.dataAttribute
    var objectUsr = req.body.objectUsr
    var purpose = req.body.purpose

    network.queryAllRecords().then((response) => {
        let record = JSON.parse(response)
        let newKey = record.length;  
        // リクエスト情報の登録　*ブロック書き込み有り
        network.requestInfo(newKey, companyFrom, companyTo, dataAttribute, objectUsr, purpose);    
    });

    // 承認依頼メール送信（提供先 ⇨ 対象ユーザ）
    mail.requestMailSend(companyFrom, companyTo, dataAttribute, objectUsr, purpose);

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
    var sign = (req.body.name).replace(/\s+/g, "");
    var apploval = req.body.apploval
    var nonapploval = req.body.nonapploval

    // statedbのkey値を手動で変更して検索。アプリとしては終わってる..おいおい考える。
    // sign = keyとする。
    // ==========
    sign = 1
    // ==========

    network.queryAllRecords().then((response) => {
        let record = JSON.parse(response)
        let newKey = record.length;

        if(apploval == 1 && nonapploval != 0) {
            network.querySingleRecord(sign).then((response) => {
                let Record = JSON.parse(response);
                var companyFrom = Record.companyFrom
                var companyTo = Record.companyTo
                var objectUser = Record.objectUser
                var dataAttribute = Record.dataAttribute
                var purpose = Record.purpose

                // 承認情報のブロック書き込み        
                network.approval(newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose);
   
                // 提供依頼メール送信（gateway ⇨ 提供元）
                mail.offerMailSend(objectUser, dataAttribute, companyTo);

                // 提供依頼情報のブロック書き込み *ブロック書き込み有り
                newwork.offerinfo(newKey+1, companyFrom, companyTo, objectUser, dataAttribute, purpose);
            });
        } else {
            network.querySingleRecord(sign).then((response) => {
                let Record = JSON.parse(response);
                var companyFrom = Record.companyFrom
                var companyTo = Record.companyTo
                var objectUser = Record.objectUser
                var dataAttribute = Record.dataAttribute
                var purpose = Record.purpose
            
                // 否認情報のブロック書き込み
                network.nonapproval(newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose);
            });
        }
    });
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

    network.queryAllRecords().then((response) => {
        let record = JSON.parse(response)
        let newKey = record.length;

        // statedbのkey値を手動で変更して検索。アプリとしては終わってる..おいおい考える。
        // 承認完了処理のsignと値を合わせる。
        // ==========
        key = 1
        // ==========

        network.querySingleRecord(key).then((response) => {
            let Record = JSON.parse(response);
            var companyFrom = Record.companyFrom
            var companyTo = Record.companyTo
            var objectUser = Record.objectUser
            var dataAttribute = Record.dataAttribute
            var purpose = Record.purpose

            // 受領通知情報のブロック書き込み
            network.receiptNotice(newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose)

            // 受領通知メール送信（提供先 ⇨ ユーザ）
            mail.receiptMailSend(receiptDay, comment);
        });
    });
    
    // ページレンダリング
    res.render(path.join(path.join(process.cwd(), viewspath), 'receipt_completed.ejs'),
        {title: '受領通知完了ページ',
         content: '受領通知が正常に送信されました。',
         link:{href:'/', text: 'トップページに戻る'}
        });
}); 

//// サーバ起動 -----------------------------------------------
app.listen(3000, () => {
    console.log('WebAPI Runnning');
});

