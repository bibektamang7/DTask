const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const a = {
	post: async (...args) => {
		try {
			const res = await axios.post(...args);
			return res;
		} catch (error) {
			return error.response;
		}
	},
	get: async (...args) => {
		try {
			const res = await axios.get(...args);
			return res;
		} catch (error) {
			return error.response;
		}
	},
	put: async (...args) => {
		try {
			const res = await axios.put(...args);
			return res;
		} catch (error) {
			return error.response;
		}
	},
	delete: async (...args) => {
		try {
			const res = await axios.delete(...args);
			return res;
		} catch (error) {
			return error.response;
		}
	},
	patch: async (...args) => {
		try {
			const res = await axios.patch(...args);
			return res;
		} catch (error) {
			return error.response;
		}
	},
};

const BACKEND_URL = "http://localhost:8000/api/v1";

// describe("Authentication endpoints", () => {
// 	// 	// test("user is able to signup", async () => {
// 	// 	// 	const response = await a.post(`${BACKEND_URL}/users/signup`, {
// 	// 	// 		email: "bibektamang@gmail.com",
// 	// 	// 		password: "hellworld",
// 	// 	// 		username: "here_it_is",
// 	// 	// 		workspace: {
// 	// 	// 			name: `pme-${Math.random()}`,
// 	// 	// 		},
// 	// 	// 	});
// 	// 	// 	console.log(response);
// 	// 	// 	expect(response.status).toBe(200);
// 	// 	// });
// 	// 	// test("user is not able to signup without password", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/signup`, {
// 	// 	//     email: "bibektamang@gmail.com",
// 	// 	//     // password: "hellworld",
// 	// 	//     username: "here_it_is",
// 	// 	// 		  workspace: {
// 	// 	// 			  name: `pme-${Math.random()}`,
// 	// 	// 		  },
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(400);
// 	// 	// }) ✅✅✅
// 	// 	// test("user is not able to signup without email", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/signup`, {
// 	// 	//     // email: "bibektamang@gmail.com",
// 	// 	//      password: "hellworld",
// 	// 	//      username: "here_it_is",
// 	// 	// 		  workspace: {
// 	// 	// 			  name: `pme-${Math.random()}`,
// 	// 	// 		  },
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(400);
// 	// 	// }) ✅✅✅
// 	// 	// test("user's email already exits", async () => {
// 	// 	// 	const response = await a.post(`${BACKEND_URL}/users/signup`, {
// 	// 	// 		email: "bibektamang@gmail.com",
// 	// 	// 		password: "hellworld",
// 	// 	// 		username: "here_it_is",
// 	// 	// 		workspace: {
// 	// 	// 			name: `pme-${Math.random()}`,
// 	// 	// 		},
// 	// 	// 	});
// 	// 	// 	expect(response.status).toBe(400);
// 	// 	// }); ✅✅✅
// 	// 	// test("user is able to login", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/login`, {
// 	// 	//     email: "bibektamang@gmail.com",
// 	// 	//     password: "hellworld",
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(200);
// 	// 	// }); ✅✅✅ TODO: valid / test for workspace related metadata
// 	// 	// test("user is not able to login without password", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/login`, {
// 	// 	//     email: "bibektamang@gmail.com",
// 	// 	//     // password: "hellworld",
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(400);
// 	// 	// }); ✅✅✅
// 	// 	// test("user is not able to login if not exists", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/login`, {
// 	// 	//     email: "bibektamang123@gmail.com",
// 	// 	//     password: "hellworld",
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(400);
// 	// 	// }) ✅✅✅
// 	// 	// test("user is able to set username", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/username`, {
// 	// 	//     email: "bibektamang123@gmail.com",
// 	// 	//     username: `helloWorld-${Math.random()}`,
// 	// 	//   });
// 	// 	//   username = response.data.username;
// 	// 	//   expect(response.status).toBe(200);
// 	// 	// }) TODO: THIS IS NOT AUTHENTICATION ENDPOINT
// 	// 	// test("user is not able to set username without username", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/username`, {
// 	// 	//     email: "bibektamang123@gmail.com",
// 	// 	//     // username: "helloWorld",
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(200);
// 	// 	// })
// 	// 	// test("user is not able to set username if username already exists", async () => {
// 	// 	//   const response = await a.post(`${BACKEND_URL}/users/username`, {
// 	// 	//     email: "bibektamang123@gmail.com",
// 	// 	//     username,
// 	// 	//   });
// 	// 	//   expect(response.status).toBe(200);
// 	// 	// })
// });

