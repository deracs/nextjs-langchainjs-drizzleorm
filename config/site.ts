export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Taskr",
  description:
    "Taskr is a simple task management app built with Drizzle, a full-stack framework for NextJS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Tasks",
      href: "/tasks",
    },
    {
      title: "Ask",
      href: "/ask",
    },
  ],
  links: {
    twitter: "https://twitter.com/deracs",
    github: "https://github.com/deracs",
    docs: "https://deracs.com",
    tasks: {
      create: "/tasks/create",
      view: "/tasks",
    },
    ask: {
      // create: "/ask/create",
      view: "/ask",
    },
  },
}
