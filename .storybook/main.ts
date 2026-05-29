import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // Add SCSS support
    config.module?.rules?.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: [/src/, /stories/],
    });

    return config;
  },
};
export default config;