// describe("Workspace endpoints", () => {
// 	// 	// let userId;
// 	// 	// let userToken;
// 	// 	// let workspaceId;
// 	// 	// let anotherUserId;
// 	// 	// let anotherUserToken;
// 	// 	// beforeAll(async () => {
// 	// 	// 	const userEmail = `bibektamang${Math.random()}@gmail.com`;
// 	// 	// 	const userSignUpResponse = await axios.post(`${BACKEND_URL}/users/signup`, {
// 	// 	// 		email: userEmail,
// 	// 	// 		password: "hellworld",
// 	// 	// 		username: `bibek-${Math.random()}`,
// 	// 	// 		workspace: {
// 	// 	// 			name: `some-${Math.random()}`,
// 	// 	// 		},
// 	// 	// 	});
// 	// 	// 	const userSignInResponse = await axios.post(`${BACKEND_URL}/users/login`, {
// 	// 	// 		email: userEmail,
// 	// 	// 		password: "hellworld",
// 	// 	// 	});
// 	// 	// 	userToken = userSignInResponse.data.data.token;
// 	// 	// 	userId = userSignInResponse.data.data.userId;
// 	// 	// 	const anotherEmail = `bibektamang${Math.random()}@gmail.com`;
// 	// 	// 	const anotherUserSignup = await axios.post(`${BACKEND_URL}/users/signup`, {
// 	// 	// 		email: anotherEmail,
// 	// 	// 		password: "hellworld",
// 	// 	// 		username: `bibek-${Math.random()}`,
// 	// 	// 		workspace: {
// 	// 	// 			name: `some-${Math.random()}`,
// 	// 	// 		},
// 	// 	// 	});
// 	// 	// 	const anotherUserResponse = await axios.post(`${BACKEND_URL}/users/login`, {
// 	// 	// 		email: anotherEmail,
// 	// 	// 		password: "hellworld",
// 	// 	// 	});
// 	// 	// 	anotherUserToken = anotherUserResponse.data.data.token;
// 	// 	// 	anotherUserId = anotherUserResponse.data.data.userId;
// 	// 	// 	const worksapceResponse = await axios.post(
// 	// 	// 		`${BACKEND_URL}/workspaces`,
// 	// 	// 		{
// 	// 	// 			name: "Hello something new",
// 	// 	// 			members: [],
// 	// 	// 		},
// 	// 	// 		{
// 	// 	// 			headers: {
// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 			},
// 	// 	// 		}
// 	// 	// 	);
// 	// 	// 	workspaceId = worksapceResponse.data.data._id;
// 	// 	// });
// 	// 	// test("user is able to create workspace", async () => {
// 	// 	// 	const res = await axios.post(
// 	// 	// 		`${BACKEND_URL}/workspaces`,
// 	// 	// 		{
// 	// 	// 			name: "Hello worlddfsdf",
// 	// 	// 			members: [],
// 	// 	// 		},
// 	// 	// 		{
// 	// 	// 			headers: {
// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 			},
// 	// 	// 		}
// 	// 	// 	);
// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	expect(res.data.message).toBe("Workspace created successfully");
// 	// 	// });
// 	// 	// 	// 	// test("user is not able to create workspace without workspace name", async () => {
// 	// 	// 	// 	// 	const response = await a.post(
// 	// 	// 	// 	// 		`${BACKEND_URL}/workspaces`,
// 	// 	// 	// 	// 		{},
// 	// 	// 	// 	// 		{
// 	// 	// 	// 	// 			headers: {
// 	// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	// 			},
// 	// 	// 	// 	// 		}
// 	// 	// 	// 	// 	);
// 	// 	// 	// 	// 	expect(response.status).toBe(400);
// 	// 	// 	// 	// });✅✅✅
// 	// 	// 	// 	// test("user is not able to create workspace without token", async () => {
// 	// 	// 	// 	// 	const res = await a.post(`${BACKEND_URL}/workspaces`, {
// 	// 	// 	// 	// 		name: "Hello",
// 	// 	// 	// 	// 	});
// 	// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// 	// }); ✅✅✅
// 	// 	// 	// 	// test("user is able to delete workspace", async () => {
// 	// 	// 	// 	// 	const res = await axios.delete(`${BACKEND_URL}/workspaces/delete-workspace/${workspaceId}`, {
// 	// 	// 	// 	// 		headers: {
// 	// 	// 	// 	// 			Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	// 		},
// 	// 	// 	// 	// 	});
// 	// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// 	// });✅✅✅
// 	// 	// 	// 	// test("user is not able to delete workspace with wrong workspace id", async () => {
// 	// 	// 	// 	// 	const res = await axios.delete(`${BACKEND_URL}/workspaces/delete-workspace/123`, {
// 	// 	// 	// 	// 		headers: {
// 	// 	// 	// 	// 			Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	// 		},
// 	// 	// 	// 	// 	});
// 	// 	// 	// 	// 	console.log(res.status)
// 	// 	// 	// 	// 	expect(res.status).toBe(500);
// 	// 	// 	// 	// });TODO: THIS WORKS BUT NEED TO HANDLE ERROR IN BACKEND TO GIVE RIGHT MESSAGE
// 	// 	// 	// 	// test("user is not able to delete workspace if not exists", async () => {
// 	// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 	// 		`${BACKEND_URL}/workspaces/delete-workspace/67ab82615e8e791fdcf197fe`,
// 	// 	// 	// 	// 		{
// 	// 	// 	// 	// 			headers: {
// 	// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	// 			},
// 	// 	// 	// 	// 		}
// 	// 	// 	// 	// 	);
// 	// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// 	// }); ✅✅✅
// 	// 	// 	// 	// test("user is not able to delete workspace not created by current user", async () => {
// 	// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 	// 		`${BACKEND_URL}/workspaces/delete-workspace/${workspaceId}`,
// 	// 	// 	// 	// 		{
// 	// 	// 	// 	// 			headers: {
// 	// 	// 	// 	// 				Authorization: `Bearer ${anotherUserToken}`,
// 	// 	// 	// 	// 			},
// 	// 	// 	// 	// 		}
// 	// 	// 	// 	// 	);
// 	// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// 	// });✅✅✅
// 	// 	// 	// 	//   test("user is able to update workspace name", async () => {
// 	// 	// 	// 	//     const res = await axios.patch(
// 	// 	// 	// 	//       `${BACKEND_URL}/workspaces/update-workspace/${workspaceId}`,
// 	// 	// 	// 	//       {
// 	// 	// 	// 	//         workspaceName: "New name",
// 	// 	// 	// 	//       },
// 	// 	// 	// 	//       {
// 	// 	// 	// 	//         headers: {
// 	// 	// 	// 	//           Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	//         },
// 	// 	// 	// 	//       }
// 	// 	// 	// 	//     );
// 	// 	// 	// 	//     expect(res.status).toBe(200);
// 	// 	// 	// 	//   }); ✅✅✅
// 	// 	// 	// 	//   test("user is not able to update workspace name without name", async () => {
// 	// 	// 	// 	//     const res = await a.patch(
// 	// 	// 	// 	//       `${BACKEND_URL}/workspaces/update-workspace/${workspaceId}`,
// 	// 	// 	// 	// 	  {},
// 	// 	// 	// 	//       {
// 	// 	// 	// 	//         headers: {
// 	// 	// 	// 	//           Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 	//         },
// 	// 	// 	// 	//       }
// 	// 	// 	// 	//     );
// 	// 	// 	// 	//     expect(res.status).toBe(400);
// 	// 	// 	// 	//   }); ✅✅✅
// 	// 	// 	// 	// test("user is not able to update workspace name if not owner", async () => {
// 	// 	// 	// 	// 	const res = await a.patch(
// 	// 	// 	// 	// 		`${BACKEND_URL}/workspaces/update-workspace/${workspaceId}`,
// 	// 	// 	// 	// 		{
// 	// 	// 	// 	// 			workspaceName: "Something new",
// 	// 	// 	// 	// 		},
// 	// 	// 	// 	// 		{
// 	// 	// 	// 	// 			headers: {
// 	// 	// 	// 	// 				Authorization: `Bearer ${anotherUserToken}`,
// 	// 	// 	// 	// 			},
// 	// 	// 	// 	// 		}
// 	// 	// 	// 	// 	);
// 	// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// 	// }); ✅✅✅
// 	// 	// 	// test("user is able to add member in the workspace", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			member: {
// 	// 	// 	// 				userId: anotherUserId,
// 	// 	// 	// 				workspaceId: workspaceId,
// 	// 	// 	// 				role: "Member",
// 	// 	// 	// 			},
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// }); ✅✅✅
// 	// 	// 	// test("user is not able to add member without workspace Id", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			member: {
// 	// 	// 	// 				userId: anotherUserId,
// 	// 	// 	// 				role: "Member",
// 	// 	// 	// 			},
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// }); ✅✅✅
// 	// 	// 	// test("user is not able to add member if no member Id", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			member: {
// 	// 	// 	// 				workspaceId: workspaceId,
// 	// 	// 	// 				role: "Member",
// 	// 	// 	// 			},
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// });✅✅✅
// 	// 	// 	// test("user is not able to add member if role is member", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			member: {
// 	// 	// 	// 				userId: anotherUserId,
// 	// 	// 	// 				workspaceId: workspaceId,
// 	// 	// 	// 				role: "Member",
// 	// 	// 	// 			},
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${anotherUserToken}`, //TODO:ADD token of workspace's member
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// });✅✅✅
// 	// 	// 	// test("user is able to delete member from the workspace", async () => {
// 	// 	// 	// 	const addMemberResponse = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			member: {
// 	// 	// 	// 				userId: anotherUserId,
// 	// 	// 	// 				workspaceId: workspaceId,
// 	// 	// 	// 				role: "Member",
// 	// 	// 	// 			},
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}?memberId=${anotherUserId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// }); ✅✅✅
// 	// 	// 	//TOOD:NEED TO CONSIDER THIS ROUTE
// 	// 	// 	// test("user is not able to delete member without workspace Id", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members?memberId=${anotherUserId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// });
// 	// 	// 	// test("user is not able to delete member with role member", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/workspaces/members/${workspaceId}?memberId=${userToken}}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${anotherUserToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// });✅✅✅
// 	// 	// 	test("user is not able to delete member if role is equal", async () => {
// 	// 	// 		const addMemberResponse = await a.post(
// 	// 	// 			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 	// 	// 			{
// 	// 	// 				member: {
// 	// 	// 					userId: anotherUserId,
// 	// 	// 					workspaceId: workspaceId,
// 	// 	// 					role: "Admin",
// 	// 	// 				},
// 	// 	// 			},
// 	// 	// 			{
// 	// 	// 				headers: {
// 	// 	// 					Authorization: `Bearer ${userToken}`,
// 	// 	// 				},
// 	// 	// 			}
// 	// 	// 		);
// 	// 	// 		const res = await a.delete(
// 	// 	// 			`${BACKEND_URL}/workspaces/members/${workspaceId}?memberId=${userId}`,
// 	// 	// 			{
// 	// 	// 				headers: {
// 	// 	// 					Authorization: `Bearer ${anotherUserToken}`,
// 	// 	// 				},
// 	// 	// 			}
// 	// 	// 		);
// 	// 	// 		expect(res.status).toBe(401);
// 	// 	// 	});
// });

// describe("Task endpoints", () => {
// 	let userId;
// 	let userToken;

// 	let workspaceId;
// 	let taskAssignedUserId;
// 	let taskAssignedUserToken;
// 	let taskId;

// 	let editorId;
// 	let editorToken;

// 	let anotherEditorId;
// 	let anotherEditorToken;
// 	let attachmentId;

// 	beforeAll(async () => {
// 		const userEmail = `bibektamang${Math.random()}@gmail.com`;
// 		const userSignUpResponse = await axios.post(`${BACKEND_URL}/users/signup`, {
// 			email: userEmail,
// 			password: "hellworld",
// 			username: `bibek-${Math.random()}`,
// 			workspace: {
// 				name: `some-${Math.random()}`,
// 			},
// 		});

// 		const userSignInResponse = await axios.post(`${BACKEND_URL}/users/login`, {
// 			email: userEmail,
// 			password: "hellworld",
// 		});
// 		userToken = userSignInResponse.data.data.token;
// 		userId = userSignInResponse.data.data.userId;

// 		const anotherEmail = `bibektamang${Math.random()}@gmail.com`;
// 		const anotherUserSignup = await axios.post(`${BACKEND_URL}/users/signup`, {
// 			email: anotherEmail,
// 			password: "hellworld",
// 			username: `bibek-${Math.random()}`,
// 			workspace: {
// 				name: `some-${Math.random()}`,
// 			},
// 		});

// 		const anotherUserResponse = await axios.post(`${BACKEND_URL}/users/login`, {
// 			email: anotherEmail,
// 			password: "hellworld",
// 		});

// 		taskAssignedUserId = anotherUserResponse.data.data.userId;
// 		taskAssignedUserToken = anotherUserResponse.data.data.token;

// 		const editorEmail = `bibektamang${Math.random()}@gmail.com`;
// 		const editorSignupResponse = await axios.post(
// 			`${BACKEND_URL}/users/signup`,
// 			{
// 				email: editorEmail,
// 				password: "hellworld",
// 				username: `bibek-${Math.random()}`,
// 				workspace: {
// 					name: `some-${Math.random()}`,
// 				},
// 			}
// 		);

// 		const editorSigninResponse = await axios.post(
// 			`${BACKEND_URL}/users/login`,
// 			{
// 				email: editorEmail,
// 				password: "hellworld",
// 			}
// 		);

// 		editorId = editorSigninResponse.data.data.userId;
// 		editorToken = editorSigninResponse.data.data.token;

// 		const anotherEditorEmail = `bibektamang${Math.random()}@gmail.com`;
// 		const anotherEditorSignupResponse = await axios.post(
// 			`${BACKEND_URL}/users/signup`,
// 			{
// 				email: anotherEditorEmail,
// 				password: "hellworld",
// 				username: `bibek-${Math.random()}`,
// 				workspace: {
// 					name: `some-${Math.random()}`,
// 				},
// 			}
// 		);

// 		const anotherEditorSigninResponse = await axios.post(
// 			`${BACKEND_URL}/users/login`,
// 			{
// 				email: anotherEditorEmail,
// 				password: "hellworld",
// 			}
// 		);

// 		anotherEditorId = anotherEditorSigninResponse.data.data.userId;
// 		anotherEditorToken = anotherEditorSigninResponse.data.data.token;

// 		const worksapceResponse = await axios.post(
// 			`${BACKEND_URL}/workspaces`,
// 			{
// 				name: "Hello something new",
// 				members: [],
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 				},
// 			}
// 		);
// 		workspaceId = worksapceResponse.data.data._id;

// 		const addMemberResponse = await a.post(
// 			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 			{
// 				member: {
// 					userId: taskAssignedUserId,
// 					workspaceId: workspaceId,
// 					role: "Member",
// 					isJoined: true,
// 				},
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 				},
// 			}
// 		);
// 		taskAssignedUserId = addMemberResponse.data.data._id;
// 		const addEditorResponse = await a.post(
// 			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 			{
// 				member: {
// 					userId: editorId,
// 					workspaceId: workspaceId,
// 					role: "Editor",
// 					isJoined: true,
// 				},
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 				},
// 			}
// 		);
// 		editorId = addEditorResponse.data.data._id;
// 		const anotherAddEditorResponse = await a.post(
// 			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
// 			{
// 				member: {
// 					userId: anotherEditorId,
// 					workspaceId: workspaceId,
// 					role: "Editor",
// 					isJoined: true,
// 				},
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 				},
// 			}
// 		);
// 		anotherEditorId = anotherAddEditorResponse.data.data._id;
// 		const createTaskResponse = await a.post(
// 			`${BACKEND_URL}/tasks/${workspaceId}`,
// 			{
// 				workspaceId: workspaceId,
// 				title: "Building task management application",
// 				status: "Done",
// 				description: "This is description of the tasks",
// 				priority: "Low",
// 				dueDate: new Date("2024:12:29"),
// 				assignees: [taskAssignedUserId],
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 				},
// 			}
// 		);

// 		taskId = createTaskResponse.data.data._id;

// 		const formData = new FormData();
// 		formData.append("taskFiles", fs.createReadStream("./1.jpg"));

// 		const res = await axios.post(
// 			`${BACKEND_URL}/tasks/${workspaceId}/attachments/${taskId}`,
// 			formData,
// 			{
// 				headers: {
// 					Authorization: `Bearer ${userToken}`,
// 					"Content-Type": "multipart/form-data",
// 				},
// 			}
// 		);
// 		attachmentId = res.data.data[0];
// 		console.log(attachmentId, "this si sattachemmtn d");
// 	});

// 	// 	// TODO:NEED TO CONSIDER DATE BOTH IN SERVER AND TEST
// 	// 	// test("user is able to create task", async () => {
// 	// 	// 	const adminResponse = await a.post(
// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}`,
// 	// 	// 		{
// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 			title: "Building task management application",
// 	// 	// 			status: "Done",
// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 			priority: "Low",
// 	// 	// 			dueDate: new Date("2024:12:29"),
// 	// 	// 			assignees: [taskAssignedUserId],
// 	// 	// 		},
// 	// 	// 		{
// 	// 	// 			headers: {
// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 			},
// 	// 	// 		}
// 	// 	// 	);
// 	// 	// 	expect(adminResponse.status).toBe(200);
// 	// 	// 	const editorResponse = await a.post(
// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}`,
// 	// 	// 		{
// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 			title: "Building task management application",
// 	// 	// 			status: "Done",
// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 			priority: "Low",
// 	// 	// 			dueDate: new Date("2024:12:29"),
// 	// 	// 			assignees: [taskAssignedUserId, anotherEditorId],
// 	// 	// 		},
// 	// 	// 		{
// 	// 	// 			headers: {
// 	// 	// 				Authorization: `Bearer ${editorToken}`,
// 	// 	// 			},
// 	// 	// 		}
// 	// 	// 	);
// 	// 	// 	expect(editorResponse.status).toBe(200);
// 	// 	// });✅✅✅

