package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>鸟类栖息地分析</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
public class CoverageSuitableChainTopVo {


    @ApiModelProperty("丹顶鹤")
    private List<CoverageSuitableChainVo> crane;

    @ApiModelProperty("东方白鹳")
    private List<CoverageSuitableChainVo> stork;

    @ApiModelProperty("天鹅")
    private List<CoverageSuitableChainVo> swan;

}