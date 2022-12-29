export default function Singleton<T extends {new(...args: any[]): {}}>( constr: T ) {
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