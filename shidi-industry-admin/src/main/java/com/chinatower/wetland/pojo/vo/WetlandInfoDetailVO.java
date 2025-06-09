package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.WetlandInfoRegion;
import com.chinatower.wetland.pojo.entity.WetlandInfoVegetation;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>湿地信息</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@ApiModel(value = "湿地信息")
public class WetlandInfoDetailVO {
    @ApiModelProperty(value = "主键ID")
    private String id;

    @ApiModelProperty(value = "创建人")
    private String createBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "修改人")
    private String updateBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "修改时间")
    private Date updateTime;

    @ApiModelProperty(value = "湿地名称")
    private String wetlandName;

    @ApiModelProperty(value = "地区编码")
    @NotEmpty(message = "地区编码不能为空")
    private List<String> regionCodeList;

    @ApiModelProperty(value = "地区名字")
    @NotEmpty(message = "地区名字不能为空")
    private List<String> regionNameList;

    @ApiModelProperty(value = "纬度、经度")
    private String latitudeLongitude;

    @ApiModelProperty(value = "区域颜色")
    @NotBlank(message = "区域颜色不能为空")
    private String mapColor;

    @ApiModelProperty(value = "地图数据")
    private List<MapInfo> mapDataList = new ArrayList<>();

    @ApiModelProperty(value = "湿地类型String")
    private String wetlandTypeString;

    @ApiModelProperty(value = "湿地类型 1-沼泽湿地,2-湖泊湿地,3-河流湿地,4-滨海湿地,5-人工湿地")
    private List<Integer> wetlandTypeList;

    @ApiModelProperty(value = "湿地面积")
    private BigDecimal wetlandArea;

    @ApiModelProperty(value = "湿地面积单位")
    private String areaUnit;

    @ApiModelProperty(value = "气候类型,1-热带雨林气候、2-热带草原气候、3-热带沙漠气候、4-热带季风气候、5-亚热带季风气候、6-地中海气候、" +
            "7-温带海洋性气候、8-温带季风气候、9-温带大陆性气候、10-亚寒带针叶林气候、11-极地气候、12-高原山地气候")
    private List<Integer> climateTypeList;

    @ApiModelProperty(value = "气候类型")
    private String climateTypeString;

    @ApiModelProperty(value = "建立时间")
    @DateTimeFormat(pattern = "yyyy年")
    @JsonFormat(pattern = "yyyy年", timezone = "GMT+8")
    private Date establishmentTime;

    @ApiModelProperty(value = "所属单位")
    private String ownerUnit;


    @ApiModelProperty(value = "保护级别,1-国家级，2-省级，3-一般")
    private Integer protectionLevel;

    @ApiModelProperty(value = "保护级别,1-国家级，2-省级，3-一般")
    private String protectionLevelString;

    @ApiModelProperty(value = "图片集合")
    private List<String> imageList;

    @ApiModelProperty(value = "丰水期")
    private List<String> highWaterPeriodList;

    @ApiModelProperty(value = "平均水位")
    private String averageWaterLevel;

    @ApiModelProperty(value = "枯水期")
    private List<String> lowWaterPeriodList;

    @ApiModelProperty(value = "平均枯水位")
    private String averageLowWaterLevel;

    @ApiModelProperty(value = "平水期")
    private List<String> normalWaterPeriodList;

    @ApiModelProperty(value = "平均平水位")
    private String averageNormalWaterLevel;

    /*@ApiModelProperty(value = "区域信息")
    private List<WetlandInfoRegion> wetlandInfoRegionList;*/

    @ApiModelProperty(value = "区域信息-区域信息")
    private List<WetlandInfoRegion> regionList;

    @ApiModelProperty(value = "区域信息-水域面积")
    private List<WetlandInfoRegion> waterRegionList;

    @ApiModelProperty(value = "区域信息-湿地建筑物")
    private List<WetlandInfoRegion> constructionRegionList;

    @ApiModelProperty(value = "区域信息-人类活动")
    private List<WetlandInfoRegion> humanActivitiesRegionList;


    @ApiModelProperty(value = "植被信息")
    private List<WetlandInfoVegetation> wetlandInfoVegetationList;

    @ApiModelProperty(value = "全部地图信息")
    private List<MapInfo> mapList = new ArrayList<>();

}