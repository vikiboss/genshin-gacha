import ora from "ora";
import prompts, { type PromptObject } from "prompts";
import { getR5UpRoles, stripTags } from "./utils";
import { fetchPoolDetail, fetchPools } from "./services";

const loading = ora({ color: "cyan" });

loading.start("正在获取当前版本卡池列表...");

const pools = await fetchPools();
const poolDetails = await Promise.all(
	pools.map((e) => fetchPoolDetail(e.gacha_id)),
);

for (const item of poolDetails) {
	item.title = stripTags(item.title);
	item.content = stripTags(item.content);
}

loading.succeed("当前版本卡池列表获取完毕");

const questions: PromptObject[] = [
	{
		type: "select",
		name: "pool",
		message: "请选择卡池",
		choices: poolDetails.map((e) => ({
			title: `${e.title} - ${getR5UpRoles(e)}`,
			value: e.title,
		})),
	},
	{
		type: "number",
		name: "count",
		message: "请输入抽卡次数",
	},
];

const { pool, count } = await prompts(questions);
const p = poolDetails.find((e) => e.title === pool);

const status = {
	totalCount: count,
	currentCount: 0,
	isNextR5Up: false,
	isNextR4Up: false,
};

console.log(pool, count);
