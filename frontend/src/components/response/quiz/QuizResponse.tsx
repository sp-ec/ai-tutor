import React from 'react'
import type { Quiz, MultipleChoiceQuestion, FreeResponseQuestion } from "@/types/response.types";
import MultipleChoice from './MultipleChoice';

function QuizResponse({ data }: { data: Quiz | null }) {
  return (
    <>
      {data?.multiple_choice_questions?.map((question: MultipleChoiceQuestion, index: number) => (
        <MultipleChoice data={question} key={`step-${index}`} />
      ))}
    </>
    
  )
}

export default QuizResponse