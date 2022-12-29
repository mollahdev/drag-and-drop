import Singleton from "./utils/singleton";
import { Draggable, DragTarget } from "./utils/interfaces";
import { ProjectStatus } from "./enums";
import View from "./view";

@Singleton
export default class ProjectItem implements Draggable, DragTarget {
	
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