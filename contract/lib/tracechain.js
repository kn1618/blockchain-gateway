/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
require('date-utils');

class TraceChain extends Contract {

    // 初期化
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        let now = new Date();
        const requests = [
            {
                companyFrom: '杉並区役所',
                companyTo: '企業B',
                dataAttribute: '住所',
                objectUser: '中西康介',
                purpose: '土地登記のため',
                transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
                omitFlg: false,
                status: '情報提供済'
            }
        ];

        for (let i = 0; i < requests.length; i++) {
            await ctx.stub.putState(i, Buffer.from(JSON.stringify(requests[i])));
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // 登録情報全件取得
    async queryAllRecords(){
        const startKey = '0';
        const endKey = '99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    // 対象のレコード情報取得
    async querySingleRecord(ctx, key) {

        const res = await ctx.stub.getState(key);
        if (res){
            let Record;
            try {
                Record = JSON.parse(res.toString('utf8'));
            } catch (err) {
                console.log(err);
                Record = res.toString('utf8');
            }
            return JSON.stringify([{ key, Record }]);
        }
        else{
            console.err('Did not find the record with No ' + key);
            return [];
        }
    }

    // 情報提供依頼処理（企業 ⇨ ユーザ）
    async requestInfo(ctx, newKey, companyFrom, companyTo, dataAttribute, objectUsr, purpose) {
        console.info('============= START : Request Information（企業 ⇨ ユーザ） ==========='); 
        
        let now = new Date();

        // 情報提供依頼レコード
        const requestData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUsr,
            purpose,
            transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
            omitFlg: false,
            status: '情報提供依頼済(to_user)'
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(requestData)));
        console.info('============= END : Request Infomation（企業 ⇨ ユーザ） ===========');
    }

    // 情報提供承認処理
    async approval(ctx, newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose) {
        console.info('============= START : Approval Completion ===========');
        
        let now = new Date();

        // 情報提供承認レコード
        const approvalData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUser,
            purpose,
            transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
            omitFlg: false,
            status: '情報提供承認済'
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(approvalData)));
        console.info('============= END : Approval Completion ===========');
    }

    // 情報提供否認処理
    async nonapproval(ctx, newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose) {
        console.info('============= START : Nonapproval Completion ===========');
        
        let now = new Date();

        // 情報提供否認レコード
        const nonapprovalData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUser,
            purpose,
            transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
            omitFlg: false,
            status: '情報提供否認済'
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(nonapprovalData)));
        console.info('============= END : Nonapproval Completion ===========');
    }

    // 情報提供依頼処理（ユーザ ⇨ 区役所）
    async offerinfo(ctx, newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose) {
        console.info('============= START : Offer Information（ユーザ ⇨ 区役所） ===========');

        let now = new Date();

        // 情報提供依頼レコード
        const userRequestData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUser,
            purpose,
            transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
            omitFlg: false,
            status: '情報提供依頼済(to_com)'
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(userRequestData)));
        console.info('============= END : Offer Infomation（ユーザ ⇨ 区役所） ===========');
    }

    // 情報受領通知処理
    async receiptNotice(ctx, newKey, companyFrom, companyTo, objectUser, dataAttribute, purpose) {
        console.info('============= START : Receipt Notification ===========');
        
        let now = new Date();

        // 情報受領通知レコード
        const receiptData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUser,
            purpose,
            transactionTime: now.toFormat('yyyy/mm/dd HH24:MI:SS'),
            omitFlg: false,
            status: '情報受領通知済(to_user)'
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(receiptData)));
        console.info('============= END : Receipt Notification ===========');
    }

}

module.exports = TraceChain;
