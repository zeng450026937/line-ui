const cheerio = require('cheerio');

const load = c => cheerio.load(c, { xmlMode: true });
const each = (o, f) => Object.keys(o).forEach(f);

module.exports = function createSvgSymbol(inline = true) {
  const svg = `
${ inline ? '' : '<?xml version="1.0" encoding="UTF-8"?>' }
${ inline ? '' : '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' }
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> id="svg-symbols">
  <defs/>
</svg>
    `.trim();

  const $ = load(svg);
  const $SVG = $('svg');
  const $DEFS = $('defs');

  const namespaces = {};

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
      $DEFS.append($defs.contents());
      $defs.remove();
    }

    $symbol.append($svg.contents());
    $SVG.append($symbol);
  }

  function toString() {
    if (!$DEFS.contents().length) {
      $DEFS.remove();
    }
    each(namespaces, ns => {
      $SVG.attr(ns, namespaces[ns]);
    });
    return $.xml();
  }

  return {
    get $svg() {
      return $SVG;
    },
    get $defs() {
      return $DEFS;
    },

    add,
    toString,
  };
};
