# Gaochao Song 学术个人主页

纯静态页面（HTML + CSS + 原生 JS），无需构建，可直接部署到 GitHub Pages。

## 文件结构

```
index.html   页面内容（主要修改这里）
styles.css   样式（修改 :root 中的 --accent 更换主题色）
script.js    交互：深色模式、导航高亮、论文筛选、BibTeX 复制
images/      头像 person.jpg 与论文配图
```

## 本地预览

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 如何修改

- **头像**：替换 `images/person.jpg`（正方形裁剪，默认居中偏上）。
- **论文**：复制一个 `<article class="pub">` 块修改即可。
  - `data-type`：`conference` / `journal` / `preprint`
  - `data-selected="true"`：显示在 Selected 标签中
  - `<span class="me">` 高亮自己的名字；`<span class="highlight">Spotlight</span>` 标注 Oral/Spotlight
  - 有配图：`<div class="pub-thumb"><img src="images/xxx.png" /><span class="venue-badge">...</span></div>`
  - 无配图：使用 `class="pub pub-compact"`，会议名写在标题前的 `<span class="venue-inline">` 中
- **News**：给较早的条目加 `class="news-extra"`，默认折叠。

## 部署到 GitHub Pages

1. 新建仓库 `<username>.github.io`
2. 将本目录文件推送到仓库的 main 分支
3. 访问 `https://<username>.github.io`
