import fixedFileNameList from '../fixedFileNameList'

const manager: any = []

type GetFileNameCallback<C> = (o: C) => string

export function registerOnGetFileName<C>(c: C, fn: GetFileNameCallback<C>) {
	manager.push([c, fn])
}

export default function getFileNameFromClass(o: any): string {
	const findFunction = ([v]) => o.constructor === v
	const matchedFileName = fixedFileNameList.find(findFunction)
	if (matchedFileName) return <string>matchedFileName[1]
	else return manager.find(findFunction)?.[1]?.(o)
}
