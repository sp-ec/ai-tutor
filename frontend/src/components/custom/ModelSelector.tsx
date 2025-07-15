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

interface ModelSelectorProps {
	value: "gpt-4o" | "gpt-4" | "gpt-3.5-turbo";
	onChange: (value: "gpt-4o" | "gpt-4" | "gpt-3.5-turbo") => void;
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
				defaultValue="gpt-4o"
				onValueChange={(e) =>
					props.onChange(e as "gpt-4o" | "gpt-4" | "gpt-3.5-turbo")
				}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Model</SelectLabel>
						<SelectItem value={"gpt-4o"}>GPT-4o</SelectItem>
						<SelectItem value={"gpt-4"}>GPT-4</SelectItem>
						<SelectItem value={"gpt-3.5-turbo"}>GPT-3.5 Turbo</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FormItem>
	);
}
