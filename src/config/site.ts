export const siteConfig = {
  title: "p.log",
  subtitle: "Pragmatic Log",
  description: "많은 것을 이해하고 싶습니다. 더 이해하기 위해 노력합니다.",
  author: "p-iknow 🎹",
  siteUrl: "https://p-iknow.netlify.app",
  ogImage: "/og-img.webp",
  links: {
    github: "https://github.com/p-iknow",
    x: "https://x.com/p_iknow",
    linkedIn: "https://www.linkedin.com/in/p-iknow/",
    email: "mailto:apricotsoul@gmail.com",
  },
  giscus: {
    repo: "p-iknow/p-iknow-devlog-comment",
    repoId: "MDEwOlJlcG9zaXRvcnkyMzkyODQ4MjA=",
    category: "General",
    categoryId: "DIC_kwDODkMyVM4C0Cxn",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "1",
    inputPosition: "top",
    lang: "en",
    loading: "lazy",
  },
  googleAnalyticsId: "UA-110581115-1",
};

export type SiteConfig = typeof siteConfig;
