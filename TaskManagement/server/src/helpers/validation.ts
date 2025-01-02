import z from "zod";

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

export {
    createTaskSchema,
    addAttachmentSchema,
    addMemeberInWorkspaceSchema,
    createWorkspaceSchema,
    deleteAttachmentSchema,
    deleteTaskSchema,
    updateWorkspaceNameSchema,
}