import styled from "@emotion/styled";
import { color } from "metabase/lib/colors";
import { space } from "metabase/styled-components/theme";

export const ActionCreatorRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 3.25rem);
`;

export const ActionCreatorBodyContainer = styled.div`
  display: flex;
  border-top: 1px solid ${color("border")};
  .react-resizable-handle {
    display: none;
  }
  flex: 1;
  overflow-y: auto;
`;

export const EditorContainer = styled.div`
  flex: 1 1 0;
  transition: flex 500ms ease-in-out;
  position: relative;
  margin-left: ${space(2)};
  overflow-y: auto;
`;
