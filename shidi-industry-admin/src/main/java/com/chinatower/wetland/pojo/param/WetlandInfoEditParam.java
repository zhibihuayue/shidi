package com.chinatower.wetland.pojo.param;

import com.chinatower.wetland.pojo.entity.WetlandInfoRegion;
import com.chinatower.wetland.pojo.entity.WetlandInfoVegetation;
import com.chinatower.wetland.pojo.vo.MapInfo;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * <p>湿地信息新增参数</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@ApiModel(value = "湿地信息新增参数")
public class WetlandInfoEditParam {
    @ApiModelProperty(value = "主键ID")
    @NotBlank(message = "主键ID不能为空")
    private String id;

    @ApiModelProperty(value = "湿地名称")
    @Length(max = 50,min = 1,message = "长度不能超过50")
    private String wetlandName;

    @ApiModelProperty(value = "地区id")
    private Integer regionId;

    @ApiModelProperty(value = "地区编码")
    @NotEmpty(message = "地区编码不能为空")
    private List<String> regionCodeList;

    @ApiModelProperty(value = "地区名字")
    @NotEmpty(message = "地区名字不能为空")
    private List<String> regionNameList;


    @ApiModelProperty(value = "纬度、经度")
    @NotBlank(message = "纬度、经度不能为空")
    private String latitudeLongitude;

    @ApiModelProperty(value = "区域颜色")
    @NotBlank(message = "区域颜色不能为空")
    private String mapColor;

    @ApiModelProperty(value = "地图数据")
    @NotEmpty(message = "地图数据不能为空")
    private List<MapInfo> mapDataList;

    @ApiModelProperty(value = "湿地类型 1-沼泽湿地,2-湖泊湿地,3-河流湿地,4-滨海湿地,5-人工湿地")
    @NotEmpty(message = "湿地类型不能为空")
    private List<Integer> wetlandTypeList;

    @ApiModelProperty(value = "湿地面积")
    @NotNull(message = "湿地面积不能为空")
    private BigDecimal wetlandArea;

    @ApiModelProperty(value = "湿地面积单位")
    @NotBlank(message = "湿地面积单位不能为空")
    private String areaUnit;

    @ApiModelProperty(value = "气候类型,1-热带雨林气候、2-热带草原气候、3-热带沙漠气候、4-热带季风气候、5-亚热带季风气候、6-地中海气候、" +
            "7-温带海洋性气候、8-温带季风气候、9-温带大陆性气候、10-亚寒带针叶林气候、11-极地气候、12-高原山地气候")
    @NotEmpty(message = "气候类型不能为空")
    private List<Integer> climateTypeList;

    @ApiModelProperty(value = "建立时间")
    @DateTimeFormat(pattern = "yyyy年")
    @JsonFormat(pattern = "yyyy年", timezone = "GMT+8")
    @NotNull(message = "建立时间不能为空")
    private Date establishmentTime;

    @ApiModelProperty(value = "所属单位")
    @Length(max = 100,min = 1,message = "长度不能超过50")
    @NotBlank(message = "所属单位不能为空")
    private String ownerUnit;

    @ApiModelProperty(value = "保护级别,1-国家级，2-省级，3-一般")
    @Max(value = 3,message = "保护级别不能超过3")
    @Min(value = 1,message = "保护级别不能小于1")
    @NotNull(message = "保护级别不能为空")
    private Integer protectionLevel;

    @ApiModelProperty(value = "图片集合")
    @Size(min = 1,max = 5,message = "图片集合长度不能超过5")
    @NotEmpty(message = "图片集合不能为空")
    private List<String> imageList;

    @ApiModelProperty(value = "丰水期")
    private List<String> highWaterPeriodList;

    @ApiModelProperty(value = "平均水位")
    @Length(max = 20,message = "长度不能超过20")
    private String averageWaterLevel;

    @ApiModelProperty(value = "枯水期")
    private List<String> lowWaterPeriodList;

    @ApiModelProperty(value = "平均枯水位")
    @Length(max = 20,message = "长度不能超过20")
    private String averageLowWaterLevel;

    @ApiModelProperty(value = "平水期")
    private List<String> normalWaterPeriodList;

    @ApiModelProperty(value = "平均平水位")
    @Length(max = 20,message = "长度不能超过20")
    private String averageNormalWaterLevel;

    /*@ApiModelProperty(value = "区域信息")
    @Size(min = 3,message = "区域信息必须给")
    private List<WetlandInfoRegion> wetlandInfoRegionList;*/

    @ApiModelProperty(value = "区域信息-区域信息")
    private List<WetlandInfoRegion> regionList;

    @ApiModelProperty(value = "区域信息-水域面积")
    private List<WetlandInfoRegion> waterRegionList;

    @ApiModelProperty(value = "区域信息-湿地建筑物")
    private List<WetlandInfoRegion> constructionRegionList;

    @ApiModelProperty(value = "区域信息-人类活动")
    private List<WetlandInfoRegion> humanActivitiesRegionList;

    @ApiModelProperty(value = "区域信息-需要删除的区域id")
    private List<String> deleteRegionIdList;


    @ApiModelProperty(value = "植被信息")
    private List<WetlandInfoVegetation> wetlandInfoVegetationList;
}