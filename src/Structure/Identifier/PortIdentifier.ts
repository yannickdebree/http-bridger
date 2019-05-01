/**
 * Copyright (c) Aeres Games.
 * This code is licensed under the MIT License.
 * See the LICENSE file for more informations.
 *
 * Created by : Matthieu 'Aeres-Blade' Arques <aeresblade@aeres.games>
 */

import {ParseError} from '../../Error/ParseError';

/**
 * Handles matching of ports.
 */
export class PortIdentifier
{
	/**
	 * The registered ports of the identifier.
	 */
	readonly units: Array<number>;

	/**
	 * @param 	units 	The registered ports of the identifier
	 */
	private constructor(units: Array<number>)
	{
		this.units = units;
	}

	/**
	 * Checks if the port supplied matches this PortIdentifier.
	 *
	 * @param 	port 	The port to test
	 * @return			Wether the port matches this PortIdentifier or not
	 */
	public matches(port: number): boolean
	{
		for(let unit of this.units)
			if(unit === port)
				return true;

		return false;
	}

	/**
	 * Gets a list of the registered port number.
	 *
	 * @return 			The list of registered ports
	 */
	public getAvailablePorts(): Array<number>
	{
		return Array.from(this.units);
	}

	/**
	 * Creates a PortIdentifier from an array of port numbers.
	 *
	 * @param 	ports				The array of port numbers to parse
	 * @return 						The created PortIdentifier
	 * @throws	Error/ParseError 	Thrown if one of the port numbers is invalid
	 */
	public static fromNumberArray(ports: Array<number>): PortIdentifier
	{
		for(let port of ports)
		{
			if(!Number.isInteger(port))
				throw new ParseError('Port number must be an integer');

			if(port < 0 || port > 49151)
				throw new ParseError('Port number must be in range 0-49151');
		}

		return new PortIdentifier(ports);
	}
}