(function() {
    function compile() {
        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
        };

        function cpar(HTML, e, p) {
            let c = replaceAll(HTML, '{{innerHTML}}', e.innerHTML);

            for (let i = 0; i < p.attributes.length; i++) {
                let name = p.attributes[i].name.toLowerCase();
                if (name != 'name' && name != 'tag-name') {
                    let q = e.querySelector(name);
                    if (q != null)
                        c = replaceAll(c, '{{' + name + '}}', q.innerHTML);
                }
            }

            for (let n in e.dataset) {
                c = replaceAll(c, '{{' + n + '}}', e.dataset[n])
            }
            for (let i = 0; i < e.attributes.length; i++) {
                c = replaceAll(c, '{{a.' + e.attributes[i].name + '}}', e.attributes[i].value)
            }
            return c;
        }

        {
            function res_name(name, p) {
                if (name == undefined) return; {
                    let e = document.querySelectorAll('ml-compile fun[name="' + name.nodeValue + '"]');
                    for (let i = 0; i < e.length; i++)
                        e[i].outerHTML = cpar(p.innerHTML, e[i], p)
                }
            }

            function res_tagname(name, p) {
                if (name == undefined) return; {
                    let e = document.querySelectorAll('ml-compile ' + name.nodeValue);
                    for (let i = 0; i < e.length; i++)
                        e[i].outerHTML = cpar(p.innerHTML, e[i], p)
                }
            }
            let p = document.querySelectorAll('define>fun');

            for (let i = 0; i < p.length; i++) {
                res_name(p[i].attributes["name"], p[i]);
            }
            for (let i = 0; i < p.length; i++) {
                res_tagname(p[i].attributes["tag-name"], p[i]);
            }
        }

        {
            function addStyle(styles) {
                var css = document.createElement('style');
                css.type = 'text/css';
                if (css.styleSheet)
                    css.styleSheet.cssText = styles;
                else
                    css.appendChild(document.createTextNode(styles));
                document.getElementsByTagName("head")[0].appendChild(css);
            }

            let cssText = "";
            let styles = document.querySelectorAll('define>style');
            for (let i = 0; i < styles.length; i++)
                cssText += styles[i].innerHTML;
            if (cssText.length > 0) addStyle(cssText);
        }

        {
            let define = document.querySelectorAll('define');
            for (let i = 0; i < define.length; i++)
                define[i].outerHTML = "";
        }

        {
            let compiler = document.querySelectorAll('ml-compile');
            for (let i = 0; i < compiler.length; i++)
                compiler[i].outerHTML = compiler[i].innerHTML;
        }
    }

    {
        let p = document.querySelectorAll('define>inc');
        if (p.length > 0) {
            let promises = [];
            for (let i = 0; i < p.length; i++) {
                promises.push(
                    fetch(p[i].attributes["name"].value)
                    .then(response => { return response.text() })
                    .then(data => p[i].outerHTML = data)
                    .catch(error => { console.log(error) })
                )
            }

            Promise
                .all(promises)
                .then(function() { compile() })
                .catch(function() { compile() });
        } else compile();
    }

    {
        let currentScript;
        currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.removeChild(currentScript);
    }
})();