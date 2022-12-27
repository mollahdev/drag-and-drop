enum ProjectStatus { Active, Finished }

type Elements = {
	root: HTMLDivElement;
  	templateInput: HTMLTemplateElement;
	formElement: HTMLFormElement;
	titleInput: HTMLInputElement;
	descriptionInput: HTMLTextAreaElement;
	peopleInput: HTMLInputElement;
	projectColumn: HTMLTemplateElement;
	projectSingle: HTMLTemplateElement;
}

type FormDataType = {
	title: string,
	description: string,
	people: number,
	type?: ProjectStatus,
	id?: string
}

type State =  {[props: string]: FormDataType}

interface Validatable {
	type: string;
	required: Boolean;
	maxLength?: number;
	min?: number;
	max?: number 
}

interface Draggable {
	dragStartHandler( ev: DragEvent, id: string ): void;
	dragEndHandler( ev: DragEvent, id: string ): void;
}

interface DragTarget {
	dragOverHandler( ev: DragEvent, element: HTMLUListElement ): void;
	dropHandler( ev: DragEvent, element: HTMLUListElement ): void;
	dragLeaveHandler( ev: DragEvent, element: HTMLUListElement ): void;
}

function Singleton<T extends {new(...args: any[]): {}}>( constr: T ) {
	return class Instance extends constr {
		private static instance: any

		constructor(...args: any[]) {
			if( !Instance.instance ) {
				super(...args)
				Instance.instance = this;
			}
			return Instance.instance;
		}
	}
}

class Utils {
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


class Base {
    
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

@Singleton
class ProjectItem implements Draggable, DragTarget {
	
	dragStartHandler(ev: DragEvent, id: string): void {
		ev.dataTransfer!.setData('text/plain', id);
		ev.dataTransfer!.effectAllowed = 'move';
	}

	dragEndHandler(_ev: DragEvent, _id: string): void {}
	
	dragOverHandler(ev: DragEvent, element: HTMLUListElement): void {
		if( ev.dataTransfer && ev.dataTransfer.types[0] === 'text/plain' ) {
			ev.preventDefault();
			element.classList.add('droppable');
		}
	}

	dropHandler(ev: DragEvent, element: HTMLUListElement): void {
		element.classList.remove('droppable');

		const id	= ev.dataTransfer!.getData('text/plain');
		const data	= View.getProject(id);
		const type 	= Number( element.dataset.status );

		if( data.type !== type ) {
			const status = type === 0 ? ProjectStatus.Active: ProjectStatus.Finished; 
			View.moveProject( id, status )
		}
	}

	dragLeaveHandler(_ev: DragEvent, element: HTMLUListElement): void {
		element.classList.remove('droppable');
	}
}

class View {

	private static state: State = {};
	private static elements: Elements;
	
	private static getTemplateNode( selector: HTMLTemplateElement ) {
		return document.importNode( selector.content, true )
	}

	static renderInitialUI( elements: Elements ){
		this.elements = elements;
        const { templateInput, root } = this.elements;

        const element     = this.getTemplateNode( templateInput ).firstElementChild!;
              element.id  = 'user-input';

        root.insertAdjacentElement( 'afterbegin', element );
    }

	static renderInitialColumns( status: ProjectStatus) {
		const { projectColumn, root } = this.elements;
		const projectItem = new ProjectItem(); 
		const type = status === ProjectStatus.Active ? 'active' : 'finished';
        const 	
			element     = this.getTemplateNode( projectColumn ).firstElementChild!;
            element.id  = `${type}-projects`;
			element.querySelector('h2')!.innerText = `${type} projects`.toUpperCase();


		const 
			listElement = element.querySelector('ul')! as HTMLUListElement;
			listElement.setAttribute('data-status', String(status));

		listElement.addEventListener('dragover', function( ev: Event ){
			projectItem.dragOverHandler(ev as DragEvent, listElement)
		})
		
		listElement.addEventListener('dragleave', function( ev: Event ){
			projectItem.dragLeaveHandler(ev as DragEvent, listElement)
		})
		
		listElement.addEventListener('drop', function( ev: Event ){
			projectItem.dropHandler(ev as DragEvent, listElement)
		})

        root.insertAdjacentElement( 'beforebegin', element );
	}

	private static uid(): string {
		const id = Math.random().toString().split('.')[1];
		if( Reflect.has( this.state, id ) ) {
			return this.uid();
		}
		return id;
	}

	static getProject( id: string ) {
		return this.state[id]
	}

	static moveProject( id: string, status: ProjectStatus ) {
		this.state[id].type = status;
		for( let key in this.state ) {
			document.getElementById(key)?.remove();
			this.updateProjectList(key)
		}
	}

	static get projects() {
		return Object.keys( this.state )
	}

	private static updateProjectList<T extends string>(x: T ) {
		const data			= this.getProject(x);
		const projectItem	= new ProjectItem(); 

		const 
			element     = this.getTemplateNode( this.elements.projectSingle ).firstElementChild!;
            element.id  = x;
			element.querySelector('h2')!.innerText	= data.title;
			element.querySelector('h3')!.innerText	= String( data.people ) + ' Persons assigned';
			element.querySelector('p')!.innerText	= data.description;
			
			element.addEventListener('dragstart', function( ev: Event ){
				projectItem.dragStartHandler(ev as DragEvent, x)
			})
			
			element.addEventListener('dragend', function( ev: Event ){
				projectItem.dragEndHandler(ev as DragEvent, x)
			})
			
		const target = data.type === ProjectStatus.Active ? '#active-projects ul' : '#finished-projects ul';
		document.querySelector(target)!.insertAdjacentElement('afterbegin', element);
	}

	static set addProject( details: FormDataType ) {
		const id = this.uid();
		this.state[id] = {
			id, ... details, type: ProjectStatus.Active
		}

		for( let key in this.state ) {
			document.getElementById(key)?.remove();
			this.updateProjectList(key)
		}
	}
}

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