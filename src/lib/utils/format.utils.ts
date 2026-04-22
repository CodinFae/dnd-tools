import { calculateAttributeModifier } from "./dnd.utils";


	/**
	 * Format a modifier with + prefix for positive values
	 */
	export const formatModifier = (mod: number): string  => {
		if (mod >= 0) return `+${mod}`;
		if (mod < 0) return `${mod}`;
		return '0';
	}

	export const formatAttributeModifier = (attribute :number | undefined) : string => {
		return formatModifier(calculateAttributeModifier(attribute))
	}