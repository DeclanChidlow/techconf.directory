export default (sitemapContent) => {
	return sitemapContent.replace(/(https:\/\/techconf\.directory[^<\s]+)(\/|\.html)(?=<\/loc>)/g, "$1");
};
