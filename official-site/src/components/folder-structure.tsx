"use client";

import { FolderIcon, FolderOpenIcon, ListCollapseIcon, ListTreeIcon } from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/originui/tree";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import useStateX from "@/hooks/use-state-x";
import {
  selectionFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  dragAndDropFeature,
  createOnDropHandler,
  syncDataLoaderFeature,
  keyboardDragAndDropFeature,
} from "@headless-tree/core";
import {
  RiBracesLine,
  RiCodeSSlashLine,
  RiFileLine,
  RiFileTextLine,
  RiImageLine,
  RiReactjsLine,
  RiCommandLine,
  RiGitBranchLine,
  RiTerminalBoxLine,
  RiTailwindCssLine,
  RiQuillPenAiLine,
  RiLinkUnlinkM,
  RiToolsLine,
  RiNpmjsLine,
} from "@remixicon/react";

interface Item {
  name?: string;
  children?: string[];
  fileExtension?: string;
}

const initialItems: Record<string, Item> = {
  // .vscode
  ".vscode": { name: ".vscode", children: [".vscode/settings.json"] },
  ".vscode/settings.json": { name: "settings.json", fileExtension: "json" },

  // packages
  packages: {
    name: "packages",
    children: [
      "packages/components",
      "packages/eslint-config",
      "packages/hooks",
      "packages/types",
      "packages/typescript-config",
      "packages/utils",
      "packages/validations",
    ],
  },

  // packages/components
  "packages/components": {
    name: "components",
    children: [
      "packages/components/src",
      "packages/components/eslint-config.mjs",
      "packages/components/package.json",
      "packages/components/tsconfig.json",
    ],
  },
  "packages/components/src": {
    name: "src",
    children: ["packages/components/src/button.tsx", "packages/components/src/card.tsx", "packages/components/src/code.tsx"],
  },
  "packages/components/src/button.tsx": { name: "button.tsx", fileExtension: "tsx" },
  "packages/components/src/card.tsx": { name: "card.tsx", fileExtension: "tsx" },
  "packages/components/src/code.tsx": { name: "code.tsx", fileExtension: "tsx" },
  "packages/components/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "packages/components/package.json": { name: "package.json", fileExtension: "json" },
  "packages/components/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/eslint-config
  "packages/eslint-config": {
    name: "eslint-config",
    children: [
      "packages/eslint-config/src",
      "packages/eslint-config/eslint-config.mjs",
      "packages/eslint-config/package.json",
      "packages/eslint-config/tsconfig.json",
    ],
  },
  "packages/eslint-config/src": {
    name: "src",
    children: [
      "packages/eslint-config/src/base.mjs",
      "packages/eslint-config/src/components.mjs",
      "packages/eslint-config/src/expo.mjs",
      "packages/eslint-config/src/node.mjs",
    ],
  },
  "packages/eslint-config/src/base.mjs": { name: "base.mjs", fileExtension: "mjs" },
  "packages/eslint-config/src/components.mjs": { name: "components.mjs", fileExtension: "mjs" },
  "packages/eslint-config/src/expo.mjs": { name: "expo.mjs", fileExtension: "mjs" },
  "packages/eslint-config/src/node.mjs": { name: "node.mjs", fileExtension: "mjs" },
  "packages/eslint-config/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "packages/eslint-config/package.json": { name: "package.json", fileExtension: "json" },
  "packages/eslint-config/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/hooks
  "packages/hooks": {
    name: "hooks",
    children: ["packages/hooks/src", "packages/hooks/eslint-config.mjs", "packages/hooks/package.json", "packages/hooks/tsconfig.json"],
  },
  "packages/hooks/src": {
    name: "src",
    children: ["packages/hooks/src/index.ts", "packages/hooks/src/use-stable-callback.ts", "packages/hooks/src/use-state-x.ts"],
  },
  "packages/hooks/src/index.ts": { name: "index.ts", fileExtension: "ts" },
  "packages/hooks/src/use-stable-callback.ts": { name: "use-stable-callback.ts", fileExtension: "ts" },
  "packages/hooks/src/use-state-x.ts": { name: "use-state-x.ts", fileExtension: "ts" },
  "packages/hooks/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "packages/hooks/package.json": { name: "package.json", fileExtension: "json" },
  "packages/hooks/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/types
  "packages/types": {
    name: "types",
    children: ["packages/types/src", "packages/types/eslint-config.mjs", "packages/types/package.json", "packages/types/tsconfig.json"],
  },
  "packages/types/src": {
    name: "src",
    children: ["packages/types/src/example.ts", "packages/types/src/index.ts"],
  },
  "packages/types/src/example.ts": { name: "example.ts", fileExtension: "ts" },
  "packages/types/src/index.ts": { name: "index.ts", fileExtension: "ts" },
  "packages/types/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "js" },
  "packages/types/package.json": { name: "package.json", fileExtension: "json" },
  "packages/types/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/typescript-config
  "packages/typescript-config": {
    name: "typescript-config",
    children: [
      "packages/typescript-config/src",
      "packages/typescript-config/eslint-config.mjs",
      "packages/typescript-config/package.json",
      "packages/typescript-config/tsconfig.json",
    ],
  },
  "packages/typescript-config/src": {
    name: "src",
    children: [
      "packages/typescript-config/src/base.json",
      "packages/typescript-config/src/components.json",
      "packages/typescript-config/src/expo.json",
      "packages/typescript-config/src/nextjs.json",
      "packages/typescript-config/src/node.json",
    ],
  },
  "packages/typescript-config/src/base.json": { name: "base.json", fileExtension: "json" },
  "packages/typescript-config/src/components.json": { name: "components.json", fileExtension: "json" },
  "packages/typescript-config/src/expo.json": { name: "expo.json", fileExtension: "json" },
  "packages/typescript-config/src/nextjs.json": { name: "nextjs.json", fileExtension: "json" },
  "packages/typescript-config/src/node.json": { name: "node.json", fileExtension: "json" },
  "packages/typescript-config/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "packages/typescript-config/package.json": { name: "package.json", fileExtension: "json" },
  "packages/typescript-config/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/utils
  "packages/utils": {
    name: "utils",
    children: ["packages/utils/src", "packages/utils/eslint-config.mjs", "packages/utils/package.json", "packages/utils/tsconfig.json"],
  },
  "packages/utils/src": {
    name: "src",
    children: ["packages/utils/src/cn.ts", "packages/utils/src/index.ts"],
  },
  "packages/utils/src/cn.ts": { name: "cn.ts", fileExtension: "ts" },
  "packages/utils/src/index.ts": { name: "index.ts", fileExtension: "ts" },
  "packages/utils/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "js" },
  "packages/utils/package.json": { name: "package.json", fileExtension: "json" },
  "packages/utils/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // packages/validations
  "packages/validations": {
    name: "validations",
    children: [
      "packages/validations/src",
      "packages/validations/eslint-config.mjs",
      "packages/validations/package.json",
      "packages/validations/tsconfig.json",
    ],
  },
  "packages/validations/src": {
    name: "src",
    children: [
      "packages/validations/src/email.ts",
      "packages/validations/src/index.tsx",
      "packages/validations/src/password.tsx",
      "packages/validations/src/username.tsx",
    ],
  },
  "packages/validations/src/email.ts": { name: "email.ts", fileExtension: "ts" },
  "packages/validations/src/index.tsx": { name: "index.tsx", fileExtension: "ts" },
  "packages/validations/src/password.tsx": { name: "password.tsx", fileExtension: "ts" },
  "packages/validations/src/username.tsx": { name: "username.tsx", fileExtension: "ts" },
  "packages/validations/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "packages/validations/package.json": { name: "package.json", fileExtension: "json" },
  "packages/validations/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // projects
  projects: {
    name: "projects",
    children: ["projects/backend", "projects/mobile", "projects/website"],
  },

  // projects/backend
  "projects/backend": {
    name: "backend",
    children: ["projects/backend/src", "projects/backend/eslint-config.mjs", "projects/backend/package.json", "projects/backend/tsconfig.json"],
  },
  "projects/backend/src": {
    name: "src",
    children: [
      "projects/backend/src/api",
      "projects/backend/src/hooks",
      "projects/backend/src/utils",
      "projects/backend/src/dev-server.ts",
      "projects/backend/src/vercel.json",
    ],
  },
  "projects/backend/src/api": { name: "api", children: ["projects/backend/src/api/index.ts"] },
  "projects/backend/src/hooks": { name: "hooks", children: ["projects/backend/src/hooks/withMiddleware.ts"] },
  "projects/backend/src/utils": {
    name: "utils",
    children: [
      "projects/backend/src/utils/api-helper.ts",
      "projects/backend/src/utils/cors.ts",
      "projects/backend/src/utils/environment.ts",
      "projects/backend/src/utils/logging.ts",
      "projects/backend/src/utils/middleware.ts",
      "projects/backend/src/utils/validate.ts",
    ],
  },
  "projects/backend/src/api/index.ts": { name: "index.ts", fileExtension: "ts" },
  "projects/backend/src/hooks/withMiddleware.ts": { name: "withMiddleware.ts", fileExtension: "ts" },
  "projects/backend/src/utils/api-helper.ts": { name: "api-helper.ts", fileExtension: "ts" },
  "projects/backend/src/utils/cors.ts": { name: "cors.ts", fileExtension: "ts" },
  "projects/backend/src/utils/environment.ts": { name: "environment.ts", fileExtension: "ts" },
  "projects/backend/src/utils/logging.ts": { name: "logging.ts", fileExtension: "ts" },
  "projects/backend/src/utils/middleware.ts": { name: "middleware.ts", fileExtension: "ts" },
  "projects/backend/src/utils/validate.ts": { name: "validate.ts", fileExtension: "ts" },
  "projects/backend/src/dev-server.ts": { name: "dev-server.ts", fileExtension: "ts" },
  "projects/backend/src/vercel.json": { name: "vercel.json", fileExtension: "json" },
  "projects/backend/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "projects/backend/package.json": { name: "package.json", fileExtension: "json" },
  "projects/backend/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // projects/mobile
  "projects/mobile": {
    name: "mobile",
    children: [
      "projects/mobile/assets",
      "projects/mobile/plugins",
      "projects/mobile/src",
      "projects/mobile/eslint-config.mjs",
      "projects/mobile/package.json",
      "projects/mobile/tsconfig.json",
    ],
  },
  "projects/mobile/assets": {
    name: "assets",
    children: [
      "projects/mobile/assets/adaptive-icon.png",
      "projects/mobile/assets/favicon.png",
      "projects/mobile/assets/icon.png",
      "projects/mobile/assets/splash-icon.png",
    ],
  },
  "projects/mobile/plugins": {
    name: "plugins",
    children: [
      "projects/mobile/plugins/drop-down-menu.ts",
      "projects/mobile/plugins/material-theme.ts",
      "projects/mobile/plugins/navigation-bar.ts",
      "projects/mobile/plugins/snack-bar.ts",
    ],
  },
  "projects/mobile/src": { name: "src", children: ["projects/mobile/src/app", "projects/mobile/src/libs"] },
  "projects/mobile/src/app": { name: "app", children: ["projects/mobile/src/app/_layout.tsx", "projects/mobile/src/app/index.tsx"] },
  "projects/mobile/src/libs": { name: "libs", children: ["projects/mobile/src/libs/root-handler.tsx"] },
  "projects/mobile/assets/adaptive-icon.png": { name: "adaptive-icon.png", fileExtension: "png" },
  "projects/mobile/assets/favicon.png": { name: "favicon.png", fileExtension: "png" },
  "projects/mobile/assets/icon.png": { name: "icon.png", fileExtension: "png" },
  "projects/mobile/assets/splash-icon.png": { name: "splash-icon.png", fileExtension: "png" },
  "projects/mobile/plugins/drop-down-menu.ts": { name: "drop-down-menu.ts", fileExtension: "ts" },
  "projects/mobile/plugins/material-theme.ts": { name: "material-theme.ts", fileExtension: "ts" },
  "projects/mobile/plugins/navigation-bar.ts": { name: "navigation-bar.ts", fileExtension: "ts" },
  "projects/mobile/plugins/snack-bar.ts": { name: "snack-bar.ts", fileExtension: "ts" },
  "projects/mobile/src/app/_layout.tsx": { name: "_layout.tsx", fileExtension: "tsx" },
  "projects/mobile/src/app/index.tsx": { name: "index.tsx", fileExtension: "tsx" },
  "projects/mobile/src/libs/root-handler.tsx": { name: "root-handler.tsx", fileExtension: "tsx" },
  "projects/mobile/eslint-config.mjs": { name: "eslint-config.mjs", fileExtension: "mjs" },
  "projects/mobile/package.json": { name: "package.json", fileExtension: "json" },
  "projects/mobile/tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },

  // projects/website
  "projects/website": { name: "website", children: ["projects/website/public", "projects/website/src"] },
  "projects/website/public": { name: "public", children: ["projects/website/public/sumit-app.svg"] },
  "projects/website/src": {
    name: "src",
    children: ["projects/website/src/app", "projects/website/src/components", "projects/website/src/providers"],
  },
  "projects/website/src/app": {
    name: "app",
    children: [
      "projects/website/src/app/favicon.ico",
      "projects/website/src/app/globals.css",
      "projects/website/src/app/layout.tsx",
      "projects/website/src/app/page.tsx",
    ],
  },
  "projects/website/src/components": {
    name: "components",
    children: [
      "projects/website/src/components/ui",
      "projects/website/src/components/footer.tsx",
      "projects/website/src/components/header.tsx",
      "projects/website/src/components/theme-switch.tsx",
    ],
  },
  "projects/website/src/components/ui": { name: "ui", children: ["projects/website/src/components/ui/switch.tsx"] },
  "projects/website/src/providers": { name: "providers", children: ["projects/website/src/providers/theme-switch-provider.tsx"] },
  "projects/website/public/sumit-app.svg": { name: "sumit-app.svg", fileExtension: "svg" },
  "projects/website/src/app/favicon.ico": { name: "favicon.ico", fileExtension: "ico" },
  "projects/website/src/app/globals.css": { name: "globals.css", fileExtension: "css" },
  "projects/website/src/app/layout.tsx": { name: "layout.tsx", fileExtension: "tsx" },
  "projects/website/src/app/page.tsx": { name: "page.tsx", fileExtension: "tsx" },
  "projects/website/src/components/ui/switch.tsx": { name: "switch.tsx", fileExtension: "tsx" },
  "projects/website/src/components/footer.tsx": { name: "footer.tsx", fileExtension: "tsx" },
  "projects/website/src/components/header.tsx": { name: "header.tsx", fileExtension: "tsx" },
  "projects/website/src/components/theme-switch.tsx": { name: "theme-switch.tsx", fileExtension: "tsx" },
  "projects/website/src/providers/theme-switch-provider.tsx": { name: "theme-switch-provider.tsx", fileExtension: "tsx" },

  // root config
  ".editorconfig": { name: ".editorconfig", fileExtension: "editorconfig" },
  ".gitattributes": { name: ".gitattributes", fileExtension: "gitattributes" },
  ".gitignore": { name: ".gitignore", fileExtension: "gitignore" },
  ".prettierignore": { name: ".prettierignore", fileExtension: "prettierignore" },
  ".prettierrc": { name: ".prettierrc", fileExtension: "prettierrc" },
  "bun.lock": { name: "bun.lock", fileExtension: "lock" },
  "commands.sh": { name: "commands.sh", fileExtension: "sh" },
  "eslint.config.mjs": { name: "eslint.config.mjs", fileExtension: "mjs" },
  "package.json": { name: "package.json", fileExtension: "json" },
  "tsconfig.json": { name: "tsconfig.json", fileExtension: "json" },
  "turbo.json": { name: "turbo.json", fileExtension: "json" },

  root: {
    name: "Project Root",
    children: [
      ".vscode",
      "packages",
      "projects",
      ".editorconfig",
      ".gitattributes",
      ".gitignore",
      ".prettierignore",
      ".prettierrc",
      "bun.lock",
      "commands.sh",
      "eslint.config.mjs",
      "package.json",
      "tsconfig.json",
      "turbo.json",
    ],
  },
};

