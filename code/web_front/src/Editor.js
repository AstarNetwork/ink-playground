import React, {forwardRef,useImperativeHandle,useState,useRef,useEffect,useCallback} from 'react';
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

const Editor = forwardRef((props,ref) => {
	const [editor, setEditor] = useState(null);
	const child = useRef(null);

	useImperativeHandle( ref,()=>({
		getValue: () => {return editor.getValue();},
	}));
	
	useEffect(() => {
    if (!child.current) { return; }

    const editor = ace.edit(child.current);
    editor.getSession().setMode("ace/mode/rust");
    console.log(Infinity);

    setEditor(editor);
  }, [child]);

	useEffect(() => {
    if(editor!==null){
      editor.resize();
    }
  });

  useEditorProp(editor, props.theme, useCallback((editor, theme) => {
		editor.setTheme(`ace/theme/${theme}`);
  },[]));

	useEditorProp(editor, props.value, useCallback((editor, code) => {
		editor.setValue(code);
		editor.clearSelection();
	},[]));

	return (
		<div ref={child} style={{ position:'relative',width: '100%',height:'100%'}}> </div>
	);

});

export default Editor;
