import { Validatable } from "./interfaces";

export default class Utils {
	static isEmpty( value: string | number | any[] | object | undefined ): Boolean {
		if( typeof value === 'string' ) {
			return value.trim().length === 0
		}

		if( Array.isArray( value ) ) {
			return value.length === 0
		}

		if( typeof value === 'number' ) {
			return String(value).trim().length === 0;
		}

		if( typeof value === 'object' && !Array.isArray( value ) ) {
			const keys = Object.keys(value);
			return keys.length === 0;
		}

		return true;
	}

	static isValid( settings: Validatable, value: string | number ) {
		if( settings.type === 'string' && typeof value === 'string') {
			let valid = Boolean( value );
			
			if( valid && settings.required && this.isEmpty( value )) {
				valid = false;
			}

			if( valid && settings.maxLength && value.length > settings.maxLength ) {
				valid = false;
			}

			return valid;
		}

		if( settings.type === 'number' && typeof value === 'number' ) {
			let valid = true;

			if( valid && settings.required && this.isEmpty( value )) {
				valid = false;
			}

			if( valid && settings.min && value < settings.min) {
				valid = false;
			}

			if( valid && settings.max && value > settings.max ) {
				valid = false;
			}

			return valid;
		}

		return false;
	}
}
