const sass = require('./config/sass-process');
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  //Watching for modifications in style directory
  sass('./assets/scss/freelancer.scss', './assets/css/freelancer.min.css');
  // eleventyConfig.setTemplateFormats([
  //   "html",
  //   "md",
  //   "css", // css is not yet a recognized template extension in Eleventy
  //   "jpg",
  //   "png"
  // ]);
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("resources");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  return {
    pathPrefix: "/"
  }
};
