(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[678],{8505:function(e){"use strict";e.exports=JSON.parse('{"layout":"fixed","backgroundColor":"#f8f8f8","images":{"fallback":{"src":"/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/d24ee/profile-pic.jpg","srcSet":"/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/d24ee/profile-pic.jpg 50w,\\n/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/64618/profile-pic.jpg 100w","sizes":"50px"},"sources":[{"srcSet":"/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/d4bf4/profile-pic.avif 50w,\\n/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/ee81f/profile-pic.avif 100w","type":"image/avif","sizes":"50px"},{"srcSet":"/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/3faea/profile-pic.webp 50w,\\n/JPerformance/static/b394b3864420cc2067967d4b42ef6b5a/6a679/profile-pic.webp 100w","type":"image/webp","sizes":"50px"}]},"width":50,"height":50}')},9535:function(e,t,a){"use strict";var l=a(7294),i=a(5444),r=a(6802);t.Z=function(){var e,t,c=(0,i.useStaticQuery)("230163734"),n=null===(e=c.site.siteMetadata)||void 0===e?void 0:e.author,o=null===(t=c.site.siteMetadata)||void 0===t?void 0:t.social;return l.createElement("div",{className:"bio"},l.createElement(r.S,{className:"bio-avatar",layout:"fixed",formats:["AUTO","WEBP","AVIF"],src:"../images/profile-pic.jpg",width:50,height:50,quality:95,alt:"Profile picture",__imageData:a(8505)}),(null==n?void 0:n.name)&&l.createElement("p",null,"Written by ",l.createElement("strong",null,n.name)," ",(null==n?void 0:n.summary)||null," ",l.createElement("a",{href:"https://github.com/"+((null==o?void 0:o.github)||"")},"You should follow them on GitHub"),"  or  ",l.createElement(i.Link,{className:"header-link-home",to:"/contact"}," Contact Here")))}},7704:function(e,t,a){"use strict";a.r(t);var l=a(7294),i=a(5444),r=a(9535),c=a(7198),n=a(3751);t.default=function(e){var t,a=e.data,o=e.location,s=(null===(t=a.site.siteMetadata)||void 0===t?void 0:t.title)||"Title",m=a.allMarkdownRemark.nodes;return 0===m.length?l.createElement(c.Z,{location:o,title:s},l.createElement(n.Z,{title:"All posts"}),l.createElement(r.Z,null),l.createElement("p",null,'No blog posts found. Add markdown posts to "content/blog" (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).')):l.createElement(c.Z,{location:o,title:s},l.createElement(n.Z,{title:"All posts"}),l.createElement(r.Z,null),l.createElement("ol",{style:{listStyle:"none"}},m.map((function(e){var t=e.frontmatter.title||e.fields.slug;return l.createElement("li",{key:e.fields.slug},l.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},l.createElement("header",null,l.createElement("h2",null,l.createElement(i.Link,{to:e.fields.slug,itemProp:"url"},l.createElement("span",{itemProp:"headline"},t))),l.createElement("small",null,e.frontmatter.date)),l.createElement("section",null,l.createElement("p",{dangerouslySetInnerHTML:{__html:e.frontmatter.description||e.excerpt},itemProp:"description"}))))}))))}}}]);
//# sourceMappingURL=component---src-pages-index-js-c02af80bc7a4ee933601.js.map