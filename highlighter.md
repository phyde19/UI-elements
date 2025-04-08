Skip to content
Navigation Menu
wooorm
starry-night

Type / to search
Code
Issues
Pull requests
Actions
Security
Insights
Owner avatar
starry-night
Public
wooorm/starry-night
Go to file
t
Name		
wooorm
wooorm
3.7.0
a429705
 · 
3 weeks ago
.github/workflows
Update Actions
3 months ago
lang
Regenerate for linguist@9.1.0
3 weeks ago
lib
Regenerate for linguist@9.1.0
3 weeks ago
media
Regenerate screenshot
2 years ago
script
Regenerate for linguist@9.1.0
3 weeks ago
style
Regenerate CSS
8 months ago
.editorconfig
Refactor .editorconfig
3 months ago
.gitignore
Add .tsbuildinfo to .gitignore
3 months ago
.npmrc
Add ignore-scripts to .npmrc
2 years ago
.prettierignore
Refactor .prettierignore
3 months ago
.remarkignore
.
3 years ago
changelog.md
.
3 years ago
funding.yml
.
3 years ago
index.d.ts
Refactor types
10 months ago
index.js
Refactor types
10 months ago
license
.
3 years ago
notice
Regenerate for linguist@9.1.0
3 weeks ago
package.json
3.7.0
3 weeks ago
readme.md
Refactor docs
3 weeks ago
test.js
Regenerate for linguist@9.0.0
3 months ago
tsconfig.json
Refactor types
10 months ago
Repository files navigation
README
MIT license


Close up of The Starry Night by Vincent van Gogh (1889)
with examples of starry-night over it


starry-night
Build Coverage Downloads Size

Syntax highlighting, like what GitHub uses to highlight code, but free and open source and JavaScript!

Contents
What is this?
When should I use this?
What is PrettyLights?
Install
Use
API
all
common
createStarryNight(grammars[, options])
starryNight.flagToScope(flag)
starryNight.highlight(value, scope)
starryNight.missingScopes()
starryNight.register(grammars)
starryNight.scopes()
GetOnigurumaUrl
Grammar
Options
Examples
Example: serializing hast as html
Example: using starry-night on the client
Example: turning hast into react nodes
Example: adding line numbers
Example: integrate with unified, remark, and rehype
Example: integrating with markdown-it
Syntax tree
CSS
Languages
Compatibility
Security
Related
Contribute
License
What is this?
This package is an open source version of GitHub’s closed-source PrettyLights project (more on that later). It supports 600+ grammars and its extremely high quality. It uses TextMate grammars which are also used in popular editors (SublimeText, Atom, VS Code, &c). They’re heavy but high quality.

When should I use this?
starry-night is a high quality highlighter (when your readers or authors are programmers, you want this!) that can support tons of grammars (from new things like MDX to much more!) which approaches how GitHub renders code.

It has a WASM dependency, and rather big grammars, which means that starry-night might be too heavy particularly in browsers, in which case lowlight or refractor might be more suitable.

This project is similar to the excellent shiki, and it uses the same underlying dependencies, but starry-night is meant to match GitHub in that it produces classes and works with the CSS it ships, making it easier to add dark mode and other themes with CSS compared to inline styles.

Finally, this package produces objects (an AST), which makes it useful when you want to perform syntax highlighting in a place where serialized HTML wouldn’t work or wouldn’t work well. For example, when you want to show code in a CLI by rendering to ANSI sequences, when you’re using virtual DOM frameworks (such as React or Preact) so that diffing can be performant, or when you’re working with hast or rehype.

Bundled, minified, and gzipped, starry-night and the WASM binary are 185 kB. There are two lists of grammars you can use: common (±35 languages, good for your own site) adds 250 kB and all (~600 languages, useful if you are making a site like GitHub) is 1.6 MB. You can also manually choose which grammars to include (or add to common): a language is typically between 3 and 5 kB. To illustrate, Astro costs 2.1 kB and TSX costs 25.4 kB.

What is PrettyLights?
PrettyLights is the syntax highlighter that GitHub uses to turn this:

```markdown
# Hello, world!
```
…into this:

<span class="pl-mh"><span class="pl-mh">#</span><span class="pl-mh"> </span>Hello, world!</span>
…which is what starry-night does too (some small differences in markup, but essentially the same)!

PrettyLights is responsible for taking the flag markdown, looking it up in languages.yml from github-linguist to figure out that that means markdown, taking a corresponding grammar (in this case wooorm/markdown-tm-language), doing some GPL magic in C, and turning it into spans with classes.

GitHub is using PrettyLights since December 2014, when it replaced Pygments. They wanted to open source it, but were unable due to licensing issues. Recently (Feb 2019?), GitHub has slowly started to move towards TreeLights, which is based on TreeSitter, and also closed source. If TreeLights includes a language (currently: C, C#, CSS, CodeQL, EJS, Elixir, ERB, Gleam, Go, HTML, Java, JS, Nix, PHP, Python, RegEx, Ruby, Rust, TLA, TS), that’ll be used, for everything else PrettyLights is used.

starry-night does what PrettyLights does, not what TreeLights does. I’m hopeful that that will be open sourced in the future and we can mimic both.




Install
This package is ESM only. In Node.js (version 16+), install with npm:

npm install @wooorm/starry-night
In Deno with esm.sh:

import {common, createStarryNight} from 'https://esm.sh/@wooorm/starry-night@3'
In browsers with esm.sh:

<script type="module">
  import {common, createStarryNight} from 'https://esm.sh/@wooorm/starry-night@3?bundle'
</script>
To get the CSS in browsers, do (see CSS for more info):

<!-- This supports light and dark mode automatically. -->
<link rel="stylesheet" href="https://esm.sh/@wooorm/starry-night@3/style/both">
Use
import {common, createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight(common)

const scope = starryNight.flagToScope('markdown')
const tree = starryNight.highlight('# hi', scope)

console.log(tree)
Yields:

{
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'span',
      properties: {className: ['pl-mh']},
      children: [
        {type: 'text', value: '# '},
        {
          type: 'element',
          tagName: 'span',
          properties: {className: ['pl-en']},
          children: [{type: 'text', value: 'hi'}]
        }
      ]
    }
  ]
}
API
This package exports the identifiers all, common, and createStarryNight from the main module. It exports the additional TypeScript types GetOnigurumaUrl, Grammar, and Options. There is no default export.

It also includes grammars directly in its export map, which each expose a Grammar as the default export. Do not use the lang/ folder or the .js extension.

For CSS files, do use style/ and don’t use .css:

import sourceMdx from '@wooorm/starry-night/source.mdx' // Grammar.
import styleTritanopiaDark from '@wooorm/starry-night/style/tritanopia-dark' // CSS.
all
List of all grammars (Array<Grammar>)

