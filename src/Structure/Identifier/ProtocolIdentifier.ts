/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {ParseError} from '../../Error/ParseError';

/**
 * A single protocol tester.
 */
class ProtocolUnit
{
	/**
	 * The raw protocol string.
	 */
	readonly value: string;

	/**
	 * A RegExp matcher generated when wildcards are being used.
	 */
	readonly tester: RegExp;

	/**
	 * The main part of the protocol name ('http', 'ws' or '*').
	 */
	readonly main: string;

	/**
	 * The secured part of the protocol name ('' or 's').
	 */
	readonly secured: string;

	/**
	 * @param 	value		The raw protocol string
	 * @param	tester		A RegExp matcher generated when wildcards are being used
	 * @param 	main 		The main part of the protocol name ('http', 'ws' or '*')
	 * @param 	secured 	The secured part of the protocol name ('' or 's')
	 */
	public constructor(value: string, tester: RegExp, main: string, secured: string)
	{
		this.value = value;
		this.tester = tester;
		this.main = main;
		this.secured = secured;
	}
}

/**
 * Handles matching of protocols
 * Currently supported protocols: http, https, ws, wss
 */
export class ProtocolIdentifier
{
	/**
	 * The protocol units of the identifier.
	 */
	readonly units: Array<ProtocolUnit>;

	/**
	 * @param 	units		The protocol units of the identifier
	 */
	private constructor(units: Array<ProtocolUnit>)
	{
		this.units = units;
	}

	/**
	 * Checks if the supplied protocol matches this ProtocolIdentifier.
	 *
	 * @param 	protocol	The protocol to test
	 * @return 				Wether the protocol matches this ProtocolIdentifier or not
	 */
	public matches(protocol: string): boolean
	{
		for(let unit of this.units)
			if((!unit.tester && unit.value === protocol) || (unit.tester && unit.tester.test(protocol)))
				return true;

		return false;
	}

	/**
	 * Gets a list of available protocols.
	 *
	 * @return 	The list of available protocols
	 */
	public getAvailableProtocols(): Array<string>
	{
		let protocols: {
			http?: boolean,
			https?: boolean,
			ws?: boolean,
			wss?: boolean
		} = {};

		for(let unit of this.units)
		{
			if(unit.secured === '')
			{
				if(unit.main === 'http' || unit.main === '*')
					protocols.http = true;

				if(unit.main === 'ws' || unit.main === '*')
					protocols.ws = true;
			}
			else
			{
				if(unit.main === 'http' || unit.main === '*')
					protocols.https = true;

				if(unit.main === 'ws' || unit.main === '*')
					protocols.wss = true;
			}
		}

		return Object.keys(protocols);
	}

	/**
	 * Creates a ProtocolIdentifier from an array of protocol strings.
	 *
	 * @param 	protocols			The array of protocol strings to parse
	 * @param 	allowWildcards		Wether to allow wildcards in the protocol strings or not
	 * @return 						The created ProtocolIdentifier
	 * @throws	Error/ParseError 	Thrown if one the protocol strings is malformed or invalid
	 */
	public static fromStringArray(protocols: Array<string>, allowWildcards: boolean = true): ProtocolIdentifier
	{
		let units: Array<ProtocolUnit> = [];

		for(let protocol of protocols)
		{
			let matches: RegExpMatchArray = protocol.match(/^(http|ws|\*)(s||)$/);

			if(matches === null)
				throw new ParseError('Invalid protocol string value');

			let regexStr: string = null;

			if(matches[1] === '*')
			{
				if(!allowWildcards)
					throw new ParseError('Protocol string mustn\'t contain wilcards');

				regexStr = 	(matches[1] === '*' ? '(http|ws)' : matches[1]) + matches[2];
			}

			units.push(new ProtocolUnit(protocol, regexStr === null ? null : new RegExp('^' + regexStr + '$'), matches[1], matches[2]));
		}

		return new ProtocolIdentifier(units);
	}
}