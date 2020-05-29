/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class TraceChain extends Contract {

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
        console.info('============= END : Request Infomation ===========');
    }

    // 承認処理
    async approval(ctx, name) {
        console.info('============= START : Approval Completion ===========');
        console.info('============= END : Approval Completion ===========');
    }

    // 受領処理
    async receiptNotice(ctx, message) {
        console.info('============= START : Receipt Notification ===========');
        console.info('============= END : Receipt Notification ===========');
    }

}

module.exports = TraceChain;
