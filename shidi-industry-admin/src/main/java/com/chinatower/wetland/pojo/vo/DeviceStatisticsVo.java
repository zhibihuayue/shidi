package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>设备信息统计数据</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/06/17 zyx
 * <p>
 * @see
 */
@Data
@ApiModel(value = "设备信息新增参数")
public class DeviceStatisticsVo {

    @ApiModelProperty(value = "摄像机总数")
    private Integer deviceCountTotal;

    @ApiModelProperty(value = "摄像机在线")
    private Integer devCountOnline;

    @ApiModelProperty(value = "摄像机离线")
    private Integer devCountOffline;

    @ApiModelProperty(value = "气象站总数")
    private Integer iotDeviceCount;

    @ApiModelProperty(value = "气象站在线")
    private Integer iotDeviceOnlineCount;

    @ApiModelProperty(value = "气象站离线")
    private Integer iotDeviceOfflineCount;


    @ApiModelProperty(value = "诱捕器总数")
    private Integer trapCount;

    @ApiModelProperty(value = "野保相机总数")
    private Integer wildProtectionCameraCount;
}
