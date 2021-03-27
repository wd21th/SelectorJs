const vscode = require('vscode');
const ncp = require("copy-paste");
var HTMLParser = require('node-html-parser');

/**
* @param {vscode.ExtensionContext} context
*/

function activate (context) {
    
    
    class parentElement {
        constructor(tagName, attrsObj) {
            this.tagName = tagName
            this.attrs = attrsObj
        }
        
    }
    
    class htmlElement {
        constructor(tagName, tabSize, attrsObj, nestingLevel, parentEl) {
            this.tagName = tagName
            this.tabSize = tabSize
            this.attrs = attrsObj
            this.nestingLevel = nestingLevel
            this.parentEl = parentEl
        }
    }
    
    function tabPlus (nestingLevel, tabs) {
        var tab = '    '
        for (let i = 0; i < nestingLevel; i++) {
            tabs += tab
        }
        return tabs;
    }
    
    function setAttributes (attrs, attrsObj) {
        for (let i = 0; i < attrs.match(/([a-zA-Z\d-_]+)(?==)/g).length; i++) {
            // attrs[attributeName] = value
            var
                attributeName = attrs.match(/([a-zA-Z\d-_]+)(?==)/g)[i],
                attributeValue = attrs.match(/".+?"/g)[i];
            
            attrsObj[attributeName] = attributeValue
        }
    }
    
    
    function nesting (htmlEl, arr, nestingLevel, parent) {
        
        if (htmlEl.childNodes == 0) {
            var
                tagName = htmlEl.rawTagName
            attrs = htmlEl.rawAttrs,
                attrsObj = {},
                tabs = '';
            if (attrs != '') {
                setAttributes(attrs, attrsObj)
            }
            // setAttributes(attrs, attrsObj)
            // tabs = tabPlus(nestingLevel,tabs)
            if (parent) {
                var tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent)
                
                arr.push(tag)
            } else {
                
                var tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel)
                
                arr.push(tag)
            }
            
            
            
        } else {
            
            var
                tagName = htmlEl.rawTagName
            attrs = htmlEl.rawAttrs,
                attrsObj = {},
                tabs = '';
            if (attrs != '') {
                setAttributes(attrs, attrsObj)
            }
            // tabPlus(nestingLevel,tabs)
            
            if (parent) {
                var tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent)
                
                arr.push(tag)
                
                
                let parentEl = new parentElement(tagName, attrsObj);
                nestingLevel++
                for (let i = 0; i < htmlEl.childNodes.length; i++) {
                    nesting(htmlEl.childNodes[i], arr, nestingLevel, parentEl)
                }
                
                
            } else {
                var tag = new htmlElement(tagName, tabs, attrsObj, nestingLevel, parent)
                arr.push(tag)
                let parentEl = new parentElement(tagName, attrsObj)
                nestingLevel++
                for (let i = 0; i < htmlEl.childNodes.length; i++) {
                    nesting(htmlEl.childNodes[i], arr, nestingLevel, parentEl)
                }
            }
            
            
            
        }
        
    }
    
    function checkIdVarName (idValue) {
        
        // Select without quotes
        let varableName = idValue.replace(/"/g, '')
        // =====================================================
        // If idValue beifin with numbers
        if (varableName.match(/^\d+/m)) {
            const lengthOfDigits = varableName.match(/^\d+/m)[0].length
            varableName = varableName.substring(lengthOfDigits)
        }
        // =====================================================
        // If idValue separated with -
        if (varableName.match(/-/g)) {
            varableName = varableName.split("-")
            for (let j = 1; j < varableName.length; j++) {
                varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
            }
            varableName = varableName.join('')
        }
        return varableName;

    }
    
    function checkClassVarName (classValue) {
        
        classValue = classValue.replace(/"/g, '')

        if (classValue.match(/\s/g)) {
            var classes = classValue.split(" ")
    
            classes.filter(element => element != '')
    
            classValue = classes[0]
            // console.log(classValue);
        }


        let varableName = classValue
        if (varableName.match(/^\d+/m)) {
            const lengthOfDigits = varableName.match(/^\d+/m)[0].length
            varableName = varableName.substring(lengthOfDigits)
        }
        // console.log(varableName);

        if (varableName.match(/-/g)) {
            varableName = varableName.split("-")
    
            varableName.filter(element => element != '')
    
            for (let j = 1; j < varableName.length; j++) {
                varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
            }
            varableName = varableName.join('')
        }

        return varableName;

    }

    function buttonCorrect(item, arr) {
        let keys = Object.keys(item.attrs)
        if (keys.includes('id')) {
    var varableName = checkIdVarName(item.attrs['id'])
    var btnId = item.attrs['id'].replace(/"/g, '')
    
var varable = `btn${varableName} = document.querySelector('${item.tagName}#${btnId}')`
                            arr.push(varable)


        }else if (keys.includes('type')) {
var varableName = checkIdVarName(item.attrs['type'])
var btnType = item.attrs['type']
    
var varable = `btn${varableName} = document.querySelector('${item.tagName}[type="${btnType}"]')`
arr.push(varable)
            
        }else if(keys.includes('value')) {
var varableName = checkIdVarName(item.attrs['value'])
var btnValue = item.attrs['value']
    
var varable = `btn${varableName} = document.querySelector('${item.tagName}[value="${btnValue}"]')`
arr.push(varable)
                        
                } else if(keys.includes('name')) {
                
var varableName = checkIdVarName(item.attrs['name'])
var btnName = item.attrs['name']
    
var varable = `btn${varableName} = document.querySelector('${item.tagName}[name="${btnName}"]')`
arr.push(varable)
                                    
            }else {
                var varable = `btn = document.querySelector('${item.tagName}')`
                            arr.push(varable)
            }

    }
    
    function qs (item, arr) {
        let keys = Object.keys(item.attrs)
        if(keys.includes('id')) {
            let varableName = checkIdVarName(item.attrs['id'])
let id = item.attrs['id'].replace(/\"/g, '')
let varable = `${varableName} = document.getElementById('${id}')`
arr.push(varable)
        }else if(keys.includes('class')) {
            let varableName = checkClassVarName(item.attrs['class'])
let classV = item.attrs['class'].replace(/\"/g, '')
let varable = `${varableName} = document.querySelector('.${classV}')`
arr.push(varable)
        }else {
            let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
            arr.push(varable)
        }
    }
// =====================================================


    function buttonAllCorrect(item, arr) {
        
        let keys = Object.keys(item.attrs)
        if (keys.includes('id')) {
    var varableName = checkIdVarName(item.attrs['id'])
    var btnId = item.attrs['id'].replace(/"/g, '')
    
var varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}#${btnId}')`
                            arr.push(varable)


        }else if (keys.includes('type')) {
var varableName = checkIdVarName(item.attrs['type'])
var btnType = item.attrs['type']
    
var varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[type="${btnType}"]')`
arr.push(varable)
            
        }else if(keys.includes('value')) {
var varableName = checkIdVarName(item.attrs['value'])
var btnValue = item.attrs['value']
    
var varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[value="${btnValue}"]')`
arr.push(varable)
                        
                } else if(keys.includes('name')) {
                
var varableName = checkIdVarName(item.attrs['name'])
var btnName = item.attrs['name']
    
var varable = `btn${varableName}s = document.querySelectorAll('${item.tagName}[name="${btnName}"]')`
arr.push(varable)
                                    
            }else {
                var varable = `btns = document.getElementsByTagName('${item.tagName}')`
                            arr.push(varable)
            }

    
    }


    function qsa(item, arr) {
        let keys = Object.keys(item.attrs)
        if(keys.includes('id')) {
            let varableName = checkIdVarName(item.attrs['id'])
let id = item.attrs['id'].replace(/\"/g, '')
let varable = `${varableName}s = document.querySelectorAll('#${id}')`
arr.push(varable)
        }else if(keys.includes('class')) {
            let varableName = checkClassVarName(item.attrs['class'])
let classV = item.attrs['class'].replace(/\"/g, '')
let varable = `${varableName}s = document.getElementsByClassName('${classV}')`
arr.push(varable)
        }else if(keys.includes('name')) {
            
            let varableName = checkIdVarName(item.attrs['id'])
let name = item.attrs['name'].replace(/\"/g, '')
let varable = `${varableName}s = document.getElementsByName('${name}')`
arr.push(varable)
        
        } else {
            let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`
            arr.push(varable)
        }
    }




    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.ce', function () {
            let htmlObjs = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                
                // =====================================================
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {
                    
                    nesting(item, htmlObjs, 0, null)
                    
                });
                
                let createElement = []
                htmlObjs.forEach((item) => {
                    createElement.push(`const ${item.tagName} = document.createElement('${item.tagName}')`)
                    // setAttribute("${key}",${item.attrs[key]})`)
                    for (const key in item.attrs) {
                        if (key == 'class') {
                            if (item.attrs[key].match(/\s/g)) {
                                
                                var classes = item.attrs[key].replace(/"/g, '').split(" ")
                                for (let i = 0; i < classes.length; i++) {
                                    createElement.push(`${item.tagName}.classList.add("${classes[i]}")`)
                                }
                            } else {
                                createElement.push(`${item.tagName}.classList.add("${item.attrs[key].replace(/"/g, '')}")`)
                            }
                            
                        } else {
                            createElement.push(`${item.tagName}.setAttribute("${key}",${item.attrs[key]})`)
                            
                        }
                    }
                    
                    if (item.parentEl) {
                        /* for (const key in item.parent.attrs) {
                            
                        } */
                        var keys = Object.keys(item.parentEl.attrs)
                        
                        if (keys.includes('id')) {
                            createElement.push(`document.querySelector('${item.parentEl.tagName}#${item.parentEl.attrs["id"].replace(/"/g, '')}').appendChild(${item.tagName})`)
                        } else if (keys.includes('class')) {
                            
                            if (item.parentEl.attrs["class"].match(/\s/g)) {
                                var fstClass = item.parentEl.attrs["class"].replace(/"/g, '').split(' ')[0]
                                createElement.push(`document.querySelector('${item.parentEl.tagName}.${fstClass}').appendChild(${item.tagName})`)
                            } else {
                                var fstClass = item.parentEl.attrs["class"].replace(/"/g, '')
                                createElement.push(`document.querySelector('${item.parentEl.tagName}.${fstClass}').appendChild(${item.tagName})`)
                                
                            }
                        } else {
                            createElement.push(`document.querySelector('${item.parentEl.tagName}').appendChild(${item.tagName})`)
                        }
                        
                        
                    } else {
                        createElement.push(`document.body.appendChild(${item.tagName})`)
                    }
                    
                    createElement.push('//=====================================================')
                });
                
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, createElement.join('\n'));
                });
                
            }
            
            
        })
        
        
        
        
    );
        
    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.qsby', async function () {
                
            let htmlObjs = []
            let declarations = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {
                        
                    nesting(item, htmlObjs, 0, null)
                        
                });
                    
                let result = await vscode.window.showQuickPick([
                    'id',
                    'class',
                    'tagName'
                ])
                    
                htmlObjs.forEach((item) => {
                    if (result == 'id') {
                        if (item.attrs[result]) {
                            let varableName = item.attrs[result].replace(/"/g, '')
                            // =====================================================
                            if (varableName.match(/^\d+/m)) {
                                const lengthOfDigits = varableName.match(/^\d+/m)[0].length
                                varableName = varableName.substring(lengthOfDigits)
                            }
                            // =====================================================
                            if (varableName.match(/-/g)) {
                                varableName = varableName.split("-")
                                for (let j = 1; j < varableName.length; j++) {
                                    varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
                                }
                                varableName = varableName.join('')
                            }
                            // =====================================================
                            let varable = `${varableName} = document.getElementById('${item.attrs[result].replace(/"/g, '')}')`
                            declarations.push(varable)
                        }
                    } else if (result == 'class') {
                            
                        if (item.attrs[result]) {
                            let classValue = item.attrs[result].replace(/"/g, '')
                                
                            if (classValue.match(/\s/g)) {
                                var classes = classValue.split(" ")
                                    
                                classes.filter(element => element != '')
                                    
                                classValue = classes[0]
                                // console.log(classValue);
                            }
                                
                                
                            let varableName = classValue
                            if (varableName.match(/^\d+/m)) {
                                const lengthOfDigits = varableName.match(/^\d+/m)[0].length
                                varableName = varableName.substring(lengthOfDigits)
                            }
                            // console.log(varableName);
                                
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
                                
                            //  
                        }
                    } else if (result == 'tagName') {
                        let varable = `${item.tagName} = document.querySelector('${item.tagName}')`
                        declarations.push(varable)
                    }
                        
                });
                    
                for (let i = 1; i < declarations.length; i++) {
                    declarations[i] = htmlObjs[i].tabSize + declarations[i]
                }
                let finalString;
                if (declarations.length == 1) {
                    finalString = 'const ' + declarations[0]
                } else {
                    finalString = 'const \n' + declarations.join(",\n")
                }
                    
                ncp.copy(finalString, function () {
                    vscode.window.showInformationMessage("OK");
                })
                    
                    
                    
                    
            }
                
                
        })
    )
            
    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.qsaby', async function () {
                    
            let htmlObjs = []
            let declarations = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {
                            
                    nesting(item, htmlObjs, 0, null)
                            
                });
                        
                let result = await vscode.window.showQuickPick([
                    'id',
                    'class',
                    'name',
                    'tagName'
                ])
                        
                htmlObjs.forEach((item) => {
                    if (result == 'id') {
                        if (item.attrs[result]) {
                            let varableName = item.attrs[result].replace(/"/g, '')
                            // =====================================================
                            if (varableName.match(/^\d+/m)) {
                                const lengthOfDigits = varableName.match(/^\d+/m)[0].length
                                varableName = varableName.substring(lengthOfDigits)
                            }
                            // =====================================================
                            if (varableName.match(/-/g)) {
                                varableName = varableName.split("-")
                                for (let j = 1; j < varableName.length; j++) {
                                    varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
                                }
                                varableName = varableName.join('')
                            }
                            // =====================================================
                            let varable = `${varableName}s = document.querySelectorAll('#${item.attrs[result].replace(/"/g, '')}')`
                            declarations.push(varable)
                        }
                    } else if (result == 'class') {
                                
                        if (item.attrs[result]) {
                            let classValue = item.attrs[result].replace(/"/g, '')
                                    
                            if (classValue.match(/\s/g)) {
                                var classes = classValue.split(" ")
                                        
                                classes.filter(element => element != '')
                                        
                                classValue = classes[0]
                                // console.log(classValue);
                            }
                                    
                                    
                            let varableName = classValue
                            if (varableName.match(/^\d+/m)) {
                                const lengthOfDigits = varableName.match(/^\d+/m)[0].length
                                varableName = varableName.substring(lengthOfDigits)
                            }
                            // console.log(varableName);
                                    
                            if (varableName.match(/-/g)) {
                                varableName = varableName.split("-")
                                        
                                varableName.filter(element => element != '')
                                        
                                for (let j = 1; j < varableName.length; j++) {
                                    varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
                                }
                                varableName = varableName.join('')
                            }
                                    
                            let varable = `${varableName}s = document.getElementsByClassName('${classValue}')`
                            declarations.push(varable)
                                    
                            //  
                        }
                    } else if (result == 'name') {
                                
                                
                                
                        if (item.attrs[result]) {
                            let varableName = item.attrs[result].replace(/"/g, '')
                            // =====================================================
                            if (varableName.match(/^\d+/m)) {
                                const lengthOfDigits = varableName.match(/^\d+/m)[0].length
                                varableName = varableName.substring(lengthOfDigits)
                            }
                            // =====================================================
                            if (varableName.match(/-/g)) {
                                varableName = varableName.split("-")
                                for (let j = 1; j < varableName.length; j++) {
                                    varableName[j] = varableName[j].charAt(0).toUpperCase() + varableName[j].substring(1)
                                }
                                varableName = varableName.join('')
                            }
                            // =====================================================
                            let varable = `${varableName}s = document.getElementsByName('${item.attrs[result].replace(/"/g, '')}')`
                            declarations.push(varable)
                        }
                                
                                
                                
                                
                                
                    } else if (result == 'tagName') {
                        let varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`
                        declarations.push(varable)
                    }
                            
                });
                        
                for (let i = 1; i < declarations.length; i++) {
                    declarations[i] = htmlObjs[i].tabSize + declarations[i]
                }
                let finalString;
                if (declarations.length == 1) {
                    finalString = 'const ' + declarations[0]
                } else {
                    finalString = 'const \n' + declarations.join(",\n")
                }
                        
                ncp.copy(finalString, function () {
                    vscode.window.showInformationMessage("OK");
                })
                        
                        
                        
                        
            }
                    
                    
        })
    )
                
                
                
    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.qswd', function () {
                        
            let htmlObjs = []
            let declarations = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                            
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {

                    nesting(item, htmlObjs, 0, null)

                });
                            
                htmlObjs.forEach((item) => {
    
                    const keys = Object.keys(item.attrs)
                    if (keys.includes('id')) {
                        // =====================================================
                        let varableName = checkIdVarName(item.attrs['id'])
                        // =====================================================
                        if (item.parentEl) {
                            var tagNameOfParent = item.parentEl.tagName

                            if (Object.keys(item.parentEl.attrs).length != 0) {
            
                
                                var attrsOfParent = item.parentEl.attrs
                                var keysOfParent = Object.keys(attrsOfParent)
                                if (keysOfParent.includes('id')) {

                                    var parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '')
                                    var childIdAttrsV = item.attrs['id'].replace(/"/g, '')
                
                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}#${childIdAttrsV}')`
                                    declarations.push(varable)





                                } else if (keysOfParent.includes('class')) {
                                    var parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '')
                
                                    if (parentclassAttrsV.match(/\s/g)) {
                                        var classes = parentclassAttrsV.split(" ")
						
                                        classes.filter(element => element != '')
						
                                        parentclassAttrsV = classes[0]
                                    }

                                    var childIdAttrsV = item.attrs['id'].replace(/"/g, '')

                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}#${childIdAttrsV}')`
                                    declarations.push(varable)


                                }
                            } else {
                                var childIdAttrsV = item.attrs['id'].replace(/"/g, '')
                                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}#${childIdAttrsV}')`
                                declarations.push(varable)

                            }
                        } else {
                            let varable = `${varableName} = document.querySelector('${item.tagName}#${item.attrs['id'].replace(/"/g, '')}')`
                            declarations.push(varable)
                        }
        


                        // =====================================================


                    } else if (keys.includes('class')) {
                        let varableName = checkClassVarName(item.attrs['class'])
        

                        if (item.parentEl) {
                            var tagNameOfParent = item.parentEl.tagName

                            if (Object.keys(item.parentEl.attrs).length != 0) {
                                // =====================================================
                                var attrsOfParent = item.parentEl.attrs
                                var keysOfParent = Object.keys(attrsOfParent)

                                if (keysOfParent.includes('id')) {

                                    var parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '')
                                    var childClassAttrsV = item.attrs['class'].replace(/"/g, '')
                
                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}.${childClassAttrsV}')`
                                    declarations.push(varable)





                                } else if (keysOfParent.includes('class')) {
                                    var parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '')
                
                                    if (parentclassAttrsV.match(/\s/g)) {
                                        var classes = parentclassAttrsV.split(" ")
						
                                        classes.filter(element => element != '')
						
                                        parentclassAttrsV = classes[0]
                                    }

                                    var childClassAttrsV = item.attrs['class'].replace(/"/g, '')

                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}.${childClassAttrsV}')`
                                    declarations.push(varable)


                                }
                                // =====================================================
                            } else {
                
                                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}.${item.attrs['class'].replace(/"/g, '')}')`
                                declarations.push(varable)
                            }
            

                        } else {
                            let varable = `${varableName} = document.querySelector('${item.tagName}.${item.attrs['class'].replace(/"/g, '')}')`
                            declarations.push(varable)
                        }
        



                    } else {
                        let varableName = item.tagName

                        if (item.parentEl) {
                            var tagNameOfParent = item.parentEl.tagName
                            if (Object.keys(item.parentEl.attrs).length != 0) {
                                var attrsOfParent = item.parentEl.attrs
                
                                var keysOfParent = Object.keys(attrsOfParent)
    
                                if (keysOfParent.includes('id')) {
    
                                    var parentIdAttrsV = attrsOfParent['id'].replace(/"/g, '')
                    
                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}#${parentIdAttrsV} ${item.tagName}')`
                                    declarations.push(varable)
    
    
    
    
    
                                } else if (keysOfParent.includes('class')) {
                                    var parentclassAttrsV = attrsOfParent['class'].replace(/"/g, '')
                    
                                    if (parentclassAttrsV.match(/\s/g)) {
                                        var classes = parentclassAttrsV.split(" ")
                            
                                        classes.filter(element => element != '')
                            
                                        parentclassAttrsV = classes[0]
                                    }
    
    
                                    let varable = `${varableName} = document.querySelector('${tagNameOfParent}.${parentclassAttrsV} ${item.tagName}')`
                                    declarations.push(varable)
    
    
                                }
                
                            } else {
                
                                let varable = `${varableName} = document.querySelector('${tagNameOfParent} ${item.tagName}')`
                                declarations.push(varable)

                            }

                        } else {
                            let varable = `${varableName} = document.querySelector('${item.tagName}')`
                            declarations.push(varable)
                        }

                    }


                });
                        

                const tab = '    '
                htmlObjs.forEach((item) => {
					
                    var tabs = ''
                    for (let i = 0; i < item.nestingLevel; i++) {
                        tabs += tab
                    }
                    item.tabSize = tabs
                });
                            
                for (let i = 0; i < declarations.length; i++) {
                    declarations[i] = htmlObjs[i].tabSize + declarations[i]
                }
                            
                let finalString;
                if (declarations.length == 1) {
                    finalString = 'const ' + declarations.join(",\n")
                } else {
                    finalString = 'const \n' + declarations.join(",\n")
                }
                ncp.copy(finalString, function () {
                    vscode.window.showInformationMessage("OK");
                })

            }
                        
                        
                        
        })
                    
                    
    )
                    



                    
    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.qs', function () {
            
            let htmlObjs = []
            let declarations = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {

                    nesting(item, htmlObjs, 0, null)

                });
                            
                htmlObjs.forEach((item) => {
                    
                    if (Object.keys(item.attrs).length != 0) {
if (item.tagName == 'button') {
    buttonCorrect(item, declarations)
}else {
    qs(item, declarations)
}
                        
                    }else {

                        if (item.tagName == 'button') {
                            var varable = `btn = document.querySelector('${item.tagName}')`
                            declarations.push(varable)
                        } else {
                        
                            var varable = `${item.tagName} = document.querySelector('${item.tagName}')`
                            declarations.push(varable)
                        }
                    }


                })

