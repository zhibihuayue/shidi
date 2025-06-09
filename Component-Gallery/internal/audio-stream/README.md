<!--
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-23 19:33:19
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-26 09:59:47
 * @FilePath: /Component-Gallery/internal/audio-stream/README.md
 * @Description:
-->
# @ct/audio-stream

## Installation

```bash
pnpm install @ct/audio-stream
```
## Usage

```vue
import { convertStream } from '@ct/audio-stream'
const { convertBase64 } = convertStream(this.bufferArray)
this.nowPlayingUrl = convertBase64
```
