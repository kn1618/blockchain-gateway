// -------------------
// Author： 中西 康介
// Since ： 2020/9/30
// -------------------

'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const mailviewspath = 'src/sub/mail_views'

// メール情報（デモ用）
var receiveEmailAddress = 'knakanishi1618@gmail.com'
var senderEmailAddress = 'nakanishi1618@gmail.com'
var senderEmailPassword = 'Y89ud2mb'

// 提供依頼メール送信処理（to_user）
exports.requestMailSend = async function(companyFrom, companyTo, dataAttribute, objectUser, purpose){

var readHTMLFile = (path, callback) => {
    fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
        if(err){
            throw err;
        } else {
            callback(null, html);
        }
    });
}
var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: senderEmailAddress,
                        pass: senderEmailPassword
                    }
});
readHTMLFile(path.join(path.join(process.cwd(), mailviewspath),'request-mail.html'),(err, html) => {
    var template = handlebars.compile(html);
    var replacements = {
        companyFrom: companyFrom,
        companyTo: companyTo,
        dataAttribute: dataAttribute,
        objectUser: objectUser,
        purpose: purpose
    };
    var htmlToSend = template(replacements);
    var mailData = {
        from: senderEmailAddress,
        to: receiveEmailAddress,
        subject: `${replacements.companyTo}様からの「${replacements.dataAttribute}」情報の提供依頼`,
        html: htmlToSend              
    };
    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
  });
};

// 提供依頼メール送信処理（to_com）
exports.offerMailSend = async function(signature, apploval){

    var readHTMLFile = (path, callback) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
            if(err){
                throw err;
            } else {
                callback(null, html);
            }
        });
    }
    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: senderEmailAddress,
                            pass: senderEmailPassword
                        }
    });
    readHTMLFile(path.join(path.join(process.cwd(), mailviewspath),'offer-mail.html'), (err, html) => {
        var template = handlebars.compile(html);
        var replacements = {
            signature: signature,
            apploval: apploval,
        };
        var htmlToSend = template(replacements);
        var mailData = {
            from: senderEmailAddress,
            to: receiveEmailAddress,
            subject:  `${replacements.signature}様から企業A様への住所情報提供依頼`,
            html: htmlToSend              
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

// 受領通知メール送信処理（to_user）
exports.receiptMailSend = async function(receiptDay, comment){

    var readHTMLFile = (path, callback) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
            if(err){
                throw err;
            } else {
                callback(null, html);
            }
        });
    }
    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: senderEmailAddress,
                            pass: senderEmailPassword
                        }
    });
    readHTMLFile(path.join(path.join(process.cwd(), mailviewspath),'receipt-mail.html'), (err, html) => {
        var template = handlebars.compile(html);
        var replacements = {
            receiptday: receiptDay,
            comment: comment
        };
        var htmlToSend = template(replacements);
        var mailData = {
            from: senderEmailAddress,
            to: receiveEmailAddress,
            subject: "○○様の住所情報の受領連絡",
            html: htmlToSend              
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

// 情報削除依頼メール送信処理（to_com）
exports.deletionMailSend = async function(userName, deletionCom, deletionInfo){

    var readHTMLFile = (path, callback) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
            if(err){
                throw err;
            } else {
                callback(null, html);
            }
        });
    }
    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: senderEmailAddress,
                            pass: senderEmailPassword
                        }
    });
    readHTMLFile(path.join(path.join(process.cwd(), mailviewspath),'deletion-mail.html'),(err, html) => {
        var template = handlebars.compile(html);
        var replacements = {
            userName: userName,
            deletionCom: deletionCom,
            deletionInfo: deletionInfo
        };
        var htmlToSend = template(replacements);
        var mailData = {
            from: senderEmailAddress,
            to: receiveEmailAddress,
            subject: `${replacements.userName}からの「${replacements.deletionInfo}」情報の削除依頼`,
            html: htmlToSend              
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
      });
    };