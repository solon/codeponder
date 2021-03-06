import React, { useContext } from "react";
import { CreateCodeReviewQuestionComponent } from "../../../../generated/apollo-components";
import { EditorSubmitProps } from "../../../../types/questionReplyTypes";
import { PostContext } from "../PostContext";
import { TextEditor, TextEditorResult } from "./CommentForm";

export interface CreateQuestionProps {
  onEditorSubmit: (T: EditorSubmitProps) => void;
  isReply: boolean;
  lineNum?: number;
  view: "code-view" | "repo-view";
}

export const CreateQuestion = ({
  onEditorSubmit,
  ...props
}: CreateQuestionProps) => {
  const { code, path, postId, lang } = useContext(PostContext);
  return (
    <CreateCodeReviewQuestionComponent>
      {mutate => {
        const submitForm = async ({
          cancel,
          lineNum,
          text,
          title,
        }: TextEditorResult) => {
          if (!cancel) {
            // save result
            const response = await mutate({
              variables: {
                codeReviewQuestion: {
                  lineNum,
                  codeSnippet:
                    !code || !lineNum
                      ? null
                      : code
                          .split("\n")
                          .slice(
                            Math.max(1, lineNum - 5),
                            Math.min(code.length, lineNum + 5)
                          )
                          .join("\n"),
                  text,
                  title,
                  path,
                  postId,
                  programmingLanguage: lang,
                },
              },
            });

            console.log(response);

            onEditorSubmit({
              submitted: true,
              response:
                response &&
                response.data!.createCodeReviewQuestion.codeReviewQuestion,
            });
          } else {
            onEditorSubmit({ submitted: false });
          }
        };
        return <TextEditor {...props} submitForm={submitForm} />;
      }}
    </CreateCodeReviewQuestionComponent>
  );
};
