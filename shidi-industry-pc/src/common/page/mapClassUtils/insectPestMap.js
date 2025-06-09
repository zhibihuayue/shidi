// 病虫害预测地图类工具
import store from '@/store/index.js'
export class insectPestMap{
    constructor(map){
        this.mapRef=map,
        this.mutyGeometryList=[],
        this.colorList={
            0:'#00B38E',
            1:'#FFEE55',
            2:'#FF814F',
            3:'#FF4C54'
        },
        this.interval=[],
        this.markerList=[]
    }

    //设置地图中心点
    setMapZoom(zoom,center) {
        CTMapOl.ViewControl.common.setZoomAndCenter(
            { mapRef: this.mapRef },
            { zoom,center}
        );
    }

    // 绘制圆图形
    dragCircle(center,item){
        const radius = this.mapRef.mapType=='2D' ? 30 : 15
        const strokeWidth = this.mapRef.mapType=='2D' ? 5 : 2
        const mutyGeometry = new CTMapOl.DataSourceControl.lib.MutyGeometryDataSource(
            {
                mapRef:this.mapRef,
                geojson : {
                    type: 'Featurecollection',
                    features: [{
                        type: '',
                        geometry: {
                            type: 'MultiPoint',
                            coordinates: [center]
                        }
                    }]
                }
            }, 
            {
                zIndex:10,
                disableDepthTestDistance:Infinity,
                normalstyle:{
                    radius: radius,
                    fillColor: this.colorList[item.pestLevel],
                    fillTransparency: 0.5,
                    strokeColor: '#ffffff',
                    strokeWidth: strokeWidth,
                    strokeTransparency: 0
                },
                selectlstyle:{
                    radius: radius,
                    fillColor: this.colorList[item.pestLevel],
                    fillTransparency: 0.5,
                    strokeColor: '#ffffff',
                    strokeWidth: strokeWidth,
                    strokeTransparency: 1
                },
                onSelectFunc: (mapRef, type, feature) => {
                    let insectPestMemory = store.state.insectPestMemory
                    insectPestMemory.trapId = item.lightId
                    insectPestMemory.trapName = item.lightName
                    store.state.insectPestMemory=insectPestMemory
                    store.state.insectPestDetailsShow=true
                }
            }
        )
        mutyGeometry.init()
        mutyGeometry.mount()
        mutyGeometry.itemData=item

        let filterEntities = mutyGeometry.propertySearch({
            filterFunc:(val)=>{
                return val
            }
        })
        // 默认选中
        if(store.state.insectPestMemory.trapId==item.lightId){
            if(this.mapRef.mapType=='2D'){
                mutyGeometry.setselection({feature:filterEntities[0]})
            }else{
                mutyGeometry.setselection({entity:filterEntities.entities})
            }
        }
        // 闪烁
        if(item.pestLevel>0){
            this.flicker(mutyGeometry,item.lightId)
        }
        this.mutyGeometryList.push(mutyGeometry)
        this.creatMarker(center,item)
    }

    // 重绘选中的图形
    reDraw(item){
        let center=[item.longitude,item.latitude]
        this.mutyGeometryList.forEach((val,index)=>{
            if(val.itemData.lightId==item.lightId){
                val.destroy()
                this.interval.forEach((rl,ind)=>{
                    if(rl.id==item.lightId){
                        clearInterval(rl.inter)
                        this.interval.splice(ind,1)
                    }
                })
                this.mutyGeometryList.splice(index,1)
                this.markerList[index].destroy()
                this.markerList.splice(index,1)
            }
        })
        this.dragCircle(center,item)
    }

    // 针对高风险板块进行闪烁样式
    flicker(mutyGeometry,id){
        let status = true
        let inter=setInterval(()=>{
            status=!status
            if(status){
                mutyGeometry.visable()
            }else{
                mutyGeometry.invisable()
            }
        },1500)
        this.interval.push({inter:inter,id:id})
    }

    // 创建标注用于点击显示弹窗
    creatMarker(center,item){
        const marker=new CTMapOl.DataSourceControl.lib.MutyMarkerDataSource(
            {
                mapRef:this.mapRef,
                geojson:{
                    type: 'Featurecollection',
                    features: [{
                        type: 'text',
                        geometry: {
                            type: 'Point',
                            coordinates: center,
                        },
                        properties:{
                            label:{
                                value: "1"
                            }
                        }
                    }]
                }
            },
            {
                zIndex: 15,
                heightReference:"CLAMP_TO_GROUND",
                normalstyle: {
                    textstyle: {
                        offset:[],
                        text: '1',
                        textvalue: 'label,value',
                        font: 'normal 14px 微软雅黑',
                        scale: 1,
                        width:50,
                        height:50,
                        textAlign: 'center',
                        fontstyle: {
                            fillColor: '#fff',
                            fillTransparency: 0,
                            strokeColor: '#ffcc33',
                            strokeWidth: 0,
                            strokeTransparency:0
                        },
                        backgroundstyle: {
                            fillColor: '#ffcc33',
                            fillTransparency: 0.01,
                            strokeColor: '#ffcc33',
                            strokeWidth: 0,
                            strokeTransparency: 0
                        }
                    }
                },
                selectlstyle:{
                    textstyle: {
                        offset:[],
                        text: '1',
                        textvalue: 'label,value',
                        font: 'normal 14px 微软雅黑',
                        scale: 1,
                        width:50,
                        height:50,
                        textAlign: 'center',
                        fontstyle: {
                            fillColor: '#fff',
                            fillTransparency: 0,
                            strokeColor: '#ffcc33',
                            strokeWidth: 0,
                            strokeTransparency: 0
                        },
                        backgroundstyle: {
                            fillColor: '#ffcc33',
                            fillTransparency: 0.01,
                            strokeColor: '#ffcc33',
                            strokeWidth: 0,
                            strokeTransparency: 0
                        }
                    }
                },
                // onSelectFunc: function (mapRef, type, feature) {
                //     
                // },
                // onUnselectFunc: function (mapRef, type, feature) {
                    
                // },
                events:{
                    leftClick:function(val){
                        store.state.insectPestDetailsShow=true
                    },
                    // rightClick:()=>{

                    // },
                    // dblClick:()=>{

                    // }
                }
            }
        )
        marker.init()
        marker.mount()
        marker.itemData=item
        this.markerList.push(marker)
    }

    // 清除图层
    clearLayer(){
        this.mutyGeometryList.forEach(item=>{
            item.destroy()
        })
        this.mutyGeometryList=[]
        this.markerList.forEach(item=>{
            item.destroy()
        })
        this.markerList=[]
        if(this.interval.length>0){
            this.interval.forEach(item=>{
                clearInterval(item.inter)
            })
            this.interval=[]
        }
    }
}