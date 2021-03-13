// =====================================================
// Необходимые модули
const vscode = require('vscode');
const ncp = require("copy-paste");
var HTMLParser = require('node-html-parser');
// =====================================================
/**
* @param {vscode.ExtensionContext} context
*/
function activate(context) {
	
	// =====================================================
	class htmlElement {
		constructor(tagName, tabSize, attrs, nestingLevel){
			this.tagName = tagName
			this.tabSize = tabSize
			this.attrs = attrs
			this.nestingLevel = nestingLevel
		}
	}
	// ====================================================
	
	
	const contentBetween = /(?<=>)([\s\S]+?)(?=<)/g
	
	
	const matchTypeAttr = new RegExp(/type=/)
	
	
	const matchNameAttr = new RegExp(/name=/)
	
	const matchIdAttr = new RegExp(/id=/)
	
	const matchClassAttr = new RegExp(/class=/)
	
	const matchValueAttr = new RegExp(/value=/)
	
	
	const matchAccesskeyAttr = new RegExp(/accesskey=/)
	
	
	const matchForAttr = new RegExp(/for=/)
	
	// =====================================================
	
	function haveType(string) {
		if(string.match(matchTypeAttr)) {
			return true
		}else {
			return false
		}
	}
	function haveName(string) {
		if(string.match(matchNameAttr)) {
			return true
		}else {
			return false
		}
	}
	function haveId(string) {
		if(string.match(matchIdAttr) && string.match(/(?<=id=")(.+)(?=")/g)) {
			if (string.match(/(?<=id=")(.+)(?=")/g)[0].trim() != '') {
				return true
			}else {
				return false;
			}
		}else {
			return false
		}
	}
	
	function haveClass(string) {
		if(string.match(matchClassAttr)) {
			if (string.match(/(?<=class=")(.+)(?=")/g)[0].trim() != '') {
				return true
			}else {
				return false;
			}
		}else {
			return false
		}
	}
	
	function haveValue(string) {
		if(string.match(matchValueAttr)) {
			return true
		}else {
			return false
		}
	}
	function haveAccesskey(string) {
		if(string.match(matchAccesskeyAttr)) {
			return true
		}else {
			return false
		}
	}
	function haveFor(string) {
		if(string.match(matchForAttr)) {
			return true
		}else {
			return false
		}
	}
	
	function haveAttributes(string) {
		if(haveType(string)||haveName(string)||haveId(string)||haveValue(string)||haveAccesskey(string)||haveFor(string)) {
			return true
		}else {
			return false;
		}
		
	}
	
	function haveParent(htmlElements) {
		if (htmlElements) {
			// first element 
			let openTag = htmlElements[0].match(/(?<=<)([a-z\d]+)(?=[\s\S]+)/g)[0]
			// last element 
			var lastEl = htmlElements.length - 1;
			let closeTag = htmlElements[lastEl].match(/(?<=<)([a-z\d]+)(?=>)/g)[0]
			// Если имя открывающего тега и закрывающего тега равно то они вложены
			if (openTag == closeTag) {
				
				return true;
			}else {
				return false;
			}
		}
	}
	
	function remRepEl(arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr.indexOf(arr[i]) != i)
			arr.splice(i, 1);
		}
	}
	
	function querySelector(item, declarations, qs) {
		
		if (qs == 'single') {
			
			if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs.trim() != '') {
				switch (item.tagName) {
					case 'input':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						
						let varableName = idValue
						if(varableName.split("-")) {
							varableName = varableName.split("-")
							
							if (varableName.match(/^\d+/m)) {
								const lengthOfDigits = varableName.match(/^\d+/m)[0].length
								varableName = varableName.substring(lengthOfDigits)
							}
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						}else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1) 
						}
						
						let varable = `${item.tagName}${varableName} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if(haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
						let varable = `${item.tagName}${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					}else if(haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						
						let varableName = nameValue
						if(varableName.split("-")) {
							varableName = varableName.split("-")
							
							if (varableName.match(/^\d+/m)) {
								const lengthOfDigits = varableName.match(/^\d+/m)[0].length
								varableName = varableName.substring(lengthOfDigits)
							}
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						}else {
							varableName = nameValue[0].toUpperCase() + nameValue.substring(1) 
						}
						
						let varable = `${item.tagName}${varableName} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
						let varable = `${item.tagName}${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					case 'button':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
						let varable = `btn${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if(haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
						let varable = `btn${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					}else if(haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
						let varable = `btn${nameValue2} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
						let varable = `btn${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `btn${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					case 'label':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
						let varable = `${item.tagName}${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if (haveFor(item.attrs)) {
						let forValue = item.attrs.match(/(?<=for=\")([a-z\d]+)(?=\")/g)[0]
						let forValue2 = forValue[0].toUpperCase() + forValue.substring(1) 
						let varable = `${item.tagName}${forValue2} = document.querySelector('${item.tagName}[id="${forValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					
					
				}
				
				
				
				
			}else {
				if (haveId(item.attrs)) {
					/* if() {
						vscode.window.showInformationMessage('Will select the first class name')
					} */
					
					// let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]

					let idValue = item.attrs.match(/id=".+?"/g)[0]
					idValue = idValue.replace(/id=/g, '')
					idValue = idValue.replace(/"/g, '')
					


					let varableName = idValue
					if(varableName.split("-")) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						/* if (varableName.join().match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						} */
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					let varable = `${varableName} = document.getElementById('${idValue}')`
					declarations.push(varable)
				} else if (haveClass(item.attrs)) {
					// let classValue = item.attrs.match(/(?<=class=\")(.+?)(?=\")/g)[0]
					let classValue = item.attrs.match(/class=".+?"/g)[0]
					classValue = classValue.replace(/class=/g, '')
					classValue = classValue.replace(/"/g, '')

					if (classValue.split(" ")) {
						vscode.window.showInformationMessage('Will select the first class name')
						var classes = classValue.split(" ")
						
						classes.filter(element => element != '')
						
						classValue = classes[0]
					}
					
					let varableName = classValue
					
					if(varableName.split("-")) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						/* if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						} */
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					
					let varable = `${varableName} = document.querySelector('.${classValue}')`
					declarations.push(varable)
				}else {
					let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
					declarations.push(varable)
				}
			}
			
			
			
		}else if(qs == 'all') {
			
			if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs.trim() != '') {
				switch (item.tagName) {
					case 'input':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
						let varable = `${item.tagName}${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if(haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
						let varable = `${item.tagName}${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					}else if(haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
						let varable = `${item.tagName}${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
						let varable = `${item.tagName}${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					case 'button':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
						let varable = `btn${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if(haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
						let varable = `btn${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					}else if(haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
						let varable = `btn${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
						let varable = `btn${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `btn${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					
					
					case 'label':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
						let varable = `${item.tagName}${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					}else if (haveFor(item.attrs)) {
						let forValue = item.attrs.match(/(?<=for=\")([a-z\d]+)(?=\")/g)[0]
						let forValue2 = forValue[0].toUpperCase() + forValue.substring(1) 
						let varable = `${item.tagName}${forValue2} = document.querySelectorAll('${item.tagName}[id="${forValue}"]')`
						declarations.push(varable)
					}else if(haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					
				}
				
			}else {
				if (haveId(item.attrs)) {
					// let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
					let idValue = item.attrs.match(/id=".+?"/g)[0]
					idValue = idValue.replace(/id=/g, '')
					idValue = idValue.replace(/"/g, '')
					
					
					let varableName = idValue
					if(varableName.split("-")) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						/* if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						} */
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					let varable = `${varableName} = document.getElementById('${idValue}')`
					declarations.push(varable)
				} else if(haveClass(item.attrs)) {
					// let classValue = item.attrs.match(/(?<=class=\")([a-z\d]+)(?=\")/g)[0]
					let classValue = item.attrs.match(/class=".+?"/g)[0]
					classValue = classValue.replace(/class=/g, '')
					classValue = classValue.replace(/"/g, '')
					
					
					if (classValue.split(" ")) {
						vscode.window.showInformationMessage('Will select the first class name')
						var classes = classValue.split(" ")
						
						classes.filter(element => element != '')
						
						classValue = classes[0]
					}
					
					let varableName = classValue
					
					if(varableName.split("-")) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						/* if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						} */
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					
					let varable = `${varableName} = document.getElementsByClassName('.${classValue}')`
					declarations.push(varable)
					
				}else {
					let varable = `${item.tagName} = document.getElementsByTagName('${item.tagName}')`
					declarations.push(varable)
				}
			}
			
			
			
			
			
			
		}
		
		
	}
	
	// =====================================================
	let myF2 = vscode.commands.registerCommand('selectorjs.select_with_nesting', function () {
		let htmlObj = []
		let declarations = []
		const editor = vscode.window.activeTextEditor;
		// =====================================================
		if (editor) { 
			function nesting(htmlEl, nest) {
				var root = HTMLParser.parse(htmlEl);
				if (root.firstChild.childNodes.length == 0) {
					console.log(root.firstChild);
					var tagName = root.firstChild.rawTagName
					var attrs = root.firstChild.rawAttrs
					// var tabSize = 
					console.log(nest);
					let tag = new htmlElement(tagName, '', attrs, nest)
					htmlObj.push(tag)
				} else {
					var tagName = root.firstChild.rawTagName
					var attrs = root.firstChild.rawAttrs
					// var tabSize = 
					let tag = new htmlElement(tagName, '', attrs, nest)
					htmlObj.push(tag)
					console.log(nest);
					nest++
					for (let i = 0; i < root.firstChild.childNodes.length; i++) {
						console.log(root.firstChild.childNodes[i].toString());
						var test = root.firstChild.childNodes[i].toString()
						nesting(root.firstChild.childNodes[i].toString(), nest)
					}
				}
			}
			
			// =====================================================
			const document = editor.document;
			const selection = editor.selection;
			let html = document.getText(selection);
			// =====================================================
			// Выделяем html tags
			let htmlTags = html.match(/<.+?>/g)
			// =====================================================
			
			let positions = [] //results 
			let htmlTags2 = [] // - массив который хранить только открывающии или закрывающии тег 
			htmlTags.forEach((item) => {
				if (item.match(/<[a-z\d]+/)) {
					htmlTags2.push(item.match(/<[a-z\d]+/)[0])
				}else {
					htmlTags2.push(item.match(/<\/[a-z\d]+/)[0])
				}
			});
			
			/* 	let openTags = []
			let closeTags = []
			let htmlTags3 = htmlTags2
			htmlTags3.forEach((item, i, arr) => {
				if (item == '<input') {
					arr.splice(i,1)
				}
			});
			
			htmlTags3.forEach((item) => {
				if(item.match(/<[a-z\d]+/)) {
					openTags.push(item.match(/<[a-z\d]+/)[0])
				}else {
					closeTags.push(item.match(/<\/[a-z\d]+/)[0])
				}
			});
			
			if (openTags.length != closeTags.length) {
				vscode.window.showInformationMessage('Please select tags in correct form, extention will work with wrongs')
			} */
			// =====================================================
			
			
			function findEndPosition(arr,start, tagname) {
				for (let i = start; i < arr.length; i++) {
					if (arr[i] == `</${tagname}`) { 
						return i
						break;
					}
					/* else if (arr[i] == `<${tagname}`) {
						start = i
						findEndPosition(arr, start, tagname)
						break;
					} */
				}
			}
			
			function f(arr, start) {
				// нужно проверить что это открывающии или де акрывающии тега
				if (arr[start].match(/<[a-z\d]+/)) {
					
					let tagname = arr[start].match(/[a-z\d]+/)[0]
					
					if (arr[start] == '<input') {
						// Нужно записать позиции
						// arr[start] = arr[start] + start
						
						var res = `${arr[start]} start=${start}`
						positions.push(res)
						// =====================================================
						// Двыигаемся дальше
						if(start < arr.length - 1) {
							start++
							f(arr, start)
						}
						
						
					}else {
						
						
						for (let i = start + 1; i < arr.length; i++) {
							if (arr[i] == `</${tagname}`) {
								var endPosition = i
								var res = `${arr[start]} start=${start} end=${endPosition}`
								
								positions.push(res)
								
								// return i
								if(start < arr.length - 1) {
									start++
									f(arr, start)
									break;
								}
							}else if(arr[i] == `<${tagname}`) {
								
								var endOfSameEl = findEndPosition(arr,i, tagname)
								// var endOfSameEl = f(arr, i)
								console.log(endOfSameEl);
								console.log(i);
								i = endOfSameEl
								console.log(i);
							}
						}
					}
					
					
				}else {
					if (start < arr.length -1) {
						start++
						f(arr, start)
					}
				}
			}
			f(htmlTags2, 0)
			
			let se = []
			positions.forEach((item) => {
				let a = []
				if (item.match(/(?<=start=)(\d+)/) && item.match(/(?<=end=)(\d+)/)) {
					a.push(item.match(/(?<=start=)(\d+)/)[0])				
					a.push(item.match(/(?<=end=)(\d+)/)[0])	
					se.push(a)			
				}else if(item.match(/(?<=start=)(\d+)/)) {
					a.push(item.match(/(?<=start=)(\d+)/)[0])
					se.push(a)
				}
			});
			
			
			se.forEach((item, index, arr) => {
				if(item.length == 1) {
					item.push(item[0])
				}
			});
			function f2(start) {
				if (start+1 < se.length) {
					
					if (+se[start][1] > +se[1+start][1]) {
						se.splice(start + 1, 1)
						f2(start)
					}else {
						if(start < se.length -1) {
							f2(start+1)
						}
					}
				}
			}
			f2(0)
			let c = []
			
			for (let i = 0; i < se.length; i++) {
				se[i][1] = +se[i][1] + 1
				/* if(+se[i][0] >= +se[i][1]) {
					se[i][1] = +se[i][0] + 1
				} */
				c.push(htmlTags.slice(se[i][0], se[i][1]).join(''))
			}
			// =====================================================
			c.forEach((html) => {
				
				html = html.replace(/(?<=^)(\s+)(?=<)/gm, '')
				html = html.replace(/\r\n\s+/gm, '')
				html = html.replace(/(?<=>)(\r\n)/gm, '')
				html = html.replace(/\r/g, '')
				
				var root = HTMLParser.parse(html);
				
				// let structure = root.firstChild.structure.replace(/(?<=\n)(\s+#text\n?)/g ,'')
				
				let childNodes = root.firstChild.childNodes
				
				if (childNodes.length == 0) {
					let tagName = root.firstChild.rawTagName
					let attrs = root.firstChild.rawAttrs
					let tag = new htmlElement(tagName, '', attrs, 0)
					htmlObj.push(tag)
				} else {
					nesting(root.firstChild.toString(), 0)
					htmlObj.forEach((item, i, arr) => {
						if(item.tagName == undefined) {
							arr.splice(i,1)
						}
					});
				}
				
			});
			// =====================================================
			
			const tab = '    '
			htmlObj.forEach((item) => {
				
				var tabs = ''
				for (let i = 0; i < item.nestingLevel; i++) {
					tabs += tab
				}
				item.tabSize = tabs
			});
			// =====================================================
			htmlObj.forEach((item) => {
				// item.tagName = ''
				if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs != '') {
					
					switch (item.tagName) {
						case 'input':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `${item.tagName}${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if(haveType(item.attrs)) {
							let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
							let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
							let varable = `${item.tagName}${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
							declarations.push(varable)
						}else if(haveName(item.attrs)) {
							let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
							let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
							let varable = `${item.tagName}${nameValue2} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
							declarations.push(varable)
						} else if (haveValue(item.attrs)) {
							let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
							let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
							let varable = `${item.tagName}${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						break;
						
						
						case 'button':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `btn${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if(haveType(item.attrs)) {
							let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
							let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
							let varable = `btn${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
							declarations.push(varable)
						}else if(haveName(item.attrs)) {
							let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
							let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
							let varable = `btn${nameValue2} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
							declarations.push(varable)
						} else if (haveValue(item.attrs)) {
							let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
							let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
							let varable = `btn${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `btn${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						
						break;
						case 'label':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `${item.tagName}${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if (haveFor(item.attrs)) {
							let forValue = item.attrs.match(/(?<=for=\")([a-z\d]+)(?=\")/g)[0]
							let forValue2 = forValue[0].toUpperCase() + forValue.substring(1) 
							let varable = `${item.tagName}${forValue2} = document.querySelector('${item.tagName}[id="${forValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						
						break;
						
						
					}
					
				}else {
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)
						let varable = `${idValue} = document.getElementById('${idValue}')`
						declarations.push(varable)
					} else if (haveClass(item.attrs)) {
						let classValue = item.attrs.match(/(?<=class=\")([a-z\d]+)(?=\")/g)
						let varable = `${classValue} = document.querySelector('.${classValue}')`
						declarations.push(varable)
					}else {
						let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
						declarations.push(varable)
					}
				}
				
			});
			// =====================================================
			// Добовляем табы чтобы выглядяло как вложенности
			for (let i = 0; i < declarations.length; i++) {
				declarations[i] =  htmlObj[i].tabSize + declarations[i]
			}
			// =====================================================
			const finalString = 'const \n'+declarations.join(",\n")
			ncp.copy(finalString, function () {
				// 
				vscode.window.showInformationMessage("OK");
			})
		}
	})
	
	
	let myF3 = vscode.commands.registerCommand('selectorjs.select_all_with_nesting', function () { 
		
		
		let htmlObj = []
		let declarations = []
		const editor = vscode.window.activeTextEditor;
		// =====================================================
		if (editor) { 
			function nesting(htmlEl, nest) {
				var root = HTMLParser.parse(htmlEl);
				if (root.firstChild.childNodes.length == 0) {
					console.log(root.firstChild);
					var tagName = root.firstChild.rawTagName
					var attrs = root.firstChild.rawAttrs
					// var tabSize = 
					console.log(nest);
					let tag = new htmlElement(tagName, '', attrs, nest)
					htmlObj.push(tag)
				} else {
					var tagName = root.firstChild.rawTagName
					var attrs = root.firstChild.rawAttrs
					// var tabSize = 
					let tag = new htmlElement(tagName, '', attrs, nest)
					htmlObj.push(tag)
					console.log(nest);
					nest++
					for (let i = 0; i < root.firstChild.childNodes.length; i++) {
						console.log(root.firstChild.childNodes[i].toString());
						var test = root.firstChild.childNodes[i].toString()
						nesting(root.firstChild.childNodes[i].toString(), nest)
					}
				}
			}
			
			// =====================================================
			const document = editor.document;
			const selection = editor.selection;
			let html = document.getText(selection);
			// =====================================================
			// Выделяем html tags
			let htmlTags = html.match(/<.+?>/g)
			// =====================================================
			
			let positions = [] //results 
			let htmlTags2 = [] // - массив который хранить только открывающии или закрывающии тег 
			htmlTags.forEach((item) => {
				if (item.match(/<[a-z\d]+/)) {
					htmlTags2.push(item.match(/<[a-z\d]+/)[0])
				}else {
					htmlTags2.push(item.match(/<\/[a-z\d]+/)[0])
				}
			});
			
			// =====================================================
			
			
			function findEndPosition(arr,start, tagname) {
				for (let i = start; i < arr.length; i++) {
					if (arr[i] == `</${tagname}`) { 
						return i
						break;
					}
					/* else if (arr[i] == `<${tagname}`) {
						start = i
						findEndPosition(arr, start, tagname)
						break;
					} */
				}
			}
			
			function f(arr, start) {
				// нужно проверить что это открывающии или де акрывающии тега
				if (arr[start].match(/<[a-z\d]+/)) {
					
					let tagname = arr[start].match(/[a-z\d]+/)[0]
					
					if (arr[start] == '<input') {
						// Нужно записать позиции
						// arr[start] = arr[start] + start
						
						var res = `${arr[start]} start=${start}`
						positions.push(res)
						// =====================================================
						// Двыигаемся дальше
						if(start < arr.length - 1) {
							start++
							f(arr, start)
						}
						
						
					}else {
						
						
						for (let i = start + 1; i < arr.length; i++) {
							if (arr[i] == `</${tagname}`) {
								var endPosition = i
								var res = `${arr[start]} start=${start} end=${endPosition}`
								
								positions.push(res)
								
								// return i
								if(start < arr.length - 1) {
									start++
									f(arr, start)
									break;
								}
							}else if(arr[i] == `<${tagname}`) {
								
								var endOfSameEl = findEndPosition(arr,i, tagname)
								// var endOfSameEl = f(arr, i)
								i = endOfSameEl
							}
						}
					}
					
					
				}else {
					if (start < arr.length -1) {
						start++
						f(arr, start)
					}
				}
			}
			f(htmlTags2, 0)
			
			let se = []
			positions.forEach((item) => {
				let a = []
				if (item.match(/(?<=start=)(\d+)/) && item.match(/(?<=end=)(\d+)/)) {
					a.push(item.match(/(?<=start=)(\d+)/)[0])				
					a.push(item.match(/(?<=end=)(\d+)/)[0])	
					se.push(a)			
				}else if(item.match(/(?<=start=)(\d+)/)) {
					a.push(item.match(/(?<=start=)(\d+)/)[0])
					se.push(a)
				}
			});
			
			
			se.forEach((item, index, arr) => {
				if(item.length == 1) {
					item.push(item[0])
				}
			});
			function f2(start) {
				if (start+1 < se.length) {
					
					if (+se[start][1] > +se[1+start][1]) {
						se.splice(start + 1, 1)
						f2(start)
					}else {
						if(start < se.length -1) {
							f2(start+1)
						}
					}
				}
			}
			f2(0)
			let c = []
			
			for (let i = 0; i < se.length; i++) {
				se[i][1] = +se[i][1] + 1
				/* if(+se[i][0] >= +se[i][1]) {
					se[i][1] = +se[i][0] + 1
				} */
				c.push(htmlTags.slice(se[i][0], se[i][1]).join(''))
			}
			// =====================================================
			c.forEach((html) => {
				
				html = html.replace(/(?<=^)(\s+)(?=<)/gm, '')
				html = html.replace(/\r\n\s+/gm, '')
				html = html.replace(/(?<=>)(\r\n)/gm, '')
				html = html.replace(/\r/g, '')
				
				var root = HTMLParser.parse(html);
				
				// let structure = root.firstChild.structure.replace(/(?<=\n)(\s+#text\n?)/g ,'')
				
				let childNodes = root.firstChild.childNodes
				
				if (childNodes.length == 0) {
					let tagName = root.firstChild.rawTagName
					let attrs = root.firstChild.rawAttrs
					let tag = new htmlElement(tagName, '', attrs, 0)
					htmlObj.push(tag)
				} else {
					nesting(root.firstChild.toString(), 0)
					htmlObj.forEach((item, i, arr) => {
						if(item.tagName == undefined) {
							arr.splice(i,1)
						}
					});
				}
				
			});
			// =====================================================
			
			const tab = '    '
			htmlObj.forEach((item) => {
				
				var tabs = ''
				for (let i = 0; i < item.nestingLevel; i++) {
					tabs += tab
				}
				item.tabSize = tabs
			});
			// =====================================================
			htmlObj.forEach((item) => {
				// item.tagName = ''
				if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs != '') {
					
					switch (item.tagName) {
						case 'input':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `${item.tagName}${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if(haveType(item.attrs)) {
							let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
							let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
							let varable = `${item.tagName}${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
							declarations.push(varable)
						}else if(haveName(item.attrs)) {
							let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
							let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
							let varable = `${item.tagName}${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
							declarations.push(varable)
						} else if (haveValue(item.attrs)) {
							let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
							let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
							let varable = `${item.tagName}${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						break;
						
						
						case 'button':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `btn${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if(haveType(item.attrs)) {
							let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
							let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1) 
							let varable = `btn${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
							declarations.push(varable)
						}else if(haveName(item.attrs)) {
							let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
							let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1) 
							let varable = `btn${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
							declarations.push(varable)
						} else if (haveValue(item.attrs)) {
							let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
							let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1) 
							let varable = `btn${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `btn${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						
						break;
						case 'label':
						if (haveId(item.attrs)) {
							let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
							let idValue2 = idValue[0].toUpperCase() + idValue.substring(1) 
							let varable = `${item.tagName}${idValue2} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
							declarations.push(varable)
						}else if (haveFor(item.attrs)) {
							let forValue = item.attrs.match(/(?<=for=\")([a-z\d]+)(?=\")/g)[0]
							let forValue2 = forValue[0].toUpperCase() + forValue.substring(1) 
							let varable = `${item.tagName}${forValue2} = document.querySelectorAll('${item.tagName}[id="${forValue}"]')`
							declarations.push(varable)
						}else if(haveAccesskey(item.attrs)) {
							let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
							let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1) 
							let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
							declarations.push(varable)
						}
						
						break;
						
						
					}
					
				}else {
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let varableName = idValue
						if(varableName.split("-")) {
							varableName = varableName.split("-")
							
							varableName.filter(element => element != '')
							
							if (varableName.match(/^\d+/m)) {
								const lengthOfDigits = varableName.match(/^\d+/m)[0].length
								varableName = varableName.substring(lengthOfDigits)
							}
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						}
						let varable = `${varableName} = document.getElementById('${idValue}')`
						declarations.push(varable)
					} else if (haveClass(item.attrs)) {
						let classValue = item.attrs.match(/(?<=class=\")([a-z\d]+)(?=\")/g)[0]
						if (classValue.split(" ")) {
							vscode.window.showInformationMessage('Will select the first class name')
							var classes = classValue.split(" ")
							
							classes.filter(element => element != '')
							
							classValue = classes[0]
						}
						let varableName = classValue
						
						if(varableName.split("-")) {
							varableName = varableName.split("-")
							
							varableName.filter(element => element != '')
							
							if (varableName.match(/^\d+/m)) {
								const lengthOfDigits = varableName.match(/^\d+/m)[0].length
								varableName = varableName.substring(lengthOfDigits)
							}
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						}
						
						let varable = `${varableName} = document.Cl('.${classValue}')`
						declarations.push(varable)
					}else {
						let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
						declarations.push(varable)
					}
				}
				
			});
			// =====================================================
			// Добовляем табы чтобы выглядяло как вложенности
			for (let i = 0; i < declarations.length; i++) {
				declarations[i] =  htmlObj[i].tabSize + declarations[i]
			}
			// =====================================================
			const finalString = 'const \n'+declarations.join(",\n")
			ncp.copy(finalString, function () {
				vscode.window.showInformationMessage("OK");
			})
		}
		
		
	})
	
	
	let myF4 = vscode.commands.registerCommand('selectorjs.select_without_nesting', function () { 
		let htmlObj = []
		let declarations = []
		
		const editor = vscode.window.activeTextEditor;
		
		if (editor) { 
			// =====================================================
			// Все что нужно для взаймодействия с VSCode
			const document = editor.document;
			const selection = editor.selection;
			let html = document.getText(selection);
			// =====================================================
			// Удоляю закрывающее теги
			html = html.replace(/<\/[a-z\d]+>/g, )
			// Выделяем html tags
			
			let htmlTags = html.match(/<.+?>/g)
			// =====================================================
			
			// =====================================================
			// Удоляю повторяющее элементы
			remRepEl(htmlTags)
			// =====================================================
			// Создаю объект html  
			htmlTags.forEach((item) => {
				// =====================================================
				// параметры для конструктора
				let tagName = item.match(/(?<=<)([a-z\d]+)/)[0]
				let attrs = item.match(/(?<=<[a-z\d]+\s)(.+)(?=>)/)[0]
				// =====================================================
				let tag = new htmlElement(tagName, '', attrs, 0)
				htmlObj.push(tag)
			});
			// =====================================================
			htmlObj.forEach((item) => {
				// Just querySelector 
				querySelector(item, declarations, 'single')	
				
			});
			// Заключительная строка
			const finalString = 'const \n'+declarations.join(",\n")
			ncp.copy(finalString, function () {
				// Функция выполнена успешна
				vscode.window.showInformationMessage("OK");
			})
			
		}
		
	})
	
	let myF5 = vscode.commands.registerCommand('selectorjs.select_all_without_nesting', function () { 
		let htmlObj = []
		let declarations = []
		const editor = vscode.window.activeTextEditor;
		
		if (editor) { 
			// =====================================================
			// Все что нужно для взаймодействия с VSCode
			const document = editor.document;
			const selection = editor.selection;
			let html = document.getText(selection);
			// =====================================================
			// Удоляю закрывающее теги
			html = html.replace(/<\/[a-z\d]+>/g, '')
			// Выделяем html tags
			
			
			// Выделяем html tags
			let htmlTags = html.match(/<.+?>/g)
			// =====================================================
			// Удоляю закрывающее теги
			// =====================================================
			remRepEl(htmlTags)
			// =====================================================
			// Создаю объект html  
			htmlTags.forEach((item) => {
				// =====================================================
				// параметры для конструктора
				let tagName = item.match(/(?<=<)([a-z\d]+)/)[0]
				let attrs = item.match(/(?<=<[a-z\d]+\s)(.+)(?=>)/)[0]
				// =====================================================
				let tag = new htmlElement(tagName, '', attrs, 0)
				htmlObj.push(tag)
			});
			// =====================================================
			htmlObj.forEach((item) => {
				// Just querySelector 
				querySelector(item, declarations, 'all')	
				
			});
			// Заключительная строка
			const finalString = 'const \n'+declarations.join(",\n")
			ncp.copy(finalString, function () {
				// Функция выполнена успешна
				vscode.window.showInformationMessage("OK");
			})
			
		}
		
	})
	
	
	// =====================================================
	context.subscriptions.push(myF2);
	context.subscriptions.push(myF3);
	context.subscriptions.push(myF4);
	context.subscriptions.push(myF5);
}
// =====================================================
function deactivate() {}

module.exports = {
	activate,
	deactivate	
}