// Helper function to get icon based on file extension
function getFileIcon(extension: string | undefined, className: string) {
  switch (extension) {
    case "tsx":
    case "jsx":
      return <RiReactjsLine className={className} />;
    case "ts":
    case "js":
    case "mjs":
      return <RiCodeSSlashLine className={className} />;
    case "json":
      return <RiBracesLine className={className} />;
    case "svg":
    case "ico":
    case "png":
    case "jpg":
      return <RiImageLine className={className} />;
    case "gitattributes":
    case "gitignore":
      return <RiGitBranchLine className={className} />;
    case "prettierignore":
    case "prettierrc":
      return <RiQuillPenAiLine className={className} />;
    case "editorconfig":
      return <RiTerminalBoxLine className={className} />;
    case "npmrc":
      return <RiNpmjsLine className={className} />;
    case "lock":
      return <RiToolsLine className={className} />;
    case "yml":
      return <RiLinkUnlinkM className={className} />;
    case "css":
      return <RiTailwindCssLine className={className} />;
    case "md":
      return <RiFileTextLine className={className} />;
    case "sh":
      return <RiCommandLine className={className} />;
    default:
      return <RiFileLine className={className} />;
  }
}

const indent = 20;

export default function FolderStructure() {
  const [items, setItems] = useStateX(initialItems);

  const tree = useTree<Item>({
    initialState: {
      selectedItems: [],
    },
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData()?.name ?? "Unknown",
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    canReorder: false,
    onDrop: createOnDropHandler((parentItem, newChildrenIds) => {
      setItems((prevItems) => {
        // Sort the children alphabetically
        const sortedChildren = [...newChildrenIds].sort((a, b) => {
          const itemA = prevItems[a];
          const itemB = prevItems[b];

          // First sort folders before files
          const isAFolder = (itemA?.children?.length ?? 0) > 0;
          const isBFolder = (itemB?.children?.length ?? 0) > 0;

          if (isAFolder && !isBFolder) return -1;
          if (!isAFolder && isBFolder) return 1;

          // Then sort alphabetically by name
          return (itemA?.name ?? "").localeCompare(itemB?.name ?? "");
        });

        return {
          ...prevItems,
          [parentItem.getId()]: {
            ...prevItems[parentItem.getId()],
            children: sortedChildren,
          },
        };
      });
    }),
    dataLoader: {
      getItem: (itemId) => items.get()[itemId]!,
      getChildren: (itemId) => items.get()[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature, dragAndDropFeature, keyboardDragAndDropFeature, expandAllFeature],
  });

  return (
    <div className="flex w-full flex-col gap-3 *:first:grow">
      <div className="flex w-full items-center justify-between gap-3">
        <h4 className="font-semibold tracking-wide opacity-60 max-sm:text-[0.938rem]/6">my-sumit-app</h4>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => tree.expandAll()}
            className="flex items-center gap-x-2 rounded-md bg-black/5 px-3 py-1.5 text-sm transition-all duration-100 ease-in hover:cursor-pointer hover:bg-black/10 active:scale-90 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ListTreeIcon className="opacity-60" size={16} aria-hidden="true" />
            <span className="max-sm:hidden">Expand all</span>
          </button>
          <button
            type="button"
            onClick={tree.collapseAll}
            className="flex items-center gap-x-2 rounded-md bg-black/5 px-3 py-1.5 text-sm transition-all duration-100 ease-in hover:cursor-pointer hover:bg-black/10 active:scale-90 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ListCollapseIcon className="opacity-60" size={16} aria-hidden="true" />
            <span className="max-sm:hidden">Collapse all</span>
          </button>
        </div>
      </div>
      <div className="h-full">
        <Tree
          className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
          indent={indent}
          tree={tree}
        >
          <AssistiveTreeDescription tree={tree} />
          {tree.getItems().map((item) => {
            return (
              <TreeItem key={item.getId()} item={item}>
                <TreeItemLabel className="relative">
                  <span className="-order-1 flex flex-1 items-center gap-2">
                    {item.isFolder() ? (
                      item.isExpanded() ? (
                        <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                      ) : (
                        <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                      )
                    ) : (
                      getFileIcon(item.getItemData()?.fileExtension, "text-muted-foreground pointer-events-none size-4")
                    )}
                    {item.getItemName()}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            );
          })}
        </Tree>
      </div>
    </div>
  );
}
