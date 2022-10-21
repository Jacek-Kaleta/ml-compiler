(function ()
{
	function cpar(HTML, dataset, innerHTML)
	{
		let c = HTML.replaceAll('{{innerHTML}}', innerHTML);
		for(n in dataset)
		{
			c= c.replaceAll('{{'+n+'}}', dataset[n])
		}
		return c;
	}
	function res(name, HTML)
	{
		if (name == undefined) return ;
		let e = document.querySelectorAll('fun[name="'+name.nodeValue+'"]');
		for (let i=0;i< e.length;i++)
		{
			e[i].outerHTML = cpar(HTML, e[i].dataset, e[i].innerHTML)
		}
	}
	let p = document.querySelectorAll('define>fun');
	for (let i=0;i< p.length;i++)
	{
		res(p[i].attributes["name"], p[i].innerHTML);
	}
	document.body.style.display="block"

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
		let style= document.querySelectorAll('define>style');
		for(let i=0;i<styles.length;i++)
			cssText += styles[i].innerHTML;
		addStyle(cssText);
	}
	
	{
		let define= document.querySelectorAll('define');
		for(let i=0;i<define.length;i++) 
			define[i].outerHTML="";
	}
})();

