import { Elements } from "./utils/types";

export default class Base {
    
    protected selectors
    protected elements

    constructor() {
    	this.selectors  = this.getDefaultSelectros();
	    this.elements   = this.getDefaultElement();
    }

	protected syncSelect() {
		this.elements   = this.getDefaultElement();
	}

    private getDefaultSelectros() {
      return {
        root: '#app',
        templateInput: '#project-input',
		formElement: 'form',
		titleInput: '#title',
		descriptionInput: '#description',
		peopleInput: '#people',
		projectColumn: '#project-list',
		projectSingle: '#single-project',
      }
    }

    private getDefaultElement(): Elements {
      return {
        root          	: document.querySelector( this.selectors.root  )!,
        templateInput 	: document.querySelector( this.selectors.templateInput )!,
		formElement		: document.querySelector( this.selectors.formElement )!,
		titleInput		: document.querySelector( this.selectors.titleInput )!,
		descriptionInput: document.querySelector( this.selectors.descriptionInput )!,
		peopleInput		: document.querySelector( this.selectors.peopleInput )!,
		projectColumn	: document.querySelector( this.selectors.projectColumn )!,
		projectSingle	: document.querySelector( this.selectors.projectSingle )!,
      }
    }
}