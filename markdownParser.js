$(function() {

    var output = "", BLOCK = "block", INLINE = "inline";

    var markdownMap = [
      { reg: /(#{1,6})([^\n]+)/g,
        replace: "<h$L1>$2</h$L1>",
        type: BLOCK },
      { reg: /```([a-z]*\n[\s\S]*?\n)```/gm,
        replace: "<code>$1</code>",
        type: BLOCK },
      { reg: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
        replace: "<p>$1</p>",
        type: BLOCK },
      { reg: /\n(?:&gt;|\>)\W*(.*)/g,
        replace: "<blockquote><p>$1</p></blockquote>",
        type: BLOCK },
      { reg: /\n\s?\*\s*(.*)/g,
        replace: "<ul>\n\t<li>$1</li>\n</ul>",
        type: BLOCK },
      { reg: /\n\s?[0-9]+\.\s*(.*)/g,
        replace: "<ol>\n\t<li>$1</li>\n</ol>",
        type: BLOCK },
      { reg: /(\*\*|__)(.*?)\1/g,
        replace: "<strong>$2</strong>",
        type: INLINE },
      { reg: /(\*|_)(.*?)\1/g,
        replace: "<em>$2</em>",
        type: INLINE },
      { reg: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "$1<a href=\"$3\">$2</a>",
        type: INLINE },
      { reg: /!\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "<img src=\"$2\" alt=\"$1\" />",
        type: INLINE },
      { reg: /`([^`\n]+)`/g,
        replace: "<code>$1</code>",
        type: INLINE },
      { reg: /\n-{5,}\n/g,
        replace: "<hr />",
        type: BLOCK }
    ];

    function MarkdownParser(string) {
    		var output = htmlEncode(string);
        output = "\n" + output + "\n";
        
      markdownMap.forEach(function(p) {
        output = output.replace(p.reg, function() {
            return replace.call(this, arguments, p.replace, p.type);
          });
        });
      output = clean(output);
      output = output.trim();
      output = output.replace(/[\n]{1,}/g, "\n");
        return output;
    }

    function replace(matchList, replacement, type) {
        var
            i,
        $$;

        for(i in matchList) {
            if(!matchList.hasOwnProperty(i)) {
                continue;
            }

            replacement = replacement.split("$" + i).join(matchList[i]);
            replacement = replacement.split("$L" + i).join(matchList[i].length);
        }

        if(type === BLOCK) {
            replacement = replacement.trim() + "\n";
        }

        return replacement;
    }

    function clean(string) {
        var cleaningReg = [
            {
                match: /<\/([uo]l)>\s*<\1>/g,
                replacement: "",
            },
            {
                match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
                replacement: "$1",
            },
        ];

        cleaningReg.forEach(function(rule) {
            string = string.replace(rule.match, rule.replacement);
        });

        return string;
    }
    
    function htmlEncode(value) {
        //create a div in-memory, set it's inner text. Which jQuery automatically encodes.
        //then take the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
      }

    $('#parse').click(function() {
        var inputText = $('#input').val();
        var result = MarkdownParser(inputText);
                $('#results').val(result);
            $('#resultsDiv').html(result);
        //console.log(result);
    });

    $('#html').click(function() {
        $('#results').toggle();
      $('#resultsDiv').toggle();
    });
    
});