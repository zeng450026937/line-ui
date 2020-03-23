const cheerio = require('cheerio');

const load = c => cheerio.load(c, { xmlMode: true });
const each = (o, f) => Object.keys(o).forEach(f);

module.exports = function createSvgSymbol(inline = true) {
  const svg = `
${ inline ? '' : '<?xml version="1.0" encoding="UTF-8"?>' }
${ inline ? '' : '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' }
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg-symbols" style="position: absolute; width: 0; height: 0;">
  <defs/>
</svg>
    `.trim();

  const $ = load(svg);
  const $svg = $('svg');
  const $defs = $('defs');

  const namespaces = {};

  const addSymbol = s => $svg.append(s);
  const addDefs = d => $defs.append(d);

  function add(content, symbolId) {
    const $svg = load(content)('svg');

    if (!$svg.length) return;

    const id = symbolId || $svg.attr('id');
    const viewBox = $svg.attr('viewBox');
    const preserveAspectRatio = $svg.attr('preserveAspectRatio');

    const $symbol = $('<symbol/>');

    if (id) {
      $symbol.attr('id', id);
    }
    if (viewBox) {
      $symbol.attr('viewBox', viewBox);
    }
    if (preserveAspectRatio) {
      $symbol.attr('preserveAspectRatio', preserveAspectRatio);
    }

    const attrs = $svg[0].attribs;

    each(attrs, key => {
      if (!/xmlns:.+/.test(key)) {
        return;
      }
      const value = attrs(key);
      const stored = namespaces[key];

      if (stored && value !== stored) {
        console.log(
          `${ key } namespace appeared multiple times with different value.\n`
          + `Keeping the first one : "${ stored }".\n`
          + 'Each namespace must be unique across files.',
        );
        return;
      }
      each(namespaces, (ns) => {
        if (namespaces[ns] === value) {
          console.log(
            `Same namespace value under different names : ${ ns } and ${ key }\n`
            + 'Keeping both.',
          );
        }
      });
      namespaces[key] = value;
    });

    const $defs = $svg.find('defs');
    if ($defs.length > 0) {
      addDefs($defs.contents());
      $defs.remove();
    }

    $symbol.append($svg.contents());
    addSymbol($symbol);
  }

  function toString() {
    if (!$defs.contents().length) {
      $defs.remove();
    }
    each(namespaces, ns => {
      $svg.attr(ns, namespaces[ns]);
    });
    return $.xml();
  }

  return {
    $svg,
    $defs,

    add,
    toString,
  };
};
