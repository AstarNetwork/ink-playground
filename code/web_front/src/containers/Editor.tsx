import React, {forwardRef,useImperativeHandle,useState,useRef,useEffect,useCallback} from 'react';
import ace from 'brace'
import 'brace/mode/rust';
import 'brace/theme/monokai';

function useEditorProp(editor:(ace.Editor | null), prop: any, whenPresent: any) {
  useEffect(() => {
    if (editor) {
			return whenPresent(editor, prop);
    }
  }, [editor, prop, whenPresent]);
}

type PropType = {
	value: string,
	theme: string,
	style: any,
}
const Editor = forwardRef((props: PropType, ref) => {
	const [editor, setEditor] = useState<ace.Editor | null>(null);
	const child = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref ,()=>({
		getValue: () => {if(editor){return editor.getValue();}},
	}));

	useEffect(() => {
    if (!child.current) { return; }

    const editor = ace.edit(child.current);
    editor.getSession().setMode("ace/mode/rust");

    setEditor(editor);
  }, [child]);

	useEffect(() => {
    if(editor!==null){
      editor.resize();
    }
  });

  useEditorProp(editor, props.theme, useCallback((editor:ace.Editor, theme:string) => {
		editor.setTheme(`ace/theme/${theme}`);
  },[]));

	useEditorProp(editor, props.value, useCallback((editor:ace.Editor, code:string) => {
		editor.setValue(code);
		editor.clearSelection();
	},[]));

	return (
		<div ref={child} style={{ position:'relative',width: '100%',height:'100%'}}>
			[]
		</div>
	);

});

export default Editor;
