function getWidth(pre_space, str, post_space, append_elem) {
  var pre = pre_space ? "&nbsp;" : "";
  var post = post_space ? "&nbsp;" : "";

  var tmp_div = $(
    '<span style="white-space: nowrap;">' + pre + str + post + "</span>"
  );
  append_elem.append(tmp_div);
  var width = tmp_div[0].offsetWidth;
  tmp_div.remove();
  return width;
}

function ellipsisLine(elem, linePosition) {
  var width = elem[0].offsetWidth;
  var foundOriginalText = elem[0].dataset.thellipsisOriginalText !== undefined;
  var text;

  if (foundOriginalText) text = elem[0].dataset.thellipsisOriginalText;
  else text = elem[0].innerText;

  var words = text.split(" ");
  var line_width = 0;
  var current_line = "";
  var lines = [];

  words.map(function(word, index) {
    if (line_width == 0) {
      line_width += getWidth(false, word, false, elem);
    } else {
      line_width += getWidth(true, word, false, elem);
    }

    // console.log("=====================");
    // console.log("current_line: ", current_line);
    // console.log("word: ", word);
    // console.log("line_width: ", line_width);
    // console.log("width: ", width);
    // console.log("line_width / width: ", line_width / width);
    // console.log("line_width >= width: ", line_width >= width);
    // console.log("=====================");
    if (line_width >= width) {
      lines.push(current_line);

      line_width = getWidth(false, word, false, elem); // new line
      current_line = "";
    }
    current_line += (current_line != "" ? " " : "") + word;

    // Garante que a última linha será sempre adicionada
    if (index == words.length - 1) {
      lines.push(current_line);
    }
  });

  var line_index = linePosition - 1;
  var end_index = lines.length - 1;

  if (lines.length > linePosition) {
    lines[line_index] =
      '<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: ' +
      parseInt(width) +
      'px; display: inline-block;">' +
      lines[line_index];
    lines[end_index] += "</span>";
  }

  if (!foundOriginalText) elem[0].dataset.thellipsisOriginalText = text;

  elem[0].innerHTML = lines.join(" ");
}