// 	// 	// test("user is not able to create task without workspaceId", async () => {
// 	// 	// 	const res = await a.post(
// 	// 	// 		`${BACKEND_URL}/tasks`,
// 	// 	// 		{
// 	// 	// 			title: "Building task management application",
// 	// 	// 			status: "Done",
// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 			priority: "Low",
// 	// 	// 			dueDate: "2024:12:29",
// 	// 	// 			assignees: [taskAssignedUserId],
// 	// 	// 		},
// 	// 	// 		{
// 	// 	// 			headers: {
// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 			},
// 	// 	// 		}
// 	// 	// 	);
// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to create task without task title", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 			// title: "Building task management application",
// 	// 	// 	// 			status: "Done",
// 	// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 	// 			priority: "Low",
// 	// 	// 	// 			dueDate: "2024:12:29",
// 	// 	// 	// 			assignees: [taskAssignedUserId],
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to create task without assignees", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 			title: "Building task management application",
// 	// 	// 	// 			status: "Done",
// 	// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 	// 			priority: "Low",
// 	// 	// 	// 			dueDate: "2024:12:29",
// 	// 	// 	// 			// assignees: [memberId],
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is able to delete task", async () => {
// 	// 	// 	// 	const res = await axios.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}?taskId=${taskId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to delete task without taskid", async () => {
// 	// 	// 	// 	const res = await a.delete(`${BACKEND_URL}/tasks/${workspaceId}`, {
// 	// 	// 	// 		headers: {
// 	// 	// 	// 			Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 		},
// 	// 	// 	// 	});
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is not able to delete task without workspaceId", async () => {
// 	// 	// 	// 	const res = await a.delete(`${BACKEND_URL}/tasks/?taskId=${taskId}`, {
// 	// 	// 	// 		headers: {
// 	// 	// 	// 			Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 		},
// 	// 	// 	// 	});
// 	// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to delete task if not created", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}?taskId=${taskId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${taskAssignedUserToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is able to delete task if role is admin", async () => {
// 	// 	// 	// 	const editorResponse = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 			title: "Building task management application",
// 	// 	// 	// 			status: "Done",
// 	// 	// 	// 			description: "This is description of the tasks",
// 	// 	// 	// 			priority: "Low",
// 	// 	// 	// 			dueDate: new Date("2024:12:29"),
// 	// 	// 	// 			assignees: [taskAssignedUserId, anotherEditorId],
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${editorToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	const editorTaskId = editorResponse.data.data._id;

// 	// 	// 	// 	const res = await axios.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}?taskId=${editorTaskId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// comments

// 	// 	// 	// test("user is able to make comment in the task", async () => {
// 	// 	// 	// 	const res = await axios.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 			commentImage: "1.png",
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 				"Content-Type": "multipart/form-data",
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is not able to make comment without taskId", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to make comment without workspaceId", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 				"Content-Type": "multipart/form-data",
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to make comment without message and file", async () => {
// 	// 	// 	// 	const res = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			// message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 				"Content-Type": "multipart/form-data",
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is able to delete comment", async () => {
// 	// 	// 	// 	const createCommentResponse = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 				"Content-Type": "multipart/form-data",
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);

