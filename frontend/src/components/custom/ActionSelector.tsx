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

interface ActionSelectorProps {
	value: "explain" | "quiz" | "tutor";
	onChange: (value: "explain" | "quiz" | "tutor") => void;
	onBlur: () => void;
	name: string;
	ref: React.Ref<any>;
	disabled?: boolean;
}

export function ActionSelector(props: ActionSelectorProps) {
	return (
		<FormItem>
			{/* <FormLabel>Action</FormLabel> */}
			<Select
				defaultValue="explain"
				onValueChange={(e) => props.onChange(e as "explain" | "quiz" | "tutor")}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Action</SelectLabel>
						<SelectItem value={"explain"}>Explain</SelectItem>
						<SelectItem value={"quiz"}>Quiz</SelectItem>
						<SelectItem value={"tutor"}>Tutor</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormItem>
	);
}
