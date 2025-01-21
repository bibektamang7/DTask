import z from "zod";

const signupSchema = z.object({
    email: z.string(),
    password: z.string(),
})

const setUsernameSchema = z.object({
    email: z.string(),
    username: z.string().min(6).max(20),
})

const userLoginWithEmailAndPasswordSchema = z.object({
    email: z.string(),
    password: z.string(),
})

const createWorkspaceSchema = z.object({
ownerId: z.string(),
    workspaceName: z.string(), // consider min and max value of workspace name
});

const updateWorkspaceNameSchema = z.object({
    workspaceName: z.string(),
});

const addMemeberInWorkspaceSchema = z.object({
    member: z.object({
        userId: z.string(),
        role: z.enum(["Member", "Editor"])
    })
});

const createTaskSchema = z.object({
    workspaceId: z.string(),
    title: z.string(),
    status: z.enum(["Done", "Todo", "In-Progress"]),
    description: z.string(),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
    dueDate: z.date(), //TODO:need to recheck this validation
    assignees: z.array(z.string()).min(1),
    // attachments?: z.array() //TODO:Not sure 
});

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
    message: z.string(),
    taskId: z.string(),
    createdBy: z.string(),
    workspaceId: z.string(),
})

const deleteCommentSchema = z.object({
    workspaceId: z.string(),
    taskId: z.string(),
})

export {
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
    userLoginWithEmailAndPasswordSchema
}