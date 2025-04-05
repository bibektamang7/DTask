import {
	BellIcon,
	CheckSquareIcon,
	LayoutDashboardIcon,
	MessageSquareIcon,
} from "lucide-react";

const HeaderList = [
	{
		title: "About",
		redirect: "/about",
	},
	{
		title: "Features",
		redirect: "/features",
	},
	{
		title: "Pricing",
		redirect: "/pricing",
	},
	{
		title: "App",
		redirect: "/app",
	},
	{
		title: "contact",
		redirect: "/contact",
	},
];

const featureCardData = [
	{
		heading: "Reminders That Actually Work",
		description:
			"Never forget again! Set reminders your way-on your phone, laptop, or both. Deadlines, meetings, or breaks, we've got you.",
		image: {
			source: "/images/reminder.png",
			desc: "reminder component image",
		},
	},
	{
		heading: "See How Far You've Come",
		description:
			"Stay motivated by keeping track of your wins with simple and intuitive progress tracking.",
		image: {
			source: "/images/timeline.png",
			desc: "timeline component image",
		},
	},
	{
		heading: "Team Up and Get Things Done",
		description:
			"Share schedules, assign tasks, and keep everyone on the same page.",
		image: {
			source: "/images/team.png",
			desc: "team component image",
		},
	},
	{
		heading: "One Calendar to Rule Theam All",
		description:
			"All your tasks and events in one place, syncing seamlessly across devices. Stay on top effortlessly.",
		image: {
			source: "/images/calendar.png",
			desc: "calendar component image",
		},
	},
];

const sideBar_menu_lists = [
	{
		title: "Dashboard",
		icon: LayoutDashboardIcon,
		redirectTo: "/w",
	},
	{
		title: "Tasks",
		icon: CheckSquareIcon,
		redirectTo: "/w/tasks",
	},
	// {
	// 	title: "Calendar",
	// 	icon: CalendarIcon,
	// 	redirectTo: "/w/calendar",
	// },
];

const sidebar_account_lists = [
	// {
	// 	title: "User",
	// 	icon: UserIcon,
	// 	redirectTo: "",
	// },
	{
		title: "Chat",
		icon: MessageSquareIcon,
		redirectTo: "/w/chats",
	},
	{
		title: "Notification",
		icon: BellIcon,
		redirectTo: "/w/notifications",
	},
];

const statusColors = {
	Completed: "bg-green-500/10 text-green-500",
	"In-Progress": "bg-blue-500/10 text-blue-500",
	Todo: "bg-gray-500/10 text-gray-500",
};

const priorityColors = {
	Urgent: "bg-red-500/10 text-red-500",
	High: "bg-orange-500/10 text-orange-500",
	Medium: "bg-yellow-500/10 text-yellow-500",
	Low: "bg-green-500/10 text-green-500",
};

const ChatEvent = Object.freeze({
	JOIN_CHAT: "join-chat",
	LEAVE_CHAT: "leave-chat",
	NEW_CHAT: "new-chat",
	ADD_MEMBER: "add-chat-member",
	REMOVE_MEMBER: "remove-member",
	DELETE_CHAT: "delete-chat",
	DELETE_MESSAGE: "delete-chat-message",
	ADD_MESSAGE: "add-chat-message",
});

const TaskEvent = Object.freeze({
	NEW_TASK_ADDED: "new-task-added",
	TASK_ASSIGNED: "task-assigned",
	REMOVE_ASSINGEE: "task-assignee",
	TASK_STATUS_CHANGED: "task-status-changed",
	TASK_PRIORITY_CHANGED: "task-priority-changed",
	TASK_DATE_CHANGED: "task-date-changed",
	TASK_DESCRIPTION_CHANGED: "task-description-changed",
	TASK_TITLE_CHANGED: "task-title-changed",
	NEW_COMMENT: "new-comment",
	NEW_ATTACHMENT: "new-attachment",
	DELETE_ATTACHMENT: "delete-attachment",
	DESCRIPTION_EDITED: "description_edited",
	TASK_DELETED: "task-deleted",
	COMMENT_DELETED: "comment-deleted",
});
export {
	HeaderList,
	featureCardData,
	sideBar_menu_lists,
	sidebar_account_lists,
	statusColors,
	priorityColors,
	ChatEvent,
	TaskEvent,
};
