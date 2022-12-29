export interface Validatable {
	type: string;
	required: Boolean;
	maxLength?: number;
	min?: number;
	max?: number 
}

export interface Draggable {
	dragStartHandler( ev: DragEvent, id: string ): void;
	dragEndHandler( ev: DragEvent, id: string ): void;
}

export interface DragTarget {
	dragOverHandler( ev: DragEvent, element: HTMLUListElement ): void;
	dropHandler( ev: DragEvent, element: HTMLUListElement ): void;
	dragLeaveHandler( ev: DragEvent, element: HTMLUListElement ): void;
}