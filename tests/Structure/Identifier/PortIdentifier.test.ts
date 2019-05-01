/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {expect} from 'chai';

import {PortIdentifier} from '../../../src/Structure/Identifier/PortIdentifier';
import {ParseError} from '../../../src/Error/ParseError';

describe('PortIdentifier', function()
{
	it('can be created from number array', function()
	{
		const portIdentifier = PortIdentifier.fromNumberArray([80]);
		expect(portIdentifier.units.length).to.equal(1);
	});

	it('throws ParseError if a port is not an integer', function()
	{
		expect(PortIdentifier.fromNumberArray.bind(PortIdentifier, [80.5])).to.throw(ParseError, 'Port number must be an integer');
	});

	it('throws ParseError if a port is out of the allowed range', function()
	{
		expect(PortIdentifier.fromNumberArray.bind(PortIdentifier, [100000])).to.throw(ParseError, 'Port number must be in range 0-49151');
	});

	it('matches ports correctly', function()
	{
		const portIdentifier = PortIdentifier.fromNumberArray([80, 443]);
		expect(portIdentifier.matches(80)).to.be.true;
		expect(portIdentifier.matches(443)).to.be.true;
		expect(portIdentifier.matches(8000)).to.be.false;
	});
});