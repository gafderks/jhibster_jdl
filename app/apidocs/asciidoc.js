'use strict';

const asciidoctor = require('asciidoctor')()

let attributes =  {
	showtitle: true,
	revnumber: '0.1.0-SNAPSHOT'
};

let options = {
	safe: 'server',
	headerFooter: true,
	doctype: 'article',
	backend: 'html5',
	mkdirs: true,
	to_dir: 'dist',
	attributes: attributes
}

let doc = asciidoctor.convertFile('apidocs/index.adoc', options);
doc = asciidoctor.convertFile('apidocs/tasks.api.adoc', options);