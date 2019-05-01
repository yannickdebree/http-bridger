/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {expect} from 'chai';

import {DomainIdentifier} from '../../../src/Structure/Identifier/DomainIdentifier';
import {ParseError} from '../../../src/Error/ParseError';

describe('DomainIdentifier', function()
{
	it('can be created from string array', function()
	{
		const domainIdentifier = DomainIdentifier.fromStringArray(['example.com']);
		expect(domainIdentifier.units.length).to.equal(1);
	});

	it('throws ParseError if invalid domain string', function()
	{
		expect(DomainIdentifier.fromStringArray.bind(DomainIdentifier, ['localhost!'])).to.throw(ParseError, 'Invalid domain string value');
		expect(DomainIdentifier.fromStringArray.bind(DomainIdentifier, ['example--.com'])).to.throw(ParseError, 'Invalid domain string value');
	});

	it('throws ParseError if containing wildcards while allowWildcards = false', function()
	{
		expect(DomainIdentifier.fromStringArray.bind(DomainIdentifier, ['**.example.com'], false)).to.throw(ParseError, 'Domain string mustn\'t contain wilcards');
	});

	it('matches normal domains correctly', function()
	{
		const domainIdentifier = DomainIdentifier.fromStringArray(['example.com'], false);
		expect(domainIdentifier.matches('example.com')).to.be.true;
		expect(domainIdentifier.matches('www.example.com')).to.be.false;
	});

	it('matches domains with wildcards correctly', function()
	{
		let domainIdentifier = DomainIdentifier.fromStringArray(['*.example.com']);
		expect(domainIdentifier.matches('example.com')).to.be.true;
		expect(domainIdentifier.matches('www.example.com')).to.be.true;
		expect(domainIdentifier.matches('www.sub.example.com')).to.be.false;
		expect(domainIdentifier.matches('example.co.uk')).to.be.false;

		domainIdentifier = DomainIdentifier.fromStringArray(['**.example.com']);
		expect(domainIdentifier.matches('example.com')).to.be.true;
		expect(domainIdentifier.matches('www.example.com')).to.be.true;
		expect(domainIdentifier.matches('www.sub.example.com')).to.be.true;
		expect(domainIdentifier.matches('example.co.uk')).to.be.false;
	});

	it('doesn\'t generate a RegExp when not using wildcards', function()
	{
		const domainIdentifier = DomainIdentifier.fromStringArray(['example.com']);
		expect(domainIdentifier.units[0].tester).to.be.null;
	});

	it('creates well-formed RegExps', function()
	{
		const domainIdentifier = DomainIdentifier.fromStringArray(['**.cluster-*.example.com']);
		expect(domainIdentifier.units[0].tester).to.eql(new RegExp('^([a-z0-9]+(-+[a-z0-9]+)*(\\.[a-z0-9]+(-+[a-z0-9]+)*)*\\.)?cluster-[a-z0-9]+(-+[a-z0-9]+)*\\.example\\.com$'));
	});

	it('works well with multiple domain values', function()
	{
		const domainIdentifier = DomainIdentifier.fromStringArray(['*.example.com', 'aeres.games']);
		expect(domainIdentifier.units.length).to.equal(2);
		expect(domainIdentifier.matches('sub.example.com')).to.be.true;
		expect(domainIdentifier.matches('aeres.games')).to.be.true;
		expect(domainIdentifier.matches('foo.com')).to.be.false;
	});
});