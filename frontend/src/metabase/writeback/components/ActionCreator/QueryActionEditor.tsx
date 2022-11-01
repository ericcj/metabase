import React from "react";

import NativeQueryEditor from "metabase/query_builder/components/NativeQueryEditor";
import type Query from "metabase-lib/queries/Query";

import type Question from "metabase-lib/Question";
import { EditorContainer } from "./ActionCreator.styled";
import { DataReferenceTriggerButton } from "./InlineDataReference";

export function QueryActionEditor({
  question,
  setQuestion,
  toggleDataRef,
}: {
  question: Question;
  setQuestion: (q: Question) => void;
  toggleDataRef: () => void;
}) {
  return (
    <EditorContainer>
      <DataReferenceTriggerButton onClick={toggleDataRef} />
      <NativeQueryEditor
        query={question.query()}
        viewHeight="full"
        setDatasetQuery={(newQuery: Query) =>
          setQuestion(question.setQuery(newQuery))
        }
        enableRun={false}
        hasEditingSidebar={false}
        isNativeEditorOpen
        hasParametersList={false}
        resizable={false}
        readOnly={false}
        requireWriteback
      />
    </EditorContainer>
  );
}
