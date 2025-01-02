import axios from "axios";

const a = {
  post: async (...args) => {
    try {
      const res = await a.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await a.get(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await a.put(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await a.delete(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};

const BACKEND_URL = "http://localhost:8000/api/v1";

describe("Authentication endpoints", () => {});

describe("Workspace endpoints", () => {
  let userId;
  let userToken;
  let user2Token;
  let memberToken;
  let memberId;
  let editorToken;
  let editorUserId;
  let adminToken;
  let adminUserId;
  let workspaceId;
  beforeAll(async () => {});
  test("user is able to create workspace", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/workspaces`,
      {
        workspaceName: "Hello world",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data.message).toBe("Workspace created successfully");
  });
  test("user is not able to create workspace without workspace name", async () => {
    const response = await axios.post(`${BACKEND_URL}/workspaces`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Validation Error");
  });
  test("user is not able to create without token", async () => {
    const res = await axios.post(`${BACKEND_URL}/workspaces`, {
      name: "Hello",
    });
    expect(res.status).toBe(403);
  });
  test("user is able to delete workspace", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to delete workspace without workspace id", async () => {
    const res = await axios.delete(`${BACKEND_URL}/workspaces`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is not able to delete workspace if not created by", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        headers: {
          Authorization: `Bearer ${user2Token}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });
  test("user is not able to delete workspace with invalid workspace Id", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is able to update workspace name", async () => {
    const res = await axios.put(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        name: "New name",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to update workspace name without name", async () => {
    const res = await axios.put(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to update workspace name if not owner", async () => {
    const res = await axios.put(
      `${BACKEND_URL}/workspaces?workspaceId=${123}`,
      {
        name: "Something new",
      },
      {
        headers: {
          Authorization: `Bearer ${user2Token}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });
  test("user is able to add member in the workspace", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/workspaces?workspaceId=${123}/members`,
      {
        member: {
          userId: memberId,
          workspaceId: workspaceId,
          role: "member",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to add member without workspace Id", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/workspaces/members`,
      {
        member: {
          userId: memberId,
          workspaceId: workspaceId,
          role: "member",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to add member if no member Id", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/workspaces?workspaceId=${123}/members`,
      {
        member: {
          workspaceId: workspaceId,
          role: "member",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to add member if role is member", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/workspaces?workspaceId=${123}/members`,
      {
        member: {
          userId: memberId,
          workspaceId: workspaceId,
          role: "member",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`, //TODO:ADD token of workspace's member
        },
      }
    );
    expect(res.status).toBe(403);
  });
  test("user is able to delete member from the workspace", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${workspaceId}/members?memberId=${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to delete member without workspace Id", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces/members?memberId=${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to delete member with role member", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${123}/members?memberId=${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });
  test("user is not able to delete member if role is equal", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/workspaces?workspaceId=${123}/members?memberId=${editorUserId}`,
      {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });
});

describe("Task endpoints", () => {
  let userId;
  let userToken;
  let memberId;
  let memberToken;
  let editorId;
  let editorToken;
  let adminId;
  let adminToken;
  let workspaceId;
  let taskId;
  beforeAll(async () => {});
  test("user is able to create task", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks`,
      {
        workspaceId: workspaceId,
        title: "Building task management application",
        status: "Done",
        description: "This is description of the tasks",
        priority: "LOW",
        dueDate: "2024:12:29",
        assignees: [memberId],
      },
      {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to create task without workspaceId", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks`,
      {
        title: "Building task management application",
        status: "Done",
        description: "This is description of the tasks",
        priority: "LOW",
        dueDate: "2024:12:29",
        assignees: [memberId],
      },
      {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to create task without task title", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks`,
      {
        workspaceId: workspaceId,
        // title: "Building task management application",
        status: "Done",
        description: "This is description of the tasks",
        priority: "LOW",
        dueDate: "2024:12:29",
        assignees: [memberId],
      },
      {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to create task without assignees", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks`,
      {
        workspaceId: workspaceId,
        title: "Building task management application",
        status: "Done",
        description: "This is description of the tasks",
        priority: "LOW",
        dueDate: "2024:12:29",
        // assignees: [memberId],
      },
      {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is able to delete task", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks?taskId=${taskId}`,
      {
        workspaceId: workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to delete task without taskid", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks`,
      {
        workspaceId: workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to delete task without workspaceId", async () => {
    const res = await axios.delete(`${BACKEND_URL}/tasks?taskId=${taskId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is not able to delete task if not created", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks?taskId=${sfhkfkh234}`,
      {
        workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is able to delete task if role is admin", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks?taskId=${taskId}`,
      {
        workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is able to add attachment in the task", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks?taskId=${taskId}`,
      {
        workspaceId,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to add attachment without workspaceId", async () => {});
  test("user is not able to add attachment wiithout taskId", async () => {});
  test("user is not able to add attachement if role is member", async () => {});
  test("user is able to delete attachment", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks?taskId=${taskId}/attachments`,
      {
        workspaceId,
        attachmentId: "12312", //TODO:add proper attachment id
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to delete attachment without taskid", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/attachments`,
      {
        workspaceId,
        attachmentId: "12312", //TODO:add proper attachment id
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to delete attachment without workspaceId", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/attachments`,
      {
        // workspaceId,
        attachmentId: "12312", //TODO:add proper attachment id
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test("user is not able to delete attachment if role is member", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/attachments`,
      {
        workspaceId,
        attachmentId: "12312", //TODO:add proper attachment id
      },
      {
        headers: {
          Authorization: `Bearer ${memberToken}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });

  // comments
  test("user is able to make comment in the task", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/tasks?taskId=${sfdhkfjsbf}/comments`,
      {
        //TODO:pass proper taskId
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to make comment without taskId", async () => {
    const res = await axios.post(`${BACKEND_URL}/tasks/comments`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(200);
  });
  test("user is not able to make comment without workspaceId", async () => {
    const res = await axios.post(`${BACKEND_URL}/tasks/comments`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is not able to make comment without message", async () => {
    const res = await axios.post(`${BACKEND_URL}/tasks/comments`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is able to delete comment", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
      {
        //TODO:pass proper comment id
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
  test("user is not able to delete comment without taskId", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
      {
        //TODO:pass proper comment id
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to delete comment without workspaceId", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
      {
        //TODO:pass proper comment id
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(400);
  });
  test("user is not able to delete comment without commentId", async () => {
    const res = await axios.delete(`${BACKEND_URL}/tasks/comments`, {
      //TODO:pass proper comment id
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(res.status).toBe(400);
  });
  test("user is not able to delete comment if not created by", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
      {
        //TODO:pass proper comment id
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      }
    );
    expect(res.status).toBe(403);
  });
  test("user is able to delete comment if role is admin", async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
      {
        //TODO:pass proper comment id
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(res.status).toBe(200);
  });
});

describe("websocket endpoints", () => {});
