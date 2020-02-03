import React, {forwardRef,useState,useRef,useEffect,useCallback} from 'react';
import ace from 'brace'
import 'brace/mode/rust';
import 'brace/theme/monokai';

function useEditorProp(editor: (ace.Editor | null) , prop: any, whenPresent: any){
	useEffect(()=>{
	    if (editor) {
			return whenPresent(editor, prop);
		}
	}, [editor, prop, whenPresent]);
}

type PropType = {
	value: string;
	theme: string;
}

const ResultArea = forwardRef((props: PropType ,ref) => {
	const [editor, setEditor] = useState<ace.Editor | null>(null);
	const child = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (child && child.current){
			const editor_ = ace.edit(child.current);
			setEditor(editor_);
			//editor.getSession().setMode("ace/mode/bash");
			editor_.setReadOnly(true);
			editor_.renderer.setShowGutter(false);
			editor_.getSession().setUseWrapMode(true)
		}
	},[child]);

	useEditorProp(editor , props.theme, useCallback((editor : ace.Editor, theme : string) => {
		editor.setTheme(`ace/theme/${theme}`);
	}, []));

	useEditorProp(editor, props.value, useCallback((editor: ace.Editor, code: string) => {
		editor.setValue(code);
		editor.clearSelection();
	}, []));

	return (
		<div ref={child} style={{ position:'relative',width:'100%',height:'100%'}}>
    </div>
	);

});

export default ResultArea;
