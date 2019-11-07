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
    console.log("line_width / width: ", values.line_width / values.width);
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

function thellipsis(element, line_position, debug) {
  const line_index = line_position - 1;
  const width = element.offsetWidth;
  const text = getOriginalText(element);
  const words = text.split(" ");
  let line_width = 0;
  let current_line = "";
  let lines = [];

  words.map(function(word, index) {
    if (line_width == 0) {
      line_width += getContentWidth(false, word, element);
    } else {
      line_width += getContentWidth(true, word, element);
    }

    debugging(debug, { line_width, current_line, word, width });

    if (line_width >= width) {
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

  const end_index = lines.length - 1;

  if (lines.length > line_position) {
    lines[line_index] =
      '<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: ' +
      parseInt(width) +
      'px; display: inline-block;">' +
      lines[line_index];
    lines[end_index] += "</span>";
  }

  if (!detectOriginalTextAsDataAttribute(element))
    element.dataset.thellipsisOriginalText = text;

  element.innerHTML = lines.join(" ");
}
