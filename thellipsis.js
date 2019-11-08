function createStyledWhiteSpaceNoWrapSpan(content) {
  const tempSpanElement = document.createElement("span");

  tempSpanElement.style.whiteSpace = "nowrap";
  tempSpanElement.className = "temp";
  tempSpanElement.innerHTML = content;

  return tempSpanElement;
}

function getContentWidth(pre_space, contentString, appendElement) {
  const pre = pre_space ? "&nbsp;" : "";
  const tempSpanElement = createStyledWhiteSpaceNoWrapSpan(
    `${pre}${contentString}`
  );

  appendElement.appendChild(tempSpanElement);

  const width = tempSpanElement.offsetWidth;

  appendElement.removeChild(tempSpanElement);

  return width;
}

function debugging(on, values) {
  if (on) {
    console.log("=====================");
    console.log("current_line: ", values.current_line);
    console.log("word: ", values.word);
    console.log("line_width: ", values.line_width);
    console.log("width: ", values.width);
    console.log("line_width >= width: ", values.line_width >= values.width);
    console.log("=====================");
  }
}

function detectOriginalTextAsDataAttribute(element) {
  return element.dataset.thellipsisOriginalText !== undefined;
}

function getOriginalText(element) {
  if (detectOriginalTextAsDataAttribute(element))
    return element.dataset.thellipsisOriginalText;
  else return element.innerText;
}

function applyMultilineEllipsisWithMaxLines(lines, max_lines, max_line_width) {
  const end_index = lines.length - 1;
  const line_index = max_lines - 1;

  if (lines.length > max_lines) {
    lines[line_index] =
      '<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: ' +
      parseInt(max_line_width) +
      'px; display: inline-block;">' +
      lines[line_index];
    lines[end_index] += "</span>";
  }
}

function calculateLinesContentWordByWordToFitIntoWidth(
  text,
  element,
  max_lines,
  debug
) {
  const words = text.split(" ");
  let lines = [];
  let line_width = 0;
  let current_line = "";

  words.forEach(function(word, index) {
    if (lines.length > max_lines) {
      lines[lines.length - 1] += ` ${word}`;
      return; // continue
    }

    if (line_width == 0) {
      line_width += getContentWidth(false, word, element);
    } else {
      line_width += getContentWidth(true, word, element);
    }

    debugging(debug, {
      line_width,
      current_line,
      word,
      width: element.offsetWidth
    });

    if (line_width >= element.offsetWidth) {
      lines.push(current_line);

      line_width = getContentWidth(false, word, element); // new line
      current_line = "";
    }
    current_line += (current_line != "" ? " " : "") + word;

    // Garante que a última linha será sempre adicionada
    if (index == words.length - 1) {
      lines.push(current_line);
    }
  });

  return lines;
}

function thellipsis(element, max_lines, debug) {
  const text = getOriginalText(element);
  const lines = calculateLinesContentWordByWordToFitIntoWidth(
    text,
    element,
    max_lines,
    debug
  );

  applyMultilineEllipsisWithMaxLines(lines, max_lines, element.offsetWidth);

  if (!detectOriginalTextAsDataAttribute(element))
    element.dataset.thellipsisOriginalText = text;

  element.innerHTML = lines.join(" ");
}
