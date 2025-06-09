package com.chinatower.wetland.handle;


import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.properties.TenantProperties;
import com.chinatower.wetland.service.RpcService;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.StringValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

public class MyTenantLineHandler implements TenantLineHandler {

    private final RpcService rpcService;

    private final TenantProperties properties;

    public MyTenantLineHandler(TenantProperties properties, RpcService rpcService) {
        this.properties = properties;
        this.rpcService = rpcService;
    }

    /**
     * 获取租户 ID 值表达式，只支持单个 ID 值
     * <p>
     *
     * @return 租户 ID 值表达式
     */
    @Override
    public Expression getTenantId() {
        LoginUser loginUser = rpcService.getLoginUser();
        String industryCode = loginUser.getUser().getIndustryCode();
        return new StringValue(industryCode);
    }

    /**
     * 获取租户字段名
     * <p>
     * 默认字段名叫: tenant_id
     *
     * @return 租户字段名
     */
    @Override
    public String getTenantIdColumn() {
        return properties.getColumn();
    }

    /**
     * 根据表名判断是否忽略拼接多租户条件
     * <p>
     * 默认都要进行解析并拼接多租户条件
     *
     * @param tableName 表名
     * @return 是否忽略, true:表示忽略，false:需要解析并拼接多租户条件
     */
    @Override
    public boolean ignoreTable(String tableName) {
        //忽略指定表对租户数据的过滤
        List<String> ignoreTables = properties.getIgnoreTables();
        if (null != ignoreTables && ignoreTables.contains(tableName)) {
            return true;
        }
        return false;
    }
}