/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
require('date-utils');

class TraceChain extends Contract {

    // 初期化
    async initLedger() {
        console.info('============= START : Initialize Ledger ===========');
        //let now = new Date();
        //const requests = [
        //    {
        //        companyFrom: '杉並区役所',
        //        companyTo: '企業A',
        //        dataAttribute: '住所',
        //        objectUser: '中西康介',
        //        purpose: '土地登記のため'
        //        transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
        //        omitFlg: 0,
        //        status: '情報受領通知済(to_user)'
        //    }
        //];

        //for (let i = 0; i < requests.length; i++) {
        //    let key = 1
        //    await ctx.stub.putState(key, Buffer.from(JSON.stringify(requests[i])));
        //}
        console.info('============= END : Initialize Ledger ===========');
    }

     // 情報提供依頼処理（to_user）
    async requestInfo(ctx, companyFrom, companyTo, dataAttribute, objectUser, purpose) {
        console.info('============= START : Request Information（to_user） ===========');
        console.info('============= END : Request Infomation（to_user） ===========');
    };

    // 情報提供承認処理
    async approval(ctx, signature, apploval) {
        console.info('============= START : Approval Completion ===========');
        console.info('============= END : Approval Completion ===========');
    };

    // 情報提供否認処理
    async nonapproval(ctx, signature, nonapploval) {
        console.info('============= START : Nonapproval Completion ===========');
        console.info('============= END : Nonapproval Completion ===========');
    };

    // 情報提供依頼処理（to_com）
    async offerinfo(ctx, signature, apploval) {
        console.info('============= START : Offer Information（to_com） ===========');
        console.info('============= END : Offer Information（to_com） ===========');
    };

    // 情報受領通知処理
    async receiptNotice(ctx, receiptDay, comment) {
        console.info('============= START : Receipt Notification ===========');
        console.info('============= END : Receipt Notification ===========');
    };

    // 情報削除依頼処理（ユーザ ⇨ 企業）
    async deleteinfo(ctx, user, deletionCom, deletionInfo) {
        console.info('============= START : Delete Request（to_com） ===========');
        console.info('============= END : Delete Request（to_com） ===========');
    };
}

module.exports = TraceChain;
