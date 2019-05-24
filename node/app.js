var express = require('express');
var app = express();
// var cron = require('node-cron');
const AdwordsReport = require('node-adwords').AdwordsReport;
const AdwordsAuth = require('node-adwords').AdwordsAuth;
var moment = require('moment');
var convert = require('xml-js');
var config = require('./config');
var async = require('async');
var dashboardQuery = require('./dashboardQuery.js');
var common = require('./common');
var db = require('./db_connection.js');
var pg = require('pg');
format = require('pg-format');
const jwt = require('jsonwebtoken')
const request = require('request');
var port = process.env.PORT || 8080;

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port);
console.log(`Running on port ${port}`);
//calling cron job to update facebook campaign.
// common.executeAsyncMainTask();
//common.injestCampaignIDS();
//common.createCampaignIDS();
//common.createAdReporting()
executeAsyncGoogleAd();
//googleAd()
// This function is for filter the campain overview and ads overview.
// This is do the filter data as per the platform(google/facebook)
// Pass Date Range.


app.get('/api/v2/ad_reporting/:source/:type/:date_range/:attributes', function(req, res, next) {
    var platform;
    var attributes = req.params.attributes.split(",");
    var endMonth = moment(new Date()).endOf('month').format('YYYY-MM-DD');
    let commonQuery;
    if (req.params.type == "six_chunks" && req.params.source == 'common') {
        var dashboardChunks = common.getDateRangeFilter(req.params.date_range);
        commonQuery = "select distinct date,platform, SUM(" + req.params.attributes + ") as " + req.params.attributes + " from adreporting where date >= ($1) AND date<= ($2) group by date,platform";
        async function dashboardData() {
            var metricsGraph = await dashboardQuery.dashboardChunks(dashboardChunks, commonQuery, req.params.attributes);
            res.send({
                status_code: 200,
                message: "successful",
                result: metricsGraph
            });
        }
        dashboardData()
    }
    if (req.params.type == "FILTERDASBOARDCHUNKS") {
        async function dashboardData() {
            commonQuery = "select distinct date,platform, SUM(" + req.params.attributes + ") as " + req.params.attributes + " from adreporting where date >= ($1) AND date<= ($2) group by date,platform";
            let dashboard_chunks = await dashboardQuery.dashboardChunks(common.getDateRangeFilter(req.params.date_range), commonQuery, req.params.attributes);
            var result = {
                status_code: 200,
                message: "successfully done",
                CHUNKS: dashboard_chunks
            }
            res.send(result);
        }
        dashboardData()
    }
    if (req.params.source == 'common' && attributes.includes('metric_graph')) {
        platform = 'facebook';
        commonQuery = "select distinct date, SUM(impressions) as impressions,SUM(clicks) as clicks,SUM(spend) as spend, SUM(cpc) as cpc,SUM(ctr) as ctr from adreporting where platform =" + "'" + platform + "'" + " AND date >= ($1) AND date<= ($2) group by date";
        async function dashboardData() {
            var metricsGraph = await dashboardQuery.dashboardData(commonQuery, endMonth);
            res.send({
                status_code: 200,
                message: "successful",
                result: metricsGraph
            });
        }
        dashboardData()
    }
    /*else {
           console.log("Ellllllllllllllllllllllllllllll")
            platform = req.params.source;
            commonQuery = "select distinct date, SUM(impressions) as impressions,SUM(clicks) as clicks,SUM(spend) as spend, SUM(cpc) as cpc,SUM(ctr) as ctr from adreporting where platform =" + "'" + platform + "'" + " AND date >= ($1) AND date<= ($2) group by date";
            async function dashboardData() {
                var metricsGraph = await dashboardQuery.dashboardData(commonQuery, endMonth);
                res.send({
                    status_code: 200,
                    message: "successful",
                    result: metricsGraph
                });
            }
            dashboardData()
       }*/

})

