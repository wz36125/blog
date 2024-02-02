import {defineUserConfig} from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
    head: [['link', {rel: 'icon', href: '/image/logo.gif'}]],
    title: "是JK哟",
    description: "JUST DO IT.",
    theme: recoTheme({
        style: "@vuepress-reco/style-default",
        logo: "/image/logo.gif",
        author: "EngJ.K",
        // authorAvatar: "/head.png",
        authorAvatar: "/image/logo.gif",
        algolia: {
            appId: 'AYUJXIKVMO',
            apiKey: 'eb431b7d090284bfd2ecdce7661c1ef5',
            indexName: 'jkblog',
            inputSelector: '### REPLACE ME ####',
            algoliaOptions: { 'facetFilters': ["lang:$LANG"] },
            debug: false // Set debug to true if you want to inspect the dropdown
        },
        docsRepo: "https://gitee.com/wz36125/wz36125",
        docsBranch: "main",
        docsDir: "example",
        lastUpdatedText: "",
        // series 为原 sidebar
        series: {
            "/docs/theme-reco/": [
                {
                    text: "module one",
                    children: ["home", "theme"],
                },
                {
                    text: "module two",
                    children: ["api", "plugin"],
                },
            ],
        },
        navbar: [
            // {text: "首页", link: "/", icon: "Home"},
            {text: "分类", link: "/categories/qianduan/1/", icon: "Categories"},
            {text: "标签", link: "/tags/node/1/", icon: "TagGroup"},
            // {
            //   text: "文档",
            //   children: [
            //     { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
            //     { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
            //   ],
            //   icon: "Document"
            // },
            {text: '时间轴', link: '/timeline/', icon: 'Roadmap'}
        ],
        // bulletin: {
        //   body: [
        //     {
        //       type: "text",
        //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
        //       style: "font-size: 12px;",
        //     },
        //     {
        //       type: "hr",
        //     },
        //     {
        //       type: "title",
        //       content: "QQ 群",
        //     },
        //     {
        //       type: "text",
        //       content: `
        //       <ul>
        //         <li>QQ群1：1037296104</li>
        //         <li>QQ群2：1061561395</li>
        //         <li>QQ群3：962687802</li>
        //       </ul>`,
        //       style: "font-size: 12px;",
        //     },
        //     {
        //       type: "hr",
        //     },
        //     {
        //       type: "title",
        //       content: "GitHub",
        //     },
        //     {
        //       type: "text",
        //       content: `
        //       <ul>
        //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
        //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
        //       </ul>`,
        //       style: "font-size: 12px;",
        //     },
        //     {
        //       type: "hr",
        //     },
        //     {
        //       type: "buttongroup",
        //       children: [
        //         {
        //           text: "打赏",
        //           link: "/docs/others/donate.html",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // commentConfig: {
        //   type: 'valie',
        //   // options 与 1.x 的 valineConfig 配置一致
        //   options: {
        //     // appId: 'xxx',
        //     // appKey: 'xxx',
        //     // placeholder: '填写邮箱可以收到回复提醒哦！',
        //     // verify: true, // 验证码服务
        //     // notify: true,
        //     // recordIP: true,
        //     // hideComments: true // 隐藏评论
        //   },
        // },
    }),
    // debug: true,
});