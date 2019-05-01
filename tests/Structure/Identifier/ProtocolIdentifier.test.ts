/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {expect} from 'chai';

import {ProtocolIdentifier} from '../../../src/Structure/Identifier/ProtocolIdentifier';
import {ParseError} from '../../../src/Error/ParseError';

describe('ProtocolIdentifier', function()
{
	it('can be created from string array', function()
	{
		const protocolIdentifier = ProtocolIdentifier.fromStringArray(['http']);
		expect(protocolIdentifier.units.length).to.equal(1);
	});

	it('throws ParseError if invalid protocol string', function()
	{
		expect(ProtocolIdentifier.fromStringArray.bind(ProtocolIdentifier, ['foo'])).to.throw(ParseError, 'Invalid protocol string value');
	});

	it('throws ParseError if containing wildcards while allowWildcards = false', function()
	{
		expect(ProtocolIdentifier.fromStringArray.bind(ProtocolIdentifier, ['**'], false)).to.throw(ParseError, 'Protocol string mustn\'t contain wilcards');
	});

	it('allows and matches http, https, ws and wss protocols', function()
	{
		let protocolIdentifier = ProtocolIdentifier.fromStringArray(['http'], false);
		expect(protocolIdentifier.matches('http')).to.be.true;
		expect(protocolIdentifier.matches('https')).to.be.false;

		protocolIdentifier = ProtocolIdentifier.fromStringArray(['https'], false);
		expect(protocolIdentifier.matches('https')).to.be.true;
		expect(protocolIdentifier.matches('http')).to.be.false;

		protocolIdentifier = ProtocolIdentifier.fromStringArray(['ws'], false);
		expect(protocolIdentifier.matches('ws')).to.be.true;
		expect(protocolIdentifier.matches('wss')).to.be.false;

		protocolIdentifier = ProtocolIdentifier.fromStringArray(['wss'], false);
		expect(protocolIdentifier.matches('wss')).to.be.true;
		expect(protocolIdentifier.matches('ws')).to.be.false;
	});

	it('matches protocols with wildcards correctly', function()
	{
		let protocolIdentifier = ProtocolIdentifier.fromStringArray(['http*']);
		expect(protocolIdentifier.matches('http')).to.be.true;
		expect(protocolIdentifier.matches('https')).to.be.true;
		expect(protocolIdentifier.matches('ws')).to.be.false;
		expect(protocolIdentifier.matches('wss')).to.be.false;

		protocolIdentifier = ProtocolIdentifier.fromStringArray(['*s']);
		expect(protocolIdentifier.matches('http')).to.be.false;
		expect(protocolIdentifier.matches('https')).to.be.true;
		expect(protocolIdentifier.matches('ws')).to.be.false;
		expect(protocolIdentifier.matches('wss')).to.be.true;
	});

	it('doesn\'t generate a RegExp when not using wildcards', function()
	{
		const protocolIdentifier = ProtocolIdentifier.fromStringArray(['http']);
		expect(protocolIdentifier.units[0].tester).to.be.null;
	});

	it('creates well-formed RegExps', function()
	{
		const protocolIdentifier = ProtocolIdentifier.fromStringArray(['**']);
		expect(protocolIdentifier.units[0].tester).to.eql(new RegExp('^(http|ws)s?$'));
	});

	it('works well with multiple protocol values', function()
	{
		const protocolIdentifier = ProtocolIdentifier.fromStringArray(['*s', 'http']);
		expect(protocolIdentifier.units.length).to.equal(2);
		expect(protocolIdentifier.matches('http')).to.be.true;
		expect(protocolIdentifier.matches('https')).to.be.true;
		expect(protocolIdentifier.matches('ws')).to.be.false;
		expect(protocolIdentifier.matches('wss')).to.be.true;
	});

	it('can return a list of available protocols', function()
	{
		const protocolIdentifier = ProtocolIdentifier.fromStringArray(['*s', 'http']);
		expect(protocolIdentifier.getAvailableProtocols()).to.eql(['https', 'wss', 'http']);
	});
});