app.get('/api/v1/ad_reporting/chunks_filter/:platforms/:date_range/:tags', function(req, res, next) {

    var getRange = common.getDateRangeFilter(req.params.date_range);
    var platform = req.params.platforms;
    async function getCampaignFilter() {
        var filterData = await dashboardQuery.adsChunksFilter(getRange, platform, req.params.tags.split(","))
        console.log("filterData", filterData)
        res.send({
            status_code: 200,
            message: "successful",
            result: filterData
        });
    }
    getCampaignFilter()
})

app.get('/api/v1/ad_reporting/common_filter/:platforms/:date_range/:tags', function(req, res, next) {
    console.log("=================TAGS: ", req.params.tags)
    let platform = req.params.platforms;
    console.log("=================TAGS: ", req.params.tags == 'POSTENG_GRAPH' || req.params.tags == 'IMPGRAPH' && platform == 'facebook' || platform == 'google' && req.params.tags != 'nofilter')
    let getRange = common.getDateRangeFilter(req.params.date_range);
    console.log("========================================>"+getRange);
    let graphQuery;
    if (req.params.tags == 'CTRKEYBOARD' || req.params.tags == 'CAMPAIGNS_OVERVIEW' || req.params.tags == 'ADS_OVERVIEW') {
        console.log("CAMPAIGNS_OVERVIEW==============CTRKEYBOARD=====================ADS_OVERVIEW")
        var query = "SELECT distinct campaign_id,name,SUM(impressions) as impressions,SUM(cpc) as cpc,SUM(ctr) as ctr,SUM(spend) as spend from adreporting WHERE platform=" + "'" + platform + "'" + " AND date >= ($1) AND date<= ($2) group by campaign_id, name";
    }
    async function getChunksFilter() {
        if (req.params.tags == 'DASHBOARD') {
            // console.log("DASHBOARD")
            filterData = await dashboardQuery.campaignList();
            res.send({
                status_code: 200,
                message: "successful",
                result: filterData
            });
        }
        if (req.params.tags == 'POSTENG_GRAPH' || req.params.tags == 'IMPGRAPH') {
            console.log("POSTENG_GRAPH || IMPGRAPH")
            graphQuery = graphQuery = "SELECT distinct date, SUM(impressions) AS impressions,SUM(post_engagement) AS post_engagement from adreporting WHERE platform=" + "'" + platform + "'" + " AND date >= ($1) AND date<= ($2) group by date";
            filterData = await dashboardQuery.graphData(getRange, graphQuery, req.params.platforms)
            console.log(`Data impression graph google===========>`);
            res.send({
                status_code: 200,
                message: "successful",
                result: filterData
            });
        }
        if (req.params.tags == 'CTRKEYBOARD' || req.params.tags == 'CAMPAIGNS_OVERVIEW' || req.params.tags == 'ADS_OVERVIEW') {
            console.log("CTRKEYBOARD || CAMPAIGNS_OVERVIEW || ADS_OVERVIEW")
            filterData = await dashboardQuery.campaignOverview(common.getDateRangeFilter(req.params.date_range), query, platform)
            res.send({
                status_code: 200,
                message: "successful",
                result: filterData
            });
        }
        if (req.params.platforms == 'facebook' && req.params.tags == 'nofilter') {
            console.log("FACEBOOK  && nofilter")
            platform = 'facebook';
            chunksQuery = `select count(*) AS numcustomers,SUM(cpm) AS cpm,SUM(cpc) AS cpc, SUM(frequency) AS frequency, SUM(spend) AS spend, SUM(link_clicks) AS link_clicks, SUM(ctr) AS click_ctr from adreporting WHERE platform='facebook' AND date >= ($1) AND date<= ($2)`;
            graphQuery = "SELECT distinct date,SUM(impressions) as impressions,SUM(post_engagement) as post_engagement,SUM(cpc) as cpc,SUM(spend) as spend from adreporting WHERE platform='facebook' AND date >= ($1) AND date<= ($2) group by date";
            campaignQuery = `SELECT distinct campaign_id,name,SUM(impressions) as impressions,SUM(cpc) as cpc,SUM(ctr) as ctr,SUM(spend) as spend from adreporting WHERE platform='facebook' AND date >= ($1) AND date<= ($2) group by campaign_id, name`;
            // SELECT distinct campaign_id,name,SUM(impressions) as impressions,SUM(cpc) as cpc,SUM(ctr) as ctr,SUM(spend) as spend from Adreporting WHERE platform='facebook' AND date >= '2019-04-23' AND date <= '2019-04-23'group by campaign_id, name
            console.log("Debugger 1 =>" + campaignQuery)
            const CAMPAIGNS_OVERVIEW = await dashboardQuery.campaignOverview(getRange, campaignQuery, platform)
            const CAMPAIGN_CHUNKS = await dashboardQuery.googleChunks(getRange, chunksQuery, platform)
            const GRAPH_DATA = await dashboardQuery.graphData(getRange, graphQuery, platform)
            var result = {
                status_code: 200,
                message: "successfully done",
                CAMPAIGNS_OVERVIEW: CAMPAIGNS_OVERVIEW,
                CAMPAIGN_CHUNKS: CAMPAIGN_CHUNKS,
                GRAPH_DATA : GRAPH_DATA
            }
            console.log(`result for facebook all query===================>`);
            res.send(result);
        }
        if (req.params.platforms == 'google' && req.params.tags == 'nofilter') {
            console.log("GOOGLE  && nofilter")
            platform = 'google';
            chunksQuery = "select SUM(avgcpc) AS avgcpc,SUM(conversions) AS conversions, SUM(spend) AS spend, SUM(clicks) AS total_clicks from adreporting WHERE platform='google' AND date >= ($1) AND date<= ($2)";
            graphQuery = "SELECT distinct date, SUM(clicks) AS click, SUM(impressions) AS impressions,SUM(post_engagement) AS post_engagement from adreporting WHERE platform='google' AND date >= ($1) AND date<= ($2) group by date";
            campaignQuery = "SELECT distinct campaign_id,name,SUM(impressions) as impressions,SUM(cpc) as cpc,SUM(ctr) as ctr,SUM(spend) as spend from adreporting WHERE platform='google' AND date >= ($1) AND date<= ($2) group by campaign_id,name";
            // console.log('new result for compaign-------------inside getChunkFilter')
            const CAMPAIGNS_OVERVIEW = await dashboardQuery.campaignOverview(getRange, campaignQuery, platform)
            const CAMPAIGN_CHUNKS = await dashboardQuery.googleChunks(getRange, chunksQuery, platform)
            const GRAPH_DATA = await dashboardQuery.graphData(getRange, graphQuery, platform)
            var result = {
                status_code: 200,
                message: "successfully done",
                CAMPAIGNS_OVERVIEW: CAMPAIGNS_OVERVIEW,
                CAMPAIGN_CHUNKS: CAMPAIGN_CHUNKS,
                GRAPH_DATA: GRAPH_DATA
            }
            console.log('new result for compaign',result)
            res.send(result);
        }
        if (req.params.tags == "DASBOARDCHUNKS") {
            let dashboard_chunks = await dashboardQuery.loadDashboardChunks(getRange);
            var result = {
                status_code: 200,
                message: "successfully done",
                CHUNKS: dashboard_chunks
            }
            res.send(result);
        }
        if (req.params.tags == "DASBOARDCHUNKS_CPC") {
            let dashboard_chunks = await dashboardQuery.loadDashboardChunksCPC(getRange);
            var result = {
                status_code: 200,
                message: "successfully done",
                CHUNKS: dashboard_chunks
            }
            res.send(result);
        }
    }
    getChunksFilter()
})

