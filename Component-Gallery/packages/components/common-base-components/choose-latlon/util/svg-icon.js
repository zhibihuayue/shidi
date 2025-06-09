// 通用
import blue_pc1 from '@component-gallery/assets/image/emergency/wiseblue/icon_pc-calling.svg'
import blue_pc2 from '@component-gallery/assets/image/emergency/wiseblue/icon_pc-onchat.svg'
import blue_pc3 from '@component-gallery/assets/image/emergency/wiseblue/icon_pc-online.svg'
import blue_pc4 from '@component-gallery/assets/image/emergency/wiseblue/icon_pc-outline.svg'
import blue_app1 from '@component-gallery/assets/image/emergency/wiseblue/icon_phone-calling.svg'
import blue_app2 from '@component-gallery/assets/image/emergency/wiseblue/icon_phone-onchat.svg'
import blue_app3 from '@component-gallery/assets/image/emergency/wiseblue/icon_phone-online.svg'
import blue_app4 from '@component-gallery/assets/image/emergency/wiseblue/icon_phone-outline.svg'
// 林业
import green_pc1 from '@component-gallery/assets/image/emergency/aquamarine/icon_pc-calling.svg'
import green_pc2 from '@component-gallery/assets/image/emergency/aquamarine/icon_pc-onchat.svg'
import green_pc3 from '@component-gallery/assets/image/emergency/aquamarine/icon_pc-online.svg'
import green_pc4 from '@component-gallery/assets/image/emergency/aquamarine/icon_pc-outline.svg'
import green_app1 from '@component-gallery/assets/image/emergency/aquamarine/icon_phone-calling.svg'
import green_app2 from '@component-gallery/assets/image/emergency/aquamarine/icon_phone-onchat.svg'
import green_app3 from '@component-gallery/assets/image/emergency/aquamarine/icon_phone-online.svg'
import green_app4 from '@component-gallery/assets/image/emergency/aquamarine/icon_phone-outline.svg'
// 国土
import yellow_pc1 from '@component-gallery/assets/image/emergency/terracotta/icon_pc-calling.svg'
import yellow_pc2 from '@component-gallery/assets/image/emergency/terracotta/icon_pc-onchat.svg'
import yellow_pc3 from '@component-gallery/assets/image/emergency/terracotta/icon_pc-online.svg'
import yellow_pc4 from '@component-gallery/assets/image/emergency/terracotta/icon_pc-outline.svg'
import yellow_app1 from '@component-gallery/assets/image/emergency/terracotta/icon_phone-calling.svg'
import yellow_app2 from '@component-gallery/assets/image/emergency/terracotta/icon_phone-onchat.svg'
import yellow_app3 from '@component-gallery/assets/image/emergency/terracotta/icon_phone-online.svg'
import yellow_app4 from '@component-gallery/assets/image/emergency/terracotta/icon_phone-outline.svg'

export const USER_TYPE_STATE = {
  1: {
    1: 'online',
    2: 'offline',
    3: 'offline'
  },
  2: {
    1: 'calling',
    2: 'onCall',
    3: 'online'
  }
}
export const USER_STATE_ICON = {
  ty: {
    pc: {
      onCall: blue_pc1,
      calling: blue_pc2,
      online: blue_pc3,
      offline: blue_pc4
    },
    app: {
      onCall: blue_app1,
      calling: blue_app2,
      online: blue_app3,
      offline: blue_app4
    }
  },
  ly: {
    pc: {
      onCall: green_pc1,
      calling: green_pc2,
      online: green_pc3,
      offline: green_pc4
    },
    app: {
      onCall: green_app1,
      calling: green_app2,
      online: green_app3,
      offline: green_app4
    }
  },
  gt: {
    pc: {
      onCall: yellow_pc1,
      calling: yellow_pc2,
      online: yellow_pc3,
      offline: yellow_pc4
    },
    app: {
      onCall: yellow_app1,
      calling: yellow_app2,
      online: yellow_app3,
      offline: yellow_app4
    }
  }
}
