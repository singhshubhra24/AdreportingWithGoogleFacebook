var moment = require('moment'),
    pg = require('pg'),
    db = require('./db_connection.js'),
    format = require('pg-format');
    module.exports = {
        campaignOverview(getRange, query, platform) {
            var client = new pg.Client(db.connectionDB());
            console.log(`client connection ===>`);
            client.connect();
            console.log("campaignOverview=====Query", query, getRange.end_date)
            return new Promise(function(resolve, reject) {
                client.query(query, getRange.start_date, function(err, currData) {
                    if (err) reject(err)
                    client.query(query, getRange.end_date, function(err, prevData) {
                        if (err) reject(err)
                        var campDataSet = [];
                        var newData = currData.rows;
                        var oldData = prevData.rows;
                        console.log("newData==========================");
                        console.log("oldData==========================");
                        try{
                        for (var i = 0; i < newData.length; i++) {

                            console.log("newData[i].ctr",newData[i].ctr,"   ",oldData[i].ctr)
                            var new_ctr = parseInt(newData[i].ctr) > 0 ? parseInt(newData[i].ctr) : 1;
                            campDataSet.push({
                                name: newData[i].name,
                                month_date: parseInt(newData[i].ctr),
                                impressions: parseInt(newData[i].impressions),
                                spend: parseInt(newData[i].spend),
                                cpc: (newData[i].cpc).toFixed(2),
                                percentage: parseInt(newData[i].ctr - oldData[i].ctr) / (parseInt(newData[i].ctr)) ? (parseInt(newData[i].ctr - oldData[i].ctr) / (parseInt(new_ctr))).toFixed(2) : 0
                            })
                            new_ctr = 0;
                            console.log("campDataSetpercentage==>"+ campDataSet[i].cpc + "campDataSetmonth_date==>"+campDataSet[i].percentage);
                        }
                        console.log(`Campaign query result==>`);
                        resolve(campDataSet);
                        client.end(console.log('Closed client connection'));
                        }catch(e){
                            resolve(campDataSet);
                            console.log("Error occured.")
                        }
                    }) 
                })
            });
        },
        dashboardData(commonQuery, endMonth) {
            var client = new pg.Client(db.connectionDB());
            client.connect()
            var impressions = [];
            var spend = [];
            var ctr = [];
            var cpc = [];
            var clicks = [];
            var startMonth = moment().startOf('month').format('YYYY-MM-DD');
            console.log("Query : ", commonQuery, [startMonth, endMonth])
            return new Promise(function(resolve, reject) {
                client.query(commonQuery, ['2019-02-01', '2019-04-30'], function(err, data) {
                    if (err) reject(err)
                    data.rows.forEach(function(data) {
                        impressions.push({
                            x: moment(new Date(data.date)).format('YYYY,MM,DD'),
                            y: parseInt(data.impressions)
                        })
                        spend.push({
                            x: moment(new Date(data.date)).format('YYYY,MM,DD'),
                            y: parseInt(data.spend)
                        })
                        ctr.push({
                            x: moment(new Date(data.date)).format('YYYY,MM,DD'),
                            y: parseInt(data.ctr)
                        })
                        cpc.push({
                            x: moment(new Date(data.date)).format('YYYY,MM,DD'),
                            y: parseInt(data.cpc)
                        })
                        clicks.push({
                            x: moment(new Date(data.date)).format('YYYY,MM,DD'),
                            y: parseInt(data.clicks)
                        })
                    })
                    resolve({ impressions: impressions, spend: spend, ctr: ctr, cpc: cpc, clicks: clicks })
                     client.end(console.log('Closed client connection'));
                })

            })
        },
        campaignList() {
            var client = new pg.Client(db.connectionDB());
            client.connect()
            let totalQuery = "SELECT distinct platform,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(ctr) AS ctr, SUM(conversions) AS conversions,SUM(clicks) AS clicks,SUM(post_engagement) as post_engagement,SUM(cpc) as cpc,SUM(spend) as spend,SUM(budget) AS budget from adreporting group by platform";
            let query = "SELECT distinct campaign_id,name,status,platform,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(budget) AS budget,SUM(ctr) AS ctr,SUM(clicks) AS clicks,SUM(post_engagement) as post_engagement,SUM(cpc) as cpc,SUM(spend) as spend from adreporting group by campaign_id,platform,status, name";
            let resultData;
            let allData = [];
            return new Promise(function(resolve, reject) {
                client.query(query, function(err, result) {
                    if (err) reject(err)
                    client.query(totalQuery, function(err, obj) {
                        if (err) reject(err)
                        obj.rows.forEach(function(item) {
                            if (item.platform == 'facebook') {
                                allData.push({
                                    network: "FACEBOOK",
                                    clicks: item.clicks,
                                    impr: item.impressions,
                                    ctr: item.ctr,
                                    spend: item.spend,
                                    budget: item.budget,
                                    avgCpc: item.avgcpc ? (item.avgcpc) : 0,
                                    webConv: "--",
                                    convRate: item.conversions,
                                    cpa: "--",
                                    actions: "--",
                                    socClick: "--",
                                    follow: "--",
                                    replies: "--",
                                    retwe: "--",
                                    likes: "--",
                                    results: "--",
                                    cpr: "--",
                                    avgPos: "--"
                                })
                            } else {
                                allData.push({
                                    network: "GOOGLE",
                                    clicks: item.clicks,
                                    impr: item.impressions,
                                    ctr: item.ctr,
                                    spend: item.spend,
                                    budget: item.budget,
                                    avgCpc: (item.avgcpc / 100000).toFixed(2),
                                    webConv: "--",
                                    convRate: item.conversions,
                                    cpa: "--",
                                    actions: "--",
                                    socClick: "--",
                                    follow: "--",
                                    replies: "--",
                                    retwe: "--",
                                    likes: "--",
                                    results: "--",
                                    cpr: "--",
                                    avgPos: "--"
                                })
                            }
                        })
                        resultData = {
                            result: result.rows,
                            //total: obj.rows,
                            allData: allData
                        }
                        resolve(resultData)
                         client.end(console.log('Closed client connection'));
                    })
                 //client.end(console.log('Closed client connection'));
                })
            })
        },
        loadDashboardChunks(getRange) {
            var client = new pg.Client(db.connectionDB());
            client.connect();
            return new Promise(function(resolve, reject) {
            let totalQuery="SELECT distinct platform,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(ctr) AS ctr, SUM(conversions) AS conversions,SUM(clicks) AS clicks,SUM(conversions) as conversions,SUM(cpc) as cpc,SUM(spend) as spend,SUM(budget) AS budget from adreporting where date >= ($1) AND date<= ($2) group by platform"
            let query = "SELECT distinct date,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(budget) AS budget,SUM(ctr) AS ctr,SUM(clicks) AS clicks,SUM(conversions) as conversions,SUM(cpc) as cpc,SUM(spend) as spend from adreporting where date >= ($1) AND date<= ($2) group by date;";
            client.query(totalQuery, getRange.start_date, function(err, total) {
                if(err) reject(err)
                    client.query(query,getRange.start_date,function(err,result){
                        if(err) reject(err)
                           var dataSet={
                            totalSUM:total.rows,
                            result: result.rows
                           } 
                           resolve(dataSet)
                           client.end(console.log('Closed client connection'));
                    })
            })
        })

        },
        loadDashboardChunksCPC(getRange) {
            var client = new pg.Client(db.connectionDB());
            client.connect();
            return new Promise(function(resolve, reject) {
            let totalQuery="SELECT distinct platform,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(ctr) AS ctr, SUM(conversions) AS conversions,SUM(clicks) AS clicks,SUM(conversions) as conversions,SUM(cpc) as cpc,SUM(spend) as spend,SUM(budget) AS budget from adreporting where date >= ($1) AND date<= ($2) group by platform"
            let query = "SELECT distinct platform,date,SUM(impressions) as impressions,SUM(avgcpc) as avgcpc,SUM(budget) AS budget,SUM(ctr) AS ctr,SUM(clicks) AS clicks,SUM(conversions) as conversions,SUM(cpc) as cpc,SUM(spend) as spend from adreporting where date >= ($1) AND date<= ($2) group by platform,date;"
            client.query(totalQuery, getRange.start_date, function(err, total) {
                if(err) reject(err)
                    client.query(query,getRange.start_date,function(err,result){
                        if(err) reject(err)
                           var dataSet={
                            totalSUM:total.rows,
                            result: result.rows
                           } 
                           resolve(dataSet)
                           client.end(console.log('Closed client connection'));
                    })
            })
        })

        },
        dashboardChunks(getRange, query, type) {
            var client = new pg.Client(db.connectionDB());
            client.connect()
            console.log("==============================dashboardChunks", query)
            return new Promise(function(resolve, reject) {
                var dataSet = [];
                var googleSet = [];
                var facebookSet = [];
                var totalCurr = 0;
                var totalPast = 0;
                var fbTotal = 0;
                var googleTotal = 0;
                client.query(query, getRange.start_date, function(err, currData) {
                    if (err) reject(err)
                    client.query(query, getRange.end_date, function(err, preData) {
                        if (err) reject(err)
                        var current_data = currData.rows;
                        var past_data = preData.rows;
                        console.log("past_datapast_datapast_data",JSON.stringify(current_data))
                        for (var i = 0; i < current_data.length; i++) {
                            if (type == 'impressions') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].impressions)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    fbTotal = fbTotal + parseInt(current_data[i].impressions)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].impressions)
                                }
                                totalPast = totalPast + parseInt(past_data[i].impressions);
                                totalCurr = totalCurr + parseInt(current_data[i].impressions);
                            }
                            if (type == 'clicks') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].clicks)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    fbTotal = fbTotal + parseInt(current_data[i].clicks)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].clicks)
                                }
                                totalPast = totalPast + parseInt(past_data[i].clicks);
                                totalCurr = totalCurr + parseInt(current_data[i].clicks);
                            }
                            if (type == 'spend') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].spend)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    fbTotal = fbTotal + parseInt(current_data[i].spend)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].spend)
                                }
                                totalPast = totalPast + parseInt(past_data[i].spend);
                                totalCurr = totalCurr + parseInt(current_data[i].spend);
                            }
                            if (type == 'cpc') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].cpc)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    fbTotal = fbTotal + parseInt(current_data[i].cpc)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].cpc)
                                }
                                totalPast = totalPast + parseInt(past_data[i].cpc);
                                totalCurr = totalCurr + parseInt(current_data[i].cpc);
                            }
                            if (type == 'ctr') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].ctr)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    fbTotal = fbTotal + parseInt(current_data[i].ctr)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].ctr)
                                }
                                totalPast = totalPast + parseInt(past_data[i].ctr);
                                totalCurr = totalCurr + parseInt(current_data[i].ctr);
                            }
                            if (type == 'conversions') {
                                dataSet.push({
                                    level: '', //moment(new Date(current_data[i].date)).format('YYYY,MM,DD'),
                                    y: parseInt(current_data[i].conversions)
                                })
                                if (current_data[i].platform == 'facebook') {
                                    facebookSet.push({

                                    })
                                    fbTotal = fbTotal + parseInt(current_data[i].conversions)
                                }
                                if (current_data[i].platform == 'google') {
                                    googleTotal = googleTotal + parseInt(current_data[i].conversions)
                                }
                                totalPast = totalPast + parseInt(past_data[i].conversions);
                                totalCurr = totalCurr + parseInt(current_data[i].conversions);
                            }
                        }
                        var actualValue = ((totalCurr - totalPast) / (totalCurr)).toFixed(1);
                        resolve({ dataSet: dataSet, actualValue: actualValue, googleTotal: googleTotal, fbTotal: fbTotal });
                        client.end(console.log('Closed client connection'));
                    })
                })
            })
        },
        googleChunks(getRange, query, platform) {
            console.log(`getrange fpor google yesterday=====${getRange.start_date}.....${getRange.end_date}`)
            var client = new pg.Client(db.connectionDB());
            client.connect()
            console.log("Google CHUNKS Query>>>>>>",query)
            return new Promise(function(resolve, reject) {
                client.query(query, getRange.start_date, function(err, currData) {
                    if (err) reject(err)
                    client.query(query, getRange.end_date, function(err, preData) {
                        if (err) reject(err)
                        if (platform == 'facebook') {
                            var arrayObj = []
                            
                            var cpm = {
                                title: "CPM",
                                rate: (currData.rows[0].cpm / currData.rows[0].numcustomers) ? (currData.rows[0].cpm / currData.rows[0].numcustomers) : 0,
                                growthRate: (parseInt(currData.rows[0].cpm / currData.rows[0].numcustomers - preData.rows[0].cpm/preData.rows[0].numcustomers) / (parseInt(currData.rows[0].cpm / currData.rows[0].numcustomers))).toFixed(2),
                                prev: (preData.rows[0].cpm / preData.rows[0].numcustomers).toFixed(2) ? (preData.rows[0].cpm / preData.rows[0].numcustomers).toFixed(2) : 0
                            };
                            arrayObj.push(cpm)
                            var frequency = {
                                title: "FREQUENCY",
                                rate: currData.rows[0].frequency ? (currData.rows[0].frequency/currData.rows[0].numcustomers).toFixed(2): 0,
                                growthRate: (((currData.rows[0].frequency/currData.rows[0].numcustomers) - (preData.rows[0].frequency/currData.rows[0].numcustomers)) / (currData.rows[0].frequency/currData.rows[0].numcustomers)).toFixed(2),
                                prev: preData.rows[0].frequency ? (preData.rows[0].frequency/preData.rows[0].numcustomers).toFixed(2): 0
                            };
                            // console.log('dekh dhyan se aara h ===>>>>',preData.rows[0].numcustomers,  preData.rows[0].frequency );

                            arrayObj.push(frequency);
                            var click_ctr = {
                                title: "LINK CTR",
                                rate: currData.rows[0].click_ctr ? (currData.rows[0].click_ctr/currData.rows[0].numcustomers).toFixed(2) : 0,
                                growthRate: ((currData.rows[0].click_ctr/currData.rows[0].numcustomers) - (preData.rows[0].click_ctr/preData.rows[0].numcustomers) / (currData.rows[0].click_ctr/currData.rows[0].numcustomers)).toFixed(2),
                                prev: preData.rows[0].click_ctr ? (preData.rows[0].click_ctr/preData.rows[0].numcustomers).toFixed(2) : 0
                            };
                            // console.log('dekh dhyan se aara h ===>>>>', click_ctr.prev );
                            arrayObj.push(click_ctr)
                            var spend = {
                                title: "SPEND",
                                rate: currData.rows[0].spend  ? (currData.rows[0].spend) : 0,
                                growthRate: ((currData.rows[0].spend - preData.rows[0].spend) / (currData.rows[0].spend)).toFixed(2),
                                prev: preData.rows[0].spend  ? (preData.rows[0].spend) : 0
                            };

                            arrayObj.push(spend)
                            var cpc = {
                                title: "CPC",
                                rate: currData.rows[0].cpc ? (currData.rows[0].cpc/currData.rows[0].numcustomers).toFixed(2) : 0,
                                growthRate: ((currData.rows[0].cpc/currData.rows[0].numcustomers) - (preData.rows[0].cpc/preData.rows[0].numcustomers) / (currData.rows[0].cpc/currData.rows[0].numcustomers)).toFixed(2),
                                prev: preData.rows[0].cpc ? (preData.rows[0].cpc/preData.rows[0].numcustomers).toFixed() : 0
                            };
                            console.log('dekh dhyan se aara h ===>>>>', cpc );

                            arrayObj.push(cpc);;
                            var link_clicks = {
                                title: "LINK CLICKS",
                                rate: currData.rows[0].link_clicks ? currData.rows[0].link_clicks : 0,
                                growthRate: (parseInt(currData.rows[0].link_clicks - preData.rows[0].link_clicks) / (parseInt(currData.rows[0].link_clicks))).toFixed(2),
                                prev: preData.rows[0].link_clicks ? preData.rows[0].link_clicks : 0
                            };
                            arrayObj.push(link_clicks)
                            // console.log(`After facebook chunkQuery===>${JSON.stringify(arrayObj)}`);
                            resolve(arrayObj)
                        } else {
                            // console.log(`previousdata+++++++++++++++++++++++++++++++++++++${JSON.stringify(preData)}`);
                            let arrayObj = [],
                                constCurr = currData.rows[0].spend ? currData.rows[0].spend : 0,
                                constPre = preData.rows[0].spend ? preData.rows[0].spend : 0,
                                convCurr = currData.rows[0].conversions ? currData.rows[0].conversions : 0,
                                convPre = preData.rows[0].conversions ? preData.rows[0].conversions : 0,
                                actualValue = convCurr > 0 ? convCurr : 1;
                                costConvcc = constCurr / (convCurr>0?convCurr:0);
                                prevCC = constPre / (convPre > 0 ? convPre : 0 )
                                // console.log(`actualValue====>${actualValue}`)
                                growthRateCost = parseInt(currData.rows[0].spend - preData.rows[0].spend) / (parseInt(currData.rows[0].spend)),
                                growthRateConv = parseInt(currData.rows[0].conversions - preData.rows[0].conversions) / (actualValue);
                                cc= (growthRateConv > 0 ? growthRateConv : 1);
                                growthRateCC = growthRateCost / (growthRateConv > 0 ? growthRateConv : 0)
                                growthRateCCNew =  costConvcc ? ((costConvcc-prevCC) / costConvcc): 0
                                avgcpcCurr = (currData.rows[0].spend) ? (currData.rows[0].spend / currData.rows[0].total_clicks).toFixed(2): 0;
                                avgcpcPre = (preData.rows[0].spend/(100000).toFixed(2)) ? (preData.rows[0].spend/preData.rows[0].total_clicks).toFixed(2): 0;
                                // console.log(`growthrateAvgCPC==========>${growthrateAvgCPC}  avgcpcCurr====>${avgcpcCurr}  avgcpcPre====>${avgcpcPre}`);
                            var avgcpc = {
                                title: "AVG.CPC",
                                rate: (currData.rows[0].spend) ? (currData.rows[0].spend / currData.rows[0].total_clicks).toFixed(2): 0,
                                // rate: (currData.rows[0].avgcpc / (100000)).toFixed(2) ? (currData.rows[0].avgcpc / (100000)).toFixed(2) : 0,
                                // growthRate: (parseInt(currData.rows[0].spend / currData.rows[0].total_clicks - preData.rows[0].spend / preData.rows[0].total_clicks) / parseInt(currData.rows[0].spend / currData.rows[0].total_clicks)).toFixed(2),
                                growthRate: ((avgcpcCurr-avgcpcPre)/avgcpcCurr).toFixed(2),
                                // prev: (preData.rows[0].spend / (100000)).toFixed(2) ? (preData.rows[0].avgcpc / (100000)).toFixed(2) : 0
                                prev: (preData.rows[0].spend/(100000).toFixed(2)) ? (preData.rows[0].spend/preData.rows[0].total_clicks).toFixed(2): 0
                            };
                            arrayObj.push(avgcpc);

                            var conversions = {
                                title: "CONVERSIONS",
                                rate: (currData.rows[0].conversions ? (currData.rows[0].conversions) : 0.00),
                                growthRate: (parseInt(currData.rows[0].conversions - preData.rows[0].conversions) / (actualValue)).toFixed(2),
                                prev: (preData.rows[0].conversions ? preData.rows[0].conversions : 0.00)
                            };
                            arrayObj.push(conversions);
                           
                            // console.log(`arrayObj============+++++++++++++++++++++++++${arrayObj}`);
                            
                            var cost_conv = {
                                title: "COST/CONV",
                                rate: (costConvcc==Infinity?0:costConvcc).toFixed(2),
                                // rate: (constCurr / (convCurr > 0 ? convCurr : 1)).toFixed(2),
                                growthRate : (growthRateCC == Infinity || growthRateCC == -Infinity?'NA':growthRateCC.toFixed(2)),
                                // growthRate: (growthRateCost / (growthRateConv > 0 ? growthRateConv : 0)).toFixed(2),
                                prev: (prevCC==Infinity?0:prevCC).toFixed(2)
                            };
                            arrayObj.push(cost_conv);

                            var spend = {
                                title: "COST",
                                rate: currData.rows[0].spend ? currData.rows[0].spend : 0,
                                growthRate: (parseInt(currData.rows[0].spend - preData.rows[0].spend) / (parseInt(currData.rows[0].spend))).toFixed(2),
                                prev: preData.rows[0].spend ? preData.rows[0].spend : 0
                            };
                            arrayObj.push(spend);
                            // console.log(`ON page load whole chunks values....................${JSON.stringify(arrayObj)}`);
                            resolve(arrayObj)
                            client.end(console.log('Closed client connection'));
                        }
                    })
                })
            })
        },
        graphData(getRange, query, platform) {
            var client = new pg.Client(db.connectionDB());
            client.connect()
            console.log("getRange valiue =========123456",getRange)
            return new Promise(function(resolve, reject) {
                client.query(query, getRange.start_date, function(err, currData) {
                    if (err) reject(err)
                    client.query(query, getRange.end_date, function(err, prevData) {
                        if (err) reject(err)
                        console.log(`currentdata===>${JSON.stringify(currData.rows[0])}.......Previousdata===>${JSON.stringify(prevData.rows[0])}`);
                        if (!currData.rows.length && !prevData.rows.length) {
                            console.log(`=======both length is not zero=======currentdata`);
                            var impre_data = {
                                title: "IMPRESSIONS",
                                data1: 0,
                                down: 0,
                                prevTitle: "Previous",
                                prevData: 0,
                                graphData: [],
                                postGraphData: []
                            };
                            var engage_data = {
                                title: "POST ENGAGEMENT",
                                data1: 0,
                                down: 0,
                                prevTitle: "Previous",
                                prevData: 0,
                                graphData: [],
                                postGraphData: []
                            };
                            var graphModelData = [];
                            // console.log(`impresion graph data=====>${impre_data}...........POST ENGAGEMENT======>${engage_data}`);
                            graphModelData.push(impre_data)
                            graphModelData.push(engage_data)
                            resolve(graphModelData)

                        } else {
                            console.log("data.impressions: ")
                            var countImpre = 1,
                                totalPreImpre = 0,
                                totalCurrImpre = 0,
                                totalpreEngage = 0,
                                postcountImpre = 1,
                                postcountEng = 1,
                                totalEngage = 0,
                                countEngage = 1,
                                graphDataImpre = [],
                                graphDataClicks = [];
                                postGraphDataImpre = [],
                                postGraphDataClicks = [];
                            currData.rows.forEach(function(data) {
                                graphDataImpre.push({
                                    x: countImpre,
                                    y: parseInt(data.impressions)
                                })
                                countImpre = countImpre + 1;
                                totalCurrImpre = totalCurrImpre + parseInt(data.impressions)
                            })
                            currData.rows.forEach(function(data) {
                                graphDataClicks.push({
                                    x: countEngage,
                                    y: parseInt(data.post_engagement)
                                })
                                countEngage = countEngage + 1;
                                totalEngage = totalEngage + parseInt(data.post_engagement);
                            })
                            prevData.rows.forEach(function(data) {
                                postGraphDataImpre.push({
                                    x: postcountImpre,
                                    y: parseInt(data.impressions)
                                })
                                postcountImpre = postcountImpre + 1
                                totalPreImpre = totalPreImpre + parseInt(data.impressions);
                            })
                            prevData.rows.forEach(function(data) {
                                postGraphDataClicks.push({
                                    x: postcountEng,
                                    y: parseInt(data.post_engagement)
                                })
                                postcountEng = postcountEng + 1;
                                totalpreEngage = totalpreEngage + parseInt(data.post_engagement);
                            })
                            console.log(`Impression graph==============>${JSON.stringify(graphDataImpre)}.....postGraphDataClicks ====>${JSON.stringify(postGraphDataImpre)}`);
                            var preImpre = parseInt(prevData.rows[0].impressions) ? parseInt(prevData.rows[0].impressions) : 0,
                                preClick = parseInt(prevData.rows[0].click) ? parseInt(prevData.rows[0].click) : 0;
                            var actualImpre = totalCurrImpre - preImpre;
                            console.log(`Post_engagement graph====>${totalEngage}...totalpreEngage===>${totalpreEngage}`);
                            var impDown = (actualImpre / totalCurrImpre)==-Infinity ? 1: (actualImpre / totalCurrImpre);
                            var impre_data = {
                                title: "IMRESSIONS",
                                data1: (totalCurrImpre).toFixed(2),
                                down: impDown ? (impDown).toFixed(2) : 0,
                                prevTitle: "Previous",
                                prevData: (totalPreImpre).toFixed(2),
                                graphData: graphDataImpre,
                                postGraphData: postGraphDataImpre
                            };
                            var actualPE = totalEngage - totalpreEngage;
                            var peDoown = (actualPE / totalEngage)==-Infinity ? 'NA': (actualPE / totalEngage);
                            var click_data = {
                                title: "POST ENGAGEMENT",
                                data1: (totalEngage).toFixed(2),
                                down: peDoown ? (peDoown).toFixed(2) : 0,
                                prevTitle: "Previous",
                                prevData: (totalpreEngage).toFixed(2),
                                graphData: graphDataClicks,
                                postGraphData: postGraphDataClicks
                            };
                            console.log(`click_data======`, click_data.peDoown, JSON.stringify(click_data.graphData), JSON.stringify(click_data.postGraphData));
                            var graphModelData = [];
                            graphModelData.push(impre_data)
                            graphModelData.push(click_data)
                            resolve(graphModelData);
                             client.end(console.log('Closed client connection'));
                        }
                    })
                })
            })
        },
        adsChunksFilter(getRange, platform, types) {
            console.log(`getRange==>${getRange}, platform====>${platform}, types====>${types}`);
            var client = new pg.Client(db.connectionDB());
            client.connect()
            return new Promise(function(resolve, reject) {
                let query;
                if (types[0] == 'cost_conv') {
                    query = "select SUM(spend) AS spend,SUM(conversions) AS conversions from adreporting WHERE platform='google' AND date >= ($1) AND date<= ($2)";
                } else {
                    query = "select SUM(link_clicks) AS link_clicks, SUM(spend) AS spend, SUM(cpc) AS cpc,SUM(ctr) AS ctr, SUM(frequency) AS frequency, count(*) AS numcountrow, SUM(conversions) AS conversions,SUM(clicks) AS total_clicks, SUM(impressions) AS impression, SUM(cpm) AS cpm from adreporting WHERE platform=" + "'" + platform + "'" + " AND date >= ($1) AND date<= ($2)";
                }
                console.log(platform, getRange.start_date, "======"  ,getRange.end_date, "===============>>>???", query)
                client.query(query, getRange.start_date, function(err, currData) {
                    console.log("Error: ", err)
                    if (err) reject(err)
                    client.query(query, getRange.end_date, function(err, preData) {
                        if (err) reject(err)
                        let arrayObj = [];
                        let filterData;
                        let currentData;
                        let previousData;
                        console.log(`currentdata==>${JSON.stringify(currData.rows[0])}<=======>Previousdata===>${JSON.stringify(preData.rows[0])}`);
                        if (platform == 'facebook') {
                            if (types[0] == 'cpm') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: (currData.rows[0].cpm / currData.rows[0].numcountrow).toFixed(2) ? (currData.rows[0].cpm / currData.rows[0].numcountrow).toFixed(2) : 0,
                                    growthRate: (((currData.rows[0].cpm / currData.rows[0].numcountrow) - (preData.rows[0].cpm/preData.rows[0].numcountrow))/ (currData.rows[0].cpm/currData.rows[0].numcountrow)).toFixed(2),
                                    prev: (preData.rows[0].cpm / preData.rows[0].numcountrow) ? (preData.rows[0].cpm / preData.rows[0].numcountrow).toFixed(2) : 0
                                };
                            }
                            if (types[0] == 'cpc') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: currData.rows[0].cpc ? (currData.rows[0].cpc/currData.rows[0].numcountrow).toFixed(2) : 0,
                                    growthRate: ((currData.rows[0].cpc - preData.rows[0].cpc) / currData.rows[0].cpc).toFixed(2),
                                    prev: preData.rows[0].cpc ? (preData.rows[0].cpc/preData.rows[0].numcountrow).toFixed(2):0
                                };
                            }
                            console.log(`cpc calculation values===> ${filterData}`)
                            if (types[0] == 'frequency') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: currData.rows[0].frequency ? (currData.rows[0].frequency/currData.rows[0].numcountrow).toFixed(2): 0,
                                    growthRate: (((currData.rows[0].frequency/currData.rows[0].numcountrow) - (preData.rows[0].frequency/currData.rows[0].numcountrow)) / (currData.rows[0].frequency/currData.rows[0].numcountrow)).toFixed(2),
                                    prev: preData.rows[0].frequency ? (preData.rows[0].frequency/preData.rows[0].numcountrow).toFixed(2): 0
                                };
                            }
                            // console.log('frequency ====>' ,currData.rows[0].frequency/currData.rows[0].numcountrow ,preData.rows[0].frequency/currData.rows[0].numcountrow);
                            if (types[0] == 'spend') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: currData.rows[0].spend  ? (currData.rows[0].spend) : 0,
                                    growthRate: ((currData.rows[0].spend - preData.rows[0].spend) / (currData.rows[0].spend)).toFixed(2),
                                    prev: preData.rows[0].spend  ? (preData.rows[0].spend) : 0
                                };
                            }
                            if (types[0] == 'ctr') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: currData.rows[0].ctr ? (currData.rows[0].ctr/currData.rows[0].numcountrow).toFixed(2) : 0,
                                    growthRate: ((currData.rows[0].ctr/currData.rows[0].numcountrow) - (preData.rows[0].ctr/preData.rows[0].numcountrow) / (currData.rows[0].ctr/currData.rows[0].numcountrow)).toFixed(2),
                                    prev: preData.rows[0].ctr ? (preData.rows[0].ctr/preData.rows[0].numcountrow).toFixed(2) : 0
                                };
                            }
                            
                            if (types[0] == 'link_clicks') {
                                filterData = {
                                    title: types[0].toUpperCase(),
                                    rate: currData.rows[0].link_clicks ? currData.rows[0].link_clicks : 0,
                                    growthRate: (parseInt(currData.rows[0].link_clicks - preData.rows[0].link_clicks) / (parseInt(currData.rows[0].link_clicks))).toFixed(2),
                                    prev: preData.rows[0].link_clicks ? preData.rows[0].link_clicks : 0
                                };
                            }
                            console.log(`link_click calculation ===========> `,filterData)
                            arrayObj.push(filterData)
                            resolve(arrayObj)
                        } else {
                            if (types[0] == 'avgcpc') {
                                currentData = parseInt(currData.rows[0].spend) ? parseInt(currData.rows[0].spend / currData.rows[0].total_clicks) : 0
                                previousData = parseInt(preData.rows[0].spend) ? parseInt(preData.rows[0].spend / preData.rows[0].total_clicks) : 0
                                var actualValue = currentData > 0 ? currentData : 1;
                                filterData = {
                                    title: "AVG. CPC",
                                    rate: (currData.rows[0].spend) ? (currData.rows[0].spend / currData.rows[0].total_clicks).toFixed(2): 0,
                                    growthRate: ((currentData - previousData) / (actualValue)).toFixed(2),
                                    // growthRate: (currData.rows[0].spend) ? (parseInt(currData.rows[0].spend / currData.rows[0].total_clicks - preData.rows[0].spend / preData.rows[0].total_clicks) / parseInt(currData.rows[0].spend / currData.rows[0].total_clicks)).toFixed(2) : 0,
                                    prev: (preData.rows[0].spend) ? (preData.rows[0].spend/preData.rows[0].total_clicks).toFixed(2): 0
                                    // rate: (currData.rows[0].avgcpc / (100000)).toFixed(2) ? (currData.rows[0].avgcpc / (100000)).toFixed(2) : 0,
                                    // growthRate: ((currentData - previousData) / (actualValue)).toFixed(2),
                                    // prev: (preData.rows[0].avgcpc / (100000)).toFixed(2) ? (preData.rows[0].avgcpc / (100000)).toFixed(2) : 0
                                }
                                // console.log(`type12233445567=========${currData.rows[0].spend}.....${currData.rows[0].total_clicks}......${JSON.stringify(filterData)}`);
                            }
                            if (types[0] == 'conversions') {
                                currentData = parseInt(currData.rows[0].conversions) ? parseInt(currData.rows[0].conversions) : 0
                                previousData = parseInt(preData.rows[0].conversions) ? parseInt(preData.rows[0].conversions) : 0
                                console.log(currentData, previousData)
                                var actualValue = currentData > 0 ? currentData : 1;
                                var growthrateconv = (currentData - previousData / actualValue).toFixed(2);
                                filterData = {
                                    title: "CONVERSIONS",
                                    rate: currData.rows[0].conversions ? currData.rows[0].conversions : 0,
                                    growthRate: (currentData - previousData / actualValue).toFixed(2),
                                    prev: preData.rows[0].conversions ? preData.rows[0].conversions : 0
                                }
                            }
                            if (types[0] == 'cost_conv') {
                                let costCurr = currData.rows[0].spend ? currData.rows[0].spend : 0,
                                    costPre = preData.rows[0].spend ? preData.rows[0].spend : 0,
                                    convCurr = currData.rows[0].conversions ? currData.rows[0].conversions : 0,
                                    convPre = preData.rows[0].conversions ? preData.rows[0].conversions : 0,
                                    prevCC = costPre / (convPre>0?convPre:0);
                                    costConvcc = costCurr / (convCurr>0?convCurr:0);
                                    growthRateCC = ((costConvcc-prevCC)/costConvcc).toFixed(2);
                                    // growthRateCost = parseInt(currData.rows[0].spend - preData.rows[0].spend) / (parseInt(currData.rows[0].spend)),
                                    // growthRateConv = parseInt(currData.rows[0].conversions - preData.rows[0].conversions) / (parseInt(currData.rows[0].conversions));
                                    // growthRateCC = (growthRateCost/growthRateConv).toFixed(2);
                                    // console.log(`growthRateCC=======> ${growthRateCC}   convCurr ${growthRateCost}   costConvcc ${costConvcc}`);
                                filterData = {
                                    title: "COST/ CONV",
                                    rate: (costConvcc==Infinity?0:costConvcc).toFixed(2),
                                    growthRate: (growthRateCC==Infinity||growthRateCC==-Infinity)?'NA':growthRateCC,
                                    prev: (prevCC==Infinity?0:prevCC).toFixed(2)
                                }
                                // console.log(`cost/conv==================> ${JSON.stringify(filterData)}`)
                            }
                            if (types[0] == 'spend') {
                                currentData = parseInt(currData.rows[0].spend) ? parseInt(currData.rows[0].spend) : 0
                                previousData = parseInt(preData.rows[0].spend) ? parseInt(preData.rows[0].spend) : 0
                                var actualValue = currentData > 0 ? currentData : 1;
                                console.log("currentData", currentData, "previousData", previousData)
                                filterData = {
                                    title: "COST",
                                    rate: currData.rows[0].spend ? currData.rows[0].spend : 0,
                                    growthRate: ((currentData - previousData) / (actualValue)).toFixed(2),
                                    prev: preData.rows[0].spend ? preData.rows[0].spend : 0
                                }
                            }
                           arrayObj.push(filterData)
                        //     console.log(`@@@@@@@@@@@@@@@00000000000${JSON.stringify(arrayObj)}`);
                            resolve(arrayObj);
                            client.end(console.log('Closed client connection'));
                        }
                    })
                })
            })
        }
    }