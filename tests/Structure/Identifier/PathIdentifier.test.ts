/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {expect} from 'chai';

import {PathIdentifier} from '../../../src/Structure/Identifier/PathIdentifier';
import {ParseError} from '../../../src/Error/ParseError';

describe('PathIdentifier', function()
{
	it('can be created from string array', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['http']);
		expect(pathIdentifier.units.length).to.equal(1);
	});

	it('throws ParseError if containing wildcards while allowWildcards = false', function()
	{
		expect(PathIdentifier.fromStringArray.bind(PathIdentifier, ['/test/**'], false)).to.throw(ParseError, 'Path string mustn\'t contain wilcards');
	});

	it('matches normal paths correctly', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['/foo'], false);
		expect(pathIdentifier.matches('/foo')).to.be.true;
		expect(pathIdentifier.matches('/bar')).to.be.false;
	});

	it('matches paths with wildcards correctly', function()
	{
		let pathIdentifier = PathIdentifier.fromStringArray(['/foo/*']);
		expect(pathIdentifier.matches('/foo')).to.be.true;
		expect(pathIdentifier.matches('/foo/bar')).to.be.true;
		expect(pathIdentifier.matches('/foo/bar/1')).to.be.false;
		expect(pathIdentifier.matches('/bar')).to.be.false;

		pathIdentifier = PathIdentifier.fromStringArray(['/foo/**']);
		expect(pathIdentifier.matches('/foo')).to.be.true;
		expect(pathIdentifier.matches('/foo/bar')).to.be.true;
		expect(pathIdentifier.matches('/foo/bar/1')).to.be.true;
		expect(pathIdentifier.matches('/bar')).to.be.false;
	});

	it('doesn\'t generate a RegExp when not using wildcards', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['/foo']);
		expect(pathIdentifier.units[0].tester).to.be.null;
	});

	it('creates well-formed RegExps', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['/foo/*/bar/**']);
		expect(pathIdentifier.units[0].tester).to.eql(new RegExp('^\\/foo\\/[^/]*\\/bar(\\\/.*)?$'));
	});

	it('renders closing slash optional', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['/foo/bar/']);
		expect(pathIdentifier.units[0].value).to.equal('/foo/bar');
		expect(pathIdentifier.matches('/foo/bar/')).to.be.true;
	});

	it('works well with multiple path values', function()
	{
		const pathIdentifier = PathIdentifier.fromStringArray(['/foo/**', '/bar/*']);
		expect(pathIdentifier.units.length).to.equal(2);
		expect(pathIdentifier.matches('/foo/admin')).to.be.true;
		expect(pathIdentifier.matches('/bar')).to.be.true;
		expect(pathIdentifier.matches('/')).to.be.false;
	});
});