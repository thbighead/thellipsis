function getWidth(pre_space, str, post_space, append_elem) {
  var pre = pre_space ? "&nbsp;" : "";
  var post = post_space ? "&nbsp;" : "";

  var tmp_div = $(
    '<span style="white-space: nowrap;">' + pre + str + post + "</span>"
  );
  append_elem.append(tmp_div);
  var width = tmp_div.width();
  tmp_div.remove();
  return width;
}

function ellipsisLine(elem, linePosition) {
  var width = elem.width();
  var lookingForOriginalText = elem.children(".thellipsis-original-text");
  var text;

  if (lookingForOriginalText.length > 0)
    text = elem.children(".thellipsis-original-text")[0].innerText;
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

    if (line_width / width > 1) {
      lines.push(current_line);

      line_width = getWidth(false, word, false, elem); // new line
      current_line = "";
    }
    current_line += (current_line != "" ? " " : "") + word;

    if (index == words.length - 1) {
      lines.push(current_line);
    }
  });

  var line_index = linePosition - 1;

  if (lines.length > line_index)
    lines[line_index] =
      '<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: ' +
      parseInt(width) +
      'px; display: inline-block;">' +
      lines[line_index];

  var end_index = lines.length - 1;
  lines[end_index] += "</span>";

  elem[0].innerHTML =
    '<span class="thellipsis-original-text" style="display:none;">' +
    text +
    "</span>" +
    lines.join(" ");
}