// 	// 	// 	// 	const commentId = createCommentResponse.data.data._id;

// 	// 	// 	// 	const res = await axios.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments?commentId=${commentId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(200);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to delete comment without taskId", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/comments?commentId=sdfsdjhf}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to delete comment without workspaceId", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${taskId}/comments?commentId=sfdksadf`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(404);
// 	// 	// 	// });✅✅✅

// 	// 	// 	// test("user is not able to delete comment without commentId", async () => {
// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(400);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	// test("user is not able to delete comment if not created by", async () => {
// 	// 	// 	// 	const createCommentResponse = await a.post(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments`,
// 	// 	// 	// 		{
// 	// 	// 	// 			message: "hello sir",
// 	// 	// 	// 			taskId: taskId,
// 	// 	// 	// 			createdBy: userId,
// 	// 	// 	// 			workspaceId: workspaceId,
// 	// 	// 	// 		},
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 	// 	// 				"Content-Type": "multipart/form-data",
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);

// 	// 	// 	// 	const commentId = createCommentResponse.data.data._id;

// 	// 	// 	// 	const res = await a.delete(
// 	// 	// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/${taskId}/comments?commentId=${commentId}`,
// 	// 	// 	// 		{
// 	// 	// 	// 			headers: {
// 	// 	// 	// 				Authorization: `Bearer ${editorToken}`,
// 	// 	// 	// 			},
// 	// 	// 	// 		}
// 	// 	// 	// 	);
// 	// 	// 	// 	expect(res.status).toBe(401);
// 	// 	// 	// }); ✅✅✅

