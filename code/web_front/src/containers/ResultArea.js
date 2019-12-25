import React, {forwardRef,useState,useRef,useEffect,useCallback} from 'react';
import ace from 'brace'
import 'brace/mode/rust';
import 'brace/theme/monokai';

function useEditorProp(editor, prop, whenPresent) {
  useEffect(() => {
    if (editor) {
			return whenPresent(editor, prop);
    }
  }, [editor, prop, whenPresent]);
}

const ResultArea = forwardRef((props,ref) => {
	const [editor, setEditor] = useState(null);
	const child = useRef(null);

	useEffect(() => {
		if (!child.current) { return; }
		const editor = ace.edit(child.current);
		setEditor(editor);
		//editor.getSession().setMode("ace/mode/bash");
		editor.setReadOnly(true);
		editor.renderer.setShowGutter(false);
		editor.getSession().setUseWrapMode(true)
	},[child]);

	useEditorProp(editor, props.theme, useCallback((editor, theme) => {
		editor.setTheme(`ace/theme/${theme}`);
	}, []));

	useEditorProp(editor, props.value, useCallback((editor, code) => {
		editor.setValue(code);
		editor.clearSelection();
	}, []));

	return (
		<div ref={child} style={{ position:'relative',width:'100%',height:'100%'}}>
    </div>
	);

});

export default ResultArea;
