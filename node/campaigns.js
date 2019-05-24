let pg = require('pg'),
    async = require('async'),
        moment = require('moment'),
        format = require('pg-format'),
        db = require('./db_connection.js');
        stored_campaign_id = require('./campaign.js'),
        comman = require('./comman.js');
const request = require('request');
module.exports = {
    getFilterCampaign(types, getRange) {
        var client = new pg.Client(db.connectionDB());
        client.connect()
        var result;
        console.log("==========================data coming from filter" + types, getRange)
        query = 'select SUM(' + types[0] + ') AS ' + types[0] + ' from adreporting WHERE date >= ($1) AND date<= ($2)';
        console.log("QUERY: ", query)
        client.query(query, getRange.start_date, function(err, currData) {
            console.log("Error1: ", err, currData)
            if (err) res.send({
                message: "Something went wrong. Try again."
            });
            client.query(query, getRange.end_date, function(err, preData) {
                console.log("Error2: ", err, preData)
                if (err) res.send({
                    message: "Something went wrong. Try again."
                });
                var arrayObj = [];
                let filterData;
                if (types[0] == 'cpm') {
                    filterData = {
                        title: types[0],
                        rate: (currData.rows[0].cpm / (100000)).toFixed(2) ? (currData.rows[0].cpm / (100000)).toFixed(2) : 0,
                        growthRate: parseInt(currData.rows[0].cpm - preData.rows[0].cpm) / (parseInt(currData.rows[0].cpm)),
                        prev: (preData.rows[0].cpm / (100000)).toFixed(2) ? (preData.rows[0].cpm / (100000)).toFixed(2) : 0
                    };
                }
                if (types[0] == 'cpc') {
                    filterData = {
                        title: types[0],
                        rate: currData.rows[0].cpc ? currData.rows[0].cpc : 0,
                        growthRate: parseInt(currData.rows[0].cpc - preData.rows[0].cpc) / (parseInt(currData.rows[0].cpc)),
                        prev: preData.rows[0].cpc ? preData.rows[0].cpc : 0
                    };
                }
                if (types[0] == 'frequency') {
                    filterData = {
                        title: types[0],
                        rate: currData.rows[0].frequency ? currData.rows[0].frequency : 0,
                        growthRate: parseInt(currData.rows[0].frequency - preData.rows[0].frequency) / (parseInt(currData.rows[0].frequency)),
                        prev: preData.rows[0].frequency ? preData.rows[0].frequency : 0
                    };
                }
                if (types[0] == 'spend') {
                    filterData = {
                        title: types[0],
                        rate: (currData.rows[0].spend / (1000)).toFixed(2) ? (currData.rows[0].spend / (1000)).toFixed(2) : 0,
                        growthRate: parseInt(currData.rows[0].spend - preData.rows[0].spend) / (parseInt(currData.rows[0].spend)),
                        prev: (preData.rows[0].spend / (1000)).toFixed(2) ? (preData.rows[0].spend / (1000)).toFixed(2) : 0
                    };
                }
                if (types[0] == 'click_ctr') {
                    filterData = {
                        title: types[0],
                        rate: currData.rows[0].ctr ? currData.rows[0].ctr : 0,
                        growthRate: parseInt(currData.rows[0].ctr - preData.rows[0].ctr) / (parseInt(currData.rows[0].ctr)),
                        prev: preData.rows[0].ctr ? preData.rows[0].ctr : 0
                    };
                }
                if (types[0] == 'link_clicks') {
                    filterData = {
                        title: types[0],
                        rate: currData.rows[0].link_clicks ? currData.rows[0].link_clicks : 0,
                        growthRate: parseInt(currData.rows[0].link_clicks - preData.rows[0].link_clicks) / (parseInt(currData.rows[0].link_clicks)),
                        prev: preData.rows[0].link_clicks ? preData.rows[0].link_clicks : 0
                    };
                }
                arrayObj.push(filterData)
                result = {
                    status_code: 200,
                    message: "successful",
                    result: arrayObj
                }

                //res.end();
                return result;
            })

        })
        //
    }


}