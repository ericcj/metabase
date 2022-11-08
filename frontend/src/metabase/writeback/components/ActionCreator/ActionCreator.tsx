import React, { useState, useMemo, useEffect } from "react";
import { t } from "ttag";
import _ from "underscore";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import Actions from "metabase/entities/actions";
import { getMetadata } from "metabase/selectors/metadata";
import { createQuestionFromAction } from "metabase/writeback/selectors";

import type {
  WritebackQueryAction,
  ActionFormSettings,
} from "metabase-types/api";
import type { State } from "metabase-types/store";
import Modal from "metabase/components/Modal";
import { SavedCard } from "metabase-types/types/Card";
import Button from "metabase/core/components/Button";
import Question from "metabase-lib/Question";

import type NativeQuery from "metabase-lib/queries/NativeQuery";
import type Metadata from "metabase-lib/metadata/Metadata";

import { ActionCreatorHeader } from "./ActionCreatorHeader";
import { QueryActionEditor } from "./QueryActionEditor";
import { FormCreator } from "./FormCreator";

import {
  ActionCreatorBodyContainer,
  ModalRoot,
  ModalFooter,
} from "./ActionCreator.styled";

import { newQuestion } from "./utils";

const mapStateToProps = (
  state: State,
  { action }: { action: WritebackQueryAction },
) => ({
  metadata: getMetadata(state),
  question: action ? createQuestionFromAction(state, action) : undefined,
  actionId: action ? action.id : undefined,
});

const mapDispatchToProps = {
  push,
};

interface ActionCreatorProps {
  metadata: Metadata;
  question?: Question;
  actionId?: number;
  modelId?: number;
  push: (url: string) => void;
  onClose?: () => void;
}

function ActionCreatorComponent({
  metadata,
  question: passedQuestion,
  actionId,
  modelId,
  push,
  onClose,
}: ActionCreatorProps) {
  const [question, setQuestion] = useState(
    passedQuestion ?? newQuestion(metadata),
  );
  const [formSettings, setFormSettings] = useState<
    ActionFormSettings | undefined
  >(undefined);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    setQuestion(passedQuestion ?? newQuestion(metadata));

    // we do not want to update this any time the props or metadata change, only if action id changes
  }, [actionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const defaultModelId: number | undefined = useMemo(() => {
    if (modelId) {
      return modelId;
    }
    const params = new URLSearchParams(window.location.search);
    const modelQueryParam = params.get("model-id");
    return modelId ? Number(modelQueryParam) : undefined;
  }, [modelId]);

  if (!question || !metadata) {
    return null;
  }

  const query = question.query() as NativeQuery;

  const afterSave = (action: SavedCard) => {
    setQuestion(question.setCard(action));
    setTimeout(() => setShowSaveModal(false), 1000);
    onClose?.();
  };

  const handleClose = () => setShowSaveModal(false);

  const isNew = !actionId && !(question.card() as SavedCard).id;

  return (
    <>
      <Modal onClose={onClose} formModal={false} wide>
        <ModalRoot>
          <ActionCreatorHeader
            type="query"
            name={question.displayName() ?? t`New Action`}
            onChangeName={newName =>
              setQuestion(q => q.setDisplayName(newName))
            }
          />

          <ActionCreatorBodyContainer>
            <QueryActionEditor question={question} setQuestion={setQuestion} />
            <FormCreator
              tags={query?.templateTagsWithoutSnippets()}
              formSettings={
                question?.card()?.visualization_settings as ActionFormSettings
              }
              onChange={setFormSettings}
            />
          </ActionCreatorBodyContainer>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button primary onClick={() => setShowSaveModal(true)}>
              Save
            </Button>
          </ModalFooter>
        </ModalRoot>
      </Modal>
      {showSaveModal && (
        <Modal onClose={handleClose}>
          <Actions.ModalForm
            title={isNew ? t`New action` : t`Save action`}
            form={isNew ? Actions.forms.saveForm : Actions.forms.updateForm}
            action={{
              id: (question.card() as SavedCard).id,
              name: question?.displayName() ?? t`New Action`,
              description: question.description(),
              model_id: defaultModelId,
              formSettings,
              question,
            }}
            onSaved={afterSave}
            onClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
}

export const ActionCreator = _.compose(
  Actions.load({
    id: (state: State, props: { actionId?: number }) => props.actionId,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(ActionCreatorComponent);
