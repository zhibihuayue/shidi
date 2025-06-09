export class MapClass{
    constructor(){
        this.mapRef = {
            mapType: '2D',
            domId: 'map',
            viewerStatus: {
                zoom: 13,
                center: [116.39, 39.91],
                tileType: 'satellite'
            }
        }
        this.oldFeatureList=[] //当前地图回显图形数据的集合
        this.newFeatureList=[] //当前地图新增图形数据的集合
        this.addSingleGeometryDataSourceList=[] //所有图形的回显实例
        this.addSingleMarkerDataSourceList=[] //所有图形的标绘实例
        this.selectFeature=null //选中的图形
        this.selectMarker=null //选中图形的marker
        this.selectData=null //选中图形中的自定义属性data.uuid
        //绘制和回显时的样式设置
        this.drawStyleConfig = {
            strokeWidth: 1, // 线和边
            strokeTransparency: 1,
            strokeColor: "#1890FF", // 线和边
            fillColor: "#1890FF", // 面
            fillTransparency: 0.4,
        }
        // 图形选中的样式设置
        this.selectDrawStyleConfig = {
            strokeWidth: 1, // 线和边
            strokeTransparency: 1,
            strokeColor: "#1890FF", // 线和边
            fillColor: "#1890FF", // 面
            fillTransparency: 0.6,
        }
    }
    setColor(val){
        this.drawStyleConfig.strokeColor=val
        this.drawStyleConfig.fillColor=val
        this.selectDrawStyleConfig.strokeColor=val
        this.selectDrawStyleConfig.fillColor=val
    }
    
} 