common
List of ±35 common grammars (Array<Grammar>)

createStarryNight(grammars[, options])
Create a StarryNight that can highlight things with the given grammars. This is async to allow async loading and registering, which is currently only used for WASM.

Parameters
grammars (Array<Grammar>) — grammars to support
options (Options, optional) — configuration
Returns
Promise that resolves to an instance which highlights with the bound grammars (Promise<StarryNight>).

starryNight.flagToScope(flag)
Get the grammar scope (such as text.md) associated with a grammar name (such as markdown) or grammar extension (such as .mdwn).

This function uses the first word (when splitting on spaces and tabs) that is used after the opening of a fenced code block:

```js
console.log(1)
```
To match GitHub, this also accepts entire paths:

```path/to/example.js
console.log(1)
```
👉 Note: languages can use the same extensions. For example, .h is reused by many languages. In those cases, you will get one scope back, but it might not be the most popular language associated with an extension.

Parameters
flag (string) — grammar name (such as 'markdown'), grammar extension (such as '.mdwn'), or entire file path ending in extension
Returns
Grammar scope, such as 'text.md' (string or undefined).

Example
import {common, createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight(common)

console.log(starryNight.flagToScope('pandoc')) // `'text.md'`
console.log(starryNight.flagToScope('workbook')) // `'text.md'`
console.log(starryNight.flagToScope('.workbook')) // `'text.md'`
console.log(starryNight.flagToScope('path/to/example.js')) // `'source.js'`
console.log(starryNight.flagToScope('whatever')) // `undefined`
starryNight.highlight(value, scope)
Highlight programming code.

Parameters
value (string) — code to highlight
scope (string) — registered grammar scope to highlight as (such as 'text.md')
Returns
Node representing highlighted code (Root).

Example
import sourceCss from '@wooorm/starry-night/source.css'
import {createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight([sourceCss])

console.log(starryNight.highlight('em { color: red }', 'source.css'))
Yields:

{
  type: 'root',
  children: [
    {type: 'element', tagName: 'span', properties: [Object], children: [Array]},
    {type: 'text', value: ' { '},
    {type: 'element', tagName: 'span', properties: [Object], children: [Array]},
    {type: 'text', value: ': '},
    {type: 'element', tagName: 'span', properties: [Object], children: [Array]},
    {type: 'text', value: ' }'}
  ]
}
starryNight.missingScopes()
List scopes that are needed by the registered grammars but that are missing.

To illustrate, the text.xml.svg grammar needs the text.xml grammar. When you register text.xml.svg without text.xml, it will be listed here.

Returns
List of grammar scopes, such as 'text.md' (Array<string>).

Example
import textXmlSvg from '@wooorm/starry-night/text.xml.svg'
import textXml from '@wooorm/starry-night/text.xml'
import {createStarryNight} from '@wooorm/starry-night'

const svg = await createStarryNight([textXmlSvg])
console.log(svg.missingScopes()) //=> ['text.xml']

const svgAndXml = await createStarryNight([textXmlSvg, textXml])
console.log(svgAndXml.missingScopes()) //=> []
starryNight.register(grammars)
Add more grammars.

Parameters
grammars (Array<Grammar>) — grammars to support
Returns
Promise resolving to nothing (Promise<undefined>).

Example
import sourceCss from '@wooorm/starry-night/source.css'
import textMd from '@wooorm/starry-night/text.md'
import {createStarryNight} from '@wooorm/starry-night'
import {toHtml} from 'hast-util-to-html'

const markdown = '```css\nem { color: red }\n```'

const starryNight = await createStarryNight([textMd])

console.log(toHtml(starryNight.highlight(markdown, 'text.md')))

await starryNight.register([sourceCss])

console.log(toHtml(starryNight.highlight(markdown, 'text.md')))
Yields:

<span class="pl-s">```</span><span class="pl-en">css</span>
<span class="pl-c1">em { color: red }</span>
<span class="pl-s">```</span>
<span class="pl-s">```</span><span class="pl-en">css</span>
<span class="pl-ent">em</span> { <span class="pl-c1">color</span>: <span class="pl-c1">red</span> }
<span class="pl-s">```</span>
starryNight.scopes()
List all registered scopes.

Returns
List of grammar scopes, such as 'text.md' (Array<string>).

Example
import {common, createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight(common)

console.log(starryNight.scopes())
Yields:

[
  'source.c',
  'source.c++',
  // …
  'text.xml',
  'text.xml.svg'
]
GetOnigurumaUrl
Function to get a URL to the oniguruma WASM (TypeScript type).

👉 Note: this must currently result in a version 2 URL of onig.wasm from vscode-oniguruma.

⚠️ Danger: when you use this functionality, your project might break at any time (when reinstalling dependencies), except when you make sure that the WASM binary you load manually is what our internally used vscode-oniguruma dependency expects. To solve this, you could for example use an npm script called dependencies (which runs everytime node_modules is changed) which copies vscode-oniguruma/release/onig.wasm to the place you want to host it.

Returns
URL object to a WASM binary (Promise<URL> or URL).

Example
import {common, createStarryNight} from '@wooorm/starry-night'

const starryNight = await createStarryNight(common, {
  getOnigurumaUrlFetch() {
    return new URL('/onig.wasm', window.location.href);
  }
})
Grammar
TextMate grammar with some extra info (TypeScript type).

Fields
dependencies (Array<string>, optional, example: ['source.tsx']) — list of scopes that are needed for this grammar to work
extensions (Array<string>, example: ['.mdx']) — list of extensions
extensionsWithDot (Array<string>, optional, example: ['.php']) — list of extensions that only match if used w/ a dot
injections (Record<string, Rule>, optional) — TextMate injections
names (Array<string>, example: ['mdx']) — list of names
patterns (Array<Rule>) — TextMate patterns
repository (Record<string, Rule>, optional) — TextMate repository
scopeName (string, example: 'source.mdx') — scope
Options
Configuration (TypeScript type).

Fields
getOnigurumaUrlFetch (GetOnigurumaUrl, optional) — get a URL to the oniguruma WASM, typically used in browsers
getOnigurumaUrlFs (GetOnigurumaUrl, optional) — get a URL to the oniguruma WASM, typically used in Node.js
Examples
Example: serializing hast as html
hast trees as returned by starry-night can be serialized with hast-util-to-html:

import {common, createStarryNight} from '@wooorm/starry-night'
import {toHtml} from 'hast-util-to-html'

const starryNight = await createStarryNight(common)

const tree = starryNight.highlight('"use strict";', 'source.js')

console.log(toHtml(tree))
Yields:

<span class="pl-s"><span class="pl-pds">"</span>use strict<span class="pl-pds">"</span></span>;
Example: using starry-night on the client
You don’t have to do preprocess things on a server. Particularly, when you are not using Node.js or so. Or, when you have a lot of often changing content (likely markdown), such as on a page of comments.

In those cases, you can run starry-night in the browser. Here is an example. It also uses hast-util-to-dom, which is a light way to turn the AST into DOM nodes.

Say we have this example.js on our browser (no bundling needed!):

import {
  common,
  createStarryNight
} from 'https://esm.sh/@wooorm/starry-night@3?bundle'
import {toDom} from 'https://esm.sh/hast-util-to-dom@4?bundle'

const starryNight = await createStarryNight(common)
const prefix = 'language-'

const nodes = Array.from(document.body.querySelectorAll('code'))

for (const node of nodes) {
  const className = Array.from(node.classList).find(function (d) {
    return d.startsWith(prefix)
  })
  if (!className) continue
  const scope = starryNight.flagToScope(className.slice(prefix.length))
  if (!scope) continue
  const tree = starryNight.highlight(node.textContent, scope)
  node.replaceChildren(toDom(tree, {fragment: true}))
}
…and then, if we would have an index.html for our document:

<!doctype html>
<meta charset=utf8>
<title>Hello</title>
<link rel=stylesheet href=https://esm.sh/@wooorm/starry-night@3/style/both>
<body>
<h1>Hello</h1>
<p>…world!</p>
<pre><code class=language-js>console.log('it works!')
</code></pre>
<script type=module src=./example.js></script>
</body>
Opening that page in a browser, we’d see the <code> being swapped with:

<code class="language-js"><span class="pl-en">console</span>.<span class="pl-c1">log</span>(<span class="pl-s"><span class="pl-pds">'</span>it works!<span class="pl-pds">'</span></span>)
</code>
Example: turning hast into react nodes
hast trees as returned by starry-night can be turned into preact, react, solid, svelte, vue, etc., with hast-util-to-jsx-runtime:

import {common, createStarryNight} from '@wooorm/starry-night'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'react/jsx-runtime'

const starryNight = await createStarryNight(common)

const tree = starryNight.highlight('"use strict";', 'source.js')
const reactNode = toJsxRuntime(tree, {Fragment, jsx, jsxs})

console.log(reactNode)
Yields:

{
  '$$typeof': Symbol(react.element),
  type: Symbol(react.fragment),
  key: null,
  ref: null,
  props: { children: [ [Object], ';' ] },
  _owner: null,
  _store: {}
}
Example: adding line numbers
GitHub itself does not add line numbers to the code they highlight. You can do that, by transforming the AST. Here’s an example of a utility that wraps each line into a span with a class and a data attribute with its line number. That way, you can style the lines as you please. Or you can generate different elements for each line, of course.

Say we have our utility as hast-util-starry-night-gutter.js:

/**
 * @import {ElementContent, Element, RootContent, Root} from 'hast'
 */

/**
 * @param {Root} tree
 *   Tree.
 * @returns {undefined}
 *   Nothing.
 */
export function starryNightGutter(tree) {
  /** @type {Array<RootContent>} */
  const replacement = []
  const search = /\r?\n|\r/g
  let index = -1
  let start = 0
  let startTextRemainder = ''
  let lineNumber = 0

  while (++index < tree.children.length) {
    const child = tree.children[index]

    if (child.type === 'text') {
      let textStart = 0
      let match = search.exec(child.value)

      while (match) {
        // Nodes in this line.
        const line = /** @type {Array<ElementContent>} */ (
          tree.children.slice(start, index)
        )

        // Prepend text from a partial matched earlier text.
        if (startTextRemainder) {
          line.unshift({type: 'text', value: startTextRemainder})
          startTextRemainder = ''
        }

        // Append text from this text.
        if (match.index > textStart) {
          line.push({
            type: 'text',
            value: child.value.slice(textStart, match.index)
          })
        }

        // Add a line, and the eol.
        lineNumber += 1
        replacement.push(createLine(line, lineNumber), {
          type: 'text',
          value: match[0]
        })

        start = index + 1
        textStart = match.index + match[0].length
        match = search.exec(child.value)
      }

      // If we matched, make sure to not drop the text after the last line ending.
      if (start === index + 1) {
        startTextRemainder = child.value.slice(textStart)
      }
    }
  }

  const line = /** @type {Array<ElementContent>} */ (tree.children.slice(start))
  // Prepend text from a partial matched earlier text.
  if (startTextRemainder) {
    line.unshift({type: 'text', value: startTextRemainder})
    startTextRemainder = ''
  }

  if (line.length > 0) {
    lineNumber += 1
    replacement.push(createLine(line, lineNumber))
  }

  // Replace children with new array.
  tree.children = replacement
}

/**
 * @param {Array<ElementContent>} children
 * @param {number} line
 * @returns {Element}
 */
function createLine(children, line) {
  return {
    type: 'element',
    tagName: 'span',
    properties: {className: 'line', dataLineNumber: line},
    children
  }
}
…and a module example.js:

import {common, createStarryNight} from '@wooorm/starry-night'
import {toHtml} from 'hast-util-to-html'
import {starryNightGutter} from './hast-util-starry-night-gutter.js'

const starryNight = await createStarryNight(common)

const tree = starryNight.highlight(
  '# Some heading\n\n```js\nalert(1)\n```\n***',
  'text.md'
)

starryNightGutter(tree)

console.log(toHtml(tree))
Now running node example.js yields:

<span class="line" data-line-number="1"><span class="pl-mh"># <span class="pl-en">Some heading</span></span></span>
<span class="line" data-line-number="2"></span>
<span class="line" data-line-number="3"><span class="pl-s">```</span><span class="pl-en">js</span></span>
<span class="line" data-line-number="4"><span class="pl-en">alert</span>(<span class="pl-c1">1</span>)</span>
<span class="line" data-line-number="5"><span class="pl-s">```</span></span>
<span class="line" data-line-number="6"><span class="pl-ms">***</span></span>
Example: integrate with unified, remark, and rehype
This example shows how to use rehype-starry-night with unified. If we have a markdown file example.md:

# Hello

…world!

```js
console.log('it works!')
```
…and a module example.js:

import fs from 'node:fs/promises'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStarryNight)
  .use(rehypeStringify)
  .process(await fs.readFile('example.md'))

console.log(String(file))
…then running node example.js yields:

<h1>Hello</h1>
<p>…world!</p>
<pre><code class="language-js"><span class="pl-en">console</span>.<span class="pl-c1">log</span>(<span class="pl-s"><span class="pl-pds">'</span>it works!<span class="pl-pds">'</span></span>)
</code></pre>
Example: integrating with markdown-it
This example shows how to combine starry-night with markdown-it. If we have a markdown file example.md:

# Hello

…world!

```js
console.log('it works!')
```
…and a module example.js:

/**
 * @import {ElementContent} from 'hast'
 */

import fs from 'node:fs/promises'
import {common, createStarryNight} from '@wooorm/starry-night'
import {toHtml} from 'hast-util-to-html'
import markdownIt from 'markdown-it'

const file = await fs.readFile('example.md')
const starryNight = await createStarryNight(common)

const markdownItInstance = markdownIt({
  highlight(value, lang) {
    const scope = starryNight.flagToScope(lang)

    return toHtml({
      type: 'element',
      tagName: 'pre',
      properties: {
        className: scope
          ? [
              'highlight',
              'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-')
            ]
          : undefined
      },
      children: scope
        ? /** @type {Array<ElementContent>} */ (
            starryNight.highlight(value, scope).children
          )
        : [{type: 'text', value}]
    })
  }
})

const html = markdownItInstance.render(String(file))

console.log(html)
Now running node example.js yields:

<h1>Hello</h1>
<p>…world!</p>
<pre class="highlight highlight-js"><span class="pl-en">console</span>.<span class="pl-c1">log</span>(<span class="pl-s"><span class="pl-pds">'</span>it works!<span class="pl-pds">'</span></span>)
</pre>



Syntax tree
The generated hast starts with a root node, that represents the fragment. It contains up to three levels of <span> elements, each with a single class. All these levels can contain text nodes with the actual code. Interestingly, TextMate grammars work per line, so all line endings are in the root directly, meaning that creating a gutter to display line numbers can be generated rather naïvely by only looking through the root node.

CSS
starry-night does not inject CSS for the syntax highlighted code (because well, starry-night doesn’t have to be turned into HTML and might not run in a browser!). If you are in a browser, you can use the packaged themes, or get creative with CSS! 💅

All themes accept CSS variables (custom properties). With the theme core.css, you have to define your own properties. All other themes define the colors on :root. Themes either have a dark or light suffix, or none, in which case they automatically switch colors based on a @media (prefers-color-scheme: dark). All themes are tiny (under 1 kB). The shipped themes are as follows:

name	Includes light scheme	Includes dark scheme
@wooorm/starry-night/style/core		
@wooorm/starry-night/style/light	✅	
@wooorm/starry-night/style/dark		✅
@wooorm/starry-night/style/both	✅	✅
@wooorm/starry-night/style/colorblind-light	✅	
@wooorm/starry-night/style/colorblind-dark		✅
@wooorm/starry-night/style/colorblind	✅	✅
@wooorm/starry-night/style/dimmed-dark		✅
@wooorm/starry-night/style/dimmed	✅	✅
@wooorm/starry-night/style/high-contrast-light	✅	
@wooorm/starry-night/style/high-contrast-dark		✅
@wooorm/starry-night/style/high-contrast	✅	✅
@wooorm/starry-night/style/tritanopia-light	✅	
@wooorm/starry-night/style/tritanopia-dark		✅
@wooorm/starry-night/style/tritanopia	✅	✅
Languages
Checked grammars are included in common. Everything (that’s needed) is available through all. You can add more grammars as you please.

Each grammar has several associated names and extensions. See source files for which are known and use flagToScope to turn them into scopes.

Some grammars need other grammars to work. You are responsible for loading those, use missingScopes to find which dependencies are needed.

All licenses are permissive and made available in notice. Changes should go to upstream repos and languages.yml in github-linguist.

 source.c — upstream — needs: source.c.platform
 source.c.platform — upstream
 source.c++ — upstream — needs: source.c
 source.cs (mit) — upstream
 source.css (mit) — upstream
 source.css.less (mit) — upstream — needs: source.css
 source.css.scss (mit) — upstream — needs: source.css
 source.diff
 source.go (bsd-3-clause) — upstream
 source.graphql (mit) — upstream
 source.ini
 source.java — upstream
 source.js (mit) — upstream
 source.json (isc) — upstream
 source.kotlin (apache-2.0) — upstream
 source.lua (mit) — upstream
 source.makefile — upstream — needs: source.shell
 source.objc — needs: source.c, source.c.platform, source.objc.platform
 source.objc.platform
 source.perl — upstream
 source.python (mit) — upstream
 source.r
 source.ruby (mit) — upstream
 source.rust (mit) — upstream
 source.shell (mit) — upstream
 source.sql
 source.swift (mit) — upstream
 source.ts (mit) — upstream
 source.vbnet (apache-2.0) — upstream
 source.yaml (mit) — upstream
 text.html.basic (mit) — upstream
 text.html.php — needs: text.html.basic
 text.md (mit) — upstream
 text.xml
 text.xml.svg (isc) — upstream — needs: text.xml
 config.xcompose (mit)
 etc (isc) — upstream — needs: source.regexp.posix
 file.lasso (public domain)
 go.mod (mit) — upstream
 go.sum (mit) — upstream
 injections.etc (isc) — upstream
 objdump.x86asm (mit) — needs: source.c, source.c++
 source.2da (isc) — upstream
 source.4dm (mit)
 source.8xp (bsd-3-clause) — upstream
 source.abap — upstream
 source.abapcds (unlicense) — upstream
 source.abl (mit) — upstream
 source.abnf (isc) — upstream
 source.actionscript.3 (mit) — upstream — needs: text.html.asdoc, text.xml
 source.ada
 source.afm (isc) — upstream
 source.agc (isc)
 source.agda (mit) — upstream
 source.ahk (unlicense) — upstream
 source.aidl (apache-2.0) — upstream
 source.al (mit) — upstream
 source.alloy (apache-2.0) — upstream
 source.ampl (mit)
 source.angelscript (unlicense) — upstream
 source.answersetprogramming (mit) — upstream
 source.antlr
 source.apacheconf (mit) — upstream
 source.apex (bsd-3-clause) — upstream
 source.apl (isc) — upstream
 source.applescript
 source.arr (mit) — upstream
 source.asl (mit) — upstream
 source.asn (mit) — upstream
 source.asp
 source.aspectj (mit)
 source.assembly (bsd-3-clause) — upstream
 source.astro (mit) — upstream — needs: source.js, source.ts, source.tsx
 source.ats (mit)
 source.autoit (mit)
 source.avro (mit) — upstream
 source.awk (mit)
 source.ballerina (apache-2.0) — upstream
 source.basic (apache-2.0) — upstream
 source.batchfile (mit) — upstream
 source.bb (mit) — upstream
 source.bdf (isc) — upstream — needs: source.xlfd
 source.befunge (mit)
 source.berry (mit) — upstream
 source.bf (mit) — upstream
 source.bh (bsd-3-clause) — upstream
 source.bicep (mit) — upstream
 source.blitzmax
 source.boo (mit) — upstream
 source.boogie (mit) — upstream
 source.bp (mit) — upstream
 source.bqn (mit) — upstream
 source.brs (mit) — upstream
 source.bsl (mit) — upstream — needs: source.sdbl
 source.bst (mit) — upstream
 source.bsv (mit)
 source.c.ec (unlicense) — upstream — needs: source.c
 source.c.linker (mit) — upstream
 source.c.nwscript (isc) — upstream — needs: source.c
 source.cabal (mit) — upstream
 source.Caddyfile (mit) — upstream
 source.cadence (apache-2.0) — upstream
 source.cairo (apache-2.0) — upstream
 source.cairo0 (apache-2.0) — upstream
 source.camlp4.ocaml — needs: source.ocaml
 source.capnp
 source.cds (apache-2.0) — upstream
 source.ceylon (apache-2.0)
 source.cfscript (mit) — needs: source.sql
 source.changelogs.rpm-spec (mit)
 source.chapel (apache-2.0) — upstream
 source.cil (apache-2.0) — upstream
 source.circom (mit) — upstream
 source.cirru (mit) — upstream
 source.clar (mit) — upstream
 source.clarion (mit) — upstream
 source.clean (mit)
 source.click (mit)
 source.clips (mit)
 source.clojure (mit) — upstream
 source.cmake (mit) — upstream
 source.cobol (mit) — upstream
 source.coffee (mit) — upstream — needs: source.js
 source.commonlisp (mit) — upstream
 source.cool (mit)
 source.coq (mit)
 source.crystal (mit) — upstream — needs: text.html.basic
 source.csound (mit) — upstream
 source.csound-document (mit) — upstream — needs: source.csound, text.xml
 source.csound-score (mit) — upstream — needs: source.csound
 source.css.mss (mit)
 source.css.postcss.sugarss (mit)
 source.csswg (cc0-1.0) — upstream
 source.cuda-c++ (bsd-3-clause) — upstream — needs: source.c++
 source.cue (mit) — upstream
 source.cuesheet (mit) — upstream
 source.curlrc (isc) — upstream — needs: etc
 source.curry (mit) — upstream
 source.cwl (mit)
 source.cylc (bsd-3-clause) — upstream
 source.cypher (apache-2.0) — upstream
 source.cython — needs: source.regexp.python
 source.d — upstream — needs: text.html.javadoc
 source.d2 (bsd-3-clause) — upstream
 source.dart (bsd-3-clause) — upstream
 source.data-weave (mit) — upstream
 source.deb-control (mit) — upstream
 source.denizenscript (mit) — upstream
 source.desktop
 source.dircolors (mit)
 source.ditroff (isc) — upstream — needs: source.ditroff.desc, text.roff
 source.ditroff.desc (isc) — upstream
 source.dm (mit) — upstream
 source.dockerfile (mit) — upstream
 source.dot
 source.dotenv (isc) — upstream
 source.dune (mit) — upstream
 source.dylan
 source.earthfile (mpl-2.0) — upstream
 source.ebnf (isc) — upstream — needs: source.lex.regexp
 source.ecl (apache-2.0) — upstream
 source.edgeql (mit) — upstream
 source.editorconfig (mit) — upstream
 source.eiffel
 source.elixir (apache-2.0) — upstream — needs: text.elixir
 source.elm (mit) — upstream
 source.elvish (bsd-2-clause) — upstream
 source.elvish-transcript (bsd-2-clause) — upstream — needs: source.elvish
 source.emacs.lisp (isc) — upstream
 source.erlang (apache-2.0) — upstream
 source.euphoria (mit) — upstream
 source.factor (bsd-2-clause)
 source.fan (mit)
 source.fancy (bsd-3-clause) — upstream
 source.faust (mit)
 source.figfont (isc) — upstream
 source.firestore (mit)
 source.firrtl (apache-2.0) — upstream
 source.fish (mit)
 source.fnl (mit) — upstream
 source.fontdir (isc) — upstream — needs: source.xlfd
 source.fontforge (isc) — upstream
 source.forth
 source.fortran
 source.fortran.modern — needs: source.fortran
 source.fsharp (mit) — upstream
 source.fstar (apache-2.0) — upstream
 source.ftl (mit) — upstream
 source.futhark (isc) — upstream — needs: etc
 source.gap — upstream
 source.gcode (mit) — upstream
 source.gdb (zlib) — upstream
 source.gdresource (mit) — upstream
 source.gdscript (mit) — upstream
 source.gedcom (apache-2.0) — upstream
 source.gemfile-lock (mit) — upstream
 source.gemini (mit) — upstream
 source.generic-db (isc) — upstream — needs: etc
 source.genero-4gl (unlicense) — upstream
 source.genero-per (unlicense) — upstream
 source.gerber (isc) — upstream
 source.gf (mit) — upstream
 source.git-revlist (isc) — upstream
 source.gitattributes (isc) — upstream — needs: etc, source.gitignore
 source.gitconfig (isc) — upstream — needs: source.shell
 source.gitignore (isc) — upstream — needs: etc
 source.gjs (mit) — upstream — needs: source.js
 source.gleam (apache-2.0) — upstream
 source.glsl (unlicense) — upstream
 source.gn (bsd-3-clause) — upstream
 source.gnuplot (mit)
 source.golo (mit) — upstream
 source.gosu.2 (apache-2.0) — upstream
 source.grace (mit)
 source.gremlin (isc) — upstream — needs: text.roff
 source.groovy
 source.groovy.gradle (apache-2.0) — needs: source.groovy
 source.gsc (unlicense) — upstream
 source.gts (mit) — upstream — needs: source.ts
 source.hack (mit) — upstream — needs: text.html.basic
 source.haproxy-config (mit)
 source.harbour (mit)
 source.haskell (mit) — upstream
 source.hc (unlicense)
 source.hcl (mpl-2.0) — upstream
 source.hcl.terraform (mpl-2.0) — upstream
 source.hlsl (mit)
 source.hocon (mit) — upstream
 source.hoon (mit) — upstream
 source.hosts (isc) — upstream — needs: etc
 source.hql (mit)
 source.httpspec (mit) — upstream — needs: source.json
 source.hx (mit) — upstream
 source.hxml (mit) — upstream — needs: source.hx
 source.hy (mit) — upstream
 source.iCalendar (mit) — upstream
 source.ice (bsd-3-clause) — upstream
 source.ideal (isc) — upstream — needs: source.pic, text.roff
 source.idl (bsd-3-clause) — upstream
 source.idris (mit) — upstream
 source.igor (bsd-3-clause) — upstream
 source.imba (mit) — upstream
 source.inform7 (mit) — upstream
 source.ini.npmrc (isc) — upstream — needs: etc
 source.ink (mit) — upstream
 source.inno (mit) — upstream — needs: source.pascal
 source.inputrc (isc) — upstream — needs: etc
 source.io
 source.ioke (mit)
 source.isabelle.root (bsd-2-clause) — upstream
 source.isabelle.theory (bsd-2-clause) — upstream
 source.ispc (bsd-3-clause) — upstream
 source.j (mit) — upstream
 source.jai (mit) — upstream
 source.janet (mit) — upstream
 source.jasmin (wtfpl) — upstream
 source.java-properties — upstream
 source.jcl (mit) — upstream
 source.jest.snap (mit) — upstream
 source.jflex (bsd-2-clause) — upstream — needs: source.java
 source.jison (mit) — needs: source.jisonlex
 source.jisonlex (mit) — needs: source.jison, source.js
 source.jolie (mit)
 source.jq (mit) — upstream
 source.js.objj — needs: source.js
 source.json.comments (mit) — upstream
 source.jsoniq (apache-2.0) — upstream
 source.jsonnet (apache-2.0) — upstream
 source.julia (mit) — upstream
 source.julia.console (mit) — upstream — needs: source.julia, source.shell
 source.just (mit) — upstream
 source.kakscript (unlicense) — upstream
 source.kdl (apache-2.0) — upstream
 source.kerboscript (mit) — upstream
 source.keyvalues (isc) — upstream
 source.kickstart (mit) — upstream
 source.kusto (apache-2.0) — upstream
 source.lark (isc) — upstream
 source.lean (apache-2.0) — upstream
 source.lean4 (apache-2.0) — upstream
 source.lex (isc) — upstream — needs: source.c++, source.jflex
 source.lex.regexp (isc) — upstream
 source.ligo (mit) — upstream
 source.lilypond (mit) — upstream — needs: source.lisp
 source.lisp
 source.litcoffee (mit) — upstream — needs: source.coffee, text.html.basic
 source.livecodescript (bsd-3-clause) — upstream
 source.livescript (mit) — upstream
 source.llvm (mit) — upstream
 source.logos (mit) — upstream — needs: source.c++, source.objc
 source.logtalk
 source.lolcode (mit) — upstream
 source.loomscript (mit)
 source.lsl
 source.ltspice.symbol (isc) — upstream
 source.luau (mit) — upstream
 source.m2 (mit) — upstream
 source.m4 (isc) — upstream — needs: etc
 source.m68k (mit)
 source.mask (mit) — needs: source.js, text.html.basic
 source.mathematica (apache-2.0) — upstream
 source.matlab (bsd-2-clause) — upstream
 source.maxscript (isc)
 source.mc (mit)
 source.mcfunction (mit) — upstream
 source.mdx (mit) — upstream — needs: source.tsx
 source.mercury (mit)
 source.mermaid (isc) — upstream — needs: source.mermaid.c4c-diagram, source.mermaid.class-diagram, source.mermaid.er-diagram, source.mermaid.flowchart, source.mermaid.gantt, source.mermaid.gitgraph, source.mermaid.mindmap, source.mermaid.pie-chart, source.mermaid.requirement-diagram, source.mermaid.sequence-diagram, source.mermaid.state-diagram, source.mermaid.user-journey
 source.mermaid.c4c-diagram (isc) — upstream — needs: source.mermaid, source.mermaid.user-journey, source.wsd
 source.mermaid.class-diagram (isc) — upstream — needs: source.mermaid, source.mermaid.flowchart
 source.mermaid.er-diagram (isc) — upstream — needs: source.mermaid
 source.mermaid.flowchart (isc) — upstream — needs: source.mermaid
 source.mermaid.gantt (isc) — upstream — needs: source.mermaid, source.mermaid.flowchart
 source.mermaid.gitgraph (isc) — upstream — needs: source.json, source.mermaid
 source.mermaid.mindmap (isc) — upstream — needs: source.mermaid, source.mermaid.flowchart
 source.mermaid.pie-chart (isc) — upstream — needs: source.mermaid
 source.mermaid.requirement-diagram (isc) — upstream — needs: source.mermaid
 source.mermaid.sequence-diagram (isc) — upstream — needs: source.json, source.mermaid
 source.mermaid.state-diagram (isc) — upstream — needs: source.mermaid
 source.mermaid.user-journey (isc) — upstream — needs: source.mermaid
 source.meson (apache-2.0) — upstream
 source.miniyaml (mit) — upstream
 source.mint (mit) — upstream — needs: source.css, source.css.scss, source.js
 source.ml — upstream
 source.mligo (mit) — upstream
 source.mlir (apache-2.0) — upstream
 source.mo (apache-2.0) — upstream
 source.modelica (mit) — upstream
 source.modula-3 (bsd-3-clause) — upstream
 source.modula2 (mit) — upstream
 source.mojo (mit) — upstream
 source.monkey (mit)
 source.moonbit (apache-2.0) — upstream
 source.moonscript (mit)
 source.move (mit) — upstream
 source.mql5 (mit)
 source.msg (mit) — upstream
 source.msl (mit) — upstream
 source.mupad (mit) — upstream
 source.mzn (mpl-2.0) — upstream
 source.nanorc (isc) — upstream — needs: etc, injections.etc
 source.nasal (mit) — upstream
 source.nasl (mit) — upstream
 source.ncl (mit)
 source.ne (unlicense) — upstream
 source.ned (mit) — upstream
 source.nemerle
 source.neon (isc) — upstream
 source.nesc (mit) — needs: source.c
 source.netlinx (mit)
 source.netlinx.erb (mit) — needs: source.netlinx
 source.nextflow (mit) — needs: source.nextflow-groovy
 source.nextflow-groovy (mit)
 source.nginx (mit) — upstream
 source.nim (mit) — upstream
 source.ninja (mit)
 source.nit (wtfpl)
 source.nix (mit) — upstream
 source.nr (apache-2.0) — upstream
 source.nsis (apache-2.0)
 source.nu (apache-2.0)
 source.nunjucks (mit)
 source.nushell (mit) — upstream
 source.nut (mit)
 source.objc++ — needs: source.c++, source.objc
 source.objectscript (mit) — needs: source.objectscript_macros
 source.objectscript_macros (mit) — needs: source.objectscript
 source.ocaml — needs: source.camlp4.ocaml
 source.odin (mit) — upstream
 source.odin-ehr (isc) — upstream — needs: etc
 source.ooc (bsd-2-clause)
 source.opa (mit) — upstream
 source.opal (mit) — upstream
 source.opentype (isc) — upstream
 source.opts (isc) — upstream — needs: etc
 source.overpassql (mpl-2.0) — upstream
 source.ox (mit)
 source.oz (mit)
 source.p4 (mit)
 source.pact (bsd-3-clause) — upstream
 source.pan (mit)
 source.papyrus.skyrim (mit)
 source.parrot.pir
 source.pascal
 source.pawn (mit)
 source.pcb.board (isc) — upstream — needs: source.pcb.sexp
 source.pcb.schematic (isc) — upstream — needs: source.pcb.sexp, source.scheme
 source.pcb.sexp (isc) — upstream
 source.pddl (mit) — upstream
 source.peggy (mit) — upstream — needs: source.js
 source.pep8 (wtfpl)
 source.php.zephir — upstream
 source.pic (isc) — upstream — needs: source.shell, text.html.basic, text.roff
 source.pig_latin (mit)
 source.pike (unlicense)
 source.pip-requirements (mit) — upstream
 source.pkl (apache-2.0) — upstream
 source.plist (mit) — upstream
 source.po
 source.pogoscript (mit)
 source.polar (apache-2.0) — upstream
 source.pony (bsd-2-clause) — upstream
 source.portugol (mit) — upstream
 source.postcss (mit)
 source.postscript (isc) — upstream
 source.pov-ray sdl (mit)
 source.powerbuilder (mit) — upstream
 source.powershell (mit) — upstream
 source.praat (mit) — upstream
 source.prisma (apache-2.0) — upstream
 source.processing
 source.procfile (bsd-3-clause) — upstream — needs: source.shell
 source.prolog (mpl-2.0)
 source.prolog.eclipse (mpl-2.0) — needs: source.prolog
 source.promela (mit) — upstream
 source.proto (mit) — upstream
 source.puppet (mit) — upstream
 source.purescript (mit) — upstream
 source.python.kivy (mit) — upstream — needs: source.python
 source.q (mit) — upstream
 source.qasm (mit)
 source.QB64 (mit) — upstream
 source.ql (mit) — upstream
 source.qmake
 source.qml (mit) — needs: source.js
 source.qsharp (mit) — upstream
 source.quake (bsd-3-clause)
 source.quoting.raku — upstream — needs: source.raku
 source.racket (mit)
 source.raku — upstream — needs: source.quoting.raku
 source.rascal (bsd-2-clause) — upstream
 source.rbs (mit) — upstream
 source.reason (mit) — upstream
 source.rebol (mit) — upstream
 source.record-jar (isc) — upstream — needs: etc
 source.red (mit) — upstream
 source.redirects (isc) — upstream
 source.reg (mit)
 source.regexp (isc) — upstream — needs: source.regexp.extended, source.regexp.posix, source.sy
 source.regexp.extended (isc) — upstream — needs: source.regexp
 source.regexp.posix (isc) — upstream — needs: source.regexp
 source.regexp.python (mit) — upstream
 source.rego (apache-2.0) — upstream
 source.religo (mit) — upstream
 source.renpy (mit) — upstream — needs: source.regexp.python
 source.rescript (mit) — upstream
 source.rexx (mit) — upstream
 source.rez — upstream
 source.ring (mit)
 source.roc (mit) — upstream
 source.ron (mit) — upstream
 source.rpgle (mit) — upstream — needs: source.sql
 source.rpm-spec (mit) — needs: source.changelogs.rpm-spec, source.shell
 source.sas (mit) — upstream
 source.sass (mit) — upstream — needs: source.css
 source.scad (mit) — upstream
 source.scala (mit) — upstream
 source.scaml (apache-2.0) — upstream — needs: source.scala
 source.scenic (mit) — upstream
 source.scheme
 source.scilab
 source.scm (mit) — upstream
 source.sdbl (mit) — upstream
 source.sed (isc) — upstream
 source.sepolicy (apache-2.0) — upstream
 source.sfv (isc) — upstream
 source.shaderlab (mit)
 source.shellcheckrc (isc) — upstream — needs: etc
 source.shen (bsd-3-clause)
 source.sieve (isc) — upstream
 source.singularity (mit) — upstream
 source.slang (apache-2.0) — upstream
 source.slint (mit) — upstream
 source.smali (mit) — upstream
 source.smalltalk (mit)
 source.smithy (apache-2.0) — upstream
 source.smpl (isc) — upstream — needs: etc
 source.smt (unlicense)
 source.solidity (mit) — upstream
 source.solution (isc) — upstream
 source.sourcepawn (mit) — upstream
 source.sparql (mit) — upstream — needs: source.turtle
 source.spin (zlib) — upstream
 source.sqf (apache-2.0) — upstream
 source.ssh-config (isc) — upstream
 source.stan (mit) — upstream
 source.star (isc) — upstream
 source.stata (mit) — upstream
 source.stl (isc) — upstream — needs: etc
 source.string-template (isc) — upstream — needs: etc
 source.stylus (mit)
 source.supercollider (mit) — upstream
 source.svelte (mit) — upstream — needs: source.css, source.js, source.ts
 source.sway (apache-2.0) — upstream
 source.sy (isc) — upstream — needs: source.regexp
 source.systemverilog (apache-2.0) — upstream
 source.tact (mit) — upstream
 source.talon (mit) — upstream
 source.tcl
 source.tea (apache-2.0) — needs: source.js, text.html.basic, text.xml
 source.templ (mit) — upstream — needs: source.go
 source.terra (bsd-3-clause)
 source.textgrid (mit) — upstream
 source.textproto (mit) — upstream
 source.thrift
 source.tl (mit)
 source.tla (mit)
 source.tlverilog (mit) — upstream
 source.tm-properties — upstream
 source.toc (unlicense) — upstream
 source.toit (mit) — upstream
 source.toml — upstream
 source.tsp (mit) — upstream
 source.tsql (mit) — upstream
 source.tsx (mit) — upstream
 source.turing (isc) — upstream
 source.turtle (mit) — upstream
 source.txl (apache-2.0) — upstream
 source.typst (apache-2.0) — upstream
 source.ur (mit)
 source.v (mit) — upstream
 source.vala (mit) — upstream
 source.varnish.vcl (mit) — upstream
 source.vba (mpl-2.0) — upstream
 source.vcard (mit) — upstream
 source.velocity (mit) — upstream
 source.verilog
 source.vhdl
 source.vim-snippet (mit) — upstream
 source.viml (mit) — upstream
 source.vue (mit) — upstream — needs: source.css, text.html.basic
 source.vyper (mit) — upstream
 source.wavefront.mtl (isc) — upstream
 source.wavefront.obj (isc) — upstream
 source.wdl (apache-2.0) — upstream
 source.webassembly (isc) — upstream
 source.webidl (mit) — upstream
 source.wgetrc (isc) — upstream — needs: etc
 source.wgsl (mit) — upstream
 source.whiley (apache-2.0) — upstream
 source.win32-messages (isc) — upstream
 source.wit (apache-2.0) — upstream
 source.witcherscript (mit) — upstream
 source.wollok (mit)
 source.wren (mit) — upstream
 source.wsd (mit) — upstream
 source.x10 (apache-2.0)
 source.x86 (mit) — upstream
 source.xc — needs: source.c
 source.xlfd (isc) — upstream
 source.xmake (mit) — upstream
 source.xojo (apache-2.0) — upstream
 source.xq (apache-2.0) — upstream
 source.xtend (mit)
 source.yacc (isc) — upstream — needs: source.c++, source.java
 source.yaml.salt (mit) — upstream — needs: source.python
 source.yang (mit)
 source.yara (mit) — upstream
 source.yasnippet (isc) — upstream — needs: source.emacs.lisp
 source.yul (mit) — upstream
 source.zap
 source.zeek (bsd-3-clause) — upstream
 source.zenscript (mit) — upstream
 source.zig (mit) — upstream
 source.zil
 text.adblock (mit) — upstream
 text.bibtex — upstream
 text.browserslist (mit) — upstream
 text.cfml.basic (mit)
 text.checksums (isc) — upstream — needs: etc
 text.codeowners (isc) — upstream — needs: etc
 text.conllu (apache-2.0)
 text.crontab
 text.dfy.dafny (mit) — upstream
 text.elixir (apache-2.0) — upstream — needs: source.elixir
 text.eml.basic (mit) — upstream
 text.gherkin.feature (mit) — upstream
 text.grammarkdown (isc) — upstream
 text.haml (mit) — needs: source.ruby
 text.html.asciidoc (mit) — upstream — needs: text.html.basic
 text.html.asdoc (mit) — upstream — needs: text.html.basic
 text.html.asp — needs: source.asp, text.html.basic
 text.html.cfm (mit) — needs: source.cfscript, text.cfml.basic
 text.html.creole (mit) — upstream — needs: text.html.basic
 text.html.cshtml (mit) — upstream — needs: source.cs, text.html.basic
 text.html.django — needs: text.html.basic
 text.html.ecmarkup (isc) — upstream — needs: etc, source.yaml, text.grammarkdown, text.html.basic
 text.html.ecr (mit) — upstream — needs: source.crystal, text.html.basic
 text.html.edge (mit) — upstream
 text.html.elixir (apache-2.0) — upstream — needs: text.elixir, text.html.basic
 text.html.erb (mit) — upstream — needs: source.ruby, text.html.basic
 text.html.ftl (mit) — needs: text.html.basic
 text.html.handlebars (mit) — upstream — needs: text.html.basic
 text.html.javadoc
 text.html.js (mit) — needs: text.html.basic
 text.html.jsp — upstream — needs: text.html.basic
 text.html.jte (apache-2.0) — upstream — needs: source.java, text.html.basic
 text.html.liquid (mit) — upstream — needs: text.html.basic
 text.html.mako (mit) — needs: text.html.basic
 text.html.markdown.source.gfm.apib (mit) — upstream — needs: source.js, text.html.markdown.source.gfm.mson
 text.html.markdown.source.gfm.mson (mit) — upstream
 text.html.mediawiki
 text.html.nunjucks (mit) — needs: source.nunjucks, text.html.basic
 text.html.php.blade (mit) — needs: text.html.basic
 text.html.riot (mit)
 text.html.slash (mit) — needs: text.html.basic
 text.html.smarty — needs: text.html.basic
 text.html.soy (mit) — needs: text.html.basic
 text.html.statamic (mit) — upstream — needs: text.html.basic
 text.html.twig (bsd-3-clause) — upstream
 text.jade (mit) — needs: source.js, text.html.basic
 text.marko (mit) — upstream — needs: source.js
 text.muse (isc) — upstream
 text.python.console (mit) — upstream — needs: source.python
 text.python.traceback (mit) — upstream — needs: source.python
 text.rdoc (mit)
 text.restructuredtext (mit) — upstream
 text.robot (apache-2.0) — upstream
 text.robots-txt (isc) — upstream
 text.roff (isc) — upstream — needs: source.ditroff, source.gremlin, source.ideal, source.pic
 text.rtf (mit) — upstream
 text.runoff (isc) — upstream
 text.sfd (isc) — upstream — needs: source.fontforge
 text.shell-session (mit) — upstream — needs: source.shell
 text.slim (mit) — needs: text.html.basic
 text.srt (isc) — upstream — needs: text.html.basic
 text.tex — upstream — needs: source.r
 text.tex.latex — upstream — needs: text.tex
 text.tex.latex.haskell (mit) — upstream — needs: source.haskell, text.tex.latex
 text.tex.latex.sweave — upstream — needs: source.r, text.tex.latex
 text.texinfo (isc) — upstream
 text.vim-help (mit) — upstream — needs: source.viml
 text.vtt (isc) — upstream — needs: text.html.basic
 text.xml.ant (mit) — needs: text.xml
 text.xml.plist (mit) — upstream — needs: text.xml
 text.xml.pom — needs: source.groovy, text.xml
 text.xml.xsl — needs: text.xml
 text.zone_file (mit) — upstream
Compatibility
This project is compatible with maintained versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of Node. This means we try to keep the current release line, wooorm@starry-night@3, compatible with Node.js 16.

You can pass your own TextMate grammars, provided that they work with vscode-textmate, and that they have the added fields extensions, names, and scopeName (see types for the definitions and the grammars in lang/ for examples).

Security
This package is safe.

Related
lowlight — similar but based on highlight.js
refractor — similar but based on Prism
Contribute
Yes please! See How to Contribute to Open Source.

License
The grammars included in this package are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in notice.

All other files MIT © Titus Wormer




About
Syntax highlighting, like GitHub

Topics
github linguist syntax code highlighting ast virtual highlight gogh prettylights treelights
Resources
 Readme
License
 MIT license
 Activity
Stars
 1.5k stars
Watchers
 6 watching
Forks
 34 forks
Report repository
Releases 24
3.7.0
Latest
3 weeks ago
+ 23 releases
Sponsor this project
@wooorm
wooorm Titus
Learn more about GitHub Sponsors
Used by 2.5k
@jbc2212321
@refmaven
@liujiaqi222
@ajnart
@Gonanf
@admrbsn
@admrbsn
@admrbsn
+ 2,486
Contributors
4
@wooorm
wooorm Titus
@darthmaim
darthmaim darthmaim
@sebastinez
sebastinez Sebastian Martinez
@janosh
janosh Janosh Riebesell
Languages
JavaScript
99.3%
 
CSS
0.7%
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
