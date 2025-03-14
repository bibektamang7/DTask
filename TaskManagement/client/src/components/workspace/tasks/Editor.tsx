import { useCallback, useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelection,
	$isRangeSelection,
	$createParagraphNode,
	$createTextNode,
	$isTextNode,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import type { HeadingTagType } from "@lexical/rich-text";
import {
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical";
import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Code,
	Link,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	X,
	Undo,
	Redo,
	ChevronDown,
	Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "@/components/editor/toolbar";
import { useTaskUpdate } from "@/hooks/customs/useTaskUpdate";
import Loader from "@/components/Loader";

const ToolbarPlugin = ({
	taskId,
	initialContent,
}: {
	taskId: string;
	initialContent: string;
}) => {
	const [editor] = useLexicalComposerContext();
	const [prevEditorState, setPrevEditorState] = useState(
		editor.getEditorState()
	);
	useEffect(() => {
		const content = editor.parseEditorState(initialContent);
		editor.setEditorState(content);
	}, []);

	const { handleUpdate, taskUpdateLoading } = useTaskUpdate();
	const handleSaveEditorData = async () => {
		if (
			JSON.stringify(editor.getEditorState().toJSON()) !==
			JSON.stringify(prevEditorState.toJSON())
		) {
			const response = await handleUpdate(taskId, {
				taskEditorData: JSON.stringify(editor.getEditorState()),
			});
			if (response) {
				setPrevEditorState(editor.getEditorState());
			}
		}
	};
	const formatParagraph = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
			}
		});
	}, [editor]);

	const toggleLink = () => {
		editor.update(() => {
			const selection = $getSelection();

			if (selection && !selection.isCollapsed()) {
				const nodes = selection.getNodes();

				const isLink = nodes.some((node) => $isLinkNode(node.getParent()));

				if (isLink) {
					editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
				} else {
					const url = selection.getTextContent();
					if (
						url.match(
							`(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?`
						)
					) {
						editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
					}
				}
			}
		});
	};

	const formatHeading = useCallback(
		(headingSize: HeadingTagType) => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createHeadingNode(headingSize));
				}
			});
		},
		[editor]
	);

	const formatBulletList = useCallback(() => {
		editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
	}, [editor]);

	const formatNumberedList = useCallback(() => {
		editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
	}, [editor]);

	const formatQuote = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createQuoteNode());
			}
		});
	}, [editor]);

	const formatCode = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			console.log(selection);
			if ($isRangeSelection(selection)) {
				if (selection.isCollapsed()) {
					$setBlocksType(selection, () => new CodeNode());
				} else {
					const textContent = selection.getTextContent();
					const codeNode = new CodeNode();
					codeNode.append($createTextNode(textContent));
					selection.insertNodes([codeNode]);
				}
			}
		});
	}, [editor]);

	const clearFormatting = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
				selection.getNodes().forEach((node) => {
					if ($isTextNode(node)) {
						node.setFormat(0);
						node.setStyle("");
						node.setMode("normal");
					}
				});
			}
		});
	}, [editor]);

	const formatAlign = useCallback(
		(alignment: string) => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					selection.getNodes().forEach((node) => {
						if (
							node.getType() === "paragraph" ||
							node.getType() === "heading"
						) {
							(node as any).setFormat(alignment);
						}
					});
				}
			});
		},
		[editor]
	);

	return (
		<Toolbar>
			<div className="flex flex-wrap gap-1">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="gap-1"
						>
							Normal
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={formatParagraph}>
							Normal
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatHeading("h1")}>
							<Heading1 className="h-4 w-4 mr-2" />
							Heading 1
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatHeading("h2")}>
							<Heading2 className="h-4 w-4 mr-2" />
							Heading 2
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatHeading("h3")}>
							<Heading3 className="h-4 w-4 mr-2" />
							Heading 3
						</DropdownMenuItem>
						<DropdownMenuItem onClick={formatQuote}>
							<Quote className="h-4 w-4 mr-2" />
							Quote
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Separator
					orientation="vertical"
					className="h-6"
				/>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
					}
				>
					<Underline className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
					}
				>
					<Strikethrough className="h-4 w-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="h-6"
				/>

				<Button
					variant="ghost"
					size="sm"
					onClick={formatCode}
				>
					<Code className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={toggleLink}
				>
					<Link className="h-4 w-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="h-6"
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="gap-1"
						>
							Align
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => formatAlign("left")}>
							<AlignLeft className="h-4 w-4 mr-2" />
							Left
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatAlign("center")}>
							<AlignCenter className="h-4 w-4 mr-2" />
							Center
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatAlign("right")}>
							<AlignRight className="h-4 w-4 mr-2" />
							Right
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => formatAlign("justify")}>
							<AlignJustify className="h-4 w-4 mr-2" />
							Justify
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Separator
					orientation="vertical"
					className="h-6"
				/>

				<Button
					variant="ghost"
					size="sm"
					onClick={formatBulletList}
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={formatNumberedList}
				>
					<ListOrdered className="h-4 w-4" />
				</Button>

				<Separator
					orientation="vertical"
					className="h-6"
				/>

				<Button
					variant="ghost"
					size="sm"
					onClick={clearFormatting}
				>
					<X className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
				>
					<Redo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleSaveEditorData()}
				>
					{taskUpdateLoading ? <Loader /> : "Save"}
				</Button>
			</div>
		</Toolbar>
	);
};

const editorConfig = {
	namespace: "lexical-editor",
	theme: {
		root: "prose prose-sm max-w-none focus:outline-none p-4",
		link: "cursor-pointer",
		text: {
			bold: "font-bold",
			italic: "italic",
			underline: "underline",
			strikethrough: "line-through",
			underlineStrikethrough: "underline line-through",
		},
		code: "bg-muted rounded-md p-1 font-mono text-sm",
		paragraph: "mb-2",
		heading: {
			h1: "text-3xl font-bold",
			h2: "text-2xl font-bold",
			h3: "text-xl font-bold",
		},
		list: {
			ul: "list-disc list-inside",
			ol: "list-decimal list-inside",
		},
	},
	nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
	onError(error: any) {
		console.error(error);
	},
};
interface CustomEditorProps {
	taskId: string;
	initialContent: string;
}
const CustomEditor: React.FC<CustomEditorProps> = ({
	taskId,
	initialContent,
}) => {
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<ToolbarPlugin
				taskId={taskId}
				initialContent={initialContent}
			/>
			<div className="relative">
				<RichTextPlugin
					contentEditable={<ContentEditable className="min-h-[200px]" />}
					placeholder={
						<div className="text-muted-foreground absolute top-3 left-4">
							Enter some rich text...
						</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
			</div>
			<HistoryPlugin />
			<AutoFocusPlugin />
			<ListPlugin />
			<LinkPlugin />
		</LexicalComposer>
	);
};

export default CustomEditor;
