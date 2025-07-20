import "katex/dist/katex.min.css";
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
import { useEffect, useRef } from "react";

type Props = {
	content: string;
};

const LatexText = ({ content }: Props) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			renderMathInElement(ref.current, {
				delimiters: [
					{ left: "$$", right: "$$", display: true },
					{ left: "\\[", right: "\\]", display: true },
					{ left: "\\(", right: "\\)", display: false },
				],
				throwOnError: false,
			});
		}
	}, [content]);

	return <div ref={ref}>{content}</div>;
};

export default LatexText;