// 	// 	// 	//TODO:THIS NEED TO BE IMPLEMENT

// 	// 	// 	//   test("user is able to delete comment if role is admin", async () => {
// 	// 	// 	//     const res = await axios.delete(
// 	// 	// 	//       `${BACKEND_URL}/tasks/comments?commentId=${sajfjsd}`,
// 	// 	// 	//       {
// 	// 	// 	//         headers: {
// 	// 	// 	//           Authorization: `Bearer ${adminToken}`,
// 	// 	// 	//         },
// 	// 	// 	//       }
// 	// 	// 	//     );
// 	// 	// 	//     expect(res.status).toBe(200);
// 	// 	// 	//   });

// 	// 	// 	// ATTACHMENTS

// 	// test("user is able to add attachment in the task", async () => {
// 	// 	const formData = new FormData();
// 	// 	formData.append("taskFiles", fs.createReadStream("./1.jpg"));

// 	// 	const res = await axios.post(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/${taskId}`,
// 	// 		formData,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 				"Content-Type": "multipart/form-data",
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	console.log(res.data.data);
// 	// 	expect(res.status).toBe(200);
// 	// });

// 	// test("user is not able to add attachment without workspaceId", async () => {
// 	// 	const formData = new FormData();
// 	// 	formData.append("taskFiles", fs.createReadStream("./1.jpg"));

