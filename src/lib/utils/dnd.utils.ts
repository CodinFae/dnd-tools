export const calculateAttributeModifier = (attribute :number | undefined):number =>{
    	if (attribute === undefined) return 0;
		return Math.floor((attribute - 10) / 2);
}

	/**
	 * Extract movement squares from speed string (e.g., "30 ft." => 6 squares)
	 * Assumes 5 feet per square (standard D&D 5e grid)
	 */
	export const feetToSquare = (speedFt: string | undefined): number | null => {
		if (!speedFt) return null;
		const match = speedFt.match(/(\d+)/);
		if (!match) return null;
		const feet = parseInt(match[1], 10);
		return Math.floor(feet / 5);
	}