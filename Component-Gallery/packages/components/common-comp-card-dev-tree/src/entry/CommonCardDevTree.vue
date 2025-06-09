<!--
  林区卡口设备树
-->
<template>
  <div :class="bemClass.container">
    <div class="search">
      <el-input
        v-model="searchValue"
        placeholder="输入关键字"
        :class="[
          'minput',
          !isCardView && 'withprefix',
          searchFocus && 'onfocus',
          !otherNowConfig.isShowDisplayMode && 'noPadding'
        ]"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
      >
        <template #prefix v-if="otherNowConfig.isShowDisplayMode">
          <el-select
            v-show="!isCardView"
            v-model="displayMode"
            placeholder="请选择"
            :popper-append-to-body="false"
            popper-class="common-iw-s"
            @change="onDisplayModeChange"
          >
            <el-option label="按区域展示" value="1" />
            <el-option label="按组织展示" value="2" />
            <el-option label="按标签展示" value="3" />
          </el-select>
        </template>
        <template #suffix>
          <em
            v-show="searchValue"
            class="iconfont_tools icon-linye_icon_qingkong"
            @click="searchValue = ''"
          />
          <em class="iconfont_tools icon-linye_icon_sousuo" />
          <div class="icon-fav" @click="onFavor">
            <em
              :class="[
                'iconfont_tools',
                searchFavorite
                  ? 'iconon icon-icon_shoucang_20_s'
                  : 'icon-icon_shoucang_20_n'
              ]"
            />
          </div>
        </template>
      </el-input>
      <div
        :class="['infoIconBtn', isCardView && 'active']"
        @click="onSwitchCardView(true)"
      >
        <!-- <i
          :class="[
            'iconfont_tools',
            !isCardView
              ? 'icon-icon_shituxianshi_32_n'
              : 'icon-icon_shituxianshi_32_s'
          ]"
        /> -->
        <ct-icon
          :name="isCardView ? 'cardshow-active' : 'cardshow'"
          color="inherit"
          class="common-icon"
        ></ct-icon>
      </div>
      <div
        :class="['infoIconBtn', !isCardView && 'active']"
        @click="onSwitchCardView(false)"
      >
        <em
          :class="[
            'iconfont_tools',
            isCardView
              ? 'icon-icon_liebiaoxianshi_32_n'
              : 'icon-icon_liebiaoxianshi_32_s'
          ]"
        />
      </div>
    </div>
    <div v-if="isCardView" class="cardSearchFilter">
      <el-select
        v-model="cardViewParam.provinceCode"
        clearable
        placeholder="全国"
        :popper-append-to-body="false"
        popper-class="common-iw-s"
        @clear="onChangeAreaParam(null, 0)"
        @change="onChangeAreaParam(arguments[0], 0)"
      >
        <el-option
          v-for="item in provinceOption"
          :key="item.code"
          :value="item.code"
          :label="item.name"
        />
      </el-select>
      <el-select
        v-model="cardViewParam.cityCode"
        clearable
        placeholder="市"
        :popper-append-to-body="false"
        popper-class="common-iw-s"
        @clear="onChangeAreaParam(null, 1)"
        @change="onChangeAreaParam(arguments[0], 1)"
      >
        <el-option
          v-for="item in cityOption"
          :key="item.code"
          :value="item.code"
          :label="item.name"
        />
      </el-select>
      <el-select
        v-model="cardViewParam.countyCode"
        clearable
        placeholder="县"
        :popper-append-to-body="false"
        popper-class="common-iw-s"
        @clear="onChangeAreaParam(null, 2)"
        @change="onChangeAreaParam(arguments[0], 2)"
      >
        <el-option
          v-for="item in countryOption"
          :key="item.code"
          :value="item.code"
          :label="item.name"
        />
      </el-select>
      <el-select
        v-model="cardViewParam.townCode"
        clearable
        placeholder="乡镇"
        :popper-append-to-body="false"
        popper-class="common-iw-s"
        @clear="onChangeAreaParam(null, 3)"
        @change="onChangeAreaParam(arguments[0], 3)"
      >
        <el-option
          v-for="item in townOption"
          :key="item.code"
          :value="item.code"
          :label="item.name"
        />
      </el-select>
      <div :class="['expand_btn', cardViewParamExpand && 'expand']">
        <i
          :class="['iconfont_tools  icon-linye_icon_biaotizhankai_you']"
          @click="onCardParamExpand"
        />
      </div>
    </div>
    <div v-if="isCardView && cardViewParamExpand" class="cardSearchFilter">
      <div class="left">
        <el-select
          v-model="selectDateType"
          v-if="otherNowConfig.isShowDateSelectType"
          @change="switchDateType"
          popper-class="common-iw-s"
        >
          <el-option
            v-for="item in dateTypeList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</el-option
          >
        </el-select>
        <span class="label" v-else>{{ otherNowConfig.dateSelectTip }}</span>
      </div>
      <div class="right">
        <el-date-picker
          v-if="selectDateType == '4'"
          key="devDateType4"
          class="datePicker"
          v-model="cardViewParam.uploadDate"
          prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
          popper-class="common-iw-s"
          align="right"
          type="daterange"
          :editable="false"
          :clearable="false"
          :picker-options="datepickerOption"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onDateChange"
        />
        <el-date-picker
          v-model="cardViewParam.uploadDate"
          class="simpleDatePicker"
          prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
          popper-class="common-iw-s"
          :picker-options="datepickerOption2"
          :clearable="false"
          v-else-if="selectDateType == '1'"
          key="devDateType1"
          type="year"
          placeholder="选择年"
          @change="onDateChange"
        >
        </el-date-picker>
        <el-date-picker
          v-model="cardViewParam.uploadDate"
          class="simpleDatePicker"
          prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
          popper-class="common-iw-s"
          :picker-options="datepickerOption2"
          :clearable="false"
          v-else-if="selectDateType == '2'"
          key="devDateType2"
          type="month"
          placeholder="选择月"
          @change="onDateChange"
        >
        </el-date-picker>
        <el-date-picker
          v-model="cardViewParam.uploadDate"
          class="simpleDatePicker"
          prefix-icon="iconfont_tools icon-tongyong-shaixuanriqi"
          popper-class="common-iw-s"
          :picker-options="datepickerOption2"
          :clearable="false"
          v-else-if="selectDateType == '3'"
          key="devDateType3"
          type="date"
          placeholder="选择日"
          @change="onDateChange"
        >
        </el-date-picker>
      </div>
      <el-tooltip
        :content="otherNowConfig.sortTip"
        popper-class="common-iw-s gwcsp"
        placement="top-end"
      >
        <div class="caretBtn" @click="changeCardViewSort">
          <em
            :class="[
              'el-icon-caret-bottom',
              cardViewParam.orderType === 'desc' && 'active'
            ]"
          ></em>
          <em
            :class="[
              'el-icon-caret-top',
              cardViewParam.orderType === 'asc' && 'active'
            ]"
          ></em>
        </div>
      </el-tooltip>
    </div>
    <div
      v-show="isCardView"
      :class="['cardViewTree', cardViewParamExpand && 'short']"
    >
      <template v-if="!cardViewLoading">
        <el-scrollbar ref="elscrollbar" style="height: 100%">
          <div class="lineBox">
            <div
              v-for="(item, index) in filterViewData"
              :key="item.id || item.deviceCode"
              :class="[
                'line',
                nowSelectedTreeNode.deviceCode === item.deviceCode &&
                  'selected',
                `linecol${index < 3 ? index + 1 : ''}`
              ]"
              @click="onSelectDevice(item)"
            >
              <slot name="cardviewitem" :data="{ index, item, searchValue }">
                <div class="sortNumber">{{ index + 1 }}</div>
                <div class="cameraName">
                  <el-tooltip
                    placement="top"
                    :open-delay="300"
                    :content="item.deviceName"
                    popper-class="common-iw-s"
                  >
                    <span
                      v-html="
                        $options.filters.filterDiscolour(
                          item.deviceName,
                          searchValue
                        )
                      "
                    ></span>
                  </el-tooltip>
                </div>
                <div class="fileNum">
                  <i :class="`iconfont_tools ${otherNowConfig.unitIcon}`" />{{
                    item.count
                  }}
                </div>
              </slot>
            </div>
          </div>
        </el-scrollbar>
        <div
          v-if="filterViewData.length === 0"
          class="c-no-datas"
          style="text-align: center"
          >暂无数据</div
        >
      </template>
      <div v-if="cardViewLoading" class="loading-datas">
        <em class="el-icon-loading"></em>
        <span>加载中</span>
      </div>
    </div>
    <div v-show="!isCardView" class="deviceTree">
      <template v-if="!treeLoading">
        <!-- 第一行的根节点是假的，下面的才是真正的设备树。这种方式可以比较解耦地实现第一层节点固定、后续设备树滚动条效果 -->
        <div
          v-if="filterTreeData && filterTreeData.length > 0"
          class="el-tree-node__content"
          @click="isShowTree = !isShowTree"
        >
          <span
            :class="`expanded el-tree-node__expand-icon el-icon-caret-right ${
              isShowTree ? '' : 'retract'
            }`"
          ></span>
          <div class="custom-tree-node">
            <span
              :title="firstTreeNode.name"
              class="treeLabel"
              style="flex: 1; display: flex; align-items: center"
            >
              <span style="overflow: hidden; text-overflow: ellipsis">{{
                firstTreeNode.name
              }}</span
              ><span style="flex: 0" v-if="firstTreeNode.num"
                >（{{ firstTreeNode.onlineNum }}/{{ firstTreeNode.num }}）</span
              >
            </span>
            <div class="firstnodetool">
              <em
                class="iconfont_tools icon-icon_jilian_20_n"
                @click.stop="onExpandTree(true)"
              ></em>
              <em
                class="iconfont_tools icon-linye_icon_shuaxin"
                @click.stop="onRefresh"
              ></em>
            </div>
          </div>
        </div>
        <div class="treebox">
          <el-scrollbar
            ref="elscrollbar"
            style="height: 100%"
            v-show="isShowTree"
          >
            <el-tree
              ref="deviceTree"
              :data="filterTreeData"
              :props="treeProps"
              :indent="6"
              node-key="code"
              :auto-expand-parent="false"
              :default-expanded-keys="expandKey"
              @node-click="onTreeNodeClick"
              @node-expand="handleNodeExpand"
              @node-collapse="handleNodeCollapse"
            >
              <template v-slot="{ node, data }">
                <div
                  :class="['custom-tree-node']"
                  @click="onActualNodeClick(data, $event)"
                >
                  <div
                    :class="[
                      'custom-inner',
                      data.deviceCode &&
                        (!data.list || (data.list && !data.list.length)) &&
                        data.status === '1' &&
                        'grey'
                    ]"
                  >
                    <em
                      v-if="data.deviceCode && !data.channelCode"
                      :class="`iconfont_tools devIcon ${otherNowConfig.treeIcon}`"
                    />
                    <em
                      v-if="data.channelCode"
                      :class="`iconfont_tools devIcon ${otherNowConfig.treeChannelIcon}`"
                    />
                    <template v-if="otherNowConfig.isShowStatucIcon">
                      <img
                        v-if="
                          data.deviceCode &&
                          (!data.list || (data.list && !data.list.length)) &&
                          data.status === '0'
                        "
                        class="statucicon"
                        src="~@component-gallery/assets/image/card-dev-tree/online_wbg.png"
                      />
                      <img
                        v-if="
                          data.deviceCode &&
                          (!data.list || (data.list && !data.list.length)) &&
                          data.status === '1'
                        "
                        class="statucicon"
                        src="~@component-gallery/assets/image/card-dev-tree/offline_wbg.png"
                      />
                    </template>
                    <el-tooltip
                      :content="node.label"
                      placement="top"
                      :open-delay="300"
                      popper-class="common-iw-s"
                    >
                      <span
                        :class="['treeLabel', data.isPlay && 'highlight']"
                        v-html="
                          $options.filters.filterDiscolour(
                            data.name,
                            searchValue
                          )
                        "
                      >
                      </span>
                    </el-tooltip>
                    <span
                      :class="[
                        'treeLabel',
                        'onlineNum',
                        data.isPlay && 'highlight'
                      ]"
                      >{{
                        data.num ? `（${data.onlineNum}/${data.num}）` : ''
                      }}</span
                    >
                  </div>
                  <div class="rightBtns">
                    <template v-for="item in treeBtn">
                      <el-tooltip
                        :key="item.key"
                        placement="top"
                        :content="isAllFavor(data) ? '取消收藏' : '收藏'"
                        popper-class="common-iw-s"
                        v-if="item.key == 'collect'"
                      >
                        <em
                          :class="[
                            'funcicon iconfont_tools',
                            isAllFavor(data)
                              ? 'icon-icon_shoucang_20_s active'
                              : 'icon-icon_shoucang_20_n'
                          ]"
                          @click.stop="
                            favorDevice(data, data.isMonitor === '0')
                          "
                        />
                      </el-tooltip>
                      <el-tooltip
                        :key="item.key"
                        placement="top"
                        content="属性"
                        popper-class="common-iw-s"
                        v-if="item.key == 'attr'"
                      >
                        <em
                          v-if="data.deviceCode"
                          :class="[
                            'funcicon iconfont_tools',
                            nowCameraAttr === data
                              ? 'icon-icon_shuxing_20_s active'
                              : 'icon-icon_shuxing_20_n'
                          ]"
                          @click.stop="onShowDeviceAttr(data)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        :key="item.key"
                        placement="top"
                        content="关联实时抓拍记录"
                        popper-class="common-iw-s"
                        v-if="item.key == 'captureRecord'"
                      >
                        <!-- 选中和非选中图标对不上，有错位，改用svg -->
                        <!-- <i
                          :class="[
                            'funcicon iconfont_tools',
                            data.isFullRel
                              ? 'icon-guanliandanchuangmian active'
                              : 'icon-guanliandanchuang'
                          ]"
                          @click.stop="onRelLiveSnapshot(data)"
                        /> -->
                        <svg
                          class="funcicon"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 20 20"
                          version="1.1"
                          @click.stop="onRelLiveSnapshot(data)"
                        >
                          <g
                            v-if="data.isFullRel"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <rect
                              :fill="setSvgColor(data)"
                              opacity="0"
                              x="0"
                              y="0"
                              width="20"
                              height="20"
                            />
                            <g
                              transform="translate(3.999900, 3.000000)"
                              :fill="setSvgColor(data)"
                              fill-rule="nonzero"
                            >
                              <path
                                d="M9.18688525,9.34221815 L9.27928332,9.34927039 C9.43063232,9.37260317 9.56694436,9.45295796 9.6612488,9.57723521 C10.1891319,10.2713141 10.2780314,11.1818965 9.95291536,11.9484322 L9.89637038,12.0718178 C9.78430911,12.2989552 9.63438429,12.5110816 9.44728988,12.698176 L8.74191971,13.4035461 C8.33709072,13.8076866 7.81256192,14.0485019 7.24804748,14.0926235 L7.05850439,14.1 C6.42320996,14.1 5.82492748,13.8525869 5.37499974,13.4041893 L5.25426138,13.2741009 C4.44931862,12.339753 4.48912884,10.9231647 5.37444548,10.0371186 L5.72320103,9.68982868 C5.83588287,9.57802718 5.98578542,9.51579911 6.14372543,9.51579911 C6.30166543,9.51579911 6.45156798,9.57802718 6.56452765,9.69010543 C6.67654615,9.80212393 6.73883398,9.95217044 6.73883245,10.1114601 C6.73795356,10.2705405 6.67603294,10.4194722 6.56364591,10.5318589 L6.21595233,10.878088 C5.75195358,11.3427621 5.75237242,12.098972 6.21663333,12.5618815 C6.44149171,12.7867399 6.73996724,12.9105153 7.05850439,12.9105153 L7.19363602,12.9030033 C7.46081863,12.8730872 7.70764495,12.754612 7.90041216,12.5618448 L8.60636088,11.8566286 C9.02537116,11.4369425 9.07168432,10.7664173 8.71384812,10.2965034 C8.61777658,10.1695832 8.57665835,10.0131953 8.59852287,9.85665616 C8.61965113,9.6990746 8.70101963,9.55945365 8.82741742,9.46377838 C8.93123821,9.38459304 9.05654028,9.34221815 9.18688525,9.34221815 Z M10,0 C11.105,0 12,0.895 12,2 L12.0013618,6.22573946 L11.9441783,6.16578399 C11.3569974,5.58840347 10.6077325,5.27247249 9.81515348,5.27247249 C8.95548007,5.27247249 8.14770343,5.64329727 7.54080059,6.31664385 L6.58828491,7.37414203 C6.32966258,7.66211825 6.12325155,7.98990261 5.97069455,8.34128738 C5.87003599,8.37032918 5.77611912,8.43333964 5.63493919,8.55940244 C5.58589224,8.60319759 5.51081393,8.67519515 5.40970426,8.7753951 L5.23851624,8.94684684 C5.0478047,9.13945039 4.79852261,9.39550934 4.49066996,9.7150237 C3.69240797,10.6029192 3.44798079,11.8770411 3.75702989,13.0017719 L2,13 C0.896,13 0,12.104 0,11 L0,2 C0,0.895 0.896,0 2,0 L10,0 Z M9.90296163,6.49717499 C10.5387712,6.49717499 11.1369384,6.74422226 11.5856444,7.19216393 C12.0355508,7.64360011 12.2836836,8.24188476 12.2836836,8.87643212 C12.2836836,9.51109396 12.0354667,10.1093808 11.5857047,10.5599076 L11.238265,10.9073463 C11.1254018,11.0193278 10.9761634,11.0813759 10.8177321,11.0813759 C10.6584562,11.0813759 10.5086419,11.0196468 10.3969384,10.9070696 C10.1652847,10.6754159 10.1652847,10.2987317 10.3968639,10.0662721 L10.7442067,9.71819693 C10.9693652,9.49371462 11.0934665,9.19470305 11.0934665,8.87643212 C11.0934665,8.55751647 10.969647,8.25875787 10.7439937,8.03445432 C10.5522946,7.8421761 10.305163,7.72337461 10.0375693,7.69250354 L9.90222922,7.68446246 C9.58377018,7.68446246 9.28487484,7.8086925 9.06035815,8.03456106 L8.35504819,8.73987102 C7.98709979,9.10781942 7.90420416,9.67351223 8.13821582,10.1273776 L8.20333941,10.238335 C8.29067745,10.3724298 8.32157735,10.5313106 8.28929305,10.6857472 C8.25745182,10.8414154 8.16674242,10.9755076 8.03547299,11.060686 C7.93781365,11.1263842 7.82452153,11.1612085 7.70646673,11.1612085 C7.50682773,11.1612085 7.32088109,11.0610279 7.21073821,10.8944919 C6.58895806,9.95532087 6.71604216,8.69646471 7.51348047,7.89749743 L8.2188139,7.19289645 C8.66822263,6.74425202 9.26637747,6.49717499 9.90296163,6.49717499 Z M5.251,6 L3.749,6 C3.338,6.005 3.008,6.34 3.008,6.751 C3.009,7.161 3.34,7.495 3.751,7.5 L5.251,7.5 C5.662,7.495 5.993,7.16 5.993,6.75 C5.993,6.339 5.662,6.004 5.251,6 Z M8.251,3 L3.749,3 C3.335,3 3,3.336 3,3.751 C3.001,4.165 3.337,4.5 3.751,4.5 L8.251,4.5 C8.665,4.5 9.001,4.164 9.001,3.75 C9.001,3.335 8.665,3 8.251,3 Z"
                                id="形状结合"
                              />
                            </g>
                          </g>
                          <g
                            v-else
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <rect
                              :fill="setSvgColor(data)"
                              opacity="0"
                              x="0"
                              y="0"
                              width="20"
                              height="20"
                            />
                            <g
                              transform="translate(3.999900, 3.000000)"
                              :fill="setSvgColor(data)"
                              fill-rule="nonzero"
                            >
                              <path
                                d="M9.18688525,9.34221815 L9.27928332,9.34927039 C9.43063232,9.37260317 9.56694436,9.45295796 9.6612488,9.57723521 C10.1891319,10.2713141 10.2780314,11.1818965 9.95291536,11.9484322 L9.89637038,12.0718178 C9.78430911,12.2989552 9.63438429,12.5110816 9.44728988,12.698176 L8.74191971,13.4035461 C8.33709072,13.8076866 7.81256192,14.0485019 7.24804748,14.0926235 L7.05850439,14.1 C6.42320996,14.1 5.82492748,13.8525869 5.37499974,13.4041893 L5.25426138,13.2741009 C4.44931862,12.339753 4.48912884,10.9231647 5.37444548,10.0371186 L5.72320103,9.68982868 C5.83588287,9.57802718 5.98578542,9.51579911 6.14372543,9.51579911 C6.30166543,9.51579911 6.45156798,9.57802718 6.56452765,9.69010543 C6.67654615,9.80212393 6.73883398,9.95217044 6.73883245,10.1114601 C6.73795356,10.2705405 6.67603294,10.4194722 6.56364591,10.5318589 L6.21595233,10.878088 C5.75195358,11.3427621 5.75237242,12.098972 6.21663333,12.5618815 C6.44149171,12.7867399 6.73996724,12.9105153 7.05850439,12.9105153 L7.19363602,12.9030033 C7.46081863,12.8730872 7.70764495,12.754612 7.90041216,12.5618448 L8.60636088,11.8566286 C9.02537116,11.4369425 9.07168432,10.7664173 8.71384812,10.2965034 C8.61777658,10.1695832 8.57665835,10.0131953 8.59852287,9.85665616 C8.61965113,9.6990746 8.70101963,9.55945365 8.82741742,9.46377838 C8.93123821,9.38459304 9.05654028,9.34221815 9.18688525,9.34221815 Z M10,0 C11.105,0 12,0.895 12,2 L12.0013618,6.22573946 C11.5626776,5.87811031 11.0487729,5.64722225 10.5010066,5.54976919 L10.5,2.5 C10.5,1.947 10.052,1.5 9.5,1.5 L2.5,1.5 C1.948,1.5 1.5,1.947 1.5,2.5 L1.5,10.5 C1.5,11.052 1.948,11.5 2.5,11.5 L3.68645228,11.5001325 C3.65336888,12.0078695 3.73404541,12.5220887 3.92950324,13.0011293 L2,13 C0.896,13 0,12.104 0,11 L0,2 C0,0.895 0.896,0 2,0 L10,0 Z M9.90296163,6.49717499 C10.5387712,6.49717499 11.1369384,6.74422226 11.5856444,7.19216393 C12.0355508,7.64360011 12.2836836,8.24188476 12.2836836,8.87643212 C12.2836836,9.51109396 12.0354667,10.1093808 11.5857047,10.5599076 L11.238265,10.9073463 C11.1254018,11.0193278 10.9761634,11.0813759 10.8177321,11.0813759 C10.6584562,11.0813759 10.5086419,11.0196468 10.3969384,10.9070696 C10.1652847,10.6754159 10.1652847,10.2987317 10.3968639,10.0662721 L10.7442067,9.71819693 C10.9693652,9.49371462 11.0934665,9.19470305 11.0934665,8.87643212 C11.0934665,8.55751647 10.969647,8.25875787 10.7439937,8.03445432 C10.5522946,7.8421761 10.305163,7.72337461 10.0375693,7.69250354 L9.90222922,7.68446246 C9.58377018,7.68446246 9.28487484,7.8086925 9.06035815,8.03456106 L8.35504819,8.73987102 C7.98709979,9.10781942 7.90420416,9.67351223 8.13821582,10.1273776 L8.20333941,10.238335 C8.29067745,10.3724298 8.32157735,10.5313106 8.28929305,10.6857472 C8.25745182,10.8414154 8.16674242,10.9755076 8.03547299,11.060686 C7.93781365,11.1263842 7.82452153,11.1612085 7.70646673,11.1612085 C7.50682773,11.1612085 7.32088109,11.0610279 7.21073821,10.8944919 C6.58895806,9.95532087 6.71604216,8.69646471 7.51348047,7.89749743 L8.2188139,7.19289645 C8.66822263,6.74425202 9.26637747,6.49717499 9.90296163,6.49717499 Z M5.251,6 C5.662,6.004 5.993,6.339 5.993,6.75 C5.993,7.16 5.662,7.495 5.251,7.5 L3.751,7.5 C3.34,7.495 3.009,7.161 3.008,6.751 C3.008,6.34 3.338,6.005 3.749,6 L5.251,6 Z M8.251,3 C8.665,3 9.001,3.335 9.001,3.75 C9.001,4.164 8.665,4.5 8.251,4.5 L3.751,4.5 C3.337,4.5 3.001,4.165 3,3.751 C3,3.336 3.335,3 3.749,3 L8.251,3 Z"
                              />
                            </g>
                          </g>
                        </svg>
                      </el-tooltip>
                      <el-tooltip
                        :key="item.key"
                        placement="top"
                        content="关联事件"
                        popper-class="common-iw-s"
                        v-if="item.key == 'relalarm' && data.deviceCode"
                      >
                        <em
                          :class="[
                            'funcicon iconfont_tools',
                            data.showEvents
                              ? 'icon-icon_guanlian_20_s active'
                              : 'icon-icon_guanlian_20_n'
                          ]"
                          @click.stop="onRelAlarm(data, item)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        :key="item.key"
                        placement="top"
                        :content="data.isPlay ? '播放中' : '播放'"
                        popper-class="common-iw-s"
                        v-if="item.key == 'play'"
                      >
                        <em
                          :class="[
                            'funcicon iconfont_tools',
                            data.isPlay
                              ? 'icon-linye_icon_zanting active'
                              : 'icon-linye_icon_bofang'
                          ]"
                          @click.stop="onPlayDevice(data)"
                        />
                      </el-tooltip>
                    </template>
                  </div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </template>
      <div v-if="treeLoading" class="loading-datas">
        <em class="el-icon-loading"></em>
        <span>加载中</span>
      </div>
    </div>
    <camera-attribute
      v-if="nowCameraAttr"
      class="spAttr"
      :detaildata="nowCameraAttr"
      @close="onAttrClose"
    ></camera-attribute>
    <teleport :to="tele" v-if="activePop">
      <gateway-camera-dialog
        :deviceCode="selectedCode"
        :isFullRel="nowSelectedTreeNode.isFullRel"
        @close="closeMarkerWindow"
      ></gateway-camera-dialog>
    </teleport>
  </div>
</template>

<script>
import { includes, flatMap, debounce } from 'lodash-es'
import dayjs from 'dayjs'
import {
  request,
  shareRequest,
  getUserMemoryInfo,
  uptUserMemoryInfo
} from '../service/index.js'

import CTMapOl from '@ct/ct_map_ol'
import { $playerFit } from '@component-gallery/utils/funCommon/playerFit.js'
import { getUrlHead, $v } from '@component-gallery/utils/funCommon/common'
import CommonMessage from '@component-gallery/utils/funCommon/message/common-message'
import Viewshed from '@component-gallery/utils/mapCommon/Viewshed.js'
import CameraAttribute from '../components/CameraAttribute.vue'
import Teleport from '@component-gallery/base-components/Teleport.vue'
import gatewayCameraDialog from '@component-gallery/utils/dialog/gatewayCameraDialog.vue'
import { getConfig } from '../utils/resource'
import { createNameSpace } from '@component-gallery/utils/bem/create'
import eventPath from '@component-gallery/build-event-bus-path'
const bem = createNameSpace('card-dev-tree')

let pickerMinDate = ''
let nowPlayingDevice = []
let _cameraData = ''
let lastIsCardView = ''
let mapConfig = ''
let theme = ''
let MarkerIconConfig = ''
let _viewshedObj = ''
let overlayObj = ''
let singleMarker = ''
let _viewshedTime = ''
let defaultExpandMode = false

export default {
  name: 'd-card-dev-tree',
  components: { CameraAttribute, gatewayCameraDialog, Teleport },
  props: {
    hasAlarmList: {
      type: Boolean
    },
    // 图标、其它配置
    otherConfig: {
      type: Object,
      default: undefined
    },
    // 树按钮配置
    treeBtnConfig: {
      type: Array,
      default() {
        return [
          {
            key: 'collect'
          },
          {
            key: 'attr'
          },
          {
            key: 'captureRecord'
          },
          {
            key: 'play'
          }
        ]
      }
    },
    // 请求配置
    requestConfig: {
      type: Object,
      default() {
        return {
          // 查询树数据
          getVideoTree: null,
          // 查询卡片列表
          getCardViewRank: null,
          // 查询设备详情
          queryDeviceForWE: {
            url: '/video-forestry-baseservice/video/queryDeviceForWE'
          },
          // 收藏
          addDeviceToFavorites: null
        }
      }
    },
    mapId: {
      type: String,
      default: 'mapId'
    },
    // 图层Id
    layersId: {
      type: Number
    },
    viewModeKey: {
      // 用于记录是卡片视图还是列表视图的用户记忆key，外部如有需要请覆盖为别的键
      type: String,
      default: ''
    },
    defaultExpand: {
      // 是否默认展开
      type: Boolean,
      default: false
    },
    expandModeKey: {
      // 用于记录设备树展开模式的用户记忆key，外部如有需要请覆盖为别的键
      type: String,
      default: ''
    },
    videoMode: {
      type: String,
      default: 'single' // 视频播放模式，single单通道，wall视频墙
    },
    videoModeKey: {
      type: String,
      default: ''
    },
    displayModeKey: {
      type: String,
      default: ''
    },
    datetimeKey: {
      // 用于记录选择的时间的用户记忆key
      type: String,
      default: ''
    },
    paramExpandKey: {
      // 用于记录是否展开时间的用户记忆key
      type: String,
      default: ''
    },
    dateSelectTypeKey: {
      // 用于记录是选择的时间选择方式（年、月、日、自定义）
      type: String,
      default: ''
    }
  },
  inject: ['mapRef'],
  data() {
    const datepickerOption = {
      shortcuts: [
        {
          text: '今日',
          onClick(picker) {
            picker.$emit('pick', [dayjs().startOf('day'), dayjs().endOf('day')])
          }
        },
        {
          text: '近3天',
          onClick(picker) {
            picker.$emit('pick', [
              dayjs().subtract(2, 'days').startOf('day'),
              dayjs().endOf('day')
            ])
          }
        },
        {
          text: '近7天',
          onClick(picker) {
            picker.$emit('pick', [
              dayjs().subtract(6, 'days').startOf('day'),
              dayjs().endOf('day')
            ])
          }
        },
        {
          text: '近30天',
          onClick(picker) {
            picker.$emit('pick', [
              dayjs().subtract(29, 'days').startOf('day'),
              dayjs().endOf('day')
            ])
          }
        }
      ],
      disabledDate: (nowDate) => {
        if (nowDate > new Date()) {
          // 不允许选择未来时间
          return true
        }

        if (pickerMinDate) {
          // 超过区间的时间也不能，可选择日期范围为30天
          const momentA = dayjs(pickerMinDate).startOf('day')
          const momentB = dayjs(nowDate).startOf('day')

          // 判断差距是否大于最大天数，不减1，会比实际多一天
          return (
            Math.abs(momentB.diff(momentA, 'days', true)) >
            (this.otherNowConfig.maxDays || 30) - 1
          )
        }

        return false
      },
      onPick: ({ maxDate, minDate }) => {
        if (minDate) {
          pickerMinDate = pickerMinDate ? null : minDate.getTime()
        }
      },
      timeReset: false
    }
    return {
      datepickerOption,
      datepickerOption2: {
        disabledDate: (nowDate) => {
          if (nowDate > new Date()) {
            // 不允许选择未来时间
            return true
          }

          return false
        },
        timeReset: false
      },
      displayMode: '1', // displayMode：1--按区域展示    2-按组织展示     3-按标签展示
      searchValue: '',
      searchFocus: false,
      searchFavorite: false,
      treeLoading: true,
      cardViewLoading: true,
      isCardView: false, // 是否卡片视图，否。默认是设备树
      cardViewParamExpand: false,
      cardViewParam: {
        // 需求要求默认查询当前月。这个是date形式的v-model数据，实际参数在请求时处理
        uploadDate: [dayjs().startOf('month').toDate(), new Date()],
        provinceCode: '', // 省编码， 全国不传
        cityCode: '', // 地市编码
        countyCode: '', // 区县编码
        townCode: '', // 乡镇编码
        orderType: 'desc' // 排序类型 asc:升序  desc:降序, 默认降序desc
      },
      // 时间类型列表
      dateTypeList: [
        {
          value: '1',
          label: '年'
        },
        {
          value: '2',
          label: '月'
        },
        {
          value: '3',
          label: '日'
        },
        {
          value: '4',
          label: '自定义'
        }
      ],
      selectDateType: '4', // 默认的时间类型
      provinceOption: [],
      cityOption: [],
      countryOption: [],
      townOption: [],
      firstTreeNode: {
        name: null,
        num: null,
        onlineNum: null
      },
      cardViewData: [],
      cameraTreeData: [],
      // 实际的卡片视图和设备树渲染的数据是这两个filter字段，因为需要关键字模糊查询，关键字查询做在了前端
      filterViewData: [],
      filterTreeData: [],
      treeProps: {
        children: 'list',
        label: 'name'
      },
      nowSelectedIndex: -1,
      nowSelectedTreeNode: {
        deviceCode: null,
        isFullRel: null,
        code: null
      },
      expandKey: [],
      filterCodeList: [],
      videoDeviceList: [],
      nowCameraAttr: '',
      treeBtn: [],
      selectedCode: '',
      tele: '',
      activePop: '',
      isShowTree: true, // 是的显示设备树，用于根节点展开收起

      requestNowConfig: {
        // 查询树数据
        getVideoTree: null,
        // 查询卡片列表
        getCardViewRank: null,
        // 查询设备详情
        queryDeviceForWE: {
          url: '/video-forestry-baseservice/video/queryDeviceForWE'
        },
        // 收藏
        addDeviceToFavorites: null
      },
      otherNowConfig: {
        treeIcon: 'icon-tongyong-liebiaoshexiangji',
        treeChannelIcon: 'icon-tongyong_ARshijing_icon_luxiang',
        isShowStatucIcon: true,
        unitIcon: 'icon-cheliang',
        isShowDisplayMode: false, // 是否显示，切换树结构的选择框
        sortTip: '按车辆进出数量排序',
        isShowDateSelectType: false, // 是否显示时间选择方式，默认不显示
        dateSelectTip: '抓拍时间' // 时间选择提示，isShowDateSelectType为true是无效
      }
    }
  },
  computed: {
    bemClass() {
      return {
        container: bem.b('container')
      }
    }
  },
  filters: {
    filterDiscolour(value, key) {
      if (!value) {
        return ''
      }
      if (!key) {
        return value
      }
      return value.replace(
        new RegExp(`(${key})`),
        `<span class="highlight">$1</span>`
      )
    }
  },
  watch: {
    videoMode() {
      this.onChangeVideoMode()
    },
    searchValue(v) {
      this.filterNowData()
    },
    cardViewParam: {
      handler(newValue) {
        if (this.isCardView && !this.cardViewLoading) {
          this.queryCardViewData().then(() => {
            this.filterNowData()
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.requestNowConfig = {
      ...this.requestNowConfig,
      ...this.requestConfig
    }
    this.otherNowConfig = {
      ...this.otherNowConfig,
      ...this.otherConfig
    }
    let _defaultTreeBtn = [
      'collect',
      'attr',
      'captureRecord',
      'relalarm',
      'play'
    ]
    this.treeBtn = this.treeBtnConfig.filter((item) => {
      return _defaultTreeBtn.find((key) => {
        return key == item.key
      })
    })

    // 如果显示时间选择方式，默认选择方式为1（年），否则为4（自定义）
    if (this.otherNowConfig.isShowDateSelectType) {
      this.selectDateType = '1'
      // 为1（年）时，需要重设默认时间
      this.cardViewParam.uploadDate = new Date()
    } else {
      this.selectDateType = '4'
    }

    // 视频播放功能在通用，可能会有残留窗口，刚进来时关闭当前的视频播放窗口
    $playerFit.close()
    this.queryChinaDistrict()
    this.closeWallCamera()
    this._initUserMemoryInfo()
    window.addEventListener('message', this.onVideoCallback)

    // 监听弹窗关闭
    this.$globalEventBus.$on(
      `${eventPath.commonCompLayersControl}__info-window-close`,
      this._detailClose
    )
    // 摄像机弹窗关闭
    this.$globalEventBus.$on(
      `${eventPath.commonInnerUtils}__camera_datail_pop_close`,
      this._detailClose
    )
    // 告警详情关闭
    this.$globalEventBus.$on(
      `${eventPath.commonCompAlarmDetail}__alarm-detail-open-status`,
      this._detailClose
    )

    // 监听详情弹窗点击收藏、播放、关联实时抓拍记录
    this.$globalEventBus.$on(
      `${eventPath.commonCompCardDevTree}__dev-info-window-status-change`,
      this._devInfoWindowCollect
    )

    // 监听诱捕器详情弹窗收藏设备
    this.$globalEventBus.$on(
      `commonCompTrapDetailPop__Collect`,
      this._trapDetailPopCollect
    )

    // 监听可视域开关
    this.$globalEventBus.$on(
      `${eventPath.commonCompCardDevTree}__viewshed-operate`,
      this._viewshedOperate
    )
  },
  beforeDestroy() {
    // this.$globalEventBus.$off('toolboxMarkerClick', this.cancelLastInfoWindow)
    // this.$globalEventBus.$off('cameraTreeFavRefresh', this.onFavRefresh)
    // this.$globalEventBus.$off('speciesMapTypeChange', this.onMapChange)
    window.removeEventListener('message', this.onVideoCallback)
    // this.$globalEventBus.$off(
    //   'fgatewayLiveSnapFilterChannel',
    //   this.onLiveFilterChange
    // )
    this.$globalEventBus.$off(
      `${eventPath.commonCompLayersControl}__info-window-close`,
      this._detailClose
    )
    this.$globalEventBus.$off(
      `${eventPath.commonInnerUtils}__camera_datail_pop_close`,
      this._detailClose
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompAlarmDetail}__alarm-detail-open-status`,
      this._detailClose
    )

    this.$globalEventBus.$off(
      `${eventPath.commonCompCardDevTree}__dev-info-window-status-change`,
      this._devInfoWindowCollect
    )
    this.$globalEventBus.$off(
      `commonCompTrapDetailPop__Collect`,
      this._trapDetailPopCollect
    )
    this.$globalEventBus.$off(
      `${eventPath.commonCompCardDevTree}__viewshed-operate`,
      this._viewshedOperate
    )
  },
  methods: {
    onDateChange() {
      // 用户手动修改了日期，在这里保存用户记忆
      if (this.datetimeKey) {
        let _memoryValue = `${dayjs(this.cardViewParam.uploadDate[0]).format(
          'YYYY-MM-DD'
        )}~${dayjs(this.cardViewParam.uploadDate[1]).format('YYYY-MM-DD')}`
        if (this.selectDateType != '4') {
          _memoryValue = dayjs(this.cardViewParam.uploadDate).format(
            'YYYY-MM-DD'
          )
        }
        uptUserMemoryInfo({
          memoryType: this.datetimeKey,
          memoryValue: _memoryValue
        })
      }
    },
    // 查询区域树，这个数据供卡片视图时筛选使用
    // 需求要求只能展示有数据的情况，所以改为直接使用视频设备树（区域模式）的数据进行填充
    async queryChinaDistrict() {
      // 回调制。
      // 如果配置里有自定义回调，使用自定义回调的结果。自定义回调应当返回符合格式的内容。
      const videoTreeCallback =
        this.requestNowConfig.getVideoTree || this.defaultGetVideoTree
      const resultList = await videoTreeCallback(request, {
        displayMode: 1,
        searchFavorite: '1'
      })
      this.provinceOption = resultList[0].list
    },
    async queryCameraTree() {
      this.treeLoading = true
      const videoTreeCallback =
        this.requestNowConfig.getVideoTree || this.defaultGetVideoTree
      const resultList = await videoTreeCallback(request, {
        displayMode: this.displayMode,
        searchFavorite: this.searchFavorite ? '0' : '1' // 0只查询收藏的 1查询全部
      })
      if (resultList?.length > 0) {
        // 如果有数据
        ;(function fn(list, parentCode = '') {
          list.forEach((item) => {
            item.isPlay = false
            item.isFullRel = false
            if (item.list && item.list.length) {
              fn(item.list, item.code)
            }
            // 组织、标签的树数据，会出现重复数据（同一设备在不同标签、组织下），加上parentCode防止出现相同的code
            item.code += `__${parentCode}`
          })
        })(resultList)
        this.firstTreeNode = resultList[0] // 我们认为返回的数据一定是有一个固定根节点的树数据
        this.cameraTreeData = resultList[0].list // 实际的摄像机数据是根节点下面的子节点
      } else {
        // 没有数据，为空，那么就重置这个树
        this.firstTreeNode = {}
        this.cameraTreeData = []
      }
      this.filterNowData()
      setTimeout(() => {
        this.treeLoading = false
      }, 300)
    },
    async queryCardViewData() {
      this.cardViewLoading = true
      const params = {
        ...this.cardViewParam,
        orderBy: this.cardViewParam.orderType || 'desc'
      }
      // 绑定在data里的日期是Date类型，转换为对应的字符串格式
      let _formatDate = (date) => {
        return dayjs(date).format('YYYY-MM-DD')
      }
      params.selectDateType = this.selectDateType
      if (this.selectDateType != '4') {
        params.uploadDate = _formatDate(this.cardViewParam.uploadDate)
      } else {
        if (this.cardViewParam.uploadDate[0]) {
          params.alarmTimeStart = _formatDate(this.cardViewParam.uploadDate[0])
        }
        if (this.cardViewParam.uploadDate[1]) {
          params.alarmTimeEnd = _formatDate(this.cardViewParam.uploadDate[1])
        }
        // 进行一次保险转换，这是为了避免传递错误数据类型给后端（uploadDate一定是Date对象）
        params.uploadDate = [
          dayjs(this.cardViewParam.uploadDate[0]).toDate(),
          dayjs(this.cardViewParam.uploadDate[1]).toDate()
        ]
      }
      const getCardViewRankCallback =
        this.requestNowConfig.getCardViewRank || this.defaultGetCardViewRank

      try {
        const result = await getCardViewRankCallback(request, params)
        this.cardViewData = result
      } catch (e) {
        console.error(e)
      }

      this.cardViewLoading = false
    },
    // 完全展开设备树
    // saveUserMemory:这次操作要保存进用户记忆 对于内部业务方法而言，这次操作就不应该保存进用户记忆
    // 默认情况下都不保存用户记忆，仅在手动点击展开按钮时保存
    onExpandTree(saveUserMemory = false, force) {
      const recusivePush = (n) => {
        n.forEach((p) => {
          this.expandKey.push(p.code)
          if (p.list) {
            recusivePush(p.list)
          }
        })
      }
      const _setdefaultExpandMode = (flag) => {
        if (!saveUserMemory) {
          return
        }

        defaultExpandMode = flag
        if (this.expandModeKey) {
          uptUserMemoryInfo({
            memoryType: this.expandModeKey,
            memoryValue: flag ? 'true' : ''
          })
        }
      }
      if (this.expandKey.length === 0 || force) {
        recusivePush(this.filterTreeData)
        this.expandKey = [...this.expandKey]
        _setdefaultExpandMode(true)
      } else {
        // 单纯把expandKey置空不能收起，必须重新触发一次渲染
        this.expandKey = []
        this.filterTreeData = [...this.filterTreeData]
        _setdefaultExpandMode(false)
      }

      this.$nextTick(() => {
        if (this.nowSelectedTreeNode) {
          this.$refs.deviceTree?.setCurrentKey(this.nowSelectedTreeNode.code)
        }
      })
    },
    // 刷新按钮。其实这个刷新按钮只刷新设备树，所以和直接查询设备树是一回事
    onRefresh() {
      this.queryCameraTree()
    },
    onDisplayModeChange() {
      if (this.displayModeKey) {
        uptUserMemoryInfo({
          memoryType: this.displayModeKey,
          memoryValue: this.displayMode
        })
      }
      this.queryCameraTree()
    },
    onTreeNodeClick(item) {
      this.onActualNodeClick(item)
    },
    onActualNodeClick(_item, event) {
      if (!_item.deviceCode) {
        // 没有经纬度 也没有设备编码，说明是设备树数据上的区域分组节点，点击它们没有意义，拦截
        this.$refs.deviceTree?.setCurrentKey(this.nowSelectedTreeNode.code)
        return
      }
      // 如果不是区域分组节点，就拦截点击事件（避免点击文字部分展开收起）
      event?.stopPropagation()
      // 重复点击设备树上已经选中的节点的话，就取消选中这个节点
      if (
        this.nowSelectedTreeNode.code &&
        this.nowSelectedTreeNode.code === _item.code
      ) {
        this.closeMarkerWindow()
        return
      }
      this.$refs.deviceTree?.setCurrentKey(_item.code)
      this.onSelectDevice(_item, false)
    },
    async onSelectDevice(_item, noZoom = false) {
      // 重复点击设备树上已经选中的节点的话，就取消选中这个节点
      if (this.nowSelectedTreeNode === _item) {
        this.cancelSelect()
        this.$emit('treenodeselect', null)
        return
      }
      const cameraData = await this.queryCameraData(_item.deviceCode)
      cameraData.id =
        cameraData.siteCode || cameraData.longitude + ',' + cameraData.latitude
      this.nowSelectedTreeNode = _item
      let payload = {
        status: cameraData.status,
        latitude: cameraData.latitude,
        longitude: cameraData.longitude,
        deviceCode: cameraData.deviceCode,
        singleId: cameraData.deviceCode
      }
      this.$emit('treenodeselect', _item)
      // 如果有图层Id，就调用图层的方法，没有就自己打点
      if (this.layersId) {
        // 选中单个点并打开弹窗
        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__highlight-point`,
          {
            type: this.layersId,
            code: cameraData.id,
            lnglat: [cameraData.longitude, cameraData.latitude],
            payload
          }
        )
        // 并打开弹窗
        // this.$globalEventBus.$emit(
        //   `${eventPath.commonCompLayersControl}__info_window-operate`,
        //   {
        //     status: true,
        //     isSingle: false,
        //     layerId: 1,
        //     info: cameraData
        //   }
        // )
      } else {
        // 没有就自己打点
        this.handleSingleMarkerRender(
          cameraData.siteCode,
          [cameraData.longitude, cameraData.latitude],
          payload
        )
        _cameraData = cameraData
      }
    },
    // // 查询摄像机详情，供设备树使用
    queryCameraData(deviceCode) {
      return new Promise((resolve, reject) => {
        let _collectConfig = this.requestNowConfig.queryDeviceForWE
        shareRequest(_collectConfig.url, {
          deviceCode
        }).then((res) => {
          resolve(res.data)
        })
      })
    },
    // 处理省市区镇联动
    // code代表选择的编码，level代表级别，0-based，0是省，1是市，以此类推
    onChangeAreaParam(code, level) {
      const optionLevel = [
        'provinceOption',
        'cityOption',
        'countryOption',
        'townOption'
      ]
      const paramLevel = ['provinceCode', 'cityCode', 'countyCode', 'townCode']
      // 如果没有传areaCode，那么就只认为是清空
      if (!code) {
        // 将下属层级的选项全部清空
        paramLevel.slice(level + 1).forEach((o, ind) => {
          this[optionLevel[level + 1 + ind]] = []
          this.$set(this.cardViewParam, o, null)
        })
        return
      }
      const target = this[optionLevel[level]].find((o) => o.code === code)
      // 如果有下一层的话，处理下一层的联动
      if (target && optionLevel[level + 1]) {
        // target的下一层可能就跑到摄像机节点去了，要注意拦住不能有deviceCode的记录
        this[optionLevel[level + 1]] = target.list.find((i) => i.deviceCode)
          ? []
          : target.list || []
        // 将下属层级的选项全部清空
        paramLevel.slice(level + 1).forEach((o) => {
          this.$set(this.cardViewParam, o, null)
        })
        // 全国的情况下就当作是空的，容错用
        if (level === 0 && code === '100000') {
          this.cardViewParam.provinceCode = ''
        }
      }
    },
    // 切换卡片视图排序方法
    // 这里切换排序字段开始为空（这其实默认查询还是降序），点击一次升序，然后升降切换
    changeCardViewSort() {
      this.$set(
        this.cardViewParam,
        'orderType',
        this.cardViewParam.orderType === 'asc' ? 'desc' : 'asc'
      )
    },
    async onSwitchCardView(v) {
      this.cancelSelect()
      this.isCardView = v
      if (this.viewModeKey) {
        uptUserMemoryInfo({
          memoryType: this.viewModeKey,
          memoryValue: this.isCardView ? 'true' : ''
        })
      }
      if (this.isCardView) {
        this.searchFavorite = false // 卡片视图不查询收藏，如果是收藏下进入卡片视图应当关闭
        this.queryCameraTree() // 立刻查询一遍未收藏设备树，不然切换回来还是已收藏
      }
    },
    // cleanLastMarker() {
    //   if (this.lastMarker) {
    //     this.lastMarker.destroy()
    //     this.lastMarker = null
    //   }
    // },
    cancelSelect(isCloseInfoWindow = true) {
      // if (this.nowSelectedTreeNode.deviceCode) {
      //   this.$globalEventBus.$emit(
      //     'deselectGatewayCameraViewshed',
      //     this.nowSelectedTreeNode
      //   )
      // }
      this.nowSelectedTreeNode = {}
      this.$refs.deviceTree?.setCurrentKey(null)
      if (isCloseInfoWindow) {
        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__highlight-point`,
          {
            type: this.layersId,
            code: ''
          }
        )
        this.$globalEventBus.$emit(
          `${eventPath.commonCompLayersControl}__info_window-operate`,
          {
            status: false
          }
        )
      }
    },
    // cancelMyViewShed() {
    //   if (this.myViewShed) {
    //     this.myViewShed.destroy()
    //     this.myViewShed = null
    //   }
    //   this.viewShedData = null
    // },
    // cancelLastInfoWindow() {
    //   if (this.nowVueInst) {
    //     this.nowVueInst?.$destroy() // 解绑vue和元素
    //     this.nowVueInst?.$el?.remove() // 手工移除该元素
    //     this.nowVueInst = null
    //   }
    // },
    // 开启收藏模式
    onFavor() {
      this.searchFavorite = !this.searchFavorite
      this.expandKey = []
      if (this.searchFavorite) {
        lastIsCardView = this.isCardView // 记录上一次是怎么来的
        // 收藏模式仅在设备树上生效，因此如果现在是卡片视图，应当返回设备树
        this.isCardView = false
        this.queryCameraTree()
      } else {
        this.isCardView = !!lastIsCardView
        // 取消收藏，查询两边的最新数据避免问题
        this.queryCardViewData()
        this.queryCameraTree()
      }
    },
    // 内部方法，递归搜索树结构的名称关键字（保留原始树结构）
    _findNodesWithSubstring(node, substring) {
      if (includes(node.name, substring)) {
        return [node]
      }
      const childNodes = flatMap(node.list, (childNode) =>
        this._findNodesWithSubstring(childNode, substring)
      )
      if (childNodes.length > 0) {
        return [{ ...node, list: childNodes }]
      }
      return []
    },
    // 按照目前的搜索条件处理数据
    // 注意：这个方法里产生的数据才是真正意义上的实际渲染数据
    filterNowData: debounce(function () {
      if (this.searchValue) {
        // 卡片视图数据直接刷就好
        this.filterViewData = this.cardViewData.filter(
          (o) => o.deviceName.indexOf(this.searchValue) !== -1
        )
        // 设备树数据，重新构筑设备树
        this.filterTreeData = flatMap(this.cameraTreeData, (rootNode) =>
          this._findNodesWithSubstring(rootNode, this.searchValue)
        )
        this.onExpandTree(false, true)
        return
      } else {
        this.filterViewData = this.cardViewData
        this.filterTreeData = this.cameraTreeData
      }
      // 如果有展开记录那就自动展开
      if (defaultExpandMode) {
        // 做延迟，因为树渲染需要时间，$nextTick不够长等待到树处理结束。由于默认情况下设备树是关闭状态，这个延迟是无感知到，没有关系
        setTimeout(() => {
          this.onExpandTree(false, true)
        }, 300)
      }
    }, 200),
    // setTooltipDisabled(e, data) {
    //   const trigger = e.currentTarget
    //   if (trigger.scrollWidth <= trigger.offsetWidth) {
    //     this.$set(data, '_tooltipDisable', true)
    //   } else {
    //     this.$set(data, '_tooltipDisable', false)
    //   }
    // },
    isAllFavor(data) {
      return data.isMonitor === '1'
    },
    // 收藏一个设备
    favorDevice(device, isFavor) {
      let objCodeList = []
      let _isMonitor = isFavor ? '1' : '0'
      this.$set(device, 'isMonitor', _isMonitor) // 收藏字段。使用$set触发响应式渲染不然图标不会更新
      const recursiveFind = (arr) => {
        if (!arr) {
          return
        }
        arr.forEach((o) => {
          this.$set(o, 'isMonitor', _isMonitor)
          if (o.deviceCode) {
            objCodeList.push(o.deviceCode)
          }
          if (o.list) {
            recursiveFind(o.list)
          }
        })
      }
      if (device.channelCode) {
        objCodeList = [device.channelCode]
      } else if (device.deviceCode) {
        // 这是个叶子节点（具体的野保相机设备）
        objCodeList = [device.deviceCode]
        device.list?.forEach((item) => {
          this.$set(item, 'isMonitor', _isMonitor)
        })
      } else {
        // 没有deviceCode的是二级分类节点，需要遍历它之下的所有叶子节点一口气平铺提交（顺便设置收藏字段）
        recursiveFind(device.list)
      }
      const addFavorCallback =
        this.requestNowConfig.addDeviceToFavorites || this.defaultAddDeviceFavor
      addFavorCallback(request, {
        isFavor,
        device,
        list: objCodeList
      }).then(() => {
        CommonMessage.success(isFavor ? '收藏成功！' : '取消收藏成功！')
        this._setDevTreeState(['1', '0'], 'isMonitor', this.searchFavorite)
        this._noticeCollectState()
      })
    },
    // 通知打点详情弹窗收藏状态
    _noticeCollectState() {
      let _selectDev = this.$refs.deviceTree?.getCurrentNode()
      // 通知相机详情弹窗同步更新状态
      if (_selectDev) {
        let param = {
          isMonitor: _selectDev.isMonitor,
          devCode: _selectDev.deviceCode
        }
        if (this.layersId) {
          param.layersId = this.layersId
        }
        this.$globalEventBus.$emit(
          `${eventPath.commonCompCardDevTree}__dev-trww-collect`,
          param
        )
      }
    },
    // 设置设备树的收藏、播放等状态
    // state：[成功状态，失败状态]
    _setDevTreeState(state, key, isdel = false) {
      let _state = state[0]
      const fn = (o) => {
        this.$set(o, key, state[1])
        let _arr = o.list.filter((item) => {
          if (item.list && item.list.length) {
            fn(item)
          }
          return item[key] == _state
        })
        if (_arr.length && _arr.length === o.list.length) {
          this.$set(o, key, _state)
        }
      }
      const _delFn = (o) => {
        if (o[key] == state[1]) {
          this.$refs.deviceTree.remove(o)
        } else {
          // 有子元素才进入，防止部分数据，最后的层级的元素list是[]，而不是null，被误删
          if (o.list && o.list.length) {
            o.list.forEach((item) => {
              _delFn(item)
            })
            if (!o.list.length) {
              this.$refs.deviceTree.remove(o)
            }
          }
        }
      }
      this.filterTreeData.forEach((o) => {
        // 如果是收藏模式，则直接删除取消收藏的节点
        if (isdel && key == 'isMonitor') {
          _delFn(o)
        } else {
          fn(o)
        }
      })
    },
    _afterFavorDevice() {
      this.onRefresh()
      // 通知相机详情弹窗同步更新状态
      // this.$globalEventBus.$emit('gatewayCameraDetailChange')
    },
    // // 按外部要求，更新设备树内的节点收藏状态
    // onFavRefresh({ deviceCode, optType }) {
    //   this.onRefresh()
    // },
    onShowDeviceAttr(data) {
      if (
        this.nowCameraAttr?.deviceCode === data.deviceCode &&
        this.nowCameraAttr?.channelCode === data.channelCode
      ) {
        this.nowCameraAttr = ''
      } else {
        this.nowCameraAttr = data
      }
    },
    onRelLiveSnapshot(data) {
      // 唤醒实时抓拍查询
      // 确认当前节点状态。如果当前节点是已勾选就反选；否则反之
      const _relsnapshot = data.isFullRel
      let objCodeList = []
      let recursiveFind = (item) => {
        this.$set(item, 'isFullRel', !_relsnapshot)
        if (item.list && item.list.length) {
          item.list.forEach((dev) => {
            recursiveFind(dev)
          })
        }
        if (item.channelCode) {
          objCodeList.push(item.channelCode)
        }
      }
      recursiveFind(data)
      if (!data.channelCode) {
        if (_relsnapshot) {
          objCodeList = this.filterCodeList.filter(
            (i) => !objCodeList.find((o) => o === i)
          )
        }
      } else {
        // 就是一个设备节点，那就只唤起它一个
        if (_relsnapshot) {
          objCodeList = this.filterCodeList.filter(
            (i) => i !== data.channelCode
          )
        }
      }
      this.filterCodeList = objCodeList
      this.$globalEventBus.$emit(
        `${eventPath.commonCompSnapList}__visible-filter`,
        {
          channelCodes: this.filterCodeList
        }
      )
      this._setDevTreeState([true, false], 'isFullRel')
      this._noticeisFullRelState()
    },
    onRelAlarm(data, options) {
      // 唤醒关联事件
      // 确认当前节点状态。如果当前节点是已勾选就反选；否则反之
      const showEvents = data.showEvents
      this.$set(data, 'showEvents', !showEvents)

      if (options.onClick) {
        // 如果有外部事件，使用外部事件，不使用原始事件
        options.onClick(!showEvents, data)
        return
      }

      if (!this.hasAlarmList) {
        // 打开控制台
        const urlHead = getUrlHead()
        const params = { dc: data.deviceCode }
        if (!showEvents) {
          $v.openPage(urlHead + '/eventManagement', params)
        }
      } else {
        this.$globalEventBus.$emit(`${eventPath.commonCompAlarmFilte}__open`, {
          devices: [
            {
              devType: 1,
              code: showEvents ? '' : data.deviceCode
            }
          ],
          state: !showEvents
        })
      }
    },
    // 通知打点详情弹窗实时抓拍状态
    _noticeisFullRelState() {
      let _selectDev = this.$refs.deviceTree?.getCurrentNode()
      // 通知相机详情弹窗同步更新状态
      if (_selectDev) {
        this.$globalEventBus.$emit(
          `${eventPath.commonCompCardDevTree}__dev-trww-isFullRel-change`,
          _selectDev.isFullRel
        )
      }
    },
    onPlayDevice(data, forcePause = false) {
      // 对当前节点播放或暂停视频
      // 收集通道编码
      if (!data) {
        // 如果没有传data，那么意味着此次播放是“刷新模式”的目的，而不是拉起一次全新的处理
        if (!nowPlayingDevice.length) {
          return
        }
        this._playDeviceAsNow()
        return
      }
      let objCodeList = []
      const isPause = forcePause || data.isPlay
      let recursiveFind = (item) => {
        this.$set(item, 'isPlay', !isPause)
        if (item.list && item.list.length) {
          item.list.forEach((dev) => {
            recursiveFind(dev)
          })
        } else if (item.channelCode) {
          objCodeList.push(item)
        } else {
          // sonar要求必须有else
          console.log('不用处理')
        }
      }
      recursiveFind(data)
      // 如果传了data，先判断当前data的状态是什么，然后再处理接下来的事情
      if (data.status === '1' && data.channelCode) {
        CommonMessage.info('设备离线，无法播放')
        return
      }
      if (!objCodeList || objCodeList.length === 0) {
        CommonMessage.info('设备离线，无法播放')
        return
      }
      if (isPause) {
        // 是暂停，那么应当移除这个范围里的所有通道
        const removeList = nowPlayingDevice.filter((i) =>
          objCodeList.find((o) => o.channelCode === i.channelCode)
        )
        this._removeVideo(removeList)
        nowPlayingDevice = nowPlayingDevice.filter(
          (i) => !objCodeList.find((o) => o.channelCode === i.channelCode)
        )
      } else {
        this._processingList(objCodeList)
      }
      this._setDevTreeState([true, false], 'isPlay')
    },
    _processingList(arr) {
      // 是播放，需要判断现在是追加，还是全新拉起
      const addList = arr.filter(
        (i) => !nowPlayingDevice.find((o) => o.channelCode === i.channelCode)
      )
      if (addList.length === 0) {
        // 如果长度为0代表什么都不做。这种情况正常来讲不可能出现，这个判断用于极限容错（如通道编码在测试数据里出现重复的情况）。
        return
      }
      // const videoData = addList.map((o) => ({
      //   deviceCode: o.deviceCode,
      //   channelCode: o.channelCode,
      //   openQuickTool: true
      // }))
      if (nowPlayingDevice.length > 0) {
        // 追加模式
        this._playDeviceAsNow(addList)
      } else {
        // 全新播放，用现在的数据取代整个原始数组
        nowPlayingDevice = addList
        this._playDeviceAsNow()
      }
    },
    // // 移除所选视频通道
    _removeVideo(list) {
      if (!list || list.length === 0) {
        return
      }
      if (this.videoMode === 'single') {
        $playerFit.close(list)
      } else {
        this.closeWallCamera(list)
      }
    },
    // 按照当前的状态，重新播放视频列表里的所有设备（等同于刷新）
    _playDeviceAsNow(newlist) {
      if (!newlist) {
        // 关闭之前的所有窗口，按照当前状态重新拉起一遍对应的模式
        $playerFit.close()
        this.closeWallCamera()
        if (!nowPlayingDevice || nowPlayingDevice.length === 0) {
          // 如果是空的那就什么都不要做了；注意：不能因为length为0就不去关闭视频和视频墙，
          // 因为视频是可能存在滞留的，视频墙在没有可以播放的视频时也依然会出现在窗口里
          return
        }
      }
      if (this.videoMode === 'single') {
        this._playSingle(newlist)
      } else {
        this._playWall(newlist)
      }
    },
    _playSingle(newlist) {
      // 单通道模式
      if (newlist) {
        // 如果当期播放数量小于5，就在后方追加；否则是前方
        const fullList =
          nowPlayingDevice.length < 5
            ? [...nowPlayingDevice, ...newlist]
            : [...newlist, ...nowPlayingDevice.slice(newlist.length - 1)]
        // rightByAppend方法的表现不如预期，追加依然做成直接重新播放，原有代码注释备考
        // if (fullList.length > 5) {
        // 如果播放列表上限完全超过5，那就从头开始处理算了
        // 手动切割当前播放列表最大上限5
        $playerFit.close()
        nowPlayingDevice = fullList.slice(0, 5)
      } else {
        // 手动切割当前播放列表最大上限5
        nowPlayingDevice = nowPlayingDevice.slice(0, 5)
      }
      // 以下计算从摄像机树抄来的，具体含义未知
      const bottom = 112
      const top = 0
      const overallHeight = window.innerHeight
      const height = overallHeight - bottom - top
      const videoListNeedHeight = (214 + 12) * 3
      let scale = 1
      if (height < videoListNeedHeight) {
        scale = (height / 3 - 12) / 214
      }
      let _rem = this._getElStyle(document.documentElement, 'fontSize')
      let marginX = 52 * scale
      // 林区卡口的宽度是3.94rem，转换为px + 快捷功能宽度0.4rem + 边距0.06rem
      let _right = window._remoteMetadata.videoPositionRight
        ? `${window._remoteMetadata.videoPositionRight}px`
        : _rem * 3.94 + _rem * (0.4 + 0.06) + 12 + 'px'
      $playerFit.right(
        nowPlayingDevice.map((dev) => {
          dev.openQuickTool = true
          return dev
        }),
        'append',
        {
          checked: 'red',
          openQuickTool: true,
          bottom: (116 * window.innerHeight) / (1080 - 52),
          bHeight: (214 + 12) * 3,
          margin: [marginX, 12],
          right: _right
        }
      )
    },
    _getElStyle(el, key) {
      return parseFloat(window.getComputedStyle(el, null)[key])
    },
    _playWall(newlist) {
      // 视频墙
      if (newlist) {
        nowPlayingDevice = [...newlist, ...nowPlayingDevice]
      }
      const videoParam = {
        videoType: newlist ? 'videosAppend' : 'videos',
        videosData: {
          videoList: newlist || nowPlayingDevice,
          videoWidth: '58%',
          videoHeight: '64%',
          positonLeft: '21%',
          positonTop: '18%',
          // "videoWidth": videoWidth + 'px',
          showClose: true,
          transformOrigin: '0 0',
          playCallBackMethod: 'playWallCamera'
        }
      }
      // sonar-exclude-start
      window.parent.postMessage(videoParam, '*') // NOSONAR
      // sonar-exclude-end
    },
    closeWallCamera(list) {
      const videoParam = {
        videoType: list ? 'removeMutiVideo' : 'removeMutiAll',
        videosData: {
          videoList: list
        }
      }
      // sonar-exclude-start
      window.parent.postMessage(videoParam, '*') // NOSONAR
      // sonar-exclude-end
    },
    onChangeVideoMode() {
      if (this.videoModeKey) {
        uptUserMemoryInfo({
          memoryType: this.videoModeKey,
          memoryValue: this.videoMode
        })
      }
      this._playDeviceAsNow(null)
    },
    refreshScrollBar() {
      // 外部使用的刷新el-scrollbar状态
      let _elscrollbar = this.$refs.elscrollbar
      if (Array.isArray(_elscrollbar)) {
        _elscrollbar.forEach((o) => o.update())
      } else {
        _elscrollbar.update()
      }
    },
    // 监听父容器送来的视频消息事件。
    onVideoCallback(e) {
      if (!e.data) {
        return
      }
      if (e.data.callBackMethod === 'bigScreenPlayerClose') {
        // 单通道视频关闭
        const { videoData } = e.data
        nowPlayingDevice = nowPlayingDevice.filter((i) => {
          if (i.channelCode !== videoData.channelCode) {
            return true
          } else {
            i.isPlay = false
            return false
          }
        })

        this._setDevTreeState([true, false], 'isPlay')
      } else if (e.data.callBackMethod === 'playWallCamera') {
        // 视频墙播放回调
        if (this.videoMode !== 'wall') {
          return
        }
        // 如果存在flag，才接受视频墙信息；
        // removeList表示视频墙移除掉的视频列表
        const { removeList } = e.data
        this._batchSetIsPlay(removeList)
      } else if (e.data.callBackMethod === 'collectCallBack') {
        // 收藏有更新，刷新设备树
        this._afterFavorDevice()
      } else {
        console.log('不做处理')
      }
    },
    _batchSetIsPlay(removeList) {
      if (!removeList.length) {
        return
      }
      nowPlayingDevice = nowPlayingDevice.filter(
        (o) =>
          !removeList.find((i) => {
            if (
              i.channelCode === o.channelCode &&
              i.deviceCode === o.deviceCode
            ) {
              o.isPlay = false
              return true
            } else {
              return false
            }
          })
      )
      this._setDevTreeState([true, false], 'isPlay')
    },
    // onMapChange() {
    //   // 父页面地图类型切换回调。如果切换后，地图类型从2D→3D进行了转换，则重新补充当前的打点
    //   const newMapType = CommonMapSlim.is3DMapInstance(
    //     CommonMap.getMapNew(this.mapId)
    //   )
    //   if (this.nowSelectedTreeNode && newMapType !== this.mapType3d) {
    //     // 地图类型的二维/三维发生了变化，重新打点。但本次重新打点不需要进行镜头调整
    //     this.onSelectDevice(this.nowSelectedTreeNode, true)
    //   }
    // },
    onCardParamExpand() {
      this.refreshScrollBar()
      this.cardViewParamExpand = !this.cardViewParamExpand
      if (this.paramExpandKey) {
        uptUserMemoryInfo({
          memoryType: this.paramExpandKey,
          memoryValue: this.cardViewParamExpand ? 'true' : ''
        })
      }
    },
    // // 响应父组件的mapClick
    // onMapClick() {
    //   this.cancelSelect()
    // },
    handleNodeExpand(data) {
      if (!this.expandKey.find((i) => data.code === i)) {
        this.expandKey.push(data.code)
      }
    },
    handleNodeCollapse(data) {
      this.expandKey = this.expandKey.filter((i) => i !== data.code)
    },
    async handleSingleMarkerRender(
      code,
      [lng, lat],
      payload,
      isSelected = true,
      isFocus = true,
      zoom = 12
    ) {
      const mapRef = this.mapRef.getMapRef(this.mapId)
      if (!mapConfig) {
        // 当前主题
        theme = document
          .getElementsByTagName('html')[0]
          .getAttribute('data-theme')
        mapConfig = getConfig(theme)
        MarkerIconConfig = mapConfig.iconConfig
      }
      // 如果没初始化可视域，先初始化
      if (!_viewshedObj) {
        const themeMap = {
          'theme-wiseblue': 'ty',
          'theme-aquamarine': 'ly',
          'theme-terracotta': 'gt'
        }
        _viewshedObj = new Viewshed(
          this.mapRef.getMapRef(this.mapId),
          themeMap[theme]
        )
      }
      // 清楚之前的可视域
      _viewshedObj.clearViewshed()
      // 渲染前确保清除旧的点
      this.handleSingleMarkerRemove()
      const configObj = MarkerIconConfig
      const _size = [configObj.width || 34, configObj.height || 34]
      const _x = _size[0] / 2
      let _offset = _size[0] !== _size[1] ? [_x, _size[1]] : [_x, _x]
      // 林业打点调整偏移量
      if (theme === 'theme-aquamarine') {
        _offset = _size[0] !== _size[1] ? [_x, _size[1] - 10] : [_x, _x]
      }
      // 设备在离线状态 true 在线 false 离线
      const status = payload.status === '0'
      const point = {
        layerType: this.layersId, // 标识图层
        id: code,
        longitude: +lng,
        latitude: +lat,
        lnglat: [+lng, +lat],
        icon: status ? configObj.icon1 : configObj.icon2,
        clickIcon: configObj.clickIcon,
        iconSize: _size,
        offset: _offset,
        clickBig: false,
        deviceCode: payload?.deviceCode || ''
      }
      // 离线摄像机采用第二个选中图标
      if (!status) {
        point.clickIcon = configObj.clickIcon2
      }
      const list = [point]

      const markerCluster =
        await new CTMapOl.DataSourceControl.lib.MarkerCluster(
          {
            mapRef,
            data: list
          },
          {
            gridSize: 80, // 聚合网格像素大小
            styles: [
              {
                url: configObj.clusterImg,
                size: [configObj.clusterWidth, configObj.clusterHeight],
                offset: configObj.clusterOffset,
                textColor: 'white',
                textSize: 14,
                textOffset: [0, 8]
              }
            ],
            maxZoom: 18,
            zIndex: 50,
            onSelectFunc: (map, type, { geometry, props, entity } = {}) => {
              const themeOffsetMap = {
                'theme-wiseblue': [0, -20],
                'theme-aquamarine': [0, -30],
                'theme-terracotta': [0, -20]
              }
              const dom = document.createElement('div')
              let domid = `cardDevTreeDialog`
              dom.id = domid
              dom.innerHTML = ''
              document.body.appendChild(dom)
              overlayObj = CTMapOl.OverlayControl.common.addOverlay(
                {
                  mapRef,
                  coord: [+props.longitude, +props.latitude],
                  domid
                },
                {
                  positioning: 'bottom-center',
                  offset: themeOffsetMap[theme] || [0, -30]
                }
              )
              this.tele = `#${domid}`
              this.selectedCode = props.deviceCode
              this.activePop = true

              const { _zoom } = CTMapOl.ViewControl.common.getViewerStatus({
                mapRef
              })
              CTMapOl.ViewControl?.common?.setZoomAndCenter(
                { mapRef },
                {
                  center: [+props.longitude, +props.latitude],
                  zoom: _zoom < 12 ? 12 : _zoom,
                  duration: 1000,
                  offset: [0, 0]
                }
              )
            },
            onUnselectFunc: () => {
              this.handleSingleMarkerRemove()
              this.cancelSelect(false)
              this._closePollingViewshed()
            }
          }
        )
      markerCluster.init()
      markerCluster.mount()
      this._pollingViewshed()
      singleMarker = markerCluster
      // 追加选中
      if (isSelected) {
        this.selectedCode = code
        setTimeout(() => {
          // 三维locationById后无法触发点击事件，手动选中
          this.highlightMarker(code, true, payload)
          markerCluster.locationById(code, {
            center: isFocus,
            zoom,
            setselect: mapRef.mapType === '2D'
          })
          _viewshedObj.setViewshedSelected(code)
        }, 50)
      }
    },
    // 清除单个打点
    handleSingleMarkerRemove() {
      if (singleMarker) {
        singleMarker.destroy()
        singleMarker = null
        this.selectedCode = ''
        _cameraData = ''
        this._closeMarkerWindow()
        // this.clearViewshed(1)
      }
      this._closePollingViewshed()
    },
    // 关闭详情弹窗
    _closeMarkerWindow() {
      const mapRef = this.mapRef.getMapRef(this.mapId)
      if (overlayObj) {
        CTMapOl.OverlayControl.common.removeOverlay({
          mapRef,
          overlayCollection: overlayObj
        })
        overlayObj = null
        this.activePop = false
      }
    },
    /**
     * 高亮某个打点 而不触发点击事件
     * @param {*} id 打点id
     * @param {*} status 选中状态 默认为true
     * @param {*} deviceInfo 设备信息
     */
    async highlightMarker(id, status = true, deviceInfo = {}) {
      const deviceStatus = deviceInfo.status === '0'
      const target = singleMarker
      const mapRef = this.mapRef.getMapRef(this.mapId)
      if (!target || !deviceInfo) {
        return
      }
      this.selectedCode = status ? id : ''
      const configObj = MarkerIconConfig
      if (mapRef.mapType === '2D') {
        return
      }
      let icon = status
        ? configObj.clickIcon
        : deviceStatus
        ? configObj.icon1
        : configObj.icon2
      // 离线摄像机选中采用第二个选中图标
      if (status && !deviceStatus) {
        icon = configObj.clickIcon2
      }

      target.propertySearch({
        forEachFunc: ({ entity }) => {
          if (entity.properties.id._value === id) {
            entity.billboard.image = icon
          }
        }
      })
      // 摄像机还需要关闭可视域选中
      // if (!status && +layerId === 1) {
      //   // 如果当前目标是单独打点并且打开弹窗的情况下 不处理取消可视域选中 因为这时可视域会被清除
      //   if (singleMarker && this.activeWindowId) return
      //   this.clearViewshedSelect(1)
      // }
    },
    // 详情弹窗关闭事件
    closeMarkerWindow() {
      this.cancelSelect()
      this.handleSingleMarkerRemove()
    },
    // 开启轮询可视域
    _pollingViewshed() {
      if (!_cameraData || !_viewshedObj) {
        return
      }
      // 轮询之前，先查一次
      _viewshedObj.renderViewshed([_cameraData])
      _viewshedTime = setInterval(() => {
        _viewshedObj.renderViewshed([_cameraData])
      }, 5000)
    },
    _closePollingViewshed() {
      _viewshedObj && _viewshedObj.clearViewshed()
      if (_viewshedTime) {
        clearInterval(_viewshedTime)
        _viewshedTime = ''
      }
    },
    // 初始化记忆
    _initUserMemoryInfo() {
      // 部分设置有传入默认值，先设置
      defaultExpandMode = this.defaultExpand

      // 用户记忆上一次是卡片模式还是列表模式，切换后进行第一次查询
      const memoryList = [
        this.viewModeKey,
        this.expandModeKey,
        this.displayModeKey,
        this.datetimeKey,
        this.paramExpandKey,
        this.dateSelectTypeKey
      ].filter((i) => i)
      if (!memoryList.length) {
        this.queryCardViewData()
        this.queryCameraTree()
        return
      }
      getUserMemoryInfo({ memoryTypeList: memoryList }).then(async (resp) => {
        let _config = {
          [this.viewModeKey]: (v) => {
            this.isCardView = !!v
          },
          [this.expandModeKey]: (v) => {
            defaultExpandMode = v
          },
          [this.displayModeKey]: (v) => {
            this.displayMode = v || '1'
          },
          [this.datetimeKey]: (v) => {
            if (!v) {
              return
            }
            let _arr = v.split('~')
            if (_arr.length == 2) {
              this.cardViewParam.uploadDate = _arr.map((s) =>
                dayjs(s).format('YYYY-MM-DD')
              )
            } else {
              this.cardViewParam.uploadDate = dayjs(_arr[0]).format(
                'YYYY-MM-DD'
              )
            }
          },
          [this.paramExpandKey]: () => {
            this.cardViewParamExpand = true
          },
          [this.dateSelectTypeKey]: (v) => {
            if (!v) {
              return
            }
            this.selectDateType = v
          }
        }
        resp.data.forEach((item) => {
          _config[item.memoryType](item.memoryValue)
        })
        // 如果没有时间记忆的key，但是有时间类型的key，重新设置默认值，
        if (!this.datetimeKey && this.dateSelectTypeKey) {
          this.switchDateType(false)
        }

        await this.queryCardViewData()
        await this.queryCameraTree()
      })
    },
    // 弹窗关闭回调
    _detailClose(param) {
      if (typeof param === 'object') {
        if (!param.opened) {
          this.cancelSelect(false)
        }
      } else {
        this.cancelSelect(false)
      }
    },
    // 卡口相机详情弹窗点击收藏、播放、关联实时抓拍记录回调，默认是收藏
    _devInfoWindowCollect(data) {
      let _v = data.values || ['1', '0']
      let key = data.key || 'isMonitor'
      let _status = data.status ? _v[0] : _v[1]
      const recursiveFind = (arr) => {
        if (!arr) {
          return
        }
        arr.forEach((o) => {
          if (o.deviceCode == data.deviceCode) {
            o[key] = _status
          }
          if (o.list) {
            recursiveFind(o.list)
          }
        })
      }
      recursiveFind(this.filterTreeData)
      this._setDevTreeState(_v, key, this.searchFavorite)
    },
    // 诱捕器详情弹窗收藏
    _trapDetailPopCollect(data) {
      this._devInfoWindowCollect({
        deviceCode: data.deviceCode,
        status: data.type == '1'
      })
    },
    // 可视域关闭回调
    _viewshedOperate(status) {
      if (status) {
        this._pollingViewshed()
      } else {
        this._closePollingViewshed()
      }
    },
    onAttrClose() {
      this.nowCameraAttr = ''
    },
    // 切换时间类型 flag: 是否记忆
    switchDateType(flag = true) {
      if (this.selectDateType != '4') {
        this.cardViewParam.uploadDate = new Date()
      } else {
        this.cardViewParam.uploadDate = [
          dayjs().startOf('month').toDate(),
          new Date()
        ]
      }
      if (flag && this.dateSelectTypeKey) {
        uptUserMemoryInfo({
          memoryType: this.dateSelectTypeKey,
          memoryValue: this.selectDateType
        })
        this.onDateChange()
      }
    },

    setSvgColor(data) {
      let _config = {
        // 通用
        'theme-wiseblue': {
          color: '#E8F3FE',
          activeColor: '#4f9fff'
        },
        // 林业
        'theme-aquamarine': {
          color: '#fff',
          activeColor: '#F9FF6C'
        },
        // 国土
        'theme-terracotta': {
          color: '#FFEEB1',
          activeColor: '#FFFA28'
        }
      }
      let _k = document.documentElement.getAttribute('data-theme')
      let colorObj = _config[_k] || _config['theme-wiseblue']
      return data.isFullRel ? colorObj.activeColor : colorObj.color
    },
    /* 以下是本组件提供的默认配置回调处理器 */

    // 内置的查询视频树方法
    async defaultGetVideoTree(reqUtil, param) {
      const res = await reqUtil({
        url: '/video-forestry-baseservice/videoTree/getVideoTree',
        method: 'post',
        data: {
          ...param,
          isMonitorFlag: param.searchFavorite, // 0只查询收藏的 1查询全部
          categoryCode: '5' // 默认情况下，后端要求卡口摄像机的categoryCode参数为5
        }
      })
      // 实际的设备树数据要去掉第一层的节点（第一层通常是“中国”这种父级节点），所以使用data[0].list进行返回
      return res?.data || []
    },
    // 内置的查询卡片视图排行方法
    async defaultGetCardViewRank(reqUtil, param) {
      const res = await reqUtil({
        url: '/video-forestry-baseservice/alarm/checkpoint/getCheckAlarmByDevice',
        method: 'post',
        data: {
          pageNum: 1,
          pageSize: 10000, // 不需要分页的话可以传很大或者不传
          ...param
        }
      })
      // 实际的设备树数据要去掉第一层的节点（第一层通常是“中国”这种父级节点），所以使用data[0].list进行返回
      return res?.data || []
    },
    // 内置的收藏设备方法
    async defaultAddDeviceFavor(reqUtil, param) {
      const res = await reqUtil({
        url: '/video-forestry-baseservice/videoTree/addDeviceToFavorites',
        method: 'post',
        data: {
          optType: param.isFavor ? '1' : '0', // 1收藏 0取消收藏
          collObjType: param.device.channelCode ? '6' : '5', // 5 设备 6 通道
          collObjCode: param.list
        }
      })
      return res
    }

    /* 以上是本组件提供的默认配置回调处理器 */
  }
}
</script>

<style scoped lang="scss">
@import '~@component-gallery/theme-chalk/src/card-dev-tree/card-dev-tree';
@import '~@component-gallery/theme-chalk/src/card-dev-tree/card-dev-tree-sub';
</style>
<style lang="scss">
@import '~@component-gallery/theme-chalk/src/card-dev-tree/card-dev-tree-sub';
</style>
