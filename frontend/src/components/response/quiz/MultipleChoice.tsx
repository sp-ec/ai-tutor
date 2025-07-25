import React, { useState } from "react";
import { Button } from "../../ui/button";
import type { MultipleChoiceQuestion } from "@/types/response.types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction,
} from "../../ui/card";
import { FormItem, FormControl, FormLabel, FormField } from "../../ui/form";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import LatexText from "../../utils/LaTeXDisplay";

function MultipleChoice({
	data,
	form,
}: {
	data: MultipleChoiceQuestion;
	form: any;
}) {
	const [submitted, setSubmitted] = useState(false);
	const [selected, setSelected] = useState<string>("");

	return (
		<Card className="w-full mt-8">
			<CardHeader>
				<CardTitle>
					<LatexText content={data.question} />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									className="flex flex-col"
								>
									{data?.choices?.map((choice, index) => (
										<FormItem key={index} className="flex items-center gap-3">
											<FormControl>
												<RadioGroupItem
													value={choice.item}
													onClick={() => {
														setSelected(choice.item);
														field.onChange(choice.item);
													}}
												/>
											</FormControl>
											<FormLabel className="font-normal">
												<LatexText content={choice.item} />
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
						</FormItem>
					)}
				/>
			</CardContent>
			{/* {data.correct_answer_reason ? (
				<CardFooter className="flex-col gap-2 items-start">
					{submitted ? (
						<div className="w-full bg-zinc-100 rounded-lg p-8 border border-zinc-300">
							<LatexText content={`${data.correct_answer_reason}`} />
						</div>
					) : (
						<Button
							type="button"
							className=""
							onClick={() => setSubmitted(true)}
							disabled={!selected}
						>
							Submit
						</Button>
					)}
				</CardFooter>
			) : null} */}
		</Card>
	);
}

export default MultipleChoice;