async function executeAsyncGoogleAd() {
    
    // before changing cron is */5 * * * * *
    // cron.schedule('*/5 * * * *',  async () => {
        
    // })

    let report = await new AdwordsReport({
        developerToken: config.googleCredentials.developerToken,
        userAgent: config.googleCredentials.userAgent,//semusi
        clientCustomerId: config.googleCredentials.clientCustomerId,//'677-392-7783',
        client_id: config.googleCredentials.client_id,
        client_secret: config.googleCredentials.client_secret,
        refresh_token: config.googleCredentials.refresh_token
    });
    // console.log(`report===============+++++++++++++++++++++++++++++> ${JSON.stringify(report)}`);
    var arrObj = [0];
    async.forEach(arrObj, (date, asyncCb) => {
        console.log(`Going for... ${date}`);
        var currDate = moment(new Date('2019-05-23')).format('MM/DD/YYYY');
        report.getReport('v201809', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['AverageCpc', 'Ctr', 'Amount', 'Engagements', 'AveragePosition', 'Conversions', 'CampaignName', 'CampaignId', 'Impressions', 'Clicks', 'Cost', 'CampaignStatus'],
            dateRangeType: 'CUSTOM_DATE', //defaults to CUSTOM_DATE. startDate or endDate required for CUSTOM_DATE
            startDate: new Date(currDate), //2018-11-01
            endDate: new Date(currDate), // new Date(),//2018-11-01
            format: 'XML'//defaults to CSV
            // filters: [
            //     {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED']}
            // ]
        }, (error, report) => {
            console.log('xml ata', report)
            var result = convert.xml2json(report, {
                compact: true,
                spaces: 4
            });
            var data = JSON.parse(result)
            console.log(`google data report XML++++++++++++++++++++++++++++++++++++++> ${JSON.stringify(data.report.table.row)}`);
            let filteredData = [];
            if(data.report.table.row != undefined){
                let row = data.report.table.row;
                filteredData = row.filter((v,i)=>{
                    if(v['_attributes'].campaignState == 'enabled'){
                        return v;
                    }
                })
            }
        data.report.table.row = filteredData;
        insertGoogleData(data.report.table, currDate)
        currDate = 0;
        asyncCb()
    });

    }, (error, asyncResult) => {
        console.log("process done", error);
        //process.exit(0)
        //resolve("Done")
    })

}


