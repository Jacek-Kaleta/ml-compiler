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
		let e = document.querySelectorAll('fun#'+name);
		for (let i=0;i< e.length;i++)
		{
			e[i].innerHTML = cpar(HTML, e[i].dataset, e[i].innerHTML)
		}
	}
	let p = document.querySelectorAll('define>fun');
	for (let i=0;i< p.length;i++)
		res(p[i].id, p[i].innerHTML);
	document.body.style.display="block"
})();

