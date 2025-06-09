package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * <p>鸟类栖息地分析</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/25 zyx
* <p>
 * @see
 */
@Data
public class CoverageSuitableAnalyseTopVo {

    @ApiModelProperty("丹顶鹤")
    private List<CoverageSuitableAnalyseVo> crane;

    @ApiModelProperty("东方白鹳")
    private List<CoverageSuitableAnalyseVo> stork;

    @ApiModelProperty("天鹅")
    private List<CoverageSuitableAnalyseVo> swan;
}