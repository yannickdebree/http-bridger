/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {ParseError} from '../../Error/ParseError';

class DomainUnit
{
	/**
	 * The raw domain string.
	 */
	readonly value: string;

	/**
	 * A RegExp matcher generated when wildcards are being used.
	 */
	readonly tester: RegExp;

	/**
	 * @param 	value	The raw domain string
	 * @param	tester	A RegExp matcher generated when wildcards are being used
	 */
	public constructor(value: string, tester: RegExp)
	{
		this.value = value;
		this.tester = tester;
	}
}

/**
 * Handles matching of domain names, with or without wildcard.
 */
export class DomainIdentifier
{
	/**
	 * The domain units of the identifier.
	 */
	readonly units: Array<DomainUnit>;

	/**
	 * @param 	units 	The domain units of the identifier
	 */
	private constructor(units: Array<DomainUnit>)
	{
		this.units = units;
	}

	/**
	 * Checks if the domain supplied matches this DomainIdentifier.
	 *
	 * @param 	domain	The domain to test
	 * @return 			Wether the domain matches this DomainIdentifier or not
	 */
	public matches(domain: string): boolean
	{
		for(let unit of this.units)
			if((!unit.tester && unit.value === domain) || (unit.tester && unit.tester.test(domain)))
				return true;

		return false;
	}

	/**
	 * Creates a DomainIdentifier from an array of domain strings.
	 *
	 * @param 	domains				The array of domain strings to parse
	 * @param 	allowWildcards		Wether to allow wildcards in the domain strings or not
	 * @return 						The created DomainIdentifier
	 * @throws	Error/ParseError 	Thrown if one of the domain strings contains unacceptable characters or is malformed
	 */
	public static fromStringArray(domains: Array<string>, allowWildcards: boolean = true): DomainIdentifier
	{
		let units: Array<DomainUnit> = [];

		for(let domain of domains)
		{
			if(!/^[a-z0-9*]+(-+[a-z0-9*]+)*(\.[a-z0-9*]+(-+[a-z0-9*]+)*)*$/.test(domain))
				throw new ParseError('Invalid domain string value');

			let regexStr: string = null;

			if(domain.indexOf('*') !== -1)
			{
				if(!allowWildcards)
					throw new ParseError('Domain string mustn\'t contain wilcards');

				regexStr = domain.replace(/\./g, '\\.').replace(/(\\\.|)(\*{1,2})(\\\.|)/g, function(match: string, dot1: string, main: string, dot2: string, offset: number, str: string): string
				{
					// Renders bottom-level domain optional if it's a wildcard
					if(offset === 0 && dot1 === '' && dot2 !== '')
						return main.length === 2 ? '([a-z0-9]+(-+[a-z0-9]+)*(\\.[a-z0-9]+(-+[a-z0-9]+)*)*\\.)?' : '([a-z0-9]+(-+[a-z0-9]+)*\\.)?';

					return main.length === 2 ? dot1 + '[a-z0-9]+(-+[a-z0-9]+)*(\\.[a-z0-9]+(-+[a-z0-9]+)*)*' + dot2 : dot1 + '[a-z0-9]+(-+[a-z0-9]+)*' + dot2;
				});
			}

			units.push(new DomainUnit(domain, regexStr === null ? null : new RegExp('^' + regexStr + '$')));
		}

		return new DomainIdentifier(units);
	}
}