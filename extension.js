// =====================================================
// Необходимые модули
const vscode = require('vscode');
const ncp = require("copy-paste");
var HTMLParser = require('node-html-parser');
// =====================================================
/**
* @param {vscode.ExtensionContext} context
*/
function activate (context) {
	
	// =====================================================
	class htmlElement {
		constructor(tagName, tabSize, attrs, nestingLevel) {
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
	
	function haveType (string) {
		if (string.match(matchTypeAttr)) {
			return true
		} else {
			return false
		}
	}
	function haveName (string) {
		if (string.match(matchNameAttr)) {
			return true
		} else {
			return false
		}
	}
	function haveId (string) {
		if (string.match(matchIdAttr) && string.match(/(?<=id=")(.+)(?=")/g)) {
			if (string.match(/(?<=id=")(.+)(?=")/g)[0].trim() != '') {
				return true
			} else {
				return false;
			}
		} else {
			return false
		}
	}
	
	function haveClass (string) {
		if (string.match(matchClassAttr)) {
			if (string.match(/(?<=class=")(.+)(?=")/g)[0].trim() != '') {
				return true
			} else {
				return false;
			}
		} else {
			return false
		}
	}
	
	function haveValue (string) {
		if (string.match(matchValueAttr)) {
			return true
		} else {
			return false
		}
	}
	function haveAccesskey (string) {
		if (string.match(matchAccesskeyAttr)) {
			return true
		} else {
			return false
		}
	}
	function haveFor (string) {
		if (string.match(matchForAttr)) {
			return true
		} else {
			return false
		}
	}
	
	function haveAttributes (string) {
		if (haveType(string) || haveName(string) || haveId(string) || haveValue(string) || haveAccesskey(string) || haveFor(string)) {
			return true
		} else {
			return false;
		}
		
	}
	
	function haveParent (htmlElements) {
		if (htmlElements) {
			// first element 
			let openTag = htmlElements[0].match(/(?<=<)([a-z\d]+)(?=[\s\S]+)/g)[0]
			// last element 
			var lastEl = htmlElements.length - 1;
			let closeTag = htmlElements[lastEl].match(/(?<=<)([a-z\d]+)(?=>)/g)[0]
			// Если имя открывающего тега и закрывающего тега равно то они вложены
			if (openTag == closeTag) {
				
				return true;
			} else {
				return false;
			}
		}
	}
	
	function remRepEl (arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr.indexOf(arr[i]) != i)
			arr.splice(i, 1);
		}
	}
	
	function querySelector (item, declarations, qs) {
		
		if (qs == 'single') {
			
			if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs.trim() != '') {
				switch (item.tagName) {
					case 'input':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						
						let varableName = idValue
						if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						}
						
						if (varableName.match(/-/g)) {
							varableName = varableName.split("-")
							
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1)
						}
						
						let varable = `${item.tagName}${varableName[0].toUpperCase()+varableName.substring(1)} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					} else if (haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1)
						let varable = `${item.tagName}${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					} else if (haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						
						let varableName = nameValue
						if (varableName.split("-")) {
							varableName = varableName.split("-")
							
							if (varableName.match(/^\d+/m)) {
								const lengthOfDigits = varableName.match(/^\d+/m)[0].length
								varableName = varableName.substring(lengthOfDigits)
							}
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = nameValue[0].toUpperCase() + nameValue.substring(1)
						}
						
						let varable = `${item.tagName}${varableName} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1)
						let varable = `${item.tagName}${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					case 'button':
					if (haveId(item.attrs)) {
						/* let idValue = item.attrs.match(/(?<=id=\")([a-z\d]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1)
						let varable = `btn${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable) */
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						
						let varableName = idValue
						if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						}
						
						if (varableName.match(/-/g)) {
							varableName = varableName.split("-")
							
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1)
						}
						
						let varable = `btn${varableName[0].toUpperCase()+varableName.substring(1)} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					} else if (haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1)
						let varable = `btn${typeValue2} = document.querySelector('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					} else if (haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1)
						let varable = `btn${nameValue2} = document.querySelector('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d-_]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1)
						let varable = `btn${valueValue2} = document.querySelector('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d-_]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `btn${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					case 'label':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						let idValue2 = idValue[0].toUpperCase() + idValue.substring(1)
						let varable = `${item.tagName}${idValue2} = document.querySelector('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
					} else if (haveFor(item.attrs)) {
						let forValue = item.attrs.match(/(?<=for=\")([a-z\d]+)(?=\")/g)[0]
						let forValue2 = forValue[0].toUpperCase() + forValue.substring(1)
						let varable = `${item.tagName}${forValue2} = document.querySelector('${item.tagName}[id="${forValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelector('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					
					
				}
				
				
				
				
			} else {
				if (haveId(item.attrs)) {
					let idValue = item.attrs.match(/id=".+?"/g)[0]
					idValue = idValue.replace(/id=/g, '')
					idValue = idValue.replace(/"/g, '')
					
					
					
					let varableName = idValue
					// Если имя переменной начинается с цифры
					if (varableName.match(/^\d+/m)) {
						const lengthOfDigits = varableName.match(/^\d+/m)[0].length
						varableName = varableName.substring(lengthOfDigits)
					}
					if (varableName.match(/-/g)) {
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
					let classValue = item.attrs.match(/class=".+?"/g)[0]
					classValue = classValue.replace(/class=/g, '')
					classValue = classValue.replace(/"/g, '')
					
					if (classValue.match(/-/g)) {
						vscode.window.showInformationMessage('Will select the first class name')
						var classes = classValue.split(" ")
						
						classes.filter(element => element != '')
						
						classValue = classes[0]
					}
					
					let varableName = classValue
					if (varableName.match(/^\d+/m)) {
						const lengthOfDigits = varableName.match(/^\d+/m)[0].length
						varableName = varableName.substring(lengthOfDigits)
					}
					
					if (varableName.match(/-/g)) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					
					let varable = `${varableName} = document.querySelector('.${classValue}')`
					declarations.push(varable)
				} else {
					let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
					declarations.push(varable)
				}
			}
			
			
			
		} else if (qs == 'all') {
			
			if (item.tagName == 'input' || item.tagName == 'label' || item.tagName == 'button' && item.attrs.trim() != '') {
				switch (item.tagName) {
					case 'input':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						
						let varableName = idValue
						if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						}
						
						if (varableName.match(/-/g)) {
							varableName = varableName.split("-")
							
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1)
						}
						
						let varable = `${item.tagName}${varableName[0].toUpperCase()+varableName.substring(1)} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
						
						
					} else if (haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d-_]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1)
						let varable = `${item.tagName}${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					} else if (haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d-_]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1)
						let varable = `${item.tagName}${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d-_]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1)
						let varable = `${item.tagName}${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d-_]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					case 'button':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						
						let varableName = idValue
						if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						}
						
						if (varableName.match(/-/g)) {
							varableName = varableName.split("-")
							
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1)
						}
						
						let varable = `btn${varableName[0].toUpperCase()+varableName.substring(1)} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
						
					} else if (haveType(item.attrs)) {
						let typeValue = item.attrs.match(/(?<=type=\")([a-z\d-_]+)(?=\")/g)[0]
						let typeValue2 = typeValue[0].toUpperCase() + typeValue.substring(1)
						let varable = `btn${typeValue2} = document.querySelectorAll('${item.tagName}[type="${typeValue}"]')`
						declarations.push(varable)
					} else if (haveName(item.attrs)) {
						let nameValue = item.attrs.match(/(?<=name=\")([a-z\d-_]+)(?=\")/g)[0]
						let nameValue2 = nameValue[0].toUpperCase() + nameValue.substring(1)
						let varable = `btn${nameValue2} = document.querySelectorAll('${item.tagName}[name="${nameValue}"]')`
						declarations.push(varable)
					} else if (haveValue(item.attrs)) {
						let valueValue = item.attrs.match(/(?<=value=\")([a-z\d-_]+)(?=\")/g)[0]
						let valueValue2 = valueValue[0].toUpperCase() + valueValue.substring(1)
						let varable = `btn${valueValue2} = document.querySelectorAll('${item.tagName}[value="${valueValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d-_]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `btn${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					
					break;
					
					
					case 'label':
					if (haveId(item.attrs)) {
						let idValue = item.attrs.match(/(?<=id=\")([a-z\d-_]+)(?=\")/g)[0]
						
						let varableName = idValue
						if (varableName.match(/^\d+/m)) {
							const lengthOfDigits = varableName.match(/^\d+/m)[0].length
							varableName = varableName.substring(lengthOfDigits)
						}
						
						if (varableName.match(/-/g)) {
							varableName = varableName.split("-")
							
							
							for (let j = 1; j < varableName.length; j++) {
								varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
							}
							varableName = varableName.join('')
						} else {
							varableName = idValue[0].toUpperCase() + idValue.substring(1)
						}
						
						let varable = `${item.tagName}${varableName[0].toUpperCase()+varableName.substring(1)} = document.querySelectorAll('${item.tagName}[id="${idValue}"]')`
						declarations.push(varable)
						
					} else if (haveFor(item.attrs)) {
						let forValue = item.attrs.match(/(?<=for=\")([a-z\d-_]+)(?=\")/g)[0]
						let forValue2 = forValue[0].toUpperCase() + forValue.substring(1)
						let varable = `${item.tagName}${forValue2} = document.querySelectorAll('${item.tagName}[id="${forValue}"]')`
						declarations.push(varable)
					} else if (haveAccesskey(item.attrs)) {
						let accesskeyValue = item.attrs.match(/(?<=accesskey=\")([a-z\d-_]+)(?=\")/g)[0]
						let accesskeyValue2 = accesskeyValue[0].toUpperCase() + accesskeyValue.substring(1)
						let varable = `${item.tagName}${accesskeyValue2} = document.querySelectorAll('${item.tagName}[accesskey="${accesskeyValue}"]')`
						declarations.push(varable)
					}
					break;
					
					
				}
				
			} else {
				if (haveId(item.attrs)) {
					let idValue = item.attrs.match(/id=".+?"/g)[0]
					idValue = idValue.replace(/id=/g, '')
					idValue = idValue.replace(/"/g, '')
					
					let varableName = idValue
					
					// Если имя переменной начинается с цифры
					if (varableName.match(/^\d+/m)) {
						const lengthOfDigits = varableName.match(/^\d+/m)[0].length
						varableName = varableName.substring(lengthOfDigits)
					}
					
					if (varableName.match(/-/g)) {
						varableName = varableName.split("-")
						
						varableName.filter(element => element != '')
						
						for (let j = 1; j < varableName.length; j++) {
							varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
						}
						varableName = varableName.join('')
					}
					let varable = `${varableName} = document.getElementById('${idValue}')`
					declarations.push(varable)
				} else if (haveClass(item.attrs)) {
					// let classValue = item.attrs.match(/(?<=class=\")([a-z\d]+)(?=\")/g)[0]
					let classValue = item.attrs.match(/class=".+?"/g)[0]
					classValue = classValue.replace(/class=/g, '')
					classValue = classValue.replace(/"/g, '')
					
					
					if (classValue.split(" ")) {
						// vscode.window.showInformationMessage('Will select the first class name')
						var classes = classValue.split(" ")
						
						classes.filter(element => element != '')
						
						classValue = classes[0]
					}
					
					let varableName = classValue
					
					if (varableName.match(/^\d+/m)) {
						const lengthOfDigits = varableName.match(/^\d+/m)[0].length
						varableName = varableName.substring(lengthOfDigits)
					}
					
					if (varableName.match(/-/g)) {
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
					
				} else {
					let varable = `${item.tagName} = document.getElementsByTagName('${item.tagName}')`
					declarations.push(varable)
				}
			}
			
			
			
			
			
			
		}
		
		
	}
	// =====================================================
	
	context.subscriptions.push(
		vscode.commands.registerCommand('selector-js.qs', function () {
			let htmlObj = []
			let declarations = []
			const editor = vscode.window.activeTextEditor;
			// =====================================================
			if (editor) {
				function nesting(htmlEL, nestingLevel) {
					if (html.childNodes == 0) {
						// =====================================================
						var
						tagName = htmlEL.rawTagName
						attrs = htmlEL.rawAttrs;
						// =====================================================
						var tag = new htmlElement(tagName, attrs, '', nestingLevel)
						htmlObj.push(tag)
					}else {
						var tagName = htmlEL.rawTagName
						var attrs = htmlEL.rawAttrs
						let tag = new htmlElement(tagName, '', attrs, nestingLevel)
						htmlObj.push(tag)
						nestingLevel++
						for (let i = 0; i < htmlEL.childNodes.length; i++) {
							nesting(htmlEL.childNodes[i], nestingLevel)
						}
					}
				}
				
				// =====================================================
				const document = editor.document;
				const selection = editor.selection;
				let html = document.getText(selection);
				// =====================================================
				// =====================================================
				html = html.match(/<.+?>/g).join('')
				var root = HTMLParser.parse(html)
				// =====================================================
				
				root.childNodes.forEach((item) => {
					nesting(item, 0)
				});
				
				
				htmlObj.forEach((item) => {
					
					querySelector(item, declarations, 'single')
					
				});
				
				const tab = '    '
				htmlObj.forEach((item) => {
					
					var tabs = ''
					for (let i = 0; i < item.nestingLevel; i++) {
						tabs += tab
					}
					item.tabSize = tabs
				});
				
				for (let i = 0; i < declarations.length; i++) {
					declarations[i] =  htmlObj[i].tabSize + declarations[i]
				}
				let finalString;
				if(declarations.length == 1) {
					finalString = 'const '+declarations.join(",\n")
				}else {
					finalString = 'const \n'+declarations.join(",\n")
				}
				ncp.copy(finalString, function () {
					vscode.window.showInformationMessage("OK");
				})
			}
		})
		);
		
		// =====================================================
		
		context.subscriptions.push(
			vscode.commands.registerCommand('selector-js.qsa', function () {
				let htmlObj = []
				let declarations = []
				const editor = vscode.window.activeTextEditor;
				// =====================================================
				if (editor) {
					function nesting(htmlEL, nestingLevel) {
						if (html.childNodes == 0) {
							// =====================================================
							var
							tagName = htmlEL.rawTagName
							attrs = htmlEL.rawAttrs;
							// =====================================================
							var tag = new htmlElement(tagName, attrs, '', nestingLevel)
							htmlObj.push(tag)
						}else {
							var tagName = htmlEL.rawTagName
							var attrs = htmlEL.rawAttrs
							let tag = new htmlElement(tagName, '', attrs, nestingLevel)
							htmlObj.push(tag)
							nestingLevel++
							for (let i = 0; i < htmlEL.childNodes.length; i++) {
								nesting(htmlEL.childNodes[i], nestingLevel)
							}
						}
					}
					
					// =====================================================
					const document = editor.document;
					const selection = editor.selection;
					let html = document.getText(selection);
					// =====================================================
					// =====================================================
					html = html.match(/<.+?>/g).join('')
					var root = HTMLParser.parse(html)
					// =====================================================
					
					root.childNodes.forEach((item) => {
						nesting(item, 0)
					});
					
					
					htmlObj.forEach((item) => {
						
						querySelector(item, declarations, 'all')
						
					});
					
					const tab = '    '
					htmlObj.forEach((item) => {
						
						var tabs = ''
						for (let i = 0; i < item.nestingLevel; i++) {
							tabs += tab
						}
						item.tabSize = tabs
					});
					
					for (let i = 0; i < declarations.length; i++) {
						declarations[i] =  htmlObj[i].tabSize + declarations[i]
					}
					
					let finalString;
					if(declarations.length == 1) {
						finalString = 'const '+declarations.join(",\n")
					}else {
						finalString = 'const \n'+declarations.join(",\n")
					}
					
					ncp.copy(finalString, function () {
						vscode.window.showInformationMessage("OK");
					})
				}
			})
			
			
			);
			
			
			
			
			
			// =====================================================
			
			context.subscriptions.push(
				
				vscode.commands.registerCommand('selector-js.qswe', async function () {
					
					
					let htmlObj = []
					let declarations = []
					const editor = vscode.window.activeTextEditor;
					// =====================================================
					if (editor) {
						function nesting (htmlEL, nestingLevel) {
							if (html.childNodes == 0) {
								// =====================================================
								var
								tagName = htmlEL.rawTagName
								attrs = htmlEL.rawAttrs;
								// =====================================================
								var tag = new htmlElement(tagName, attrs, '', nestingLevel)
								htmlObj.push(tag)
							} else {
								var tagName = htmlEL.rawTagName
								var attrs = htmlEL.rawAttrs
								let tag = new htmlElement(tagName, '', attrs, nestingLevel)
								htmlObj.push(tag)
								nestingLevel++
								for (let i = 0; i < htmlEL.childNodes.length; i++) {
									nesting(htmlEL.childNodes[i], nestingLevel)
								}
							}
						}
						
						// =====================================================
						const document = editor.document;
						const selection = editor.selection;
						
						let result = await vscode.window.showQuickPick([
							'altKey',
							'abort',
							'animationstart',
							'animationend',
							'animationiteration',
							'animationName',
							'afterprint',
							'bubbles',
							'beforeprint',
							'beforeunload',
							'button',
							'buttons',
							'blur',
							'cancelable',
							'currentTarget',
							'copy',
							'cut',
							'ctrlKey',
							'click',
							'change',
							'charCode',
							'clientX',
							'clientY',
							'canplay',
							'canplaythrough',
							'contextmenu',
							'defaultPrevented',
							'drag',
							'dragend',
							'dragenter',
							'dragleave',
							'dragover',
							'dragstart',
							'drop',
							'detail',
							'dblclick',
							'deltaX',
							'deltaY',
							'deltaZ',
							'deltaMode',
							'durationchange',
							'eventPhase',
							'error',
							'emptied',
							'ended',
							'elapsedTime',
							'hashchange',
							'pageshow',
							'pagehide',
							'paste',
							'pause',
							'play',
							'playing',
							'progress',
							'propertyName',
							'popstate',
							'persisted',
							'mouseover',
							'mouseleave',
							'mouseout',
							'mouseenter',
							'metaKey',
							'key',
							'keyCode',
							'keyup',
							'keydown',
							'keypress',
							'load',
							'loadeddata',
							'loadedmetadata',
							'loadstart',
							'location',
							'message',
							'unload',
							'open',
							'online',
							'offline',
							'oldURL',
							'resize',
							'reset',
							'relatedTarget',
							'ratechange',
							'storage',
							'show',
							'scroll',
							'search',
							'select',
							'submit',
							'screenX',
							'screenY',
							'shiftKey',
							'seeked',
							'seeking',
							'stalled',
							'suspend',
							'timeupdate',
							'transitionend',
							'toggle',
							'target',
							'timeStamp',
							'type',
							'touchstart',
							'touchmove',
							'touchend',
							'touchcancel',
							'volumechange',
							'view',
							'focus',
							'focusin',
							'focusout',
							'input',
							'invalid',
							'isTrusted',
							'newURL',
							'which',
							'wheel',
							'waiting'
						], {})
						
						// await vscode.window.showInformationMessage(`${result}`);
						
						
						let html = document.getText(selection);
						// =====================================================
						// =====================================================
						html = html.match(/<.+?>/g).join('')
						var root = HTMLParser.parse(html)
						// =====================================================
						
						
						
						root.childNodes.forEach((item) => {
							nesting(item, 0)
						})
						
						
						htmlObj.forEach((item) => {
							
							querySelector(item, declarations, 'single')
							
						});
						
						/* const tab = '    '
						htmlObj.forEach((item) => {
							
							var tabs = ''
							for (let i = 0; i < item.nestingLevel; i++) {
								tabs += tab
							}
							item.tabSize = tabs
						}); */
						
						for (let i = 0; i < declarations.length; i++) {
							// declarations[i] =  htmlObj[i].tabSize + 'const '+declarations[i]
							var declare = declarations[i].match(/([a-zA-Z\d-_]+)(?=\s=)/g)[0]
							
							declarations[i] = `const ${declarations[i]}
function ${result}On${declare[0].toUpperCase() + declare.substring(1)}(event) {
	console.log(event.type);
}
${declare}.addEventListener("${result}", ${result}On${declare[0].toUpperCase() + declare.substring(1)})
// =====================================================\n`
							
						}
						
						ncp.copy(declarations.join('\n'), function () {
							vscode.window.showInformationMessage("OK");
						})
						
					}
					
					
					
				})
				
				);
				
				
				// Selection with details
				// 
				/* 
				Может пригодится
				{
					"auto-close-tag.excludedTags": [
						"area",
						"base",
						"br",
						"col",
						"command",
						"embed",
						"hr",
						"img",
						"input",
						"keygen",
						"link",
						"meta",
						"param",
						"source",
						"track",
						"wbr"
					]
				}
				
				
				
				*/
				
				
				
				
				
			}
			// =====================================================
			function deactivate() {}
			
			module.exports = {
				activate,
				deactivate	
			}
			
