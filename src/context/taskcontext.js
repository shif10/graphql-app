import { createContext, useContext, useEffect, useState } from "react";
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
const TaskContext = createContext()


export const TaskProvider = ({ children }) => {

    const [task, setTask] = useState([])

    const GET_TASKS = gql`
     query GetTasks{
    tasks{
        id,title,description
    }
}  `
    const { data } = useQuery(GET_TASKS)
    useEffect(() => {

        setTask(data)


        console.log("tasks", task);
    }, [data])

    console.log("data ares", data)
    return (
        <TaskContext.Provider value={{ data, task, setTask }}>

            {children}

        </TaskContext.Provider >
    )

}
export const useTask = () => useContext(TaskContext);