const tab = '    '
                htmlObjs.forEach((item) => {
					
                    var tabs = ''
                    for (let i = 0; i < item.nestingLevel; i++) {
                        tabs += tab
                    }
                    item.tabSize = tabs
                });
                            
                for (let i = 0; i < declarations.length; i++) {
                    declarations[i] = htmlObjs[i].tabSize + declarations[i]
                }
                            
                let finalString;
                if (declarations.length == 1) {
                    finalString = 'const ' + declarations.join(",\n")
                } else {
                    finalString = 'const \n' + declarations.join(",\n")
                }
                ncp.copy(finalString, function () {
                    vscode.window.showInformationMessage("OK");
                })



            }

    })

    )

    
    context.subscriptions.push(
        vscode.commands.registerCommand('selector-js.qsa', function () {
            
            let htmlObjs = []
            let declarations = []
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const selection = editor.selection;
                let html = document.getText(selection);
                // =====================================================
                html = html.match(/<.+?>/g).join('')
                var root = HTMLParser.parse(html)
                // =====================================================
                root.childNodes.forEach((item) => {

                    nesting(item, htmlObjs, 0, null)

                });
                            
                htmlObjs.forEach((item) => {
                    
                    if (Object.keys(item.attrs).length != 0) {
if (item.tagName == 'button') {
    buttonAllCorrect(item, declarations)
}else {
    qsa(item, declarations)
}
                        
                    }else {

                        if (item.tagName == 'button') {
                            var varable = `btns = document.getElementsByTagName('${item.tagName}')`
                            declarations.push(varable)
                        } else {
                        
                            var varable = `${item.tagName}s = document.getElementsByTagName('${item.tagName}')`
                            declarations.push(varable)
                        }
                    }


                })

const tab = '    '
                htmlObjs.forEach((item) => {
					
                    var tabs = ''
                    for (let i = 0; i < item.nestingLevel; i++) {
                        tabs += tab
                    }
                    item.tabSize = tabs
                });
                            
                for (let i = 0; i < declarations.length; i++) {
                    declarations[i] = htmlObjs[i].tabSize + declarations[i]
                }
                            
                let finalString;
                if (declarations.length == 1) {
                    finalString = 'const ' + declarations.join(",\n")
                } else {
                    finalString = 'const \n' + declarations.join(",\n")
                }
                ncp.copy(finalString, function () {
                    vscode.window.showInformationMessage("OK");
                })



            }

    })

    )


    context.subscriptions.push(
				
				vscode.commands.registerCommand('selector-js.qswe', async function () {
					
					
					let htmlObjs = []
					let declarations = []
					const editor = vscode.window.activeTextEditor;
					// =====================================================
					if (editor) {
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
                    nesting(item, htmlObjs, 0, null)
						})
						
						
						htmlObjs.forEach((item) => {
							
							qs(item, declarations)
							
						});
						
						
						for (let i = 0; i < declarations.length; i++) {
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
				

                    
                }
                
                function deactivate() {}
                
                module.exports = {
                    activate,
                    deactivate	
                }
                
                