// 	// 	const res = await axios.post(
// 	// 		`${BACKEND_URL}/tasks/attachments/${taskId}`,
// 	// 		formData,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 				"Content-Type": "multipart/form-data",
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(404);
// 	// });✅✅✅

// 	// test("user is not able to add attachment if taskId not exists", async () => {
// 	// 	const formData = new FormData();
// 	// 	formData.append("taskFiles", fs.createReadStream("./1.jpg"));

// 	// 	const res = await a.post(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/67b5de0830c86b2bce26d876`,
// 	// 		formData,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 				"Content-Type": "multipart/form-data",
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(400);
// 	// });✅✅✅

// 	// test("user is not able to add attachement if role is member", async () => {
// 	// 	const formData = new FormData();
// 	// 	formData.append("taskFiles", fs.createReadStream("./1.jpg"));

// 	// 	const res = await a.post(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/${taskId}`,
// 	// 		formData,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${taskAssignedUserToken}`,
// 	// 				"Content-Type": "multipart/form-data",
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(401);
// 	// });✅✅✅

// 	// test("user is able to delete attachment", async () => {
// 	// 	const res = await a.delete(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/${taskId}?attachmentId=${attachmentId}`,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(200);
// 	// }); ✅✅✅

// 	// test("user is not able to delete attachment without taskid", async () => {
// 	// 	const res = await a.delete(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/67b5e2de7ab6a0bbd66aead8?attachmentId=${attachmentId}`,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${userToken}`,
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(400);
// 	// });✅✅✅

// 	// test("user is not able to delete attachment if role is member", async () => {
// 	// 	const res = await a.delete(
// 	// 		`${BACKEND_URL}/tasks/${workspaceId}/attachments/${taskId}?attachmentId=${attachmentId}`,
// 	// 		{
// 	// 			headers: {
// 	// 				Authorization: `Bearer ${taskAssignedUserToken}`,
// 	// 			},
// 	// 		}
// 	// 	);
// 	// 	expect(res.status).toBe(401);
// 	// });✅✅✅
// });

// describe("websocket endpoints", () => {});

// THIS IS CHATS ENDPOINTS

