--
-- 转储industry_foresty_wetland数据库
--

SET statement_timeout = 0;
SET xmloption = content;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET uppercase_attribute_name = false;
SET check_function_bodies = false;
SET session_replication_role = replica;
SET client_min_messages = warning;

--
-- Name: industry_foresty_wetland; Type: DATABASE; Schema: -; Owner: industry_foresty_wetland
--

CREATE DATABASE industry_foresty_wetland WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE industry_foresty_wetland OWNER TO industry_foresty_wetland;

\connect industry_foresty_wetland

SET statement_timeout = 0;
SET xmloption = content;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET uppercase_attribute_name = false;
SET check_function_bodies = false;
SET session_replication_role = replica;
SET client_min_messages = warning;

--
-- Name: industry_foresty_wetland; Type: SCHEMA; Schema: -; Owner: industry_foresty_wetland
--

CREATE SCHEMA industry_foresty_wetland;
ALTER SCHEMA industry_foresty_wetland COLLATE = utf8_general_ci;


ALTER SCHEMA industry_foresty_wetland OWNER TO industry_foresty_wetland;

SET search_path = industry_foresty_wetland;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: coverage_info; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE coverage_info (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    industry_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    tenant_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    app_ver_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    type integer,
    coverage_name varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    coverage_type integer,
    default_nesting integer,
    coverage_area double precision,
    coverage_year integer,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.coverage_info OWNER TO industry_foresty_wetland;

--
-- Name: TABLE coverage_info; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON TABLE coverage_info IS '图层信息表';


--
-- Name: COLUMN coverage_info.industry_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.industry_code IS '行业编码';


--
-- Name: COLUMN coverage_info.tenant_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.tenant_id IS '租户id';


--
-- Name: COLUMN coverage_info.app_ver_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.app_ver_code IS '行业版本';


--
-- Name: COLUMN coverage_info.type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.type IS '图层类型 生态构成-（0-河流湿地 1-湖泊湿地 2-沼泽湿地 3-农业用地 4-城市用地 5-景观用地 6-养殖场类）适应性评估-（0-丹顶鹤 1-东方白鹳 2-天鹅）动物分布-（0-丹顶鹤 1-东方白鹳 2-天鹅）';


--
-- Name: COLUMN coverage_info.coverage_name; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.coverage_name IS '图层名称';


--
-- Name: COLUMN coverage_info.coverage_type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.coverage_type IS '图层类型 0-适应性评估 1-生态构成 2-动物分布';


--
-- Name: COLUMN coverage_info.default_nesting; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.default_nesting IS '默认套合图层 0-否 1-是';


--
-- Name: COLUMN coverage_info.coverage_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.coverage_area IS '图层总面积 平方米';


--
-- Name: COLUMN coverage_info.coverage_year; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.coverage_year IS '图层年份';


--
-- Name: COLUMN coverage_info.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.create_by IS '创建人';


--
-- Name: COLUMN coverage_info.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.create_time IS '创建时间';


--
-- Name: COLUMN coverage_info.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.update_by IS '修改人';


--
-- Name: COLUMN coverage_info.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.update_time IS '修改时间';


--
-- Name: COLUMN coverage_info.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info.is_deleted IS '删除';


--
-- Name: coverage_info_area; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE coverage_info_area (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    coverage_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    type integer,
    longitude text COLLATE pg_catalog.utf8mb4_general_ci,
    latitude text COLLATE pg_catalog.utf8mb4_general_ci,
    coverage_area double precision DEFAULT 0::double precision,
    status integer,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.coverage_info_area OWNER TO industry_foresty_wetland;

--
-- Name: TABLE coverage_info_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON TABLE coverage_info_area IS '图层区域信息表';


--
-- Name: COLUMN coverage_info_area.coverage_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.coverage_id IS '图层id';


--
-- Name: COLUMN coverage_info_area.type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.type IS '经纬度类型 0-点 1-线 2-面';


--
-- Name: COLUMN coverage_info_area.longitude; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.longitude IS '经度';


--
-- Name: COLUMN coverage_info_area.latitude; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.latitude IS '纬度';


--
-- Name: COLUMN coverage_info_area.coverage_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.coverage_area IS '经纬度面积-仅为面拥有其他为0 平方米';


--
-- Name: COLUMN coverage_info_area.status; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.status IS '面积状态 0-适宜生境 1-较适宜生境 2-不适宜生境 3-暂无数据';


--
-- Name: COLUMN coverage_info_area.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.create_by IS '创建人';


--
-- Name: COLUMN coverage_info_area.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.create_time IS '创建时间';


--
-- Name: COLUMN coverage_info_area.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.update_by IS '修改人';


--
-- Name: COLUMN coverage_info_area.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.update_time IS '修改时间';


--
-- Name: COLUMN coverage_info_area.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN coverage_info_area.is_deleted IS '删除';


--
-- Name: weather_analyse; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE weather_analyse (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    industry_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    tenant_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    app_ver_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    temperature double precision,
    precipitation double precision,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0,
    temperature_from integer,
    precipitation_from integer
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.weather_analyse OWNER TO industry_foresty_wetland;

--
-- Name: COLUMN weather_analyse.industry_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.industry_code IS '行业编码';


--
-- Name: COLUMN weather_analyse.tenant_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.tenant_id IS '租户id';


--
-- Name: COLUMN weather_analyse.app_ver_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.app_ver_code IS '行业版本';


--
-- Name: COLUMN weather_analyse.temperature; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.temperature IS '气温 摄氏度';


--
-- Name: COLUMN weather_analyse.precipitation; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.precipitation IS '降水量 mm';


--
-- Name: COLUMN weather_analyse.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.create_by IS '创建人';


--
-- Name: COLUMN weather_analyse.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.create_time IS '创建时间';


--
-- Name: COLUMN weather_analyse.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.update_by IS '修改人';


--
-- Name: COLUMN weather_analyse.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.update_time IS '修改时间';


--
-- Name: COLUMN weather_analyse.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.is_deleted IS '删除';


--
-- Name: COLUMN weather_analyse.temperature_from; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.temperature_from IS '温度数据来源，和风-1，气条站-2';


--
-- Name: COLUMN weather_analyse.precipitation_from; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN weather_analyse.precipitation_from IS '气象站数据来源，和风-1，气象站-2';


--
-- Name: wetland_info; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE wetland_info (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0,
    wetland_name varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    area_unit varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    region_code json,
    region_name json,
    latitude_longitude varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    map_color varchar(8) COLLATE pg_catalog.utf8mb4_general_ci,
    map_data json,
    wetland_type json,
    wetland_area numeric(25,2) DEFAULT 0.00,
    climate_type json,
    establishment_time date,
    owner_unit varchar(128) COLLATE pg_catalog.utf8mb4_general_ci,
    protection_level integer,
    wetland_image json,
    high_water_period json,
    average_water_level varchar(25) COLLATE pg_catalog.utf8mb4_general_ci,
    low_water_period json,
    average_low_water_level varchar(25) COLLATE pg_catalog.utf8mb4_general_ci,
    normal_water_period json,
    average_normal_water_level varchar(25) COLLATE pg_catalog.utf8mb4_general_ci,
    tenant_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    industry_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    app_ver_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.wetland_info OWNER TO industry_foresty_wetland;

--
-- Name: TABLE wetland_info; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON TABLE wetland_info IS '湿地基础信息';


--
-- Name: COLUMN wetland_info.id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.id IS '主键id';


--
-- Name: COLUMN wetland_info.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.create_by IS '创建人';


--
-- Name: COLUMN wetland_info.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.create_time IS '创建时间';


--
-- Name: COLUMN wetland_info.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.update_by IS '修改人';


--
-- Name: COLUMN wetland_info.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.update_time IS '修改时间';


--
-- Name: COLUMN wetland_info.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.is_deleted IS '删除';


--
-- Name: COLUMN wetland_info.wetland_name; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.wetland_name IS '湿地名称';


--
-- Name: COLUMN wetland_info.area_unit; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.area_unit IS '湿地单位';


--
-- Name: COLUMN wetland_info.region_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.region_code IS '地区code';


--
-- Name: COLUMN wetland_info.region_name; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.region_name IS '地区名称';


--
-- Name: COLUMN wetland_info.latitude_longitude; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.latitude_longitude IS '经纬度';


--
-- Name: COLUMN wetland_info.map_color; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.map_color IS '区域颜色';


--
-- Name: COLUMN wetland_info.map_data; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.map_data IS '地图信息';


--
-- Name: COLUMN wetland_info.wetland_type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.wetland_type IS '湿地类型 1-沼泽湿地,2-湖泊湿地,3-河流湿地,4-滨海湿地,5-人工湿地';


--
-- Name: COLUMN wetland_info.wetland_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.wetland_area IS '湿地面积';


--
-- Name: COLUMN wetland_info.climate_type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.climate_type IS '气候类型,1-热带雨林气候、2-热带草原气候、3-热带沙漠气候、4-热带季风气候、5-亚热带季风气候、6-地中海气候、" +
            "7-温带海洋性气候、8-温带季风气候、9-温带大陆性气候、10-亚寒带针叶林气候、11-极地气候、12-高原山地气候';


--
-- Name: COLUMN wetland_info.establishment_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.establishment_time IS '建立时间';


--
-- Name: COLUMN wetland_info.owner_unit; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.owner_unit IS '所属单位';


--
-- Name: COLUMN wetland_info.protection_level; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.protection_level IS '保护级别';


--
-- Name: COLUMN wetland_info.wetland_image; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.wetland_image IS '湿地图片';


--
-- Name: COLUMN wetland_info.high_water_period; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.high_water_period IS '丰水期';


--
-- Name: COLUMN wetland_info.average_water_level; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.average_water_level IS '平均水位';


--
-- Name: COLUMN wetland_info.low_water_period; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.low_water_period IS '枯水期';


--
-- Name: COLUMN wetland_info.average_low_water_level; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.average_low_water_level IS '平均枯水位';


--
-- Name: COLUMN wetland_info.normal_water_period; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.normal_water_period IS '平水期';


--
-- Name: COLUMN wetland_info.average_normal_water_level; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.average_normal_water_level IS '平均平水位';


--
-- Name: COLUMN wetland_info.tenant_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.tenant_id IS '租户id';


--
-- Name: COLUMN wetland_info.industry_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.industry_code IS '行业编码';


--
-- Name: COLUMN wetland_info.app_ver_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info.app_ver_code IS '行业版本';


--
-- Name: wetland_info_region; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE wetland_info_region (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0,
    region_name varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    region_type integer,
    region_area numeric(25,2) DEFAULT 0.00,
    map_color varchar(8) COLLATE pg_catalog.utf8mb4_general_ci,
    area_unit varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    remark varchar(255) COLLATE pg_catalog.utf8mb4_general_ci,
    wetland_info_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    map_data json,
    sort bigint,
    tenant_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    industry_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    app_ver_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.wetland_info_region OWNER TO industry_foresty_wetland;

--
-- Name: TABLE wetland_info_region; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON TABLE wetland_info_region IS '湿地区域信息';


--
-- Name: COLUMN wetland_info_region.id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.id IS '主键id';


--
-- Name: COLUMN wetland_info_region.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.create_by IS '创建人';


--
-- Name: COLUMN wetland_info_region.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.create_time IS '创建时间';


--
-- Name: COLUMN wetland_info_region.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.update_by IS '修改人';


--
-- Name: COLUMN wetland_info_region.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.update_time IS '修改时间';


--
-- Name: COLUMN wetland_info_region.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.is_deleted IS '删除';


--
-- Name: COLUMN wetland_info_region.region_name; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.region_name IS '区域名称';


--
-- Name: COLUMN wetland_info_region.region_type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.region_type IS '区域类型 见regionTypeEnum';


--
-- Name: COLUMN wetland_info_region.region_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.region_area IS '区域面积';


--
-- Name: COLUMN wetland_info_region.map_color; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.map_color IS '区域颜色';


--
-- Name: COLUMN wetland_info_region.area_unit; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.area_unit IS '面积单位';


--
-- Name: COLUMN wetland_info_region.remark; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.remark IS '备注';


--
-- Name: COLUMN wetland_info_region.wetland_info_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.wetland_info_id IS '湿地信息id';


--
-- Name: COLUMN wetland_info_region.map_data; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.map_data IS '地图数据';


--
-- Name: COLUMN wetland_info_region.sort; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.sort IS '排序';


--
-- Name: COLUMN wetland_info_region.tenant_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.tenant_id IS '租户id';


--
-- Name: COLUMN wetland_info_region.industry_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.industry_code IS '行业编码';


--
-- Name: COLUMN wetland_info_region.app_ver_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_region.app_ver_code IS '行业版本';


--
-- Name: wetland_info_vegetation; Type: TABLE; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

CREATE TABLE wetland_info_vegetation (
    id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci NOT NULL,
    create_by varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    create_time timestamp(0) without time zone,
    update_by varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    update_time timestamp(0) without time zone,
    is_deleted integer DEFAULT 0,
    vegetation_type varchar(128) COLLATE pg_catalog.utf8mb4_general_ci,
    vegetation_area numeric(25,2) DEFAULT 0.00,
    area_unit varchar(64) COLLATE pg_catalog.utf8mb4_general_ci,
    remark varchar(255) COLLATE pg_catalog.utf8mb4_general_ci,
    wetland_info_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    map_data json,
    map_color varchar(8) COLLATE pg_catalog.utf8mb4_general_ci,
    sort bigint,
    tenant_id varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    industry_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci,
    app_ver_code varchar(32) COLLATE pg_catalog.utf8mb4_general_ci
)
WITH (orientation=row, compression=no, fillfactor=80, collate=1537);


ALTER TABLE industry_foresty_wetland.wetland_info_vegetation OWNER TO industry_foresty_wetland;

--
-- Name: TABLE wetland_info_vegetation; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON TABLE wetland_info_vegetation IS '湿地植被信息';


--
-- Name: COLUMN wetland_info_vegetation.id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.id IS '主键id';


--
-- Name: COLUMN wetland_info_vegetation.create_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.create_by IS '创建人';


--
-- Name: COLUMN wetland_info_vegetation.create_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.create_time IS '创建时间';


--
-- Name: COLUMN wetland_info_vegetation.update_by; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.update_by IS '修改人';


--
-- Name: COLUMN wetland_info_vegetation.update_time; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.update_time IS '修改时间';


--
-- Name: COLUMN wetland_info_vegetation.is_deleted; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.is_deleted IS '删除';


--
-- Name: COLUMN wetland_info_vegetation.vegetation_type; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.vegetation_type IS '植被类型';


--
-- Name: COLUMN wetland_info_vegetation.vegetation_area; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.vegetation_area IS '植被面积';


--
-- Name: COLUMN wetland_info_vegetation.area_unit; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.area_unit IS '面积单位';


--
-- Name: COLUMN wetland_info_vegetation.remark; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.remark IS '备注';


--
-- Name: COLUMN wetland_info_vegetation.wetland_info_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.wetland_info_id IS '湿地信息id';


--
-- Name: COLUMN wetland_info_vegetation.map_data; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.map_data IS '地图数据';


--
-- Name: COLUMN wetland_info_vegetation.map_color; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.map_color IS '区域颜色';


--
-- Name: COLUMN wetland_info_vegetation.sort; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.sort IS '排序';


--
-- Name: COLUMN wetland_info_vegetation.tenant_id; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.tenant_id IS '租户id';


--
-- Name: COLUMN wetland_info_vegetation.industry_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.industry_code IS '行业编码';


--
-- Name: COLUMN wetland_info_vegetation.app_ver_code; Type: COMMENT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COMMENT ON COLUMN wetland_info_vegetation.app_ver_code IS '行业版本';


SET search_path = public;

--
-- Name: pg_type_nonstrict_basic_value; Type: VIEW; Schema: public; Owner: industry_foresty_wetland
--

CREATE SQL SECURITY DEFINER VIEW public.pg_type_nonstrict_basic_value(typename,basic_value) AS
    
    SELECT
            t.typname As typename,
            pg_get_nonstrict_basic_value(t.typname) As basic_value

    FROM pg_type t;


ALTER VIEW public.pg_type_nonstrict_basic_value OWNER TO industry_foresty_wetland;

SET search_path = industry_foresty_wetland;

--
-- Data for Name: coverage_info; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COPY coverage_info (id, industry_code, tenant_id, app_ver_code, type, coverage_name, coverage_type, default_nesting, coverage_area, coverage_year, create_by, create_time, update_by, update_time, is_deleted) FROM stdin;
\.
;

--
-- Data for Name: coverage_info_area; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

COPY coverage_info_area (id, coverage_id, type, longitude, latitude, coverage_area, status, create_by, create_time, update_by, update_time, is_deleted) FROM stdin;
\.
;

--
-- Data for Name: weather_analyse; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

--
-- Data for Name: wetland_info; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--



--
-- Data for Name: wetland_info_region; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--



--
-- Data for Name: wetland_info_vegetation; Type: TABLE DATA; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--



--
-- Name: coverage_info_area_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE coverage_info_area
    ADD CONSTRAINT coverage_info_area_pk PRIMARY KEY USING btree  (id);


--
-- Name: coverage_info_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE coverage_info
    ADD CONSTRAINT coverage_info_pk PRIMARY KEY USING btree  (id);


--
-- Name: weather_analyse_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE weather_analyse
    ADD CONSTRAINT weather_analyse_pk PRIMARY KEY USING btree  (id);


--
-- Name: wetland_info_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE wetland_info
    ADD CONSTRAINT wetland_info_pk PRIMARY KEY USING btree  (id);


--
-- Name: wetland_info_region_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE wetland_info_region
    ADD CONSTRAINT wetland_info_region_pk PRIMARY KEY USING btree  (id);


--
-- Name: wetland_info_vegetation_pk; Type: CONSTRAINT; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland;表空间：
--

ALTER TABLE wetland_info_vegetation
    ADD CONSTRAINT wetland_info_vegetation_pk PRIMARY KEY USING btree  (id);


--
-- Name: industry_foresty_wetland; Type: ACL; Schema: -; Owner: industry_foresty_wetland
--

REVOKE ALL ON SCHEMA industry_foresty_wetland FROM PUBLIC;
REVOKE ALL ON SCHEMA industry_foresty_wetland FROM industry_foresty_wetland;
GRANT CREATE,USAGE ON SCHEMA industry_foresty_wetland TO industry_foresty_wetland;
GRANT CREATE,USAGE ON SCHEMA industry_foresty_wetland TO industry_foresty_wetland;
GRANT ALTER,DROP,COMMENT ON SCHEMA industry_foresty_wetland TO industry_foresty_wetland;


--
-- Name: public; Type: ACL; Schema: -; Owner: industry_foresty_wetland
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM industry_foresty_wetland;
GRANT CREATE,USAGE ON SCHEMA public TO industry_foresty_wetland;
GRANT USAGE ON SCHEMA public TO PUBLIC;


--
-- Name: coverage_info; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE coverage_info FROM PUBLIC;
REVOKE ALL ON TABLE coverage_info FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE coverage_info TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE coverage_info TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE coverage_info TO industry_foresty_wetland;


--
-- Name: coverage_info_area; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE coverage_info_area FROM PUBLIC;
REVOKE ALL ON TABLE coverage_info_area FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE coverage_info_area TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE coverage_info_area TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE coverage_info_area TO industry_foresty_wetland;


--
-- Name: weather_analyse; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE weather_analyse FROM PUBLIC;
REVOKE ALL ON TABLE weather_analyse FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE weather_analyse TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE weather_analyse TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE weather_analyse TO industry_foresty_wetland;


--
-- Name: wetland_info; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE wetland_info FROM PUBLIC;
REVOKE ALL ON TABLE wetland_info FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE wetland_info TO industry_foresty_wetland;


--
-- Name: wetland_info_region; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE wetland_info_region FROM PUBLIC;
REVOKE ALL ON TABLE wetland_info_region FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info_region TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info_region TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE wetland_info_region TO industry_foresty_wetland;


--
-- Name: wetland_info_vegetation; Type: ACL; Schema: industry_foresty_wetland; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE wetland_info_vegetation FROM PUBLIC;
REVOKE ALL ON TABLE wetland_info_vegetation FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info_vegetation TO industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE wetland_info_vegetation TO industry_foresty_wetland;
GRANT COMMENT,ALTER,DROP,INDEX,VACUUM ON TABLE wetland_info_vegetation TO industry_foresty_wetland;


SET search_path = public;

--
-- Name: pg_type_nonstrict_basic_value; Type: ACL; Schema: public; Owner: industry_foresty_wetland
--

REVOKE ALL ON TABLE pg_type_nonstrict_basic_value FROM PUBLIC;
REVOKE ALL ON TABLE pg_type_nonstrict_basic_value FROM industry_foresty_wetland;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pg_type_nonstrict_basic_value TO industry_foresty_wetland;
GRANT SELECT,REFERENCES ON TABLE pg_type_nonstrict_basic_value TO PUBLIC;


--
-- 重置一些参数
--

RESET session_replication_role;
--
-- 完成industry_foresty_wetland数据库转储
--

