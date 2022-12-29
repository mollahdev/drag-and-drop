import { ProjectStatus } from "../enums";

export type Elements = {
	root: HTMLDivElement;
  	templateInput: HTMLTemplateElement;
	formElement: HTMLFormElement;
	titleInput: HTMLInputElement;
	descriptionInput: HTMLTextAreaElement;
	peopleInput: HTMLInputElement;
	projectColumn: HTMLTemplateElement;
	projectSingle: HTMLTemplateElement;
}

export type FormDataType = {
	title: string,
	description: string,
	people: number,
	type?: ProjectStatus,
	id?: string
}

export type State =  {[props: string]: FormDataType}