describe("Chats endpoints", () => {
	let editorId;
	let editorToken;
	let otherEditorId;
	let otherEditorToken;
	let adminId;
	let adminToken;
	let userOneId;
	let userOneToken;
	let userTwoId;
	let userTwoToken;
	let workspaceId;
	let chatId;
	let memberId;
	let memberToken;
	let workspaceMemberId;
	let workspaceEditorId;
	let messageId;
	beforeAll(async () => {
		const editorEmail = `Bibek-${Math.random()}@gmail.com`;
		const editorSignUpResponse = await a.post(`${BACKEND_URL}/users/signup`, {
			email: editorEmail,
			password: "hellworld",
			username: `bk-${Math.random()}`,
			workspace: {
				name: `some-${Math.random()}`,
			},
		});
		const editorSignInResponse = await axios.post(
			`${BACKEND_URL}/users/login`,
			{
				email: editorEmail,
				password: "hellworld",
			}
		);
		editorId = editorSignInResponse.data.data.userId;
		editorToken = editorSignInResponse.data.data.token;
		const otherEditorEmail = `Bibek-${Math.random()}@gmail.com`;
		const otherEditorSignUpResponse = await a.post(
			`${BACKEND_URL}/users/signup`,
			{
				email: otherEditorEmail,
				password: "hellworld",
				username: `bk-${Math.random()}`,
				workspace: {
					name: `some-${Math.random()}`,
				},
			}
		);
		const otherEditorSignInResponse = await axios.post(
			`${BACKEND_URL}/users/login`,
			{
				email: otherEditorEmail,
				password: "hellworld",
			}
		);
		otherEditorId = otherEditorSignInResponse.data.data.userId;
		otherEditorToken = otherEditorSignInResponse.data.data.token;
		const adminEmail = `Bibek-${Math.random()}@gmail.com`;
		const adminSignUpResponse = await a.post(`${BACKEND_URL}/users/signup`, {
			email: adminEmail,
			password: "hellworld",
			username: `bk-${Math.random()}`,
			workspace: {
				name: `some-${Math.random()}`,
			},
		});
		const adminSignInResponse = await axios.post(`${BACKEND_URL}/users/login`, {
			email: adminEmail,
			password: "hellworld",
		});
		adminId = adminSignInResponse.data.data.userId;
		adminToken = adminSignInResponse.data.data.token;
		const userOneEmail = `Bibek-${Math.random()}@gmail.com`;
		const userOneSignUpResponse = await a.post(`${BACKEND_URL}/users/signup`, {
			email: userOneEmail,
			password: "hellworld",
			username: `bk-${Math.random()}`,
			workspace: {
				name: `some-${Math.random()}`,
			},
		});
		const userOneSignInResponse = await axios.post(
			`${BACKEND_URL}/users/login`,
			{
				email: userOneEmail,
				password: "hellworld",
			}
		);
		userOneId = userOneSignInResponse.data.data.userId;
		userOneToken = userOneSignInResponse.data.data.token;
		const userTwoEmail = `Bibek-${Math.random()}@gmail.com`;
		const userTwoSignUpResponse = await a.post(`${BACKEND_URL}/users/signup`, {
			email: userTwoEmail,
			password: "hellworld",
			username: `bk-${Math.random()}`,
			workspace: {
				name: `some-${Math.random()}`,
			},
		});
		const userTwoSignInResponse = await axios.post(
			`${BACKEND_URL}/users/login`,
			{
				email: userTwoEmail,
				password: "hellworld",
			}
		);
		userTwoId = userTwoSignInResponse.data.data.userId;
		userTwoToken = userTwoSignInResponse.data.data.token;
		const memberEmail = `Bibek-${Math.random()}@gmail.com`;
		const memberSignUpResponse = await a.post(`${BACKEND_URL}/users/signup`, {
			email: memberEmail,
			password: "hellworld",
			username: `bk-${Math.random()}`,
			workspace: {
				name: `some-${Math.random()}`,
			},
		});
		const memberSignInResponse = await axios.post(
			`${BACKEND_URL}/users/login`,
			{
				email: memberEmail,
				password: "hellworld",
			}
		);
		memberId = memberSignInResponse.data.data.userId;
		memberToken = memberSignInResponse.data.data.token;
		const worksapceResponse = await axios.post(
			`${BACKEND_URL}/workspaces`,
			{
				name: "Hello something new",
				members: [],
			},
			{
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			}
		);
		workspaceId = worksapceResponse.data.data._id;
		const addMemberResponse = await a.post(
			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
			{
				member: {
					userId: memberId,
					workspaceId: workspaceId,
					role: "Member",
					isJoined: true,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			}
		);
		workspaceMemberId = addMemberResponse.data.data._id;
		const addEditorResponse = await a.post(
			`${BACKEND_URL}/workspaces/members/${workspaceId}`,
			{
				member: {
					userId: editorId,
					workspaceId: workspaceId,
					role: "Editor",
					isJoined: true,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			}
		);
		workspaceEditorId = addEditorResponse.data.data._id;
		const createChatResponse = await a.post(
			`${BACKEND_URL}/chats/${workspaceId}`,
			{
				creator: workspaceEditorId,
				members: [workspaceMemberId],
			},
			{
				headers: {
					Authorization: `Bearer ${editorToken}`,
				},
			}
		);
		chatId = createChatResponse.data.data._id;
		const addMemberChatResponse = await axios.post(
			`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
			{},
			{
				headers: {
					Authorization: `Bearer ${editorToken}`,
				},
			}
		);
		const sendMessageResponse = await a.post(
			`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages`,
			{
				sender: memberId,
				content: "helle world",
			},
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${memberToken}`,
				},
			}
		);
		messageId = sendMessageResponse.data.data._id;
	});
	// 	// test("user is able to create chat in the workspace", async () => {
	// 	// 	const createChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}`,
	// 	// 		{
	// 	// 			creator: adminId,
	// 	// 			members: [workspaceMemberId],
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(createChatResponse.status).toBe(200);
	// 	// }); ✅✅✅
	// 	// test("user is not able to create chat without creator", async () => {
	// 	// 	const createChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}`,
	// 	// 		{
	// 	// 			// creator: adminId,
	// 	// 			members: [workspaceMemberId],
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(createChatResponse.status).toBe(400);
	// 	// });✅✅✅
	// 	// test("user is not able to create chat without members", async () => {
	// 	// 	const createChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}`,
	// 	// 		{
	// 	// 			creator: adminId,
	// 	// 			// members: [userOneId, userTwoId],
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(createChatResponse.status).toBe(400);
	// 	// });✅✅✅
	// 	// test("user is not able to create chat if member", async () => {
	// 	// 	const createChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}`,
	// 	// 		{
	// 	// 			creator: adminId,
	// 	// 			members: [userOneId, userTwoId],
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${memberToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(createChatResponse.status).toBe(401);
	// 	// });✅✅✅
	// 	// TODO: GIVEN TRANSACTION NUMBER 10 DOES NOT MATCH AHY-IN PROGRESS TRANSACTION
	// 	// test("user is able to delete chat", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}?chatId=${chatId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("user is not able to delete chat without chat id ", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}?chatId=`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(400);
	// 	// });✅✅✅
	// 	// test("user is not able to delete chat if not created by ", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}?chatId=${chatId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${editorToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(401);
	// 	// });✅✅✅
	// 	// test("user is able to delete chat by admin", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}?chatId=${chatId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(200);
	// 	// });✅✅✅
	
	// test("user is able to send message in the chat", async () => {
	// 	const formData = new FormData();
	// 	formData.append("chatFiles", fs.createReadStream("./1.jpg"));
	// 	formData.append("content", "hello world");
	// 	const sendMessageResponse = await a.post(
	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages`,
	// 		formData,
	// 		{
	// 			headers: {
	// 				"Content-Type": "multipart/form-data",
	// 				Authorization: `Bearer ${adminToken}`,
	// 			},
	// 		}
	// 	);
	// 	expect(sendMessageResponse.status).toBe(200);
	// });

	// 	// test("user is not able to send message if not in the chat", async () => {
	// 	// 	const deleteChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages`,
	// 	// 		{
	// 	// 			sender: userOneId,
	// 	// 			content: "helle world",
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${userOneToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(401);
	// 	// });✅✅✅
	// 	// test("user is not able to send message if chat is not created ", async () => {
	// 	// 	const sendMessageResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/67b563c1fa4d3dac23870548/messages`,
	// 	// 		{
	// 	// 			sender: editorId,
	// 	// 			content: "helle world",
	// 	// 		},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${editorToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(sendMessageResponse.status).toBe(400);
	// 	// });✅✅✅
	// 	// test("user is able to delete chat message", async () => {
	// 	// 	const deleteChatResponse = await axios.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages?messageId=${messageId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("user is not able to delete chat message if not created/exists", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages?messageId=67b56b62f3c8b5ce723d6b33`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(400);
	// 	// });✅✅✅
	// 	// 	test("user is able to delete chat message by admin", async () => {
	// 	// 		const deleteChatResponse = await axios.delete(
	// 	// 			`${BACKEND_URL}/chats/${workspaceId}/${chatId}/messages?messageId=${messageId}`,
	// 	// 			{
	// 	// 				headers: {
	// 	// 					Authorization: `Bearer ${adminToken}`,
	// 	// 				},
	// 	// 			}
	// 	// 		);
	// 	// 		expect(deleteChatResponse.status).toBe(200);
	// 	// 	});✅✅✅
	// 	// test("user is able to add member in the chat", async () => {
	// 	// 	const addMemberChatResponse = await axios.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(addMemberChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("user is able to add member if chat created admin or createdBy", async () => {
	// 	// 	const addMemberChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${memberToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(addMemberChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("user is not able to add member by other editor", async () => {
	// 	// 	const deleteChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{},
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${otherEditorToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(401);
	// 	// });✅✅✅
	// 	// test("user is not able to add member in the chat by member", async () => {
	// 	// 	const deleteChatResponse = await a.post(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${memberToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(401);
	// 	// });✅✅✅
	// 	// test("user is able to remove member from the chat", async () => {
	// 	// 	const deleteChatResponse = await axios.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${editorToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("admin able to remove chat member", async () => {
	// 	// 	const deleteChatResponse = await axios.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${adminToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(200);
	// 	// });✅✅✅
	// 	// test("other editor not able to remove chat member", async () => {
	// 	// 	const deleteChatResponse = await a.delete(
	// 	// 		`${BACKEND_URL}/chats/${workspaceId}/${chatId}/members/${memberId}`,
	// 	// 		{
	// 	// 			headers: {
	// 	// 				Authorization: `Bearer ${otherEditorToken}`,
	// 	// 			},
	// 	// 		}
	// 	// 	);
	// 	// 	expect(deleteChatResponse.status).toBe(401);
	// 	// }); ✅✅✅
});
