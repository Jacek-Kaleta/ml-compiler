(function ()
{
	function replaceAll(str,find, replace) 
	{
		return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
	};
	
	function cpar(HTML, dataset, innerHTML)
	{
		let c = replaceAll(HTML,'{{innerHTML}}', innerHTML);
		for(n in dataset)
		{
			c= replaceAll(c,'{{'+n+'}}', dataset[n])
		}
		return c;
	}

	function res_name(name, HTML)
	{
		if (name == undefined) return ;
		{
			let e = document.querySelectorAll('fun[name="'+name.nodeValue+'"]');
			for (let i=0;i< e.length;i++)
			{
				e[i].outerHTML = cpar(HTML, e[i].dataset, e[i].innerHTML)
			}
		}
	}
	
	function res_tagname(name, HTML)
	{
		if (name == undefined) return ;
		{
			console.log(name);
			let e = document.querySelectorAll(name.nodeValue);
			for (let i=0;i< e.length;i++)
			{
				e[i].outerHTML = cpar(HTML, e[i].dataset, e[i].innerHTML)
			}
		}
	}
	let p = document.querySelectorAll('define>fun');
	for (let i=0;i< p.length;i++)
	{
		res_name(p[i].attributes["name"], p[i].innerHTML);
	}
	for (let i=0;i< p.length;i++)
	{
		res_tagname(p[i].attributes["tag-name"], p[i].innerHTML);
	}
	
	{
		function addStyle(styles) 
		{
			var css = document.createElement('style');
			css.type = 'text/css';
			if (css.styleSheet)
				css.styleSheet.cssText = styles;
			else
				css.appendChild(document.createTextNode(styles));
			document.getElementsByTagName("head")[0].appendChild(css);
		}	
		let cssText  = "";
		let styles= document.querySelectorAll('define>style');
		for(let i=0;i<styles.length;i++)
			cssText += styles[i].innerHTML;
		addStyle(cssText);
	}
	
	{
		let define= document.querySelectorAll('define');
		for(let i=0;i<define.length;i++) 
			define[i].outerHTML="";
	}
	
	document.body.style.display="block"
})();

