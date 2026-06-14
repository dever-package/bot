import { defineFrontPlugin, lazyNode } from "@dever/front-plugin";

const botPlugin = {
  name: "bot",
  depends: [
    "react-complex-tree",
    "@uiw/react-codemirror",
    "@codemirror/lang-json",
    "@codemirror/lang-html",
    "@codemirror/lang-css",
    "@codemirror/lang-javascript",
    "@codemirror/lang-sql",
    "@codemirror/lang-yaml",
    "@codemirror/lang-xml",
    "vditor",
  ],
  nodes: {
    "show-agent": lazyNode(() =>
      import("./nodes/show/agent").then((mod) => ({
        default: mod.ShowAgent,
      })),
    ),
    "show-team-workspace": lazyNode(() =>
      import("./nodes/show/team-workspace").then((mod) => ({
        default: mod.ShowTeamWorkspace,
      })),
    ),
    "show-stream-request": lazyNode(() =>
      import("./nodes/show/stream-request").then((mod) => ({
        default: mod.ShowStreamRequest,
      })),
    ),
    "show-knowledge-file-manager": lazyNode(() =>
      import("./nodes/show/knowledge-file-manager").then((mod) => ({
        default: mod.ShowKnowledgeFileManager,
      })),
    ),
    "bot-body-work-login-page": lazyNode(() =>
      import("./nodes/body-work/auth/login-page").then((mod) => ({
        default: mod.WorkLoginPage,
      })),
    ),
    "bot-body-work-home-shell": lazyNode(() =>
      import("./nodes/body-work/home/home-shell").then((mod) => ({
        default: mod.WorkHomeShell,
      })),
    ),
    "bot-body-work-project-page": lazyNode(() =>
      import("./nodes/body-work/project/project-page").then((mod) => ({
        default: mod.WorkProjectPage,
      })),
    ),
    "bot-body-work-space-page": lazyNode(() =>
      import("./nodes/body-work/space/space-page").then((mod) => ({
        default: mod.WorkSpacePage,
      })),
    ),
  },
};

export default defineFrontPlugin(botPlugin);
