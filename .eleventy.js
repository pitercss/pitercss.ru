const { DateTime } = require('luxon');
const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.setDataDeepMerge(true);

    eleventyConfig.addLayoutAlias('post', 'src/_includes/layouts/post.njk');

    eleventyConfig.addFilter('readableDate', dateObj => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('dd.LL.yyyy');
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
    });

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter('head', (array, n) => {
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    eleventyConfig.addCollection('tagList', require('./src/_11ty/getTagList'));

    eleventyConfig.addPassthroughCopy('src/img');
    eleventyConfig.addPassthroughCopy('src/css');

    /* Markdown Plugins */
    let markdownIt = require('markdown-it');
    let markdownItAnchor = require('markdown-it-anchor');
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        permalink: true,
        permalinkClass: 'direct-link',
        permalinkSymbol: '#'
    };

    eleventyConfig.setLibrary('md', markdownIt(options)
        .use(markdownItAnchor, opts)
    );

    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('dist/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    return {
        templateFormats: [
            'md',
            'njk',
            'html',
            'liquid'
        ],

        pathPrefix: '/',

        markdownTemplateEngine: 'liquid',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        passthroughFileCopy: true,
        dir: {
            input: 'src',
            data: 'src/_data',
            output: 'dist'
        }
    };
};
