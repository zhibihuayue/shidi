import request from "@/common/config/axios"
/**
 * 
 * window.requestSDK:线上环境
 * request：后端本地联调
 */

// 古树统计数据
export const ancientTreesList = (param) => {
    // return request.get('/ancientAndRareTrees/getClassifiedStatistic')
    return window.requestSDK('forest-wetland/ancientAndRareTrees/getClassifiedStatistic', param, {}, 'get')
}

// 湿地基础信息
export const basicInformation = (param) => {
    // return request.get('/wetland-info/queryHomeBasicsInfo')
    return window.requestSDK('forest-wetland/wetland-info/queryHomeBasicsInfo', param, {}, 'get')
}

// 湿地资源统计
export const resourceStatistics = (param) => {
    // return request.get('/wetland-info/queryHomeResourceStat') //本地测试
    return window.requestSDK('forest-wetland/wetland-info/queryHomeResourceStat', param, {}, 'get')
}

// 生态系统变化
export const statisticsChain = (param) => {
    // return request.post('/weather-analyse/statisticsChain',param) //本地测试
    return window.requestSDK('forest-wetland/weather-analyse/statisticsChain', param, {}, 'post')
}

// 生态系统矩阵
export const statisticsMatrix = (param) => {
    // return request.post('/weather-analyse/statisticsMatrix',param) //本地测试
    return window.requestSDK('forest-wetland/weather-analyse/statisticsMatrix', param, {}, 'post')
}

// 综合动态转移指数
export const statisticsDynamicIndex = (param) => {
    //  return request.post('/weather-analyse/statisticsDynamicIndex',param) //本地测试
     return window.requestSDK('forest-wetland/weather-analyse/statisticsDynamicIndex', param, {}, 'post')
}

// 景观格局特征
export const statisticsFeature = (param) => {
    // return request.post('/weather-analyse/statisticsFeature',param) //本地测试
    return window.requestSDK('forest-wetland/weather-analyse/statisticsFeature', param, {}, 'post')
}

// 生态统计默认时间有数据时接口
export const statisticsDefaultTime = (param) => {
    // return request.get('/weather-analyse/suitableYear') //本地测试
    return window.requestSDK('forest-wetland/weather-analyse/suitableYear?key='+new Date().getTime(), param, {}, 'get')
}

// 湿地资源统计详情信息
export const wetlandInfoDetail = (param) => {
    // return request.get("/wetland-info/detailById?id="+param.id+'&wetlandResourceType='+param.wetlandResourceType) //本地测试
    return window.requestSDK('forest-wetland/wetland-info/detailById', param, {}, 'get')
}

// 设备信息统计
export const deviceInformation = (param) => {
    // return request.get('/device-info/statistics')
    return window.requestSDK('forest-wetland/device-info/statistics', param, {}, 'get')
}

// 鸟类栖息地分析
export const statisticsSuitableAnalyse = (param) => {
    // return request.post('/weather-analyse/statisticsSuitableAnalyse', param);
    return window.requestSDK('forest-wetland/weather-analyse/statisticsSuitableAnalyse', param, {}, 'post')
}

// 栖息地变化
export const statisticsSuitableChain = (param) => {
    // return request.post('/weather-analyse/statisticsSuitableChain', param);
    return window.requestSDK('forest-wetland/weather-analyse/statisticsSuitableChain', param, {}, 'post')
}

// 气候统计分析
export const climaticAnalyst = (param) => {
    // return request.post('/weather-analyse/statistics', param);
    return window.requestSDK('forest-wetland/weather-analyse/statistics', param, {}, 'post')
}

// 获取鸟类栖息图层
export const selectLayerList=(params)=>{
    return window.requestSDK('/bdm/layer/selectLayerList', params, {}, 'get')
}

// 获取鸟类下拉选项
export const getBirdList=(param)=>{
    // return request.get('/weather-analyse/suitableAnimal')
    return window.requestSDK('forest-wetland/weather-analyse/suitableAnimal', param, {}, 'get')
}

// 病虫害预测图表数据
export const pestPrediction = (param) => {
    // return request.post('/pestForecastOutcome/pestPrediction',param)
    return window.requestSDK('forest-wetland/pestForecastOutcome/pestPrediction', param, {}, 'post')
}

// 病虫害预测获取有数据时间
export const pestTimeList = (param) => {
    // return request.get('/pestForecastOutcome/pestTimeList',{})
    return window.requestSDK('forest-wetland/pestForecastOutcome/pestTimeList', param, {}, 'get')
}

// 病虫害预测获取诱捕器列表
export const pestLightDevice = (param) => {
    // return request.get('/pestLightRecord/pestLightDevice',{})
    return window.requestSDK('forest-wetland/pestLightRecord/pestLightDevice', param, {}, 'get')
}

// 病虫害预测获取日期下所有诱捕器数据
export const pestLightLastDay = (param) => {
    // return request.post('/pestForecastOutcome/pestLightLastDay',param)
    return window.requestSDK('forest-wetland/pestForecastOutcome/pestLightLastDay', param, {}, 'post')
}

// 病虫害预测风险等级说明
export const getVoByPestType = (param) => {
    // return request.get('/pestControlForecast/getVoByPestType',param)
    return window.requestSDK('forest-wetland/pestControlForecast/getVoByPestType', param, {}, 'get')
}