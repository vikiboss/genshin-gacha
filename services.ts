import got from 'got'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

/** 获取卡池列表，可选是否只返回当前卡池 */
export async function fetchPools(isCurrent = true) {
  const api =
    'https://proxy.viki.moe/hk4e/gacha_info/cn_gf01/gacha/list.json?proxy-host=webstatic.mihoyo.com'
  const res = await got.get(api).json<PoolRes>()
  const { list = [] } = res?.data ?? {}

  if (!isCurrent) {
    return list
  }

  return list.filter(e => dayjs().isBetween(e.begin_time, e.end_time))
}

/** 通过卡池 id 获取详细信息 */
export async function fetchPoolDetail(gachaId: string) {
  const api = `https://proxy.viki.moe/hk4e/gacha_info/cn_gf01/${gachaId}/zh-cn.json?proxy-host=webstatic.mihoyo.com`
  return await got.get(api).json<PoolDetailRes>()
}

export interface PoolRes {
  data: PoolData
  message: string
  retcode: number
}

export interface PoolData {
  list: PoolItem[]
}

export interface PoolItem {
  begin_time: string
  end_time: string
  gacha_id: string
  gacha_name: string
  gacha_type: number
}

export interface PoolDetailRes {
  banner: string
  content: string
  date_range: string
  gacha_type: number
  r3_baodi_prob: string
  r3_prob: string
  r3_prob_list: ProbItem[]
  r4_baodi_prob: string
  r4_prob: string
  r4_prob_list: ProbItem[]
  r4_up_items: null | UpItem[]
  r4_up_prob: string
  r5_baodi_prob: string
  r5_prob: string
  r5_prob_list: ProbItem[]
  r5_up_items: null | UpItem[]
  r5_up_prob: string
  title: string
}

export interface ProbItem {
  is_up: number
  item_id: number
  item_name: string
  item_type: string
  order_value: number
  rank: number
}

export interface UpItem {
  item_attr: string
  item_color: string
  item_id: number
  item_img: string
  item_name: string
  item_type: string
  item_type_cn: string
}
