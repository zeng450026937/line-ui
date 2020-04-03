/* eslint-disable no-cond-assign */
const TITLE_REG = /^(#+)\s+([^\n]*)/;
const TABLE_REG = /^\|.+\n\|\s*-+/;
const TD_REG = /\s*`[^`]+`\s*|([^|`]+)/g;
const TABLE_SPLIT_LINE_REG = /^\|\s*-/;

interface TableContent {
  head: Array<string>;
  body: Array<Array<string>>;
}

interface SimpleMdAst {
  type: string;
  content?: string;
  table?: TableContent;
  level?: number;
}

export type Artical = Array<SimpleMdAst>;

function readLine(input: string) {
  const end = input.indexOf('\n');

  return input.substr(0, end !== -1 ? end : input.length);
}

function tableParse(input: string) {
  let start = 0;
  let isHead = true;

  const end = input.length;
  const table: TableContent = {
    head: [],
    body: [],
  };

  while (start < end) {
    const target = input.substr(start);
    const line = readLine(target);

    if (!/^\|/.test(target)) {
      break;
    }

    if (TABLE_SPLIT_LINE_REG.test(target)) {
      isHead = false;
    } else if (isHead) {
      // temp do nothing
    } else {
      const matched = line.trim().match(TD_REG);

      if (matched) {
        table.body.push(
          matched.map((i) => {
            if (i.indexOf('|') !== 0) {
              return i
                .trim()
                .toLowerCase()
                .split('|')
                .map((s) => s.trim())
                .join('|');
            }
            return i.trim();
          })
        );
      }
    }

    start += line.length + 1;
  }

  return {
    table,
    usedLength: start,
  };
}

export function mdParser(input: string): Array<SimpleMdAst> {
  const artical = [];
  let start = 0;
  const end = input.length;

  while (start < end) {
    const target = input.substr(start);

    let match;
    if ((match = TITLE_REG.exec(target))) {
      artical.push({
        type: 'title',
        content: match[2],
        level: match[1].length,
      });

      start += match.index + match[0].length;
    } else if ((match = TABLE_REG.exec(target))) {
      const { table, usedLength } = tableParse(target.substr(match.index));
      artical.push({
        type: 'table',
        table,
      });

      start += match.index + usedLength;
    } else {
      start += readLine(target).length + 1;
    }
  }

  return artical;
}
