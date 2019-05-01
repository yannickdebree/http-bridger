/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {StackableError} from './StackableError';

/**
 * An error that occurs when data from an unsecured source couldn't be parsed.
 */
export class ParseError extends StackableError
{
	/**
	 * @param 	message 	The error message
	 * @param 	previous 	The previous Error of the stack
	 * @param 	errorClass 	The Error class created
	 */
	public constructor(message: string, previous: Error = null, errorClass?: {new(...args: any[]): any})
	{
		super(message, previous, errorClass ? errorClass : ParseError);

		this.name = this.constructor.name;
	}
}