import { ProjectStatus } from "./enums";
import { FormDataType } from "./utils/types";
import Singleton from "./utils/singleton";
import Utils from "./utils/utils"; 
import Base from "./base";
import ProjectItem from "./project-items";
import View from "./view";

@Singleton
class Controllar extends Base {
	formData: Partial<FormDataType> = {};

	constructor() {
		super();
		
		View.renderInitialUI( this.elements );
		View.renderInitialColumns( ProjectStatus.Active );
		View.renderInitialColumns( ProjectStatus.Finished );

		this.syncSelect();
		this.bindFormEvents();
		this.formSubmitHandlar();
		new ProjectItem();
	}

	private bindFormEvents() {
		const formData = this.formData;
		this.elements.titleInput.addEventListener('change', function( ev: Event ) {
			ev.preventDefault();
			const target 	= ev.target! as HTMLInputElement;
			formData.title	= target.value;
		})
		
		this.elements.descriptionInput.addEventListener('change', function( ev: Event ) {
			ev.preventDefault();
			const target 		 = ev.target! as HTMLTextAreaElement;
			formData.description = target.value;
		})
		
		this.elements.peopleInput.addEventListener('change', function( ev: Event ) {
			ev.preventDefault();
			const target	= ev.target! as HTMLInputElement;
			formData.people	= parseFloat(target.value);
		})
	}

	private resetForm() {
		this.elements.titleInput.value = '';
		this.elements.descriptionInput.value = '';
		this.elements.peopleInput.value = '';
	}

	private formSubmitHandlar() {
		const self = this;

		const titleConfig = {
			type: "string",
			required: true,
			maxLength: 20
		}
		
		const descriptionConfig = {
			type: "string",
			required: true,
			maxLength: 50
		}
		
		const numberConfig = {
			type: "number",
			required: true,
			min: 0,
			max: 20
		}

		this.elements.formElement.addEventListener('submit', function(ev: Event) {
			ev.preventDefault();
			if( 
				Utils.isValid( titleConfig, self.formData.title || '' ) &&
				Utils.isValid( descriptionConfig, self.formData.description || '' ) &&
				Utils.isValid( numberConfig, self.formData.people || '' )
			) {
				self.resetForm();
				View.addProject = self.formData as FormDataType;
			}
		})
	}

}

new Controllar()