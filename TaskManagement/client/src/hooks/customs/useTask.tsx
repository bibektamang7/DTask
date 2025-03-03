import { useGetTasksQuery } from "@/redux/services/taskApi"
import { Navigate } from "react-router";

const useTask = () => {
    const token = localStorage.getItem("token");
    const workspaceId = localStorage.getItem("workspace");
    if(!token || !workspaceId) {
        <Navigate to={"/login"}/>
    }
    const {data, isLoading} = useGetTasksQuery({token: token, workspaceId: workspaceId});
    return {taskData: data?.data, isLoading};
}
export {useTask}


// bibektamang0.3818773796279711@gmail.com