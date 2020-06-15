/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class TraceChain extends Contract {

    // 初期化
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const requests = [
            {
                companyFrom: '杉並区役所',
                companyTo: '企業B',
                dataAttribute: '住所',
                objectUser: '中西康介',
                purpose: '土地登記のため',
                omitFlg: false
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
    async querySingleRecord(ctx, sign) {

        // 検証時のリクエストの回数に応じて変更。要注意。
        // sign = keyとする。
        // ==========
        sign = 1
        // ==========

        const res = await ctx.stub.getState(sign);
        if (res){
            let Record;
            try {
                Record = JSON.parse(res.toString('utf8'));
            } catch (err) {
                console.log(err);
                Record = res.toString('utf8');
            }
            return JSON.stringify([{ sign, Record }]);
        }
        else{
            console.err('Did not find the car with carNo ' + sign);
            return [];
        }
    }

    // 情報提供依頼処理（企業 ⇨ ユーザ）
    async requestInfo(ctx, newKey, companyFrom, companyTo, dataAttribute, objectUsr, purpose) {
        console.info('============= START : Request Information（企業 ⇨ ユーザ） ===========');       
        // 情報提供依頼レコード
        const requestData = {
            companyFrom,
            companyTo,
            dataAttribute,
            objectUsr,
            purpose,
            omitFlg: false
        };
        await ctx.stub.putState(newKey, Buffer.from(JSON.stringify(requestData)));
        console.info('============= END : Request Infomation（企業 ⇨ ユーザ） ===========');
    }

    // 情報提供承認処理
    async approval(ctx, sign) {
        console.info('============= START : Approval Completion ===========');
        console.info(`${sign}様のご署名`)
        console.info('============= END : Approval Completion ===========');
    }

    // 情報提供依頼処理（ユーザ ⇨ 区役所）
    async offerinfo(ctx, objectUser, dataAttribute, companyTo) {
        console.info('============= START : Offer Information（ユーザ ⇨ 区役所） ===========');
        console.info(`${objectUser}`)
        console.info(`${dataAttribute}`)
        console.info(`${companyTo}`)
        console.info('============= END : Offer Infomation（ユーザ ⇨ 区役所） ===========');
    }

    // 情報受領通知処理
    async receiptNotice(ctx, message) {
        console.info('============= START : Receipt Notification ===========');
        console.info('============= END : Receipt Notification ===========');
    }

}

module.exports = TraceChain;
