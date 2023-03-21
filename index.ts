import ora from 'ora'
import prompts, { type PromptObject } from 'prompts'
import { fetchPoolDetail, fetchPools } from './services'

const loading = ora({ color: 'cyan' })

loading.start('正在获取当前卡池列表...')

const pools = await fetchPools()

loading.succeed('当前卡池列表获取完毕')

const questions: PromptObject[] = [
  {
    type: 'select',
    name: 'pool',
    message: '请选择卡池',
    choices: pools.map(e => ({ title: e.gacha_name, value: e.gacha_id }))
  },
  {
    type: 'number',
    name: 'count',
    message: '请输入抽卡次数'
  }
]

const { pool, count } = await prompts(questions)

console.log(pool, count)

// TODO: 完善抽卡逻辑
