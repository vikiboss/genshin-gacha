// 使用 js-yaml 解析 yaml 文件
const yaml = require('js-yaml');
// fs 读写文件
const fs = require('fs');
// 随机
const oim = require('@vikiboss/oim');
// minimist 解析命令行参数
const { p = 'up1', n = 10 } = require('minimist')(process.argv.slice(2));

// 字段映射
const UpMap = {
  up1: { 5: 'up5', 4: 'up4' },
  up2: { 5: 'up5_2', 4: 'up4' },
  wea: { 5: 'weapon5', 4: 'weapon4' },
};

try {
  // 读配置
  const items = yaml.load(fs.readFileSync('./items.yaml', 'utf8'));
  const pool = yaml.load(fs.readFileSync('./pool.yaml', 'utf8'));

  // 抽卡结果
  const res = [];

  // 累计未出五星抽数
  let i5 = 0;
  // 累计未出四星抽数
  let i4 = 0;
  // 是否五星大保底
  let ensureUp5 = false;
  // 是否四星大保底
  let ensureUp4 = false;

  // 执行每一抽
  for (let i = 1; i <= n; i++) {
    i5++;
    i4++;
    if (['up1', 'up2'].includes(p)) {
      // 活动祈愿

      // 获取当前池子四星和五星 up
      const up5 = pool[UpMap[p][5]];
      const up4s = pool[UpMap[p][4]];

      // 轮盘模型
      const zone5 = i5 <= 73 ? 60 : (i5 - 73) * 600 + 60;
      const zone4 = i4 <= 8 ? 510 : (i4 - 8) * 5100 + 510;

      // 产生 1-10000 随机数
      const result = oim.random(1, 10000);

      if (result <= zone5) {
        // 落在五星范围内
        if (!ensureUp5) {
          // 小保底

          // 是否不歪
          const shot = oim.random(0, 1) === 0;

          if (shot) {
            // 不歪
            ensureUp5 = false;
            res.push(`★${i5}-` + up5);
          } else {
            // 歪了
            ensureUp5 = true;
            res.push(`☆${i5}-` + oim.rand([...items.role5, ...items.weapon5]));
          }
        } else {
          // 大保底
          ensureUp5 = false;
          res.push(`☆★ ${i5}-` + up5);
        }
        i5 = 0;
      } else if (result <= zone4 + zone5) {
        // 落在四星范围内
        if (!ensureUp4) {
          // 是否不歪
          const shot = oim.random(0, 1) === 0;

          if (shot) {
            // 不歪
            ensureUp4 = false;
            res.push(`◆${i4}-` + oim.rand(up4s));
          } else {
            // 歪了
            ensureUp4 = true;
            res.push(`◇${i4}-` + oim.rand([...items.role4, ...items.weapon4]));
          }
        } else {
          // 大保底
          ensureUp4 = false;
          res.push(`◇◆${i4}-` + oim.rand(up4s));
        }
        i4 = 0;
      } else {
        // 落在三星范围内
        res.push(oim.rand(items.weapon3));
      }
    } else if (p === 'wea') {
      // 武器祈愿

      // 获取当前池子四星和五星 up
      const up5 = pool[UpMap[p][5]];
      const up4s = pool[UpMap[p][4]];

      // 轮盘模型
      const zone5 =
        i5 <= 62
          ? 70
          : i5 <= 73
          ? (i5 - 62) * 700 + 70
          : (i5 - 73) * 350 + (74 - 63) * 700 + 70;

      const zone4 = i4 <= 8 ? 60 : (i4 - 8) * 6000 + 600;

      // 产生 1-10000 随机数
      const result = oim.random(1, 10000);

      if (result <= zone5) {
        // 落在五星范围内
        if (!ensureUp5) {
          // 小保底

          // 是否不歪
          const shot = oim.random(0, 3) >= 1;

          if (shot) {
            // 不歪
            ensureUp5 = false;
            res.push(`★${i5}-` + oim.rand(up5));
          } else {
            // 歪了
            ensureUp5 = true;
            res.push(`☆${i5}-` + oim.rand([...items.role5, ...items.weapon5]));
          }
        } else {
          // 大保底
          ensureUp5 = false;
          res.push(`☆★${i5}-` + oim.rand(up5));
        }
        i5 = 0;
      } else if (result <= zone4 + zone5) {
        // 落在四星范围内
        if (!ensureUp4) {
          // 是否不歪
          const shot = oim.random(0, 3) >= 1;

          if (shot) {
            // 不歪
            ensureUp4 = false;
            res.push(`◆${i4}-` + oim.rand(up4s));
          } else {
            // 歪了
            ensureUp4 = true;
            res.push(`◇${i4}-` + oim.rand([...items.role4, ...items.weapon4]));
          }
        } else {
          // 大保底
          ensureUp4 = false;
          res.push(`◇◆${i4}-` + oim.rand(up4s));
        }
        i4 = 0;
      } else {
        // 落在三星范围内
        res.push(oim.rand(items.weapon3));
      }
    } else if (p === 'per') {
      // 常驻祈愿

      // 轮盘模型
      const zone5 = i5 <= 73 ? 60 : (i5 - 73) * 600 + 60;
      const zone4 = i4 <= 8 ? 510 : (i4 - 8) * 5100 + 510;

      // 产生 1-10000 随机数
      const result = oim.random(1, 10000);

      if (result <= zone5) {
        // 落在五星范围内
        res.push(`☆${i5}-` + oim.rand([...items.role5, ...items.weapon5]));
        i5 = 0;
      } else if (result <= zone4 + zone5) {
        // 落在四星范围内
        res.push(`◇${i4}-` + oim.rand([...items.role4, ...items.weapon4]));
        i4 = 0;
      } else {
        // 落在三星范围内
        res.push(oim.rand(items.weapon3));
      }
    }
  }

  // 分块展示（10 个为一组）
  for (const items of oim.chunk(res, 10)) {
    // 排序，五星-四星-三星
    items.sort((a, b) => {
      if (['★', '☆'].includes(a[0])) return -1;
      if (['◆', '◇'].includes(a[0]) && !['★', '☆'].includes(b[0])) return -1;
      return 1;
    });
    // 输出每一组结果
    console.log(items.join(' '));
  }
} catch (e) {
  console.error('配置文件读取失败');
  process.exit(1);
}
