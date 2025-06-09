/*
 Navicat Premium Data Transfer

 Source Server         : 湿地准生产
 Source Server Type    : MySQL
 Source Server Version : 80021 (8.0.21-5)
 Source Host           : 10.38.26.16:3306
 Source Schema         : industry_foresty_wetland

 Target Server Type    : MySQL
 Target Server Version : 80021 (8.0.21-5)
 File Encoding         : 65001

 Date: 26/07/2024 01:17:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for wetland_info
-- ----------------------------
DROP TABLE IF EXISTS `wetland_info`;
CREATE TABLE `wetland_info`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键id',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  `wetland_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '湿地名称',
  `area_unit` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '湿地单位',
  `region_code` json NULL COMMENT '地区code',
  `region_name` json NULL COMMENT '地区名称',
  `latitude_longitude` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '经纬度',
  `map_color` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '区域颜色',
  `map_data` json NULL COMMENT '地图信息',
  `wetland_type` json NULL COMMENT '湿地类型 1-沼泽湿地,2-湖泊湿地,3-河流湿地,4-滨海湿地,5-人工湿地',
  `wetland_area` decimal(25, 2) NULL DEFAULT 0.00 COMMENT '湿地面积',
  `climate_type` json NULL COMMENT '气候类型,1-热带雨林气候、2-热带草原气候、3-热带沙漠气候、4-热带季风气候、5-亚热带季风气候、6-地中海气候、\" +\r\n            \"7-温带海洋性气候、8-温带季风气候、9-温带大陆性气候、10-亚寒带针叶林气候、11-极地气候、12-高原山地气候',
  `establishment_time` date NULL DEFAULT NULL COMMENT '建立时间',
  `owner_unit` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '所属单位',
  `protection_level` int NULL DEFAULT NULL COMMENT '保护级别',
  `wetland_image` json DEFAULT NULL COMMENT '图片',
  `high_water_period` json NULL COMMENT '丰水期',
  `average_water_level` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平均水位',
  `low_water_period` json NULL COMMENT '枯水期',
  `average_low_water_level` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平均枯水位',
  `normal_water_period` json NULL COMMENT '平水期',
  `average_normal_water_level` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '平均平水位',
  `tenant_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '租户id',
  `industry_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业编码',
  `app_ver_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业版本',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '湿地基础信息' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for wetland_info_region
-- ----------------------------
DROP TABLE IF EXISTS `wetland_info_region`;
CREATE TABLE `wetland_info_region`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键id',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  `region_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '区域名称',
  `region_type` int NULL DEFAULT NULL COMMENT '区域类型 见regionTypeEnum',
  `region_area` decimal(25, 2) NULL DEFAULT 0.00 COMMENT '区域面积',
  `map_color` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '区域颜色',
  `area_unit` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '面积单位',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `wetland_info_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '湿地信息id',
  `map_data` json NULL COMMENT '地图数据',
  `sort` bigint NULL DEFAULT NULL COMMENT '排序',
  `tenant_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '租户id',
  `industry_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业编码',
  `app_ver_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业版本',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '湿地区域信息' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of wetland_info_region
-- ----------------------------

-- ----------------------------
-- Table structure for wetland_info_vegetation
-- ----------------------------
DROP TABLE IF EXISTS `wetland_info_vegetation`;
CREATE TABLE `wetland_info_vegetation`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '主键id',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  `vegetation_type` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '植被类型',
  `vegetation_area` decimal(25, 2) NULL DEFAULT 0.00 COMMENT '植被面积',
  `area_unit` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '面积单位',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `wetland_info_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '湿地信息id',
  `map_data` json NULL COMMENT '地图数据',
  `map_color` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '区域颜色',
  `sort` bigint NULL DEFAULT NULL COMMENT '排序',
  `tenant_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '租户id',
  `industry_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业编码',
  `app_ver_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业版本',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '湿地植被信息' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of wetland_info_vegetation
-- ----------------------------

CREATE TABLE `industry_foresty_wetland`.`coverage_info`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `industry_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业编码',
  `tenant_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '租户id',
  `app_ver_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业版本',
  `type` int NULL DEFAULT NULL COMMENT '图层类型 生态构成-（0-河流湿地 1-湖泊湿地 2-沼泽湿地 3-农业用地 4-城市用地 5-景观用地 6-养殖场类）适应性评估-（0-丹顶鹤 1-东方白鹳 2-天鹅）动物分布-（0-丹顶鹤 1-东方白鹳 2-天鹅）',
  `coverage_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图层名称',
  `coverage_type` int NULL DEFAULT NULL COMMENT '图层类型 0-适应性评估 1-生态构成 2-动物分布',
  `default_nesting` int NULL DEFAULT NULL COMMENT '默认套合图层 0-否 1-是',
  `coverage_area` double NULL DEFAULT NULL COMMENT '图层总面积 平方米',
  `coverage_year` int NULL DEFAULT NULL COMMENT '图层年份',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图层信息表' ROW_FORMAT = DYNAMIC;

CREATE TABLE `industry_foresty_wetland`.`coverage_info_area`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `coverage_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图层id',
  `type` int NULL DEFAULT NULL COMMENT '经纬度类型 0-点 1-线 2-面',
  `longitude` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '经度',
  `latitude` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '纬度',
  `coverage_area` double NULL DEFAULT 0 COMMENT '经纬度面积-仅为面拥有其他为0 平方米',
  `status` int NULL DEFAULT NULL COMMENT '面积状态 0-适宜生境 1-较适宜生境 2-不适宜生境 3-暂无数据',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图层区域信息表' ROW_FORMAT = DYNAMIC;

CREATE TABLE `industry_foresty_wetland`.`weather_analyse`  (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `industry_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业编码',
  `tenant_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '租户id',
  `app_ver_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '行业版本',
  `temperature` double NULL DEFAULT NULL COMMENT '气温 摄氏度',
  `precipitation` double NULL DEFAULT NULL COMMENT '降水量 mm',
  `create_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '修改人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '删除',
  `temperature_from` int NULL DEFAULT NULL COMMENT '温度数据来源，和风-1，气象站-2',
  `precipitation_from` int NULL DEFAULT NULL COMMENT '气象站数据来源，和风-1，气象站-2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
