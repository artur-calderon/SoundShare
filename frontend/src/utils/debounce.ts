/**
 * Função de debounce para evitar execuções excessivas
 * @param func Função a ser executada
 * @param delay Delay em milissegundos
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout;
	
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

/**
 * Função de throttle para limitar execuções por tempo
 * @param func Função a ser executada
 * @param limit Limite em milissegundos
 * @returns Função com throttle aplicado
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
}