function insertGoogleData(campData, new_date) {
    var campaignsList = [];
    console.log("Send to Injest File..."+new_date)
    campData.row.forEach(function(campaigns) {
        campaignsList.push({
            appid: 6773927783,
            campaign_id: parseInt(campaigns._attributes.campaignID),
            name: campaigns._attributes.campaign,
            spend: campaigns._attributes.cost ? parseFloat(campaigns._attributes.cost / 1000000) : 0,
            budget: campaigns._attributes.budget ? (parseFloat(campaigns._attributes.budget / 1000000)).toFixed(2) : 0,
            impressions: campaigns._attributes.impressions ? parseInt(campaigns._attributes.impressions) : 0,
            post_engagement: campaigns._attributes.engagements ? parseInt(campaigns._attributes.engagements) : 0,
            frequency: 0,
            avgcpc: campaigns._attributes.avgCPC ? parseInt(campaigns._attributes.avgCPC) : 0,
            clicks: campaigns._attributes.clicks ? parseInt(campaigns._attributes.clicks) : 0,
            platform: 'google',
            link_clicks: 0,
            ctr: campaigns._attributes.ctr ? parseFloat(campaigns._attributes.ctr) : 0,
            reach: 0,
            conversions: campaigns._attributes.conversions ? parseFloat(campaigns._attributes.conversions) : 0,
            status: campaigns._attributes.campaignState.toUpperCase(),
            unique_clicks: 0,
            cost_per_unique_click: 0,
            cpc: 0,
            cpm: 0,
            date: new_date
        })
        // console.log("Send to Injest File before PG" + JSON.stringify(campaignsList)
    })
    console.log("Send to Injest File before PG..." ,JSON.stringify(campaignsList))
    common.insertInPGSQL(campaignsList)
    //resolve(campaignsList)
    campaignsList = [];
}


module.exports = app;