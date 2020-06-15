'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const mailviewspath = 'src/sub/mail_views'

var receiveEmailAddress = 'knakanishi1618@gmail.com'
var senderEmailAddress = 'nakanishi1618@gmail.com'
var senderEmailPassword = 'Y89ud2mb'

// 提供依頼メール送信処理（企業 ⇨ ユーザ）
exports.requestMailSend = async function(companyFrom, companyTo, dataAttribute, objectUsr, purpose){

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
        objectUsr: objectUsr,
        purpose: purpose
    };
    var htmlToSend = template(replacements);
    var mailData = {
        from: senderEmailAddress,
        to: receiveEmailAddress,
        subject: `${replacements.companyTo}からの「${replacements.dataAttribute}」情報の提供依頼`,
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

// 提供依頼メール送信処理（ユーザ ⇨ 区役所）
exports.offerMailSend = async function(objectUser, dataAttribute, companyTo){

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
            companyto: objectUser,
            objuser: companyTo,
            data_id: dataAttribute
        };
        var htmlToSend = template(replacements);
        var mailData = {
            from: senderEmailAddress,
            to: receiveEmailAddress,
            subject:  `「${replacements.data_id}」情報提供のご依頼`,
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

// 受領通知メール送信処理
exports.receiptMailSend = async function(message){

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
            message: message
        };
        var htmlToSend = template(replacements);
        var mailData = {
            from: senderEmailAddress,
            to: receiveEmailAddress,
            subject: "受領完了",
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