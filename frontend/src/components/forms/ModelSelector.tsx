import * as React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import type { OpenAIModel } from "@/types/openai.types";
import { OpenAIModelValues } from "@/types/openai.types";

interface ModelSelectorProps {
	value: OpenAIModel;
	onChange: (value: OpenAIModel) => void;
	onBlur: () => void;
	name: string;
	ref: React.Ref<any>;
	disabled?: boolean;
}

export function ModelSelector(props: ModelSelectorProps) {
	return (
		<FormItem>
			{/* <FormLabel>Model</FormLabel> */}
			<Select
				defaultValue={OpenAIModelValues[0]}
				onValueChange={(e) => props.onChange(e as OpenAIModel)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Model</SelectLabel>
						{Object.entries(OpenAIModelValues).map(([key, label]) => (
							<SelectItem key={key} value={label}>
								{label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormItem>
	);
}
