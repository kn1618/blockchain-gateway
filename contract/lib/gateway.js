/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

class BlockChain_GateWay extends Contract {

    // 初期化
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const usrs = [
            {
                name: 'Oosato',
                address: 'Tyuouku',
            }
        ];

        for (let i = 0; i < usrs.length; i++) {
            usrs[i].docType = 'usrID';
            await ctx.stub.putState('ID' + i, Buffer.from(JSON.stringify(usrs[i])));
            console.info('Added <--> ', usrs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // リクエスト処理
    async requestInfo(ctx, companyFrom, companyTo, dataAttribute, objectUsr, purpose, requestCount) {
        console.info('============= START : Request Information ===========');

        var receiveEmailAddress = 'knakanishi1618@gmail.com'
        var senderEmailAddress = 'nakanishi1618@gmail.com'
        var senderEmailPassword = 'Y89ud2mb'
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
        readHTMLFile('./views/request-mail.html', (err, html) => {
            var template = handlebars.compile(html);
            var replacements = {
                companyFrom: companyFrom,
                companyTo: companyTo,
                dataAttribute: dataAttribute,
                objectUsr: objectUsr,
                purpose: purpose,
                requestCount: requestCount
            };
            var htmlToSend = template(replacements);
            var mailData = {
                from: senderEmailAddress,
                to: receiveEmailAddress,
                subject: `${companyFrom}からの「${dataAttribute}」情報の提供依頼`,
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
        console.info('============= END : Request Infomation ===========');
    }

    // 承認処理
    async approval(ctx, name) {
        console.info('============= START : Approval Completion ===========');
        console.log(`${name} has been Approved`)
        console.info('============= END : Approval Completion ===========');
    }

    // 受領処理
    async receiptNotice(ctx, message) {
        console.info('============= START : Receipt Notification ===========');

        var receiveEmailAddress = 'knakanishi1618@gmail.com'
        var senderEmailAddress = 'nakanishi1618@gmail.com'
        var senderEmailPassword = 'Y89ud2mb'
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
        readHTMLFile('./views/receipt-mail.html', (err, html) => {
            var template = handlebars.compile(html);
            var replacements = {
                messsage: message
            };
            var htmlToSend = template(replacements);
            var mailData = {
                from: senderEmailAddress,
                to: receiveEmailAddress,
                subject: '受領通知',
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
        console.info('============= END : Receipt Notification ===========');
    }


}

module.exports = BlockChain_GateWay;
