import { State, Elements, FormDataType } from "./utils/types";
import { ProjectStatus } from "./enums";
import ProjectItem from "./project-items";

export default class View {

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