/*
 * xml-beautify - pretty-print text in XML formats.
 *
 * Copyright (c) 2018 Tom Misawa, riversun.org@gmail.com
 *
 * MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Usage:
 *
 *       const resultXmlText = new XmlBeautify().beautify(textInput.value,
 *       {
 *            indent: '  ',  //indent pattern like white spaces
 *            useSelfClosingElement: true //true:use self-closing element when empty element.
 *       });
 *
 * How "useSelfClosingElement" property works.
 *
 *   useSelfClosingElement:true
 *   <foo></foo> ==> <foo/>
 *
 *   useSelfClosingElement:false
 *   <foo></foo> ==> <foo></foo>
 *
*/

export namespace XmlBeautify {

    export interface XmlBeautifyOptions {
        indent?: string;
        useSelfClosingElement?: boolean;
    }

    export interface XmlBeautifyInitOptions {
        parser?: () => DOMParser;
    }

    export class XmlBeautify {
        constructor(option?: XmlBeautifyInitOptions)

        hasXmlDef(xmlText: string): boolean

        getEncoding(xmlText: string): string

        beautify(xmlText: string, data?: XmlBeautifyOptions): string
    }
}
