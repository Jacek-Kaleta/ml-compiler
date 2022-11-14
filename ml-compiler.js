(function() {
	
	function cpar(HTML, e, p) {
		let c = replaceAll(HTML, '{{innerHTML}}', e.innerHTML);
		c = replaceAll(c, '${innerHTML}', e.innerHTML);

		for (let i = 0; i < p.attributes.length; i++) {
			let name = p.attributes[i].name.toLowerCase();
			if (name != 'name' && name != 'tag-name') {
				let q = e.querySelector(name);
				if (q != null)
				{
					c = replaceAll(c, '{{' + name + '}}', q.innerHTML);
					c = replaceAll(c, '${' + name + '}', q.innerHTML);
				}
			}
		}

		for (let n in e.dataset) {
			c = replaceAll(c, '{{' + n + '}}', e.dataset[n])
			c = replaceAll(c, '${' + n + '}', e.dataset[n])
		}

		for (let i = 0; i < e.attributes.length; i++) {
			c = replaceAll(c, '{{a.' + e.attributes[i].name + '}}', e.attributes[i].value)
			c = replaceAll(c, '${a.' + e.attributes[i].name + '}', e.attributes[i].value)
		}
		return c;
	}
	
	function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
        };
		
	function addStyle(styles) {
		var css = document.createElement('style');
		css.type = 'text/css';
		if (css.styleSheet)
			css.styleSheet.cssText = styles;
		else
			css.appendChild(document.createTextNode(styles));
		document.getElementsByTagName("head")[0].appendChild(css);
	}
	
	function process(element)
	{
		function compile(element) 
		// 
		{             
			// compile functions and tags
			{
				{
					function res_name(name, p) {
						if (name == undefined) return; {
							let e = element.querySelectorAll('fun[name="' + name.nodeValue + '"]');
							for (let i = 0; i < e.length; i++)
								if (e[i].parentElement.nodeName.toLowerCase()!='define')
									e[i].outerHTML = cpar(p.innerHTML, e[i], p)
						}
					}

					function res_tagname(name, p) {
						if (name == undefined) return; {
							let e = element.querySelectorAll(name.nodeValue);
							for (let i = 0; i < e.length; i++)
								e[i].outerHTML = cpar(p.innerHTML, e[i], p)
						}
					}

					let p = element.querySelectorAll(':scope>define>fun');

					for (let i = 0; i < p.length; i++) //
					{
						if (p[i].attributes["name"] != undefined)
							res_name(p[i].attributes["name"], p[i]);
						
						if (p[i].attributes["tag-name"] != undefined)
							res_tagname(p[i].attributes["tag-name"], p[i]);
					}
				}
				// compile tags defined in define-tag block
				{
					function res_tagname(name, p) {
						if (name == undefined) return; {
							let e = element.querySelectorAll(name);
							for (let i = 0; i < e.length; i++)
								if (e[i].parentElement.nodeName.toLowerCase()!='define-tag')
									e[i].outerHTML = cpar(p.innerHTML, e[i], p)
						}
					}

					let p = element.querySelectorAll(':scope>define-tag>*');

					for (let i = 0; i < p.length; i++)
					{
						let tagname = p[i].nodeName.toLowerCase() ;
						if (tagname !='style')
							res_tagname(tagname, p[i]);
					}
				}
			}

			// move style blocks
			{            
				let cssText = "";
				let styles = element.querySelectorAll(':scope>define>style');
				for (let i = 0; i < styles.length; i++)
					cssText += styles[i].innerHTML;
				if (cssText.length > 0) addStyle(cssText);
			}

			// remove define section
			{
				let define = element.querySelectorAll(':scope>define');
				for (let i = 0; i < define.length; i++)
					define[i].outerHTML = "";
			}
			// remove define-tag section
			{
				let define = element.querySelectorAll(':scope>define-tag');
				for (let i = 0; i < define.length; i++)
					define[i].outerHTML = "";
			}
			
			// remove ml-compiler tag
			element.outerHTML = element.innerHTML;
			
		}

		// include files
		{
			let p = element.querySelectorAll(':scope>define>inc');
			let q = element.querySelectorAll(':scope>define-tag>inc');
			if (p.length + q.length > 0) {
				let promises = [];
				for (let i = 0; i < p.length; i++) {
					promises.push(
						fetch(p[i].attributes["name"].value)
						.then(response => { return response.text() })
						.then(data => p[i].outerHTML = data)
						.catch(error => { console.log(error) })
					)
				}
				for (let i = 0; i < q.length; i++) {
					promises.push(
						fetch(q[i].attributes["name"].value)
						.then(response => { return response.text() })
						.then(data => q[i].outerHTML = data)
						.catch(error => { console.log(error) })
					)
				}

				Promise
					.all(promises)
					.then(function() { compile(element) })
					.catch(function() { compile(element) });
			} else compile(element);
		}
	}

	const start = performance.now();
	
	let p = document.querySelectorAll('ml-compiler');
	for(let  i=0;i<p.length;i++)
		if (p[i].attributes["no-compile"] == undefined)
			process(p[i]);
	
	
	const end = performance.now();
	console.log(`Execution time: ${end - start} ms`);
	
    // delete script
    {
        let currentScript;
        currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.removeChild(currentScript);
    }
})();