var pg = require('pg'),
    async = require('async'),
    moment = require('moment'),
    db = require('./db_connection.js'),
    config = require('./config'),
    format = require('pg-format');
const request = require('request');
// const account= "1406727676324448";
// const account = "10151297433458641";  
const account ="152071905444284";
module.exports = {
    getDateRangeFilter(date_range) {
        var currDate = moment(new Date()).format('YYYY-MM-DD');
        switch (date_range) {
            case "last_30_days":
                var last_30_days = moment(currDate, "YYYY-MM-DD").subtract(30, 'days').format('YYYY-MM-DD');
                var last_to_last_30_days = moment(last_30_days, "YYYY-MM-DD").subtract(30, 'days').format('YYYY-MM-DD');
                var start_date = [last_30_days, currDate];
                var end_date = [last_to_last_30_days, last_30_days];
                console.log('start date',start_date,' ', end_date)
                break;
            case "today":
                var yesterday = moment(currDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
                var start_date = [currDate, currDate];
                var end_date = [yesterday, yesterday];
                console.log('start date',start_date,' ', end_date)

                break;
            case "yesterday":  
                var yesterday = moment(currDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
                var prev_yesterday = moment(yesterday, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
                // var start_date = [yesterday, currDate];   //[ '2019-05-08', '2019-05-09' ] 
                // var end_date = [prev_yesterday, yesterday]   //[ '2019-05-07', '2019-05-08' ]
                var start_date = [yesterday,yesterday];   //[ '2019-05-08', '2019-05-09' ] 
                var end_date = [prev_yesterday,prev_yesterday];
                // var end_date = [ yesterday, prev_yesterday]
                console.log('start date',start_date,' ', end_date, ' ', date_range);

                break;
            case "this_month":
                var startMonth = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
                var startOfLastMonth = moment().subtract(1, 'months').date(1).format("YYYY-MM-DD") //"2019-01-01" start of last month
                var endOfLastMonth = moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
                var start_date = [startMonth, currDate];
                var end_date = [startOfLastMonth, endOfLastMonth]
                console.log('start date',start_date,' ', end_date)

                break;
            case "this_week":
                var thisWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
                var lastWeek = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
                var yesterday = moment(thisWeek, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD');
                var start_date = [thisWeek, currDate];
                var end_date = [lastWeek, yesterday];
                console.log('start date',start_date,' ', end_date)  //[ '2019-05-06', '2019-05-09' ]   [ '2019-04-29', '2019-05-05' ]


                break;
            case "quarter":
                var startQuarter = moment().startOf('month').format('YYYY-MM-DD'); //"2019-02-01" start of month
                var startOfQuarterMonth = moment().subtract(3, 'months').date(1).format("YYYY-MM-DD") //"2019-01-01" start of last month
                var endOfLastMonth = moment(new Date()).subtract(6, 'months').endOf('month').format('YYYY-MM-DD'); //"2019-01-31" end of last month
                var start_date = [startOfQuarterMonth, startQuarter];
                var end_date = [endOfLastMonth, startOfQuarterMonth]
                break;
            default:
                var start_date = [currDate, currDate];
                var end_date = [currDate, currDate];
        };
        var rangeFilter = {
            start_date: start_date,
            end_date: end_date
        }
        console.log("==========================================range"+JSON.stringify(rangeFilter));
        return rangeFilter;
    },
    executeAsyncMainTask() {
        async function executeAsyncTask(startDate, endDate) {
            console.log(`startDate, endDate ===> ${startDate} ${endDate}`);
            const storeIDS = await getFBCampaign()//Get all campaigns from FB.
            // const udatedDB = await updateDB(storeIDS.data)// Not in use now.
            const camIDS = await getCampaignIDS(storeIDS.data)
            const campaignData = await getFacebookData(camIDS, startDate, endDate)
            // console.log("===========================26thaprilFBdata",JSON.stringify(campaignData))
            // console.log("===========================26thaprilFBdataLength"+ Object.keys(campaignData.data).length)

            const storeData = await parseData(campaignData)
            // console.log("===========================26thaprilFBdataPARSE",JSON.stringify(storeData))

            const insertPGSQL = await insertInPGSQL(storeData)
            // const updateCampaign = await updateCampaignStatus(storeIDS.data)
            const updateCampaign = await deleteDuplicateCampaign(endDate)
            console.log("===========================26thAprilPGdata",updateCampaign)

            var result = {
                status_code: 200,
                message: "successfully done"
            }
            console.log('result', result)
            return result;
        }

        function getFBCampaign() {
            return new Promise(function(resolve, reject) {
                var URL = "https://graph.facebook.com/v3.2/act_"+account+"/campaigns?access_token=" + config.accessToken + "&pretty=0&fields=status,name&limit=2000"
                request(URL, {
                    json: true
                }, (err, res, body) => {
                    if (err) {
                        reject(err)
                        console.log("Error occured.", err);
                    } else {
                        console.log(`result fb data ===> `);
                        let filterdata = [];
                        if(res.body.data!= undefined){
                            let data = res.body.data;
                            filterdata = data.filter((v,i)=>{
                                if(v['status'] == 'ACTIVE'){
                                    return v;
                                }
                            })
                        }
                        res.body.data = filterdata;
                        var size = Object.keys(res.body.data).length;
                        // console.log(`result fb campaign => ${JSON.stringify(filterdata)}`);
                        resolve(res.body)
                    }
                });
            })
        }

        /*  function updateDB(FBIds) {
            console.log("Called", FBIds.length)
            var client = new pg.Client(db.connectionDB());
            client.connect();
            counter = 0;
            return new Promise(function(resolve, reject) {
                FBIds.forEach(function(ele) {
                    counter = counter + 1;
                    var insertQuery = "SELECT campaign_id from campaign_ids WHERE campaign_id=" + "'" + ele.id + "'";
                    client.query(insertQuery, function(err, data) {
                        if (err) {
                            reject(err)
                        } else if (data.rows.length) {
                            console.log('Found...')
                        } else {
                            var insertQuery = `INSERT into campaign_ids(name,campaign_id,status) values($1, $2,$3) `;
                            client.query(insertQuery, [ele.name, ele.id, ele.status], function(err, data) {
                                if (err) {
                                    console.log("Err: " + err)
                                } else {
                                    console.log("Injested")
                                }
                            })
                        }
                        if (counter == FBIds.length) {
                            resolve("Done")
                        }
                    })
                })
            });
        }
*/
        function getCampaignIDS(campIDS) {
            return new Promise(function(resolve, reject) {
                var cids = [];
                campIDS.forEach(function(dataId) {
                    cids.push(dataId.id)
                })
                console.log("Total size: ", cids.length)
                resolve(cids);
            }).catch(error=>{
                console.log(`error get campaign => ${error}`);
            })
        }

        function updateCampaignStatus(campaignsIDS) {
            var client = new pg.Client(db.connectionDB());
            //client.connect();
            var counts = 0;
            return new Promise(function(resolve, reject) {
                client.connect();
                campaignsIDS.forEach(function(ele) {
                    counts = counts + 1;
                    // var query = "UPDATE adreporting SET status=" + "'" + ele.status + "'" + " WHERE campaign_id=" + "'" + ele.id + "'" + "AND platform='facebook'";
                    var query = "delete from adreporting WHERE date='2019-05-15' AND platform='facebook'";
                    client.query(query, function(err, result) {
                        if (err) reject(err)
                        if (campaignsIDS.length == counts)
                            console.log(`campaign length ===>`, query);
                            resolve("Updates Done.")
                    })
                })
            })
        }

        function deleteDuplicateCampaign(endDate){
            console.log(`endDate=====>${endDate}`);
            var client = new pg.Client(db.connectionDB());
            return new Promise(function(resolve, reject) {
                client.connect();
                var query = "delete from adreporting WHERE date='" +endDate+ "' AND platform='facebook'";
                client.query(query, function(err, result) {
                    if (err) reject(err)
                        console.log(`campaign length ===>`, query);
                        resolve("Updates Done.");
                })
            })
        }
        function getFacebookData(ids, startDate, endDate) {
            return new Promise(function(resolve, reject) {
                /*
                 * Using facebook graph APIs.
                 * Fetching campaign insights data from facebook.
                 * Getting Analytics data from facebook marketing APIs.
                 * Parsing the data as per the requirments.
                 * Storing data into PGSQL by calling "insertCampaignData" function.
                 */
                var key_fields = ["inline_post_engagement", "clicks", "spend", "frequency", "inline_link_click_ctr", "impressions", "inline_link_clicks", "reach", "cost_per_unique_click", "cpc", "cpm", "unique_clicks", "unique_ctr"]
                var a = JSON.stringify(ids);
                var range = `{"since":${startDate},"until":${endDate}}`;
                console.log("===============range FB data"+range);
                var queryString = 'https://graph.facebook.com/v3.1/act_'+account+'/insights?access_token=' + config.accessToken+ '&fields=["results","inline_post_engagement","clicks","spend","frequency","inline_link_click_ctr","campaign_name","campaign_id","account_id","impressions","inline_link_clicks","reach","cost_per_unique_click","cpc","cpm","unique_clicks","unique_ctr"]&level=campaign&limit=5000&time_range=' + range + '&filtering=[{"field":"campaign.delivery_info","operator":"IN","value":["active","archived","completed","inactive","limited","not_delivering","not_published","pending_review","permanently_deleted","recently_completed","recently_rejected","rejected","scheduled"]},{"field":"campaign.id","operator":"IN","value":' + a + '}]&_reqName=adaccount/insights&_priority=HIGH'
                request(queryString, {
                    json: true
                }, (err, res, body) => {
                    if (err) {
                        reject(err)
                        console.log("Error occured.", err);
                    } else {
                        console.log("RAW DATA================fb data rows length"+JSON.stringify(res.body))
                        resolve(res.body)
                    }
                });
            });
        }

        function parseData(campData) {
            return new Promise(function(resolve, reject) {
                //var insertQuery = `SELECT campaign_id from campaign_ids`;
                var campaignsList = [];
                campData.data.forEach(function(campaigns) {
                    campaignsList.push({
                        appid: parseInt(campaigns.account_id),
                        campaign_id: parseInt(campaigns.campaign_id),
                        name: campaigns.campaign_name,
                        post_engagement: campaigns.inline_post_engagement ? parseInt(campaigns.inline_post_engagement) : 0,
                        spend: campaigns.spend ? parseFloat(campaigns.spend) : 0,
                        impressions: campaigns.impressions ? parseInt(campaigns.impressions) : 0,
                        frequency: campaigns.frequency ? parseFloat(campaigns.frequency) : 0,
                        platform: 'facebook',
                        clicks: campaigns.impressions ? parseInt(campaigns.impressions) : 0,
                        link_clicks: campaigns.inline_link_clicks ? parseInt(campaigns.inline_link_clicks) : 0,
                        ctr: campaigns.inline_link_click_ctr ? parseFloat(campaigns.inline_link_click_ctr) : 0,
                        reach: campaigns.reach ? parseInt(campaigns.reach) : 0,
                        unique_clicks: campaigns.unique_clicks ? parseInt(campaigns.unique_clicks) : 0,
                        cost_per_unique_click: campaigns.cost_per_unique_click ? parseInt(campaigns.cost_per_unique_click) : 0,
                        cpc: campaigns.cpc ? (campaigns.cpc) : 0,
                        cpm: campaigns.cpm ? parseInt(campaigns.cpm) : 0,
                        avgcpc: 0,
                        status: "",
                        date: campaigns.date_start
                    })
                    // console.log(`campaignsList========>`, campaignsList);
                    resolve(campaignsList)
                })
            });
        }

        function insertInPGSQL(dataList) {
            var client = new pg.Client(db.connectionDB());
            client.connect()
            return new Promise(function(resolve, reject) {
                var count = 0;
                var limit = dataList.length;
                dataList.forEach(function(item) {
                    count = count + 1;
                    var insertQuery = `INSERT INTO Adreporting(appid,campaign_id, name,spend,impressions,post_engagement,frequency, link_clicks,ctr,clicks,reach,unique_clicks,cost_per_unique_click,cpc,cpm,status,platform,avgcpc,date) values($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19)`;
                    client.query(insertQuery, [item.appid, item.campaign_id, item.name, item.spend, item.impressions, item.post_engagement, item.frequency, item.link_clicks, item.ctr, item.clicks, item.reach, item.unique_clicks, item.cost_per_unique_click, item.cpc, item.cpm, item.status, item.platform, item.avgcpc, item.date], (error, data) => {
                        if (error) {
                            //reject(err)
                            console.log("Error: ", error);
                        } else {
                            console.log("Inserted");
                        }
                    });
                    if (count == limit) {
                        console.log("Done!", item.date);
                    }
                })
                resolve("Done")
                //This is explanation to how resolve promise into forEach block
            })
        }
        var cron = require('node-cron');
        //Cron set for everyday @ 1AM   */20 * * * * * 
        var currentDate = moment(new Date('2019-05-22')).format('YYYY-MM-DD');
            var stDate = `"${currentDate}"`;
            var enDate = `"${currentDate}"`;
            date = currentDate;
            console.log('running a task @ ', stDate, enDate, date);
            executeAsyncTask(stDate, enDate)
        // cron.schedule('*/10 * * * *', () => {
        //     var currentDate = moment(new Date('2019-04-24')).format('YYYY-MM-DD');
        //     var stDate = `"${currentDate}"`;
        //     var enDate = `"${currentDate}"`;
        //     date = currentDate;
        //     console.log('running a task @ ', stDate, enDate, date);
        //     executeAsyncTask(stDate, enDate)
        // });
    },
    createAdReporting() {
        let cleateQuery = `CREATE TABLE IF NOT EXISTS Adreporting(
        appid INT8 NULL,
        campaign_id INT8 NULL,
        name VARCHAR(250),
        spend DECIMAL(10,2) NULL,
        budget DECIMAL(10,2) NULL,
        impressions INT8 NULL,
        post_engagement INT8 NULL,
        frequency DECIMAL(10,2) NULL,
        link_clicks INT8 NULL,
        platform VARCHAR(250),
        ctr DECIMAL(10,2) NULL,
        clicks INT4 NULL,
        conversions DECIMAL(10,2) NULL,
        reach INT4 NULL,
        unique_clicks INT4 NULL,
        cost_per_unique_click DECIMAL(10,2),
        cpc float(7),
        cpm float(7),
        avgcpc DECIMAL(10,2) NULL,
        status VARCHAR(150),
        date date NULL);`
        client.query(cleateQuery, (error, result) => {
            if (error) {
                console.log(`CREATE query error => ${JSON.stringify(error)}`);
            }
            console.log("Table Created!", result)
        });
    },
    createCampaignIDS() {
        var client = new pg.Client(db.connectionDB());
        client.connect()
        var queryIDS = `create TABLE IF NOT EXISTS campaign_ids(name varchar(250),campaign_id INT8 NULL);`
        client.query(queryIDS, (error, result) => {
            if (error) {
                console.log(`Error => ${JSON.stringify(error)}`);
            }
            console.log("Table Created!", result)
        });
    },
    injestCampaignIDS() {
        var client = new pg.Client(db.connectionDB());
        client.connect()
        var queryString = "https://graph.facebook.com/v3.2/act_1406727676324448/campaigns?access_token=EAASQyNsn008BANOY9ttHQp0FmRoAzP1F8cnm0R3T3ZB12DYWFo2EYeNCQR07gdJWMioggZCS5iXnjVU1HBgxeA1IXVkBygSCe3ptdPT2YLIDZAebyJUKQ2LyKjTmZBzF7yXK3ae8WS9TTeBz20FOMRDZBz4Ny34uN0bgZBIgDin7LYh0TDGISvznwmCxEWMnAZD&pretty=0&fields=status,name&limit=1000";
        request(queryString, {
            json: true
        }, (err, res, body) => {
            if (err) {
                reject(err)
                console.log("Error occured.", err);
            } else {
                res.body.data.forEach(function(ele) {
                    var insertQuery = `INSERT into campaign_ids(name,campaign_id,status) values($1, $2,$3) `;
                    client.query(insertQuery, [ele.name, ele.id, ele.status], function(err, data) {
                        if (err) {
                            console.log("Err: " + err)
                        } else {
                            console.log("Injested")
                        }

                    })
                })
            }
        });
    },
    insertInPGSQL(dataList) {
        var client = new pg.Client(db.connectionDB());
        client.connect()
        
        var count = 0;
        var limit = dataList.length;

        
        dataList.forEach(function(item) {
            console.log(`before inserting into PGSQL in common file =================>`);
            count = count + 1;
            var insertQuery = `INSERT INTO Adreporting(appid,campaign_id, name,spend,budget,impressions,post_engagement,frequency, link_clicks,ctr,clicks,reach,unique_clicks,cost_per_unique_click,cpc,cpm,status,platform,avgcpc,conversions,date) values($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19,$20,$21)`;
           try{
                client.query(insertQuery, [item.appid, item.campaign_id, item.name, item.spend, item.budget, item.impressions, item.post_engagement, item.frequency, item.link_clicks, item.ctr, item.clicks, item.reach, item.unique_clicks, item.cost_per_unique_click, item.cpc, item.cpm, item.status, item.platform, item.avgcpc, item.conversions, item.date], (error, result) => {
                    console.log('error comes due to =========>>')
                    if (error) {
                        //reject(err)
                        console.log(`INSERT query error => ${error}`);
                    } else {
                        console.log('result after pg insertion =>>>>>>')
                    }
                });
            }catch(e){
                console.log('error comes due to in pgql query=========>>',e)
            }
            if (count == limit) {
                console.log("Processing done!" + item.date);
            }
        })
    }
}

//prod inserttopg function 6th may

// insertInPGSQL(dataList) {
//     var client = new pg.Client(db.connectionDB());
//     client.connect()
//     //console.log("dataList"+dataList.length)
//     //return new Promise(function(resolve, reject) {
//     var count = 0;
//     var limit = dataList.length;
//     dataList.forEach(function(item) {
//         //console.log("Inside the inner loop"+item.date)
//         count = count + 1;
//         //client.query('SELECT * from Adreporting WHERE campaign_id=($1) AND date=($2)', [item.campaign_id, item.date], (error, result) => {
//         //if (error) {
//         //reject(err)
//         // console.log("Finding Error: ", error)
//         //} else if (!result.rows.length) {
//         var insertQuery = `INSERT INTO Adreporting(appid,campaign_id, name,spend,budget,impressions,post_engagement,frequency, link_clicks,ctr,clicks,reach,unique_clicks,cost_per_unique_click,cpc,cpm,status,platform,avgcpc,conversions,date) values($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19,$20,$21)`;
//         client.query(insertQuery, [item.appid, item.campaign_id, item.name, item.spend, item.budget, item.impressions, item.post_engagement, item.frequency, item.link_clicks, item.ctr, item.clicks, item.reach, item.unique_clicks, item.cost_per_unique_click, item.cpc, item.cpm, item.status, item.platform, item.avgcpc, item.conversions, item.date], (error, result) => {
//             if (error) {
//                 //reject(err)
//                 console.log(`${JSON.stringify(item)},INSERT query error => ${JSON.stringify(error)}`);
//             } else {
//                 //console.log(limit+"Inserted..."+item.date)
//             }
//         });
//         //} else {
//         // console.log("Updated!");
//         /*var query = 'UPDATE adcampaign set impressions=' + item.impressions + ',spend=' + item.spend + ',reach=' + item.reach + ',clicks=' + item.clicks + ',cost_per_unique_click=' + item.cost_per_unique_click + ',cpm=' + item.cpm + ',post_engagement=' + item.post_engagement + ',cpc=' + item.cpc + ' WHERE campaign_id=' + item.campaign_id;
//         client.query(query, (err, result) => {
//             if (err)
//                 console.log(query, "Error: ", err);
//             //console.log("Updated! ");
//         })*/
//         //}
//         //})
//         if (count == limit) {
//             console.log("Processing done!" + item.date);

//         }
//     })
//     //resolve("Done")
//     //})
// }