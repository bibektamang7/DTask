import z from "zod";

const signupSchema = z.object({
	email: z.string(),
	password: z.string(),
	// username: z.string(),
	// workspace: z.object({
	// 	name: z.string(),
	// 	member: z.array(z.string()).optional(),
	// }),
});

const setUsernameSchema = z.object({
	email: z.string(),
	username: z.string().min(6).max(20),
});

const userLoginWithEmailAndPasswordSchema = z.object({
	email: z.string().min(1),
	password: z.string().min(1),
});

const createWorkspaceSchema = z.object({
	owner: z.string(),
	name: z.string(), // consider min and max value of workspace name
	members: z.array(z.string()).optional(),
});

const updateWorkspaceNameSchema = z.object({
	workspaceName: z.string(),
});

const addMemeberInWorkspaceSchema = z.object({
	member: z.object({
		userId: z.string(),
		role: z.enum(["Member", "Editor", "Admin"]).default("Member"),
		workspaceId: z.string(),
		isJoined: z.boolean().default(false),
	}),
});

const createTaskSchema = z.object({
	title: z.string().min(1),
	status: z.enum(["Completed", "Todo", "In-Progress"]),
	description: z.string().optional(),
	priority: z.enum(["Low", "Medium", "High", "Urgent"]),
	startDate: z.string(),
	dueDate: z.string(),
	assignees: z.array(z.string()),
	tags: z.array(z.string()).max(4).optional(),
});

const updateTaskSchema = z.object({
	title: z.string().min(1).optional(),
	status: z.enum(["Completed", "Todo", "In-Progress"]).optional(),
	description: z.string().optional(),
	priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
	startDate: z.string().optional(),
	dueDate: z.string().optional(),
})

const deleteTaskSchema = z.object({
	workspaceId: z.string(),
});
const addAttachmentSchema = z.object({
	workspaceId: z.string(),
});
const deleteAttachmentSchema = z.object({
	workspaceId: z.string(),
});

const createCommentSchema = z.object({
	message: z.string().optional(),
	taskId: z.string(),
	createdBy: z.string(),
	workspaceId: z.string(),
});

const deleteCommentSchema = z.object({
	workspaceId: z.string(),
	taskId: z.string(),
});

const createChatSchema = z.object({
	name: z.string(),
	members: z.array(z.string()).min(1),
});

const sendMessageSchema = z.object({ 
	content: z.string().optional(),
})

export {
	sendMessageSchema,
	createChatSchema,
	deleteCommentSchema,
	createCommentSchema,
	createTaskSchema,
	addAttachmentSchema,
	addMemeberInWorkspaceSchema,
	createWorkspaceSchema,
	deleteAttachmentSchema,
	deleteTaskSchema,
	updateWorkspaceNameSchema,
	setUsernameSchema,
	signupSchema,
	userLoginWithEmailAndPasswordSchema,
	updateTaskSchema
};
