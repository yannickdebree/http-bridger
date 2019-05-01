/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import * as URL from 'url';
import {ParseError} from '../../Error/ParseError';

/**
 * A single path tester
 */
class PathUnit
{
	/**
	 * The raw path string.
	 */
	readonly value: string;

	/**
	 * A RegExp matcher generated when wildcards are being used.
	 */
	readonly tester: RegExp;

	/**
	 * @param 	value	The raw path string
	 * @param	tester	A RegExp matcher generated when wildcards are being used
	 */
	public constructor(value: string, tester: RegExp)
	{
		this.value = value;
		this.tester = tester;
	}
}

/**
 * Handles matching of path values, with or without wildcard.
 */
export class PathIdentifier
{
	/**
	 * The path units of the identifier.
	 */
	readonly units: Array<PathUnit>;

	/**
	 * @param 	units 	The protocol units of the identifier
	 */
	private constructor(units: Array<PathUnit>)
	{
		this.units = units;
	}

	/**
	 * Checks if the path supplied matches this PathIdentifier.
	 *
	 * @param 	path	The path to test
	 * @return 			Wether the path matches this PathIdentifier or not
	 */
	public matches(path: string): boolean
	{
		path = PathIdentifier.cleanPathString(path);

		for(let unit of this.units)
			if((!unit.tester && unit.value === path) || (unit.tester && unit.tester.test(path)))
				return true;

		return false;
	}

	/**
	 * Creates a PathIdentifier from an array of path strings.
	 *
	 * @param 	paths				The array of path strings to parse
	 * @param 	allowWildcards		Wether to allow wildcards in the path strings or not
	 * @return 						The created PathIdentifier
	 * @throws	Error/ParseError 	Thrown if one of the path strings contains unacceptable characters
	 */
	public static fromStringArray(paths: Array<string>, allowWildcards: boolean = true): PathIdentifier
	{
		let units: Array<PathUnit> = [];

		for(let path of paths)
		{
			path = PathIdentifier.cleanPathString(path);

			let regexStr: string = null;

			if(/\*{1,2}/.test(path))
			{
				if(!allowWildcards)
					throw new ParseError('Path string mustn\'t contain wilcards');

				regexStr = path.replace(/[\\^$.+?()[\]{}|/]/g, '\\$&').replace(/(\\\/\*{1,2}$)|(\*{1,2})/g, function(match: string): string
				{
					// Renders closing slash optional if followed by a wildcard
					if(match.startsWith('\\/'))
						return match.length === 4 ? '(\\\/.*)?' : '(\\\/[^/]*)?';

					return match.length === 2 ? '.*' : '[^/]*';
				});
			}

			units.push(new PathUnit(path, regexStr === null ? null : new RegExp('^' + regexStr + '$')));
		}

		return new PathIdentifier(units);
	}

	/**
	 * Cleans a path string by removing URL parameters, closing slash and by adding leading slash.
	 *
	 * @param 	path 	The path string to clean
	 * @return 			The clean path generated
	 */
	private static cleanPathString(path: string): string
	{
		path = URL.parse(path).pathname;

		if(!path)
			path = '/';
		else
		{
			if(!path.startsWith('/'))
				path = '/' + path;

			path = path.replace(/([^\/])\/$/, '$1');
		}

		return path;
	}
}