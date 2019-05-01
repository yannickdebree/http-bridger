/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

/**
 * A bit more complex Error class which supports error stacking.
 */
export class StackableError extends Error
{
	/**
	 * The previous Error of the stack.
	 */
	readonly previous: Error;

	/**
	 * @param 	message 	The error message
	 * @param 	previous 	The previous Error of the stack
	 * @param 	errorClass 	The Error class created (used by setPrototypeOf, since Error class extending is a bit broken with Typescript)
	 */
	constructor(message: string, previous: Error = null, errorClass?: {new(...args: any[]): any})
	{
		super(message);
		
		Object.setPrototypeOf(this, errorClass ? errorClass.prototype : StackableError.prototype); // Not working as expected

		this.name = this.constructor.name;
		this.previous = previous;
	}

	/**
	 * Overrides Object.toString().
	 * Builds an error string using the stack.
	 *
	 * @return 	The built error string
	 */
	public toString(): string
	{
		if(!this.previous)
			return this.stack;

		let str: string = this.constructor.name + ': ' + this.message;

		if(this.previous instanceof StackableError)
			return str + '\n' + this.previous.toString();

		return str + '\n' + this.previous.stack;
